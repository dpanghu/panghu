import { PrefixApi } from '@/utils/enum';
import { $axios } from '@/utils/http';

// 获取公共目录
export async function getFolderInfo(params?: RecordItem) {
  return $axios.request({
    url: `${PrefixApi.RESOURCE}/res/repository/public/get`,
    method: 'GET',
    params,
  });
}

// 查询目录文件（一层）
export async function getRepositoryFileList(params?: RecordItem) {
  return $axios.request({
    url: `${PrefixApi.RESOURCE}/res/repository/attachment/list`,
    method: 'GET',
    params,
  });
}
// 获取团队列表
export async function getTeamList(params?: RecordItem) {
  return $axios.request({
    url: `${PrefixApi.RESOURCE}/res/repository/team/list`,
    method: 'POST',
    params,
  });
}

// 新建文件夹
export async function addFolder(params?: RecordItem) {
  return $axios.request({
    url: `${PrefixApi.RESOURCE}/res/repository/folder/save`,
    method: 'GET',
    params,
  });
}

// 保存附件
export async function saveUploadFile(params?: RecordItem) {
  return $axios.request({
    url: `${PrefixApi.RESOURCE}/res/attachment/upload`,
    method: 'GET',
    params,
  });
}

// 上传文件
export async function uploadFile(params?: RecordItem) {
  return $axios.request({
    url: `${PrefixApi.RESOURCE}/res/repository/attachment/upload`,
    method: 'GET',
    params,
  });
}

// 搜索文件
export async function searchFile(params?: RecordItem) {
  return $axios.request({
    url: `${PrefixApi.RESOURCE}/res/repository/attachment/search`,
    method: 'GET',
    params,
  });
}

// 查询文件信息
export async function getFileUrl(params?: RecordItem) {
  return $axios.request({
    url: `${PrefixApi.RESOURCE}/res/attachment/get`,
    method: 'GET',
    params,
  });
}
//【附件】文件转换状态查询
export async function getConvertStatus(params?: RecordItem) {
  return $axios.request({
    url: `${PrefixApi.RESOURCE}/res/attachment/convert/status`,
    method: 'POST',
    params,
  });
}
