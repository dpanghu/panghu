import { PrefixApi } from '@/utils/enum';
import { $axios } from '@/utils/http';
const XDATA = PrefixApi.XDATA;

// 4.4 现代农业——农业贸易分析
export async function baseList(params?: RecordItem) {
  return $axios.request({
    url: XDATA + '/app/workshop/base/get',
    method: 'POST',
    params,
  });
}

export async function baseYearGet(params?: RecordItem) {
  return $axios.request({
    url: XDATA + '/app/workshop/base/year/get',
    method: 'POST',
    params,
  });
}

// // /fsb/seentao/token
// export async function getFsbToken(params?: RecordItem) {
//   return $axios.request({
//     url: '/fsb/seentao/token',
//     method: 'POST',
//     params,
//     isJSON: true,
//   });
// }

// // /fsb/seentao/direct
// export async function getFsbKey(params?: RecordItem) {
//   return $axios.request({
//     url: '/fsb/seentao/direct',
//     method: 'GET',
//     params,
//     // isJSON: true,
//   });
// }
