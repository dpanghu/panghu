import { $axios } from '@/utils/http';
/** ------------------------------------------------- 求职 ------------------------------------ */

export async function saveAiModule<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/plugin/save',
    method: 'POST',
    params,
  });
}