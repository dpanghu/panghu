/* 
    交互式课件 接口
*/

import { $axios } from '@/utils/http';
import { PrefixApi } from '../utils/enum';
const BUILDER = PrefixApi.BUILDER;
const EXCEL = PrefixApi.EXCEL;
const RUNNER = PrefixApi.RUNNER;
const SKS = PrefixApi.SKS;
const OLD__BUILDER = PrefixApi.OLD__BUILDER;
// [项目团队]查询未授权的成员列表
export async function getPageList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/project/project/stu/study/train/page',
    method: 'POST',
    params,
  });
}
export async function getTechnologyTag(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/public/tag/findbytype',
    method: 'POST',
    params,
  });
}
export async function getNoAuthMemberList(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/rel/noauth/teacher/page',
    method: 'POST',
    params,
  });
}

// [项目团队]查询已授权的成员列表
export async function getAuthMemberList(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/rel/auth/teacher/list',
    method: 'POST',
    params,
  });
}

// [项目团队]查询未授权的成员列表
export async function getNoAuthMemberListProject(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/project/rel/noauth/teacher/page',
    method: 'POST',
    params,
  });
}

// [项目团队]查询已授权的成员列表
export async function getAuthMemberListProject(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/project/rel/auth/teacher/list',
    method: 'POST',
    params,
  });
}

//[项目]查询系统预置的或自己创建的已发版的或者本校共享的镜像列表
export async function getSystemImageList(params?: RecordItem) {
  return $axios.request({
    url: SKS + '/image/findpreorsharedormyimages',
    method: 'GET',
    params,
  });
}

// [项目团队]解除授权
export async function deleteAuthTeamMember(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/project/rel/project/teacher/unauth',
    method: 'POST',
    params,
  });
}

// [项目团队]授权
export async function addAuthTeamMember(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/project/rel/project/teacher/auth',
    method: 'POST',
    params,
  });
}

// 移交管理员
export async function transferAdmin(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/project/rel/project/teacher/change/admin',
    method: 'POST',
    params,
  });
}

// [项目] 分页查询
export async function projectPageSearch(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/page',
    method: 'GET',
    params,
  });
}

// [项目] 分页查询 - Admin
export async function projectPageSearch_Admin(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/project/project/school/authed/page',
    // url: OLD__BUILDER + '/project/project/page',
    method: 'GET',
    params,
  });
}

// [项目] 删除
export async function projectDelete(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/del',
    method: 'POST',
    params,
  });
}

// [项目] 删除
export async function ProjectDelete(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/project/project/del',
    method: 'POST',
    params,
  });
}

// [项目] 复制项目
export async function copyProject(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/project/project/copy',
    method: 'POST',
    params,
  });
}

// [项目] 发布
export async function releaseProject(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/project/project/release',
    method: 'POST',
    params,
  });
}

// [项目] 查询标签
export async function findTagList(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/public/tag/findbytype',
    method: 'POST',
    params,
  });
}

// [项目] 添加标签
export async function addTag(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/public/tag/save',
    method: 'POST',
    params,
  });
}

// [项目] 新建项目 - 基本信息
export async function createProject_step1(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/baseinfo/save',
    method: 'POST',
    params,
  });
}

// [项目] 查询项目信息 - 基础信息
export async function projectData_step1(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/get',
    method: 'POST',
    params,
  });
}

// [项目] 编辑项目信息 - 基础信息
export async function updateProject_step1(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/baseinfo/update',
    method: 'POST',
    params,
  });
}

// 报告保存
export async function saveReport(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/report/save',
    method: 'POST',
    params,
  });
}

//  更新报告
export async function updateReport(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/report/update',
    method: 'POST',
    params,
  });
}
// 项目 查询实践系统列表
export async function findSystemList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/public/biz/info/findbytype',
    method: 'POST',
    params,
  });
}
// 获取报告
export async function getReport(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/report/list',
    method: 'POST',
    params,
  });
}

// 项目 获取岗位列表
export async function getPostList(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/post/all',
    method: 'POST',
    params,
  });
}

// 项目 查询岗位职责列表
export async function getAllRelJobDutyCourseList(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/post/job/duty/data',
    method: 'POST',
    params,
  });
}

// 项目 添加能力模型 - 能力项
export async function addRelJobDutyCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/ability/element/item/add',
    method: 'POST',
    params,
  });
}

// 项目 删除关联的能力项
export async function delRelJobDutyCourse(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/ability/element/item/del',
    method: 'POST',
    params,
  });
}
// 项目 查询实践系统列表
export async function getStructures(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/courseStructures.get',
    method: 'POST',
    params,
  });
}
// 项目 查询关联能力模型项
export async function getRelElementAbilityItem(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/ability/element/item/ability/list',
    method: 'POST',
    params,
  });
}
// 项目 能力模型查询左侧列表
export async function getRelJobDutyCourseList(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/ability/element/item/duty/list',
    method: 'POST',
    params,
  });
}
// 项目 查询实践系统列表
export async function addCapacityRelElementAbilityItem(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/capacity.relElementAbilityItem.add',
    method: 'POST',
    params,
  });
}
// 项目 查询实践系统列表
export async function delCapacityRelElementAbilityItem(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/capacity.relElementAbilityItem.del',
    method: 'POST',
    params,
  });
}

