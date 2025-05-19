import { $axios } from '@/utils/http';
// import { PrefixApi } from '../utils/enum';
// const { OLD__BUILDER } = PrefixApi;

//测试-获取外观配置
export async function getAppearance(params?: RecordItem) {
  return $axios.request({
    url: '/tara' + '/manage/tara/config/appearance/get',
    method: 'GET',
    params,
  });
}

//测试-更新、保存外观配置
export async function postAppearance(params?: RecordItem) {
  return $axios.request({
    url: '/tara' + '/manage/tara/config/appearance/save',
    method: 'POST',
    params,
  });
}
