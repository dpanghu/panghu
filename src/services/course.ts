/* 
    课程 接口
*/
import { $axios } from '@/utils/http';
import { PrefixApi } from '../utils/enum';
const { BUILDER, RUNNER, OLD__BUILDER } = PrefixApi;

// 查询所有的字典
export async function queryAllDict(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/public/dict/all',
    method: 'POST',
    params,
  });
}

// 单据参数转换
export async function getDevParamId(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/platform/param/platformId',
    method: 'POST',
    params,
  });
}

// 查询专业
export async function queryMajorTree(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/public/school/major/tree',
    method: 'POST',
    params,
  });
}

// 课程列表
export async function queryCoursePage(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/page',
    method: 'POST',
    params,
  });
}

// 课程内容 - 复制
export async function copyCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/copy',
    method: 'POST',
    params,
  });
}

// 通过id查询课程
export async function getCourseById(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/get',
    method: 'POST',
    params,
  });
}

// 课程列表
export async function getCourseList_Admin(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/list/all/page',
    method: 'POST',
    params,
  });
}

// 新增课程
export async function saveCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/save',
    method: 'POST',
    params,
  });
}

// 更新课程
export async function updateCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/update',
    method: 'POST',
    params,
  });
}

// 删除课程
export async function deleteCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/del',
    method: 'POST',
    params,
  });
}

// 课程内容 - 发布课程
export async function releaseCourse(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/course/course/release/publish',
    method: 'POST',
    params,
  });
}

// 课程内容 - 分页查询最新版且已发布且有权限的项目
export async function getReleasedProject(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/newest/released/page',
    method: 'POST',
    params,
  });
}

// 课程内容 - 章列表（包括章中的项目）
export async function getIncludeProList(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/chapter/includepro/list',
    method: 'POST',
    params,
  });
}

// 课程内容 - 新增章
export async function saveChapter(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/chapter/save',
    method: 'POST',
    params,
  });
}

// 课程内容 - 修改章
export async function updateChapter(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/chapter/update',
    method: 'POST',
    params,
  });
}

// 课程内容 - 章删除
export async function deleteChapter(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/chapter/del',
    method: 'POST',
    params,
  });
}

// 课程内容 - 排序
export async function sortChapter(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/chapter/sort',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 课程内容 - 添加项目
export async function saveChapterProject(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/chapter/project/save',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 课程内容 - 删除项目
export async function deleteChapterProject(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/chapter/project/del',
    method: 'POST',
    params,
  });
}

// 课程内容 - 项目排序
export async function sortChapterProject(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/chapter/project/sort',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 课程内容 - 更新项目到最新版本
export async function renewToLastVersion(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/chapter/project/tolastversion',
    method: 'POST',
    params,
  });
}

//   导图-查询思维导图课程结构
export async function getCourseStructure(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/mindmap/structure/get',
    method: 'POST',
    params,
  });
}

// [课程脑图]初始化脑图
export async function initCourseMindmap(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/mindmap/init',
    method: 'GET',
    params,
  });
}
// [课程脑图]保存脑图
export async function saveCourseMindmap(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/mindmap/save',
    method: 'POST',
    params,
  });
}

// 管理团队 - 获取未授权的成员列表
export async function getNoAuthPage(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/power/noauth/page',
    method: 'POST',
    params,
  });
}

// 管理团队 - 获取已授权成员列表
export async function getAuthPage(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/power/auth/list',
    method: 'POST',
    params,
  });
}

// 管理团队 - 解除授权
export async function unAuthCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/power/unauth',
    method: 'POST',
    params,
  });
}

// 管理团队 - 授权
export async function authCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/power/auth',
    method: 'POST',
    params,
  });
}

// 管理团队 - 移交管理员
export async function changeAdminCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/power/admin/change',
    method: 'POST',
    params,
  });
}

// 课程能力模型
export async function getCourseAbilityModel(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/ability/mind/get',
    method: 'POST',
    params,
  });
}

// 资源-教师学生资源列表
export async function getResourceList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/resource/project/list',
    method: 'POST',
    params,
  });
}

