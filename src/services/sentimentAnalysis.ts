import { $axios } from '@/utils/http';

// 获取随机预置数据
export async function exampleRandom(params?: RecordItem) {
  return $axios.request({
    url: `/xai/plugin/example/random`,
    method: 'GET',
    params,
  });
}

// 智能生成插件实例-阻塞式
export async function pluginCreate(params?: RecordItem) {
  return $axios.request({
    url: `/xai/plugin/create`,
    method: 'POST',
    params,
    isJSON: true,
  });
}

//
export async function paramPlatformId(params?: RecordItem) {
  return $axios.request({
    url: `/platform/param/platformId`,
    method: 'GET',
    params,
  });
}
