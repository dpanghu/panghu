import { $axios } from '@/utils/http';

// 查询上传文件列表
export async function getUploadList<T>(params?: RecordItem): Promise<T[]> {
  return $axios.request({
    url: '/widget/xai/visualization/file/list',
    method: 'POST',
    params,
  });
}

// 数据可视化上传excel
export async function uploadExcel<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/visualization/file/upload',
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

// 查询上传文件详情

export async function getUploadDetail<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/visualization/file/get',
    method: 'POST',
    params,
  });
}

// 删除上传文件

export async function deleteUploadFile<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/visualization/file/del',
    method: 'POST',
    params,
  });
}

// 保存大模型结果
export async function saveResult<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/visualization/file/save',
    method: 'POST',
    params,
  });
}
