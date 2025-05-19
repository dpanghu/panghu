import { $axios } from '@/utils/http';
import { PrefixApi } from '../enum';
const STURUNNER = PrefixApi.STURUNNER;
const RESOURCE = PrefixApi.RESOURCE;

// 查询学生作业
export async function homeworkInfo(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/classstudy/project/homework/record/gethomeworksinfo',
    method: 'POST',
    params,
    isJSON: true,
    hiddenLoading: true,
  });
}

// 新增或者更新附件信息
export async function saveHomeworkRecord(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/classstudy/project/homework/record/saveHomeworkRecord',
    method: 'POST',
    params,
    isJSON: true,
  });
}

export async function attachmentImg(params?: RecordItem) {
  return $axios.request({
    url: RESOURCE + '/res/attachment/upload',
    method: 'POST',
    params,
  });
}

// 提交作业
export async function submitHomeworkRecord(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/classstudy/project/homework/record/submitHomeworkRecord',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 教师端 作业列表
export async function homeworkList(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/class/status/getteacherhomeworksinfo',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 压缩包
export async function recordZip(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/manager/class/techer/homework/zip/record/zip',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 废弃压缩
export async function cancelZip(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/manager/class/techer/homework/zip/record/cancelzip',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 查询作业人员列表
export async function studenthomeworksinfo(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/class/score/searchhomework',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 评分
export async function homeworkscore(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/class/score/homeworkscore',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 批量评分
export async function homeworkbatchscore(params?: RecordItem) {
  return $axios.request({
    url: STURUNNER + '/class/score/homeworkbatchscore',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 批量退回
export async function homeworkbatchreturn(params?: RecordItem | any) {
  return $axios.request({
    url: STURUNNER + '/class/score/homeworkbatchreturn',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 文档组件
export async function fileGet(params?: RecordItem | any) {
  return $axios.request({
    url: STURUNNER + '/tc/project/project/file/get',
    method: 'POST',
    params,
    // isJSON: true,
  });
}

//
export async function checkStart(params?: RecordItem | any) {
  return $axios.request({
    url: STURUNNER + '/localapp/check/start',
    method: 'POST',
    params,
  });
}

// 下载
export async function vrZip(params?: RecordItem | any) {
  return $axios.request({
    url: STURUNNER + '/task/vr/get',
    method: 'POST',
    params,
  });
}

// 本地
export async function startSuccess(params?: RecordItem | any) {
  return $axios.request({
    url: STURUNNER + '/localapp/start/success',
    method: 'POST',
    params,
  });
}

// 平台地址
export async function ipUrl(params?: RecordItem | any) {
  return $axios.request({
    url: STURUNNER + '/platform/main/ip/get',
    method: 'POST',
    params,
  });
}

// 概要分析
// 平台地址
export async function conspectusanalyse(params?: RecordItem | any) {
  return $axios.request({
    url: STURUNNER + '/class/score/conspectusanalyse',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 富文本查询
export async function getonetaskrichtext(params?: RecordItem | any) {
  return $axios.request({
    url: STURUNNER + '/classstudy/project/rich/text/getonetaskrichtext',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 获取Vr头盔码
export async function classVrCodeGet(params?: RecordItem | any) {
  return $axios.request({
    url: STURUNNER + '/class/vrcode/get',
    method: 'POST',
    params,
    // isJSON: true,
  });
}
