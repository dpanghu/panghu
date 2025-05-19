/*
 *@description: 用于取消axios的请求
 *@author: 王冰
 *@date: 2022-04-16 14:09:05
 */
import type { CancelTokenSource } from 'axios';

type IAxiosSource = Record<string, CancelTokenSource>;
class AxiosCancel {
  //axios source list
  public axiosSource: IAxiosSource;

  private static instance: AxiosCancel;

  static getInstance(): AxiosCancel {
    if (!this.instance) {
      this.instance = new AxiosCancel();
    }
    return this.instance;
  }

  private constructor() {
    this.axiosSource = {};
  }

  // 添加axios source
  public addAxiosSource(key: string, source: CancelTokenSource) {
    this.axiosSource[key] = source;
  }

  // 查询是否存在souce
  public queryAxiosSource(key: string) {
    return Boolean(this.axiosSource[key]);
  }

  // 取消 axios 的请求
  public cancelAxiosSource(key: string, cancelText?: string) {
    this.axiosSource[key].cancel(cancelText || '请求已取消');
    this.removeAxiosSource(key);
  }

  // 移除列表中的对应source
  public removeAxiosSource(key: string) {
    delete this.axiosSource[key];
  }
}
export default AxiosCancel.getInstance();
