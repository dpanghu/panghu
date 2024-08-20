import { $axios } from '@/utils/http';
/** ------------------------------------------------- 求职 ------------------------------------ */

export async function saveAiModule<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/plugin/save',
    method: 'POST',
    params,
  });
}

export async function iconList<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/xai/plugin/icon/list',
    method: 'GET',
    params,
  });
}