import { $axios } from '@/utils/http';
import { PrefixApi } from '../utils/enum';
const BUILDER = PrefixApi.BUILDER;
const RUNNER = '/runner';
const USER = PrefixApi.USER;
const OLD__BUILDER = PrefixApi.OLD__BUILDER;

export async function addOrg(params?: any) {
  return $axios.request({
    url: '/org.saveorupdate',
    method: 'POST',
    params,
  });
}
export async function excelExport(params?: any) {
  return $axios.request({
    url: '/checkpoint.exportExcel',
    method: 'POST',
    params,
  });
}
export async function cardExport(params?: any) {
  return $axios.request({
    url: '/checkpoint.export',
    method: 'POST',
    params,
  });
}

export async function getCheckDetail(params?: any) {
  return $axios.request({
    url: '/checkpoint.get',
    method: 'POST',
    params,
  });
}

export async function userList(params?: any) {
  return $axios.request({
    url: '/privilege.user.page',
    method: 'POST',
    params,
  });
}

export async function addCheck(params?: any) {
  return $axios.request({
    url: '/checkpoint.cy',
    method: 'POST',
    params,
  });
}

export async function editRole(params?: any) {
  return $axios.request({
    url: '/privilege.role.update',
    method: 'POST',
    params,
  });
}

export async function editUser(params?: any) {
  return $axios.request({
    url: '/privilege.user.update',
    method: 'POST',
    params,
  });
}

export async function addUser(params?: any) {
  return $axios.request({
    url: '/privilege.user.sadd',
    method: 'POST',
    params,
  });
}

export async function addRole(params?: any) {
  return $axios.request({
    url: '/privilege.role.sadd',
    method: 'POST',
    params,
  });
}

export async function roleList(params?: any) {
  return $axios.request({
    url: '/privilege.role.list',
    method: 'POST',
    params,
  });
}

export async function Upload(params?: any) {
  return $axios.request({
    url: '/private.params.upload.get',
    method: 'POST',
    params,
  });
}

export async function delUser(params?: any) {
  return $axios.request({
    url: '/privilege.user.del',
    method: 'POST',
    params,
  });
}

export async function delRole(params?: any) {
  return $axios.request({
    url: '/privilege.role.del',
    method: 'POST',
    params,
  });
}

export async function cardList(params?: any) {
  return $axios.request({
    url: '/checkpoint.page',
    method: 'POST',
    params,
  });
}

export async function delCard(params?: any) {
  return $axios.request({
    url: '/checkpoint.del',
    method: 'POST',
    params,
  });
}

export async function checkSample(params?: any) {
  return $axios.request({
    url: '/checkpoint.get',
    method: 'POST',
    params,
  });
}

export async function addCard(params?: any) {
  return $axios.request({
    url: '/checkpoint.saveorupdate',
    method: 'POST',
    params,
  });
}

export async function sampleList(params?: any) {
  return $axios.request({
    url: '/sample.page',
    method: 'POST',
    params,
  });
}

export async function delSample(params?: any) {
  return $axios.request({
    url: '/sample.del',
    method: 'POST',
    params,
  });
}

export async function addSample(params?: any) {
  return $axios.request({
    url: '/sample.save',
    method: 'POST',
    params,
  });
}

export async function delQrcode(params?: any) {
  return $axios.request({
    url: '/qr.del',
    method: 'POST',
    params,
  });
}

export async function addQrcode(params?: any) {
  return $axios.request({
    url: '/qr.create',
    method: 'POST',
    params,
  });
}

export async function qrcodeList(params?: any) {
  return $axios.request({
    url: '/qr.page',
    method: 'POST',
    params,
  });
}

export async function delDepf(params?: any) {
  return $axios.request({
    url: '/cabinet.del',
    method: 'POST',
    params,
  });
}

export async function addDept(params?: any) {
  return $axios.request({
    url: '/cabinet.saveorupdate',
    method: 'POST',
    params,
  });
}

export async function delOrg(params?: any) {
  return $axios.request({
    url: '/org.del',
    method: 'POST',
    params,
  });
}
export async function deptList(params?: any) {
  return $axios.request({
    url: '/cabinet.page',
    method: 'POST',
    params,
  });
}

export async function resourceList1(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/manage/upgrade/course/resource/list',
    method: 'POST',
    params,
  });
}

export async function orgList(params?: any) {
  return $axios.request({
    url: '/org.page',
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

export async function getForbiddenWords(params?: RecordItem) {
  return $axios.request({
    url: '/user-service/determiner.get',
    method: 'POST',
    params,
    type: 'login',
    isPlatform: true,
  });
}

export async function resourceUpdate(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/manage/upgrade/course/resource/upgrade',
    method: 'POST',
    params,
  });
}

export async function resourceList(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/manage/upgrade/course/resource/list',
    method: 'POST',
    params,
  });
}

export async function courseList(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/manage/upgrade/course/purchase/latest',
    method: 'get',
    params,
  });
}

export async function versionAdd(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/manage/upgrade/course/upgrade',
    method: 'POST',
    params,
  });
}

// 远程地址查询
export async function getOriginAddress(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/public/biz/info/remote/getAll',
    method: 'GET',
    params,
  });
}

export async function getAttachmentId(params?: RecordItem) {
  return $axios.request({
    url: 'test',
    method: 'GET',
    params,
  });
}

export async function login(params?: RecordItem) {
  return $axios.request({
    url: '/privilege.user.login',
    method: 'POST',
    params,
    type: 'login',
    isPlatform: true,
  });
}

export async function randomStr(params?: any) {
  return $axios.request({
    url: '/validcode/randomimg/create',
    method: 'POST',
    params,
    type: 'login',
    isPlatform: true,
  });
}

export async function getRoleList(params?: RecordItem) {
  return $axios.request({
    url: '/user-service/schoolMember.auth.get',
    method: 'POST',
    params,
    isPlatform: true,
  });
}

// 获取个人信息
export async function getBaseInfo(params?: RecordItem) {
  return $axios.request({
    url: '/user-service/user.login.baseinfo.get',
    method: 'POST',
    params,
    isPlatform: true,
  });
}

// 更新用户信息
export async function updateBaseInfo(params?: RecordItem) {
  return $axios.request({
    url: '/user-service/user.login.baseinfo.update',
    method: 'POST',
    params,
    isPlatform: true,
  });
}

// 更新用户信息
export async function getIps(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/public/remote/url/get',
    method: 'POST',
    params,
  });
}

// 更新用户信息
export async function checkMajorplan(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/public/license/item/majorplan',
    method: 'POST',
    params,
  });
}

// 更新用户信息
export async function getEnvironment(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/public/config/isonline',
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

// 更新用户信息
export async function changeCode(params?: RecordItem) {
  return $axios.request({
    url: USER + '/password.reset',
    method: 'POST',
    params,
  });
}
