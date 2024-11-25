import {
  clearLoading,
  showLoading,
} from '@/components/PageLoading/renderLoading';
import { message } from 'SeenPc';
import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import qs from 'qs';
import { getCommonData, transformFormData } from '../utils';
import { CodeMessage } from './config';
import { ContentType } from './enum';
import type { CreateAxiosConfig } from './interface.d';

const errorResult: string = '__ERROR_RESULT__';
const errorResult401: string = '__ERROR_RESULT__401__';

class Axios {
  private instance: AxiosInstance;

  constructor(options: CreateAxiosConfig) {
    this.instance = axios.create(options);
    this.setHeaders();
  }

  /**
   * 指定post请求方式的content-type
   */
  private setHeaders() {
    this.instance.defaults.headers.post['Content-Type'] =
      ContentType.FORM_URLENCODED;
  }

  // 请求拦截器 添加公共参数 及自定义axiosConfig
  private transformRequest(config: CreateAxiosConfig): CreateAxiosConfig {
    const conf: any = cloneDeep(config);
    let qsData = JSON.parse(
      window.sessionStorage.getItem('queryParams') || '{}',
    );
    let pluginCode = window.sessionStorage.getItem('pluginCode') || '';
    let commonData: any = getCommonData();
    conf.params = {
      ...qsData,
      pluginCode,
      ...conf.params,
      ...commonData,
      taskId: conf.params?.taskId == void 0 ? commonData.taskId : conf.params?.taskId,
    };
    if (conf.method?.toLocaleUpperCase() === 'POST') {
      if (conf.isFormData) {
        conf.data = transformFormData(conf.params);
        this.instance.defaults.headers.post['Content-Type'] =
          ContentType.FORM_DATA;
      } else if (conf.isJSON) {
        conf.data = conf.params;
        this.instance.defaults.headers.post['Content-Type'] = ContentType.JSON;
      } else {
        conf.data = qs.stringify(conf.params);
        this.instance.defaults.headers.post['Content-Type'] =
          ContentType.FORM_URLENCODED;
      }
      conf.params = null;
    }
    if (!conf.hiddenLoading) {
      showLoading(conf.url as string, conf.show);
    }
    return conf;
  }

  // 响应拦截器
  private transformResponse(res: ResponseResult, conf: CreateAxiosConfig): any {
    const { data, msg, code } = res;
    if (code === 401) {
      Promise.reject(CodeMessage[401]);
      message.error(CodeMessage[401]);
      return errorResult401;
    }
    if (Number(code) !== 200 && conf.needUrl) {
      return Promise.reject(res);
    }
    if (Number(code) !== 200) {
      if (!conf.hiddenErrorMessage) {
        message.error(msg || CodeMessage[Number(code)] || CodeMessage.other);
      }
      Promise.reject();
      return errorResult;
    }
    return conf.isPlatform ? res : data;
  }

  public request<T = any>(config: CreateAxiosConfig): Promise<T> {
    const conf = this.transformRequest(config);
    return new Promise((resolve, reject) => {
      this.instance
        .request(conf)
        .then((res: AxiosResponse<ResponseResult>) => {
          if (!conf.hiddenLoading) {
            clearLoading(conf.url as string, conf.show as any);
          }
          const { data, headers } = res;
          const ret: any = this.transformResponse(data, conf);
          if (conf.handError) {
            resolve(data as unknown as Promise<T>);
          } else if (ret !== errorResult) {
            const retData: any = ret;
            // 如果需要返回http headers
            if (conf.getHeaders) {
              retData.headers = headers;
            }
            resolve(retData as unknown as Promise<T>);
          }
          reject();
        })
        .catch((e: Error) => {
          if (!conf.hiddenLoading) {
            clearLoading(conf.url as string, conf.show as any);
          }
          message.error(`系统开小差了(${e.message})，请刷新后重试或联系管理员`);
          reject();
        });
    });
  }

  public upload<T = any>(url: string, params: UploadFileParams): Promise<T> {
    const formData = new window.FormData();

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        formData.append(key, params.data?.[key]);
      });
    }

    formData.append(params.name || 'file', params.file, params.filename);

    return this.instance.post(url, formData, {
      headers: { 'Content-Type': ContentType.FORM_DATA },
    });
  }
}

export const $axios = new Axios({
  baseURL: '/api/bus-xai',
  responseType: 'json',
  timeout: 2000 * 60,
  timeoutErrorMessage: '请求超时，请稍后重试',
});