// 项目 项目情景-富文本保存
export async function saveMarked_step2(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/scene/richtext/save',
    method: 'POST',
    params,
  });
}

// 项目 项目情景-富文本修改
export async function updateMarked_step2(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/scene/richtext/update',
    method: 'POST',
    params,
  });
}

// 项目 项目情景-富文本查询
export async function getMarked_step2(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/scene/richtext/list',
    method: 'POST',
    params,
  });
}

// 项目 项目情景-VR包查询
export async function getVrList(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/rel/scenevr/package/list',
    method: 'POST',
    params,
  });
}

// 项目 项目情景-VR任务查询
export async function getVrTask(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/rel/scenevr/task/list',
    method: 'POST',
    params,
  });
}

// 项目 项目情景-VR保存
export async function saveVr_step2(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/rel/project/scenevr/save',
    method: 'POST',
    params,
  });
}

// 项目 项目情景-VR修改
export async function updateVr_step2(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/rel/project/scenevr/update',
    method: 'POST',
    params,
  });
}

// 项目 项目情景-VR查询
export async function getChooseVr(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/rel/project/scenevr/list',
    method: 'POST',
    params,
  });
}

// 项目 项目内容-实践组件保存
export async function trainSave(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/train/save',
    method: 'POST',
    params,
  });
}

// 项目 项目内容-实践组件查询角色
export async function getRole(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/public/biz/info/get',
    method: 'POST',
    params,
  });
}

// 项目 项目内容-组件详情
export async function getComponetDetail_step3(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/task/get',
    method: 'POST',
    params,
  });
}

// 脑图初始化
export async function initMindMap(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/mindmap/init',
    method: 'POST',
    params,
  });
}

// 脑图初始化
export async function initMindMap_P(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/project/project/mindmap/init',
    method: 'POST',
    params,
  });
}

// 脑图保存
export async function saveMindMap(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/mindmap/save',
    method: 'POST',
    params,
  });
}

// 查询单据列表
export async function findBillList(params?: RecordItem) {
  return $axios.request({
    url: EXCEL + '/excel/template/released/list',
    method: 'POST',
    params,
  });
}

// 查询单据分类
export async function findBillType(params?: RecordItem) {
  return $axios.request({
    url: EXCEL + '/buscategory/list',
    method: 'POST',
    params,
  });
}
// vr组件保存
export async function vrComponentSave(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/vr/task/save',
    method: 'POST',
    params,
  });
}

// 单据参数转换
export async function getDevParamId(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/platform/param/platformId',
    method: 'POST',
    params,
  });
}

// 项目 - 仿真题库 查询分类
export async function getClassQuestion(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/simulation/classification/get',
    method: 'POST',
    params,
  });
}

// 项目 - 仿真题库 查询题目
export async function getDataQuestion(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/simulation/question/page',
    method: 'POST',
    params,
  });
}

// 项目 - 仿真题库 保存题目
export async function saveQuestion(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/simulation/question/save',
    method: 'POST',
    params,
  });
}
//[项目]项目脑图   project/project/baseinfo/mindproject
export async function getMindproject(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/baseinfo/mindproject',
    method: 'POST',
    params,
  });
}

// [任务] 交互式课件任务 保存或修改
export async function saveAndUpdateCourseWare(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/task/courseware/save',
    method: 'POST',
    params,
  });
}

// 项目 - 项目报告 查询项目报告要求详情
export async function getProjectAnswer(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/tc/project/project/report/type',
    method: 'POST',
    params,
  });
}

// [学生]获取项目报告
export async function getProjectReport(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classstudy/report/get',
    method: 'POST',
    params,
  });
}

// [学生]保存项目报告
export async function saveProjectReport(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classstudy/report/save',
    method: 'POST',
    params,
  });
}

// [学生]更换项目报告
export async function updateProjectReport(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classstudy/report/update',
    method: 'POST',
    params,
  });
}

// [学生]更换项目报告
export async function submitProjectReport(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classstudy/report/submit',
    method: 'POST',
    params,
  });
}

// [教师]查看项目报告--按项目分类列表
export async function getProjectReportList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classmanager/report/project/list',
    method: 'POST',
    params,
  });
}

// [教师]查看项目报告--第二层 给学生打分列表
export async function getRateReportList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classmanager/report/list',
    method: 'POST',
    params,
  });
}

// [教师]批量打包下载
export async function reportZipDownload(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classmanager/report/zip',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// [教师]取消压缩打包
export async function cancelZipDownload(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classmanager/report/cancelzip',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// [教师]批量退回
export async function returnBatchScoring(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classmanager/report/batch/return',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// [教师]批量项目报告评分
export async function batchScoring(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classmanager/report/batch/score',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// [教师]单个项目报告评分
export async function oneReportScore(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/classmanager/report/score',
    method: 'POST',
    params,
  });
}

// [项目] 获取关联任务列表
export async function getConnentTask(params?: RecordItem) {
  return $axios.request({
    url: BUILDER + '/project/project/task/list/bytype',
    method: 'POST',
    params,
  });
}
