import { PrefixApi } from '@/utils/enum';
import { $axios } from '@/utils/http';
const RUNNER = PrefixApi.RUNNER;
const BUILDER = PrefixApi.BUILDER;

// 分页查询
export async function getTopConfigList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tara/pre/subject/page',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
}

//【课题】本地点击率
export async function clickTopic(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tara/pre/subject/click',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
}

// 【课题】新增
export const addTopicConfig = (params?: RecordItem) => {
  return $axios.request({
    url: BUILDER + '/tara/pre/subject/save',
    method: 'POST',
    params,
  });
};

// 【课题】删除
export const delTopicConfig = (params?: RecordItem) => {
  return $axios.request({
    url: BUILDER + '/tara/pre/subject/del',
    method: 'POST',
    params,
  });
};

// 【课题】修改
export const updateTopicConfig = (params?: RecordItem) => {
  return $axios.request({
    url: BUILDER + '/tara/pre/subject/update',
    method: 'POST',
    params,
  });
};

// 【课题】导入
export const importTopicConfig = (params?: RecordItem) => {
  return $axios.request({
    url: BUILDER + '/tara/pre/subject/import',
    method: 'POST',
    params,
    isPlatform: true,
  });
};
