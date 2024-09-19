/* eslint-disable @typescript-eslint/no-unused-expressions */
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { message } from 'SeenPc';

export type ResponseType = {
  code: string;
  data: {
    answer: string;
    isEnd: boolean;
    themeId: string;
    conversation_id: string;
  };
  msg: string;
  success: boolean;
};
type Hooks = Record<string, (param?: ResponseType['data']) => void>;

export default class EventSourceStream {
  url: string;
  hooks: Hooks;
  eventSource: Promise<void> | null;
  ctrl: AbortController | null;
  num: number;
  options: {
    method?: 'GET' | 'POST';
    data?: BodyInit;
    headers?: RecordItem;
  };

  constructor(url: string, options = {}, hooks: Hooks) {
    this.url = url;
    this.hooks = hooks;
    this.eventSource = null;
    this.ctrl = new AbortController(); // 创建AbortController实例，以便中止请求
    this.num = 0;
    this.options = options;
  }
  run() {
    this.eventSource = fetchEventSource(this.url, {
      method: this.options?.method || 'GET',
      headers: this.options.headers || {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(this.options.data) || null,
      openWhenHidden: true, // 取消visibilityChange事件
      signal: this.ctrl!.signal, // AbortSignal
      onmessage: async (res) => {
        const { data, success, msg, code }: ResponseType = JSON.parse(
          res?.data || '',
        );
        if (!data && success === false) {
          message.error('信息生成错误：' + msg);
          // 非正常结束
          this.destory(code);
          return;
        }
        if (this.num === 0) {
          // 第一次接收到数据
          this.hooks?.onReveiveFirstMessage &&
            this.hooks?.onReveiveFirstMessage(data);
        }
        this.num++;
        // 接收到数据
        this.hooks?.receiveMessage && this.hooks?.receiveMessage(data);
        if (data && data.isEnd) {
          this.hooks?.onReveiveLastMessage &&
            this.hooks?.onReveiveLastMessage(data);
          this.destory();
        }
      },
      onopen: async (response) => {
        if (response.status !== 200) {
          message.error('信息生成错误：' + response.statusText);
          this.hooks?.onOpenError && this.hooks?.onOpenError(response);
          this.destory();
          return;
        } else {
          this.hooks?.onOpen && this.hooks?.onOpen(response);
        }
      },
      onclose: () => {
        this.hooks?.onClose && this.hooks?.onClose();
        this.destory();
      },
      onerror: (err) => {
        message.error('信息生成错误' + err.message);
        this.hooks?.onError && this.hooks?.onError(err);
        this.ctrl!.abort();
        this.ctrl = null;
        if (this.eventSource) {
          this.eventSource = null;
        }
        throw err;
      },
    });
  }

  destory(code?: any) {
    this.hooks?.onFinished && this.hooks?.onFinished(code);
    this.ctrl!.abort();
    this.ctrl = null;
    if (this.eventSource) {
      this.eventSource = null;
    }
  }
}
