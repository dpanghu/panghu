import { $axios } from '@/utils/http';
import { PrefixApi } from '../utils/enum';
const { OLD__BUILDER } = PrefixApi;

// 删除课程
export async function deleteCourse(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/del',
    method: 'POST',
    params,
  });
}

// 通过id查询课程
export async function getCourseById(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/get',
    method: 'POST',
    params,
  });
}

// 课程列表
export async function queryCoursePage(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/page',
    method: 'POST',
    params,
  });
}

// 课程内容 - 复制
export async function copyCourse(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/copy',
    method: 'POST',
    params,
  });
}

// 管理团队 - 获取未授权的成员列表
export async function getNoAuthPage(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/power/noauth/page',
    method: 'POST',
    params,
  });
}

// 管理团队 - 获取已授权成员列表
export async function getAuthPage(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/power/auth/list',
    method: 'POST',
    params,
  });
}

// 管理团队 - 解除授权
export async function unAuthCourse(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/power/unauth',
    method: 'POST',
    params,
  });
}

// 管理团队 - 授权
export async function authCourse(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/power/auth',
    method: 'POST',
    params,
  });
}

// 管理团队 - 移交管理员
export async function changeAdminCourse(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/power/admin/change',
    method: 'POST',
    params,
  });
}

// 新增课程
export async function saveCourse(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/save',
    method: 'POST',
    params,
  });
}

// 可选合并课程弹窗列表
export async function findAuthCourses(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/merge/findAuthCourses',
    method: 'POST',
    params,
  });
}

// 合并课程
export async function saveMergeCourse(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/merge/save',
    method: 'POST',
    params,
  });
}

// 课程合并外层列表
export async function getMergeCourseList(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/merge/list',
    method: 'POST',
    params,
  });
}
