import { clearLoading, showLoading } from '@/components/PageLoading/renderLoading';
import { message } from 'antd';
import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import { cloneDeep } from 'lodash-es';
import qs from 'qs';
import {
  _getQueryCoursewareParam,
  _getQueryParam,
  transformFormData,
  getItemInStorage,
} from '../utils';
import { CodeMessage } from './config';
import { ContentType } from './enum';
import type { CreateAxiosConfig } from './interface.d';
import Cookies from 'js-cookie';
import { clearCookie } from '../../utils/enum';
import { logout } from './workspace';
const hostMap: any = {
  'https://tedu.seentao.com': 'https://tcloud.seentao.com',
  'https://dedu.seentao.com': 'https://dcloud.seentao.com',
  'https://edu.seentao.com': 'https://cloud.seentao.com',
};

const errorResult: string = '__ERROR_RESULT__';
// const errorResult401: string = '__ERROR_RESULT__401__';
let logouts: any = false;
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
    this.instance.defaults.headers.post['Content-Type'] = ContentType.FORM_URLENCODED;
  }

  // 请求拦截器 添加公共参数 及自定义axiosConfig
  private transformRequest(config: CreateAxiosConfig): CreateAxiosConfig {
    const conf: any = cloneDeep(config);
    // this.instance.defaults.headers.userToken = Cookies.get('userToken') || '';
    let commonData = _getQueryParam(config);
    let projectData =
      JSON.parse(window.sessionStorage.getItem('projectJson') || '{}') === null
        ? {}
        : JSON.parse(window.sessionStorage.getItem('projectJson') || '{}');
    let classData =
      JSON.parse(window.sessionStorage.getItem('classData') || '{}') === null
        ? {}
        : JSON.parse(window.sessionStorage.getItem('classData') || '{}');
    conf.params = {
      classId: classData.classId,
      projectVersionId: projectData.id,
      ...commonData,
      ...conf.params,
    };

    // 判断当前请求是否为科研工作台请求，添加 memberType字段
    if (config.isScientificXHR) {
      conf.params = {
        isSchoolAdministrator: !!(Cookies.get('memberType') === 'SCHOOL_ADMINISTRATOR'),
        ...conf.params,
      };
    }

    // 判断是否存在交互式课件id，如果存在就将其设置为公共参数
    const courseware_iframe = JSON.parse(
      window.sessionStorage.getItem('courseware_iframe') || 'false',
    );
    if (courseware_iframe) {
      conf.params = {
        ...conf.params,
        ..._getQueryCoursewareParam(),
      };
    }

    if (conf.method?.toLocaleUpperCase() === 'POST') {
      if (conf.isFormData) {
        conf.data = transformFormData(conf.params);
        this.instance.defaults.headers.post['Content-Type'] = ContentType.FORM_DATA;
      } else if (conf.isJSON) {
        conf.data = conf.params;
        this.instance.defaults.headers.post['Content-Type'] = ContentType.JSON;
      } else {
        conf.data = qs.stringify(conf.params);
        this.instance.defaults.headers.post['Content-Type'] = ContentType.FORM_URLENCODED;
      }
      conf.params = null;
    }
    !conf.hiddenLoading && showLoading(conf.url as string, conf.show);
    return conf;
  }

  // 响应拦截器
  private transformResponse(res: ResponseResult, conf: CreateAxiosConfig, type: any): any {
    const { data, msg, code, errorExportUrl } = res;
    if (code === 401 && logouts === false) {
      !conf.hiddenErrorMessage && message.error(msg);
    }
    if (Number(code) !== 200 && logouts === false) {
      !conf.hiddenErrorMessage &&
        message.error(msg || CodeMessage[Number(code)] || CodeMessage.other);
      return Promise.reject(errorExportUrl || msg);
    }
    return conf.isPlatform ? res : type === 'dtc' ? res : data;
  }

  public request<T = any>(config: CreateAxiosConfig): Promise<T> {
    const conf = this.transformRequest(config);
    return new Promise((resolve, reject) => {
      this.instance
        .request(conf)
        .then((res: AxiosResponse<ResponseResult>) => {
          !conf.hiddenLoading && clearLoading(conf.url as string, conf.show as any);
          const { data, headers } = res;
          const ret: any = this.transformResponse(data, conf, config.type);
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
          !conf.hiddenLoading && clearLoading(conf.url as string, conf.show as any);
          !conf.hiddenErrorMessage &&
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
  baseURL: '/api/',
  responseType: 'json',
  timeout: 1000 * 60,
  timeoutErrorMessage: '请求超时，请稍后重试',
});
