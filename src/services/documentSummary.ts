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

// AI上传
export async function uploadSummary<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/seentao/xai/word/summary/upload',
    method: 'POST',
    params,
    hiddenLoading: true,
    timeout: 1000 * 60 * 10,
  });
}

// AI导出-导读
export async function exportSummary<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/seentao/xai/word/summary/export',
    method: 'POST',
    params,
  });
}

// AI查询列表
export async function getSummaryList<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/seentao/xai/word/summary/list',
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

// AI查询单条
export async function getSummaryItem<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/seentao/xai/word/summary/get',
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

// AI删除
export async function delSummaryItem<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/seentao/xai/word/summary/del',
    method: 'POST',
    params,
  });
}

// 重新解析
export async function resetWordAnalysis<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/seentao/xai/word/summary/analysis',
    method: 'POST',
    params,
    hiddenLoading: true,
    hiddenErrorMessage: true,
    timeout: 1000 * 60 * 10,
  });
}
