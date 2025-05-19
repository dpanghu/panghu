import { PrefixApi } from '@/utils/enum';
import { $axios } from '@/utils/http';
const RUNNER = PrefixApi.RUNNER;
const DTC = PrefixApi.DTC;
const PORTAL = PrefixApi.PORTAL;
const USER = PrefixApi.USER;
// 项目数统计
export async function projectCnt(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/project/project/stat/member/count',
    method: 'POST',
    params,
  });
}
//  课程数统计
export async function courseCnt(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/course/stat/member/count',
    method: 'POST',
    params,
  });
}
//  教学班统计
export async function classCnt(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/stat/member/count',
    method: 'POST',
    params,
  });
}
// 待办

export async function teacherTodoList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/school/todo/teacher',
    method: 'POST',
    params,
  });
}
// 项目使用排名
export async function projectRank(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/manager/stat/project/used/pre',
    method: 'POST',
    params,
  });
}
//学生成绩排名
export async function studentScoreRank(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/manager/stat/student/score/pre',
    method: 'POST',
    params,
  });
}
// 能力值排行
export async function abilityRank(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/manager/stat/student/ability/pre',
    method: 'POST',
    params,
  });
}
//  获取课程列表
export async function courseList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/course/course/simple/list',
    method: 'POST',
    params,
  });
}
//   开班情况
export async function courseClass(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/stat/class/count',
    method: 'POST',
    params,
  });
}
//   考勤情况
export async function courseAttend(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/stat/attend/rate',
    method: 'POST',
    params,
  });
}
//   完成情况
export async function courseComplete(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/stat/complete/rate',
    method: 'POST',
    params,
  });
}
//   总结情况
export async function courseSummary(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/stat/summary/rate',
    method: 'POST',
    params,
  });
}
//   总结情况
export async function stuList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/stat/members',
    method: 'POST',
    params,
  });
}
//   总结情况
export async function stuAbilityWord(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/ability/capacity/student/top20',
    method: 'POST',
    params,
  });
}
//   公告列表
export async function getNoticeList(params?: RecordItem) {
  return $axios.request({
    url: DTC + '/teacher.noticeList.get',
    method: 'POST',
    params,
    type: 'dtc',
  });
}

//   公告列表
export async function getNoticeSchoolList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/school/noticeList/get',
    method: 'POST',
    params,
  });
}

export async function getStudentNoticeList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/student/noticeList/get',
    method: 'POST',
    params,
  });
}

//新闻列表
export async function getNewsList(params?: RecordItem) {
  return $axios.request({
    url: PORTAL + '/news.list.get',
    method: 'POST',
    params,
    type: 'dtc',
  });
}

// /class/teach/stat/ability/post/get(职业能力成长--岗位)
export async function getPost(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/stat/ability/post/get',
    method: 'GET',
    params,
  });
}
// /class/teach/stat/ability/model/grade
export async function getAbilityGrade(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/stat/ability/model/grade',
    method: 'GET',
    params,
  });
}
// /class/teach/stat/ability/model/grade
export async function schoolTrainMath(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/trainingprogram/model/training/program/school/count ',
    method: 'POST',
    params,
  });
}
export async function schoolMasterMath(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/specialitymodeling/model/major/manage/conut ',
    method: 'POST',
    params,
  });
}
// /class/teach/stat/ability/model/grade
export async function adminProjectMath(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/project/project/stat/buyorcreate/count',
    method: 'POST',
    params,
  });
}
export async function adminCourseMath(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/course/stat/buyorcreate/count',
    method: 'POST',
    params,
  });
}
export async function adminClassMath(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/stat/school/count',
    method: 'POST',
    params,
  });
}
export async function userStatus(params?: RecordItem) {
  return $axios.request({
    url: USER + '/school.statistics.totalNum.get',
    method: 'POST',
    params,
    isPlatform: true,
  });
}
export async function userOnline(params?: RecordItem) {
  return $axios.request({
    url: USER + '/statistics.user.onlineNum.get',
    method: 'POST',
    params,
    type: 'dtc',
  });
}

export async function logout(params?: RecordItem) {
  return $axios.request({
    url: USER + '/logout',
    method: 'POST',
    params,
    type: 'dtc',
  });
}
