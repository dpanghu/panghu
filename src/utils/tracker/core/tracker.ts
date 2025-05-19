// import { onLCP } from 'web-vitals';
import type {
  TrackerDataType,
  EventType,
  OptionsType,
  TrackerEventDataType,
  ListenerType,
} from './typings';
import { getBaseInfo } from './getBaseInfo';
import { getUserInfo } from './getUserInfo';
import { reportTracker } from './reportTracker';
import { EventName, defaultOptions, SEENTAO_TRACKER_IS_ON_KEY } from './constants';
import { history } from './history';
import { getSwitch } from '@/services/tracker';

class Tracker {
  private _options: OptionsType;
  private _initialized: boolean;
  private _windowTop: Window;
  private _beginTime: number | null = null;
  private _stop: boolean = false;

  constructor(option: Partial<OptionsType> = {}) {
    this._options = { ...defaultOptions, ...option };
    this._initialized = false;
    this._windowTop = window.top || window;
  }

  init(options: Partial<OptionsType> = {}) {
    if (!this._initialized) {
      this._initialized = true;
      this._init(options);
    }
  }

  /**
   * 初始化
   * @param {*} options 用户参数
   */
  private async _init(options: Partial<OptionsType>) {
    const isOn = await this._isOn();
    if (!isOn) {
      return;
    }

    // 将开启状态同步给model
    // this._dispatchToModel();
    // 改为放在sessionStorage里
    sessionStorage.setItem(SEENTAO_TRACKER_IS_ON_KEY, 'true');

    this._mergeConfig(options);

    // 首屏加载时间(以LCP衡量)
    this._onLCP();

    // 心跳上送
    this._windowTop.requestAnimationFrame(this._pulse);
  }

  private async _isOn() {
    const isOn = await this._getSettingsOnRemote();

    if (isOn !== 1) {
      return false;
    }

    return true;
  }

  private _onLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1]; // Use the latest LCP candidate
      // 加载时长用ms 停留时长用s
      const eventDuration = Math.floor(lastEntry.startTime);

      // 进一个新页面，立马发一次心跳
      this.sendTracker(`${EventName.pageload},${EventName.pageview}`, {
        eventDuration,
      });

      observer.disconnect();
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  private async _getSettingsOnRemote() {
    const { baseUrl, settingsPath } = defaultOptions;
    const requestUrl = baseUrl + settingsPath;

    let res;
    try {
      res = await getSwitch(requestUrl);
    } catch (error) {
      console.error('tracker中开关接口错误', error);
      res = -1;
    }

    return Number(res);
  }

  public listenHistory(listener: ListenerType) {
    /* 监听路由的切换 */
    history.listen(listener);

    // history.listenClose((visibility) => {
    //   if (visibility === 'visible') {
    //     this.sendTracker(EventName.online);
    //     this._stop = false;
    //   } else {
    //     this.sendTracker(EventName.offline);
    //     this._stop = true;
    //   }
    // });
  }

  _pulse = (timestamp: number) => {
    this._stop = typeof this._options.condition === 'function' ? !this._options.condition() : false;

    if (this._stop) {
      this._beginTime = null;
    } else {
      if (this._beginTime === null) {
        this._beginTime = timestamp;
      }

      const elapsed = timestamp - this._beginTime;

      if (elapsed >= this._options.pulseInterval!) {
        this.sendTracker(EventName.onlineheart);
        // 重新计时
        this._beginTime = null;
      }
    }

    this._windowTop.requestAnimationFrame(this._pulse);
  };
  // private _pulse() {
  //   const pulseInterval = this._options!.pulseInterval;
  //   this._pulseTimer = window.setInterval(() => {
  //     this.sendTracker(EventName.onlineheart);
  //   }, pulseInterval);
  // }

  // @ts-ignore
  // private _stopPulse() {
  //   if (this._pulseTimer != null) {
  //     window.clearInterval(this._pulseTimer);
  //     this._pulseTimer = null;
  //   }
  // }

  /**
   * 埋点上报
   * @param {*} eventName 事件类型
   * @param {*} data 埋点数据
   */
  async sendTracker(eventName: EventType, data: TrackerEventDataType = {}) {
    const userInfo = await getUserInfo();

    const defaultData = {
      ...userInfo,
      ...getBaseInfo(),
    };

    const eventNameStr = Array.isArray(eventName) ? eventName.join(',') : eventName;

    const sendData = {
      ...defaultData,
      ...data,
      eventName: eventNameStr,
    } as unknown as TrackerDataType;

    const { baseUrl, tracePath } = this._options;
    const requestUrl = baseUrl + tracePath;

    reportTracker(requestUrl, sendData);
  }

  /**
   * 用户参数合并
   * @param {*} options 用户参数
   */
  private _mergeConfig(options: Partial<OptionsType>) {
    this._options = { ...this._options, ...options };
  }
}

// const tracker = new Tracker();

// export { tracker };
export { Tracker };
