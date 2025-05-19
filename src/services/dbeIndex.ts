import { PrefixApi } from '@/utils/enum';
import { $axios } from '@/utils/http';
const RUNNER = PrefixApi.RUNNER;
const OLD__BUILDER = PrefixApi.OLD__BUILDER;

export async function getTeamMemberInfo(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/stu/team/get',
    method: 'POST',
    params,
    hiddenLoading: true,
    hiddenErrorMessage: true,
  });
}

export async function teamDelMember(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/stu/del/member',
    method: 'POST',
    params,
  });
}

export async function selectPostList(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/stu/team/selectable',
    method: 'POST',
    params,
  });
}

export async function uploadFile(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/team/files/upload',
    method: 'POST',
    params,
  });
}

export async function delTeamFile(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/team/file/delete',
    method: 'POST',
    params,
  });
}

export async function getTeamSpaceFile(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/team/files/select',
    method: 'POST',
    params,
  });
}

export async function submitTchTeam(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/stu/team/init',
    method: 'POST',
    params,
  });
}

export async function addSchoolMemberTchTeam(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/team/member/add',
    method: 'POST',
    params,
  });
}

export async function getSchoolMembersNoEntryTchTeam(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/team/student/selectable',
    method: 'POST',
    params,
  });
}

export async function getTeachClassTchTeams(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/stu/team/member/list',
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

export async function submitTeamBaseInfo(params?: RecordItem) {
  return $axios.request({
    url: RUNNER + '/stu/team/save',
    method: 'POST',
    params,
  });
}

export async function getMenu(params?: RecordItem) {
  return $axios.request({
    url: OLD__BUILDER + '/auth/ux/menu/get',
    method: 'POST',
    params,
  });
}
