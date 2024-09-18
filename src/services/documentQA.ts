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

// AI查询列表
export async function getWordAnswerList(params?: RecordItem) {
  return $axios.request({
    url: `/seentao/xai/word/answer/list`,
    method: 'GET',
    params,
  });
}

// AI查询单条
export async function getWordAnswerItem(params?: RecordItem) {
  return $axios.request({
    url: `/seentao/xai/word/answer/get`,
    method: 'GET',
    params,
  });
}
