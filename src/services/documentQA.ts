import { $axios } from '@/utils/http';

// AI上传
export async function uploadWordAnswer(params?: RecordItem) {
  return $axios.request({
    url: `/seentao/xai/word/answer/upload`,
    method: 'GET',
    params,
    hiddenLoading: true,
  });
}
