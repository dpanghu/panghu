import { $axios } from '@/utils/http';
import { PrefixApi } from '../utils/enum';
const RUNNER = '/runner';
const TARA = '/tara';

/**
 *
 * 科研工作台
 */

// 【字典】新增
export const saveScientificTag = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/pre/tag/save',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 【字典】更新
export const updateScientificTag = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/pre/tag/update',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 【字典】列表分页
export const getScientificTagPage = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/pre/tag/page',
    method: 'GET',
    params,
    isScientificXHR: true,
  });
};

// 【字典】删除
export const delScientificTag = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/pre/tag/del',
    method: 'GET',
    params,
    isScientificXHR: true,
  });
};

// 【字典】查看
export const getScientificTag = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/pre/tag/get',
    method: 'GET',
    params,
    isScientificXHR: true,
  });
};

// 【字典】全部标签
export const getScientificTagAll = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/pre/tag/all',
    method: 'GET',
    params,
    isScientificXHR: true,
  });
};

// 【案例】新增案例
export const saveNewCase = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/pre/cases/save',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 【案例】分页查询
export const getScientificCaseAll = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/purchase/cases/page',
    method: 'GET',
    params,
    isScientificXHR: true,
  });
};

// 【案例】查看案例
export const getScientificCaseDetail = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/pre/cases/get',
    method: 'GET',
    params,
    isScientificXHR: true,
  });
};

// 【案例】 删除案例
export const delScientificCase = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/pre/cases/del',
    method: 'GET',
    params,
    isScientificXHR: true,
  });
};

// 【案例】 更新案例
export const updateScientificCase = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/pre/cases/update',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 【案例】 根据产品编码查询案例（分页）
export const getProductCaseList = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/product/case/list',
    method: 'GET',
    params,
    isScientificXHR: true,
  });
};

// 【案例】 产品案例岗位（分页）
export const getProductCasePost = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/tara/product/casepost/list',
    method: 'GET',
    params,
    isScientificXHR: true,
  });
};

// 项目保存
export const saveScientificProject = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/scientific/scientific/project/save',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 项目公开科研团队保存
export const saveScientificProjectTeam = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/scientific/scientific/project/team/save',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 项目公开科研团队查询
export const getScientificProjectTeam = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/scientific/scientific/project/team/get',
    method: 'POST',
    params,
    hiddenLoading: true,
    isScientificXHR: true,
  });
};

// 删除项目
export const delScientificProject = (params?: RecordItem) => {
  return $axios.request({
    url: TARA + '/scientific/scientific/project/del',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

//保存附件 attachmentId
export async function getAttachmentId(params?: RecordItem) {
  return $axios.request({
    url: `${PrefixApi.RESOURCE}/res/attachment/upload`,
    method: 'GET',
    params,
    isScientificXHR: true,
  });
}

// 模块权限
export const jurisdictionModal = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/model/jurisdiction',
    method: 'GET',
    params,
    hiddenLoading: true,
    isScientificXHR: true,
  });
};

// 项目主页--最近一周未结项的项目
export const notcloseitemResearch = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/notcloseitem',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 项目主页--数据集使用情况
export const datasetusedResearch = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/datasetused',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 项目主页--常用应用
export const getApplicationcfg = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/applicationcfg',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 项目主页--热门课题
export const getHsSubject = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/hsSubject',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};