// 资源-拓展资源列表
export async function getCourseResourceList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/resource/course/list',
    method: 'POST',
    params,
  });
}

// 资源-资源上传
export async function saveResource(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/resource/save',
    method: 'POST',
    params,
    isJSON: true,
  });
}

//  资源-资源变更
export async function changeResource(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/resource/change',
    method: 'POST',
    params,
  });
}

// 资源-设置是否下载
export async function setIsDownloadable(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/resource/setisdownloadable',
    method: 'POST',
    params,
  });
}

// 资源-资源修改
export async function updateResource(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/resource/update',
    method: 'POST',
    params,
  });
}

// 资源-设置是否开放
export async function setIsOpen(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/resource/setisopen',
    method: 'POST',
    params,
  });
}

// 资源-删除资源
export async function delResource(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/resource/del',
    method: 'POST',
    params,
  });
}

// 工作应用-查询未绑定的app
export async function unbindAppList(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/app/unbind/list',
    method: 'POST',
    params,
  });
}

// 工作应用-查询已绑定app列表
export async function bindAppList(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/app/bind/list',
    method: 'POST',
    params,
  });
}

// 工作应用-新增
export async function saveAppCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/app/save',
    method: 'POST',
    params,
  });
}

// 工作应用-编辑
export async function updateAppCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/app/update',
    method: 'POST',
    params,
  });
}

// 工作应用-删除
export async function delAppCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/course/app/del',
    method: 'POST',
    params,
  });
}

// 获取最近课程列表
export async function getLastversion(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/course/builder/lastversion/page',
    method: 'POST',
    params,
  });
}

// 课程加入到班级
export async function saveclassCourse(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/course/add',
    method: 'POST',
    params,
    reject: false,
  });
}
// 获取课程详情
export async function getCourseDetail(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/class/course/get',
    method: 'POST',
    params,
  });
}
// 获取课程详情
export async function saveCourseDetail(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/update',
    method: 'POST',
    params,
  });
}
// 获取课程详情
export async function getCourseChaptor(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/teach/element/chapter/includepro/list',
    method: 'POST',
    params,
  });
}
// 更新章节
export async function updateCourseChaptor(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/chapter/update',
    method: 'POST',
    params,
  });
}
// 删除章下面的项目
export async function deleteChaptorProject(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/chapter/project/del',
    method: 'POST',
    params,
  });
}
// 教师端-新增章节
export async function addTacherChaptor(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/chapter/save',
    method: 'POST',
    params,
  });
}
// 教师端-查询所有项目
export async function getTeacherProject(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/project/project/my/newest/released/page',
    method: 'POST',
    params,
  });
}
// 教师端-添加项目
export async function addTacherProject(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/chapter/project/save',
    method: 'POST',
    params,
    isJSON: true,
  });
}
// 推送
export async function pushCourse(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/element/push/push',
    method: 'POST',
    params,
  });
}
// 收回推送
export async function recoverCourse(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/element/push/recover',
    method: 'POST',
    params,
  });
}
// 开放答案
export async function openCourseAnswer(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/element/answer/open',
    method: 'POST',
    params,
  });
}
// 收回答案
export async function closeCourseAnswer(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/element/answer/close',
    method: 'POST',
    params,
  });
}
// 获取成员
export async function getMemberCount(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/class/member/count',
    method: 'POST',
    params,
  });
}
// 获取班级信息-首页统计
export async function getProjectCount(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/teach/index/element/stat',
    method: 'POST',
    params,
  });
}
// 获取班级信息-首页统计
export async function resetBill(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/project/project/train/redobill',
    method: 'POST',
    params,
  });
}
// 项目排序
export async function sortProject(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/chapter/project/sort',
    method: 'POST',
    params,
  });
}

// 查询评级中的成绩是否展示
export async function getClassStatus(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/class/class/status/get',
    method: 'POST',
    params,
  });
}

// 查询评级中的成绩是否展示
export async function delChaptor(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/course/course/chapter/del',
    method: 'POST',
    params,
  });
}
