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

// 更新会话id和主题id
export async function updateAnswerId(params?: RecordItem) {
  return $axios.request({
    url: `/seentao/xai/word/answer/update`,
    method: 'GET',
    params,
    hiddenLoading: true,
  });
}

// 更新会话id和主题id
export async function delAnswer(params?: RecordItem) {
  return $axios.request({
    url: `/seentao/xai/word/answer/del`,
    method: 'GET',
    params,
  });
}

// 获取主题下的聊天记录
export async function getMessageLast(params?: RecordItem) {
  return $axios.request({
    url: `/xai/chat/message/last`,
    method: 'GET',
    params,
  });
}

export async function analysisAnswer(params?: RecordItem) {
  return $axios.request({
    url: `/seentao/xai/word/answer/analysis`,
    method: 'GET',
    params,
    hiddenLoading: true,
  });
}
