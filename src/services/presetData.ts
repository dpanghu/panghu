import { $axios } from '@/utils/http';

// 分页查询
export async function getPresetPageData<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/pic/recognition/preset/page',
    method: 'POST',
    params,
  });
}

// 删除
export async function delPresetPageData<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/pic/recognition/preset/del',
    method: 'POST',
    params,
  });
}

// 新增
export async function savePresetPageData<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/pic/recognition/preset/save',
    method: 'POST',
    params,
  });
}

// 查询插件编码对接的附件参数
export async function getFileConf<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/xai/plugin/param/fileconf/get',
    method: 'POST',
    params,
  });
}
