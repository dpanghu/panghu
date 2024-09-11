import { $axios } from '@/utils/http';

//查询智能图谱历史记录
export async function getAtlasHistory(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/intelligence/map/get',
    method: 'GET',
    params,
  });
}

// 抽取知识
export async function extractKnowledge(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/intelligence/map/extract',
    method: 'POST',
    hiddenLoading: true,
    params,
  });
}

// 随机获取智能图谱预置的案例数据

export async function getRandomCase(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/intelligence/map/getByCycle',
    method: 'GET',
    hiddenLoading: true,
    params,
  });
}

// 生成图谱

export async function generateAtlas(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/intelligence/map/create',
    method: 'POST',
    hiddenLoading: true,
    params,
  });
}
