import { $axios } from '@/utils/http';
import { PrefixApi } from '../utils/enum';
const BUILDER = PrefixApi.BUILDER;
const RESOURCE = PrefixApi.RESOURCE;
const STURUNNER = PrefixApi.STURUNNER;
const OLD__BUILDER = PrefixApi.OLD__BUILDER;

// 公共读url
const UPLOAD_URL_PUBLIC = 'https://pbu-public.oss-cn-beijing.aliyuncs.com';
const UPLOAD_URL_PRIVATE = 'https://pbu-private.oss-cn-beijing.aliyuncs.com';

const UPLOAD_OSS = '/dbe3.private.params.upload.get';

const CUSTOM_SERVICE = {};

// 获取oss上传参数接口
export async function uploads(params?: RecordItem) {
  return $axios.request({
    url: '/private.params.upload.get',
    method: 'GET',
    params,
  });
}

const TEMPLATE_URL =
  'https://pbu-public.oss-cn-beijing.aliyuncs.com/webapps/template/course_test_import_template.xlsx';

export { UPLOAD_URL_PUBLIC, UPLOAD_URL_PRIVATE, UPLOAD_OSS, CUSTOM_SERVICE, TEMPLATE_URL };

export async function majorTreeList(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/public/school/major/tree',
    method: 'GET',
    params,
  });
}

// 查询图片url
export async function attachmentImg(params?: RecordItem) {
  return $axios.request({
    url: RESOURCE + '/res/attachment/get',
    method: 'GET',
    params,
  });
}

//
export async function getConfig(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/auth/ux/module/get',
    method: 'POST',
    params,
  });
}

// [公共]查询任务信息
export async function getTaskInfo(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/class/teach/stu/task/info',
    method: 'POST',
    params,
  });
}

// [公共]查询任务信息
export async function getText(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/tc/digitalpeople/project/task/transcripts/all',
    method: 'POST',
    params,
  });
}
