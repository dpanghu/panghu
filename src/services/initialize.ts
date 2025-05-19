import { $axios } from '@/utils/http';
import { PrefixApi } from '@/utils/enum';

// 初始化专业列表
export async function initMajorList(params?: RecordItem) {
  return $axios.request({
    url: PrefixApi.RUNNER + '/public/school/major/tree',
    method: 'POST',
    params,
  });
}

// 专业课程列表
export async function initCourseList(params?: RecordItem) {
  return $axios.request({
    url: PrefixApi.RUNNER + '/manager/initialize/major/course/course/list/all/page',
    method: 'POST',
    params,
  });
}

// 专业课程体系列表
export async function initMajorCourseList(params?: RecordItem) {
  return $axios.request({
    url: PrefixApi.RUNNER + '/manager/initialize/major/course/page',
    method: 'POST',
    params,
  });
}

// 专业配置保存
export async function initMajorCourseSave(params?: RecordItem) {
  return $axios.request({
    url: PrefixApi.RUNNER + '/manager/initialize/major/course/save',
    method: 'POST',
    params,
  });
}

// 专业配置详情
export async function initMajorCourseDetail(params?: RecordItem) {
  return $axios.request({
    url: PrefixApi.RUNNER + '/manager/initialize/major/course/get',
    method: 'POST',
    params,
  });
}

// 专业配置删除
export async function initMajorCourseDelete(params?: RecordItem) {
  return $axios.request({
    url: PrefixApi.RUNNER + '/manager/initialize/major/course/del',
    method: 'POST',
    params,
  });
}
