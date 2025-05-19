import { PrefixApi } from '@/utils/enum';
import { $axios } from '@/utils/http';
const RUNNER = PrefixApi.RUNNER;
const BUILDER = PrefixApi.BUILDER;

// user-service

// 验证手机号
export async function hasBeenUsedCheck(params?: RecordItem) {
  return $axios.request({
    url: '/user-service/userName.hasBeenUsed.check',
    method: 'POST',
    params,
    isPlatform: true,
  });
}
// 绑定手机号
export async function bindPhoneNumber(params?: RecordItem) {
  return $axios.request({
    url: '/phoneNumber.binding.add',
    method: 'POST',
    params,
    isPlatform: true,
  });
}

// 获取验证码
export async function mobileSend(params?: RecordItem) {
  return $axios.request({
    url: '/public/captcha.mobile.send',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
}
