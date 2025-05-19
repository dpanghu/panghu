import type { ListenerType, PushAndReplaceStateFuncType } from './typings';

/**
 * 核心功能是提供一个listen方法供外界注册，
 * 当pathname变化时，把要进入的新页面的信息及当前页面信息传给listener，
 * 供外部使用。
 */
class History {
  private _listeners: ListenerType[] | null = [];
  private _visibilityListeners: ((type: 'visible' | 'hidden') => void)[] | null = [];
  /**
   * 核心实现就是维护这个_currentState，每到一个新路由页面，都更新下这个值，
   * 更新之前先作为from传给listeners执行下。
   */
  private _currentState: Record<string, any> | null = {};
  private _window: Window;
  private _originPushState: Window['history']['pushState'];
  private _originReplaceState: Window['history']['replaceState'];
  private _inited: boolean = false;

  constructor() {
    this._window = window.top || window;
    this._originPushState = this._window.history.pushState;
    this._originReplaceState = this._window.history.replaceState;

    this._currentState = { state: {}, url: this._window.location.pathname, enterTime: Date.now() };

    this._init();
  }

  /**
   * 监听路由变化
   * @param listener
   * @returns
   */
  public listen(listener: ListenerType) {
    if (this._listeners === null) {
      this._listeners = [];
    }
    this._listeners.push(listener);

    return () => {
      this._listeners = this._listeners && this._listeners.filter((l) => l !== listener);
    };
  }
  /**
   * 监听浏览器可见性
   * @param listener
   * @returns
   */
  public listenClose(listener: (type: 'visible' | 'hidden') => void) {
    if (this._visibilityListeners === null) {
      this._visibilityListeners = [];
    }
    this._visibilityListeners.push(listener);

    return () => {
      this._visibilityListeners =
        this._visibilityListeners && this._visibilityListeners.filter((l) => l !== listener);
    };
  }

  public destroy() {
    this._listeners = null;
    this._currentState = null;
    this._window.history.pushState = this._originPushState;
    this._window.history.replaceState = this._originReplaceState;

    this._unlistenPopstate();
  }

  private _init() {
    if (!this._inited) {
      this._inited = true;
      this._proxy();
      this._listenPopstate();
      // this._listenBrowserClose();
      // this._listenPageVisibility();
    }
  }

  // todo: 补充unlisten
  // @ts-ignore
  private _listenPageVisibility() {
    const document = this._window.document;
    document.addEventListener('visibilitychange', () => {
      this._visibilityListeners &&
        this._visibilityListeners.forEach((listener) => listener(document.visibilityState));
    });
  }

  // @ts-ignore
  private _listenBrowserClose() {
    let beginTime = 0; // 执行onbeforeunload的开始时间
    let differTime = 0; // 时间差

    this._window.addEventListener('unload', () => {
      differTime = new Date().getTime() - beginTime;

      const start = Date.now();
      if (differTime <= 5) {
        // 浏览器关闭
        // todo: 使用window.fetch试下
        // todo: 看看这个能不能通过session获取到
        // let curUuid = sessionStorage.getItem(SEENTAO_TRACKER_UUID_KEY);

        // 阻塞400ms，确保请求发出去了
        // todo: 看下能否延迟缩短一些
        while (Date.now() < start + 10000) {}
      } else {
        // 浏览器刷新
      }
    });

    this._window.addEventListener('beforeunload', () => {
      beginTime = new Date().getTime();
    });
  }

  private _listenPopstate() {
    this._window.addEventListener('popstate', this._popstateHandler);
  }

  private _unlistenPopstate() {
    this._window.removeEventListener('popstate', this._popstateHandler);
  }

  /**
   * 改写浏览器原生的pushState、replaceState方法
   */
  private _proxy() {
    this._window.history.pushState = this._preWrapper(this._originPushState);
    this._window.history.replaceState = this._preWrapper(this._originReplaceState);
    // todo: history的其它方法
  }

  private _preWrapper(fun: PushAndReplaceStateFuncType) {
    const newFunc: PushAndReplaceStateFuncType = (state, unused, url) => {
      // 收集to、from，传给listeners，并执行。
      const now = Date.now();
      const to = { state, url, enterTime: now };
      const from = { ...this._currentState, leaveTime: now };
      this._listeners &&
        this._listeners.forEach((listener) => {
          listener(to, from);
        });
      // 设置_currentState
      this._currentState = { state, url };
      // 再执行原来的。
      fun.call(this._window.history, state, unused, url);
    };
    return newFunc;
  }

  _popstateHandler = (e: any) => {
    // 根据e组装to；根据_currentState 组装from
    const now = Date.now();
    const to = { state: e.state, url: this._window.location.pathname, enterTime: now };
    const from = { ...this._currentState, leaveTime: now };
    // 将to、from作为参数传给_listeners,并调用。
    this._listeners &&
      this._listeners.forEach((listener) => {
        listener(to, from);
      });
    // 将_currentState 设置成to；
    this._currentState = { ...to };
  };
}

const history = new History();

export { history };
