import { $axios } from '@/utils/http';

const hostname = window.location.hostname;

const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

const isDev = hostname.startsWith('tedu');
const isPre = hostname.startsWith('dedu');

const devGate = `https://ttracker.seentao.com/api/bustracker`;
const preGate = `https://dtracker.seentao.com/api/bustracker`;
const prodGate = `https://tracker.seentao.com/api/bustracker`;

let baseURL: any;
if (isLocal) {
  baseURL = devGate;
} else {
  //线上
  baseURL = isDev ? devGate : isPre ? preGate : prodGate;
}

export function report(url: string, data: any) {
  return $axios.request({
    url,
    method: 'POST',
    params: data,
    hiddenLoading: true,
    hiddenErrorMessage: true,
    baseURL,
  });
}

export function getSwitch(url: string, params?: any) {
  return $axios.request({
    url,
    method: 'GET',
    params,
    hiddenLoading: true,
    hiddenErrorMessage: true,
    baseURL,
  });
}
