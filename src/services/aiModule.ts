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

export async function getPluginDetail<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/plugin/get',
    method: 'GET',
    params,
  });
}

export async function getHistory<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/theme/common/querybyparamid',
    method: 'GET',
    params,
  });
}

export async function getHistoryDetail<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/theme/common/get',
    method: 'GET',
    params,
  });
}

export async function deleteHistory<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/theme/del',
    method: 'POST',
    params,
  });
}

export async function saveImg<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/ptt/upload/save',
    method: 'POST',
    params,
  });
}

export async function getPresetAnswer<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/ptt/point/all',
    method: 'POST',
    params,
  });
}

export async function recogNize<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/ptt/upload/recognize',
    method: 'POST',
    params,
  });
}

export async function recogNizeResult<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/ptt/upload/recognize/result',
    method: 'POST',
    params,
  });
}

export async function getFileUrl<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/ptt/upload/get',
    method: 'POST',
    params,
  });
}