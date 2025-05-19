import { $axios } from '@/utils/http';
import { PrefixApi } from '../utils/enum';
const RUNNER = '/tara';

// 项目列表分页查询
export const getScProjectList = (params?: RecordItem) => {
  return $axios.request({
    url: '/tara' + '/scientific/scientific/project/page',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 项目查询详情页
export const getScProjectDetail = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/get',
    method: 'POST',
    params,
    hiddenLoading: true,
    isScientificXHR: true,
  });
};

// 项目公开科研团队查询
export const getScTeam = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/team/get',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 查询已经选择的团队成员
export const getScMemberList = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/member/list',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 分页查询弹窗选择团队成员
export const getMemberList = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/member/page',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 弹窗选择团队成员保存
export const saveMember = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/member/save',
    method: 'POST',
    params,
    isJSON: true,
    isScientificXHR: true,
  });
};

// 移交管理员
export const updateMemberStatus = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/member/update',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 删除管理员
export const delMember = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/member/del',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 查询可选角色
export const getRoleList = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/member/rolelist',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 保存角色
export const saveRole = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/member/assignroles',
    method: 'POST',
    params,
    isJSON: true,
    isScientificXHR: true,
  });
};

// 项目初始化
export const initProject = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/scientific/scientific/project/init',
    method: 'POST',
    params,
    hiddenLoading: true,
    isScientificXHR: true,
  });
};
