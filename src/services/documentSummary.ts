import { $axios } from '@/utils/http';

// 将上传到阿里云的附件 保存，并获取附件id
export async function getAttachmentId(params?: RecordItem) {
  return $axios.request({
    url: `/bus-resource/res/attachment/upload`,
    method: 'GET',
    baseURL: '/api',
    params,
    hiddenLoading: true,
  });
}
