import { $axios } from '@/utils/http';
//学习计划接口

//builder-导入数据
export async function importData<T>(params?: RecordItem): Promise<T> {
    return $axios.request({
      url: '/widget/xai/sp/question/import',
      method: 'POST',
      params,
      needUrl: true,
    });
}
//builder-保存/更新问卷设置
export async function saveQuestionnaire<T>(params?: RecordItem): Promise<T> {
    return $axios.request({
      url: '/widget/xai/sp/save',
      method: 'POST',
      params,
    });
}
//builder-查询问卷设置信息
export async function getQuestionnaire<T>(params?: RecordItem): Promise<T> {
    return $axios.request({
      url: '/widget/xai/sp/get',
      method: 'POST',
      params,
    });
}
//builder-查询导入数据列表
export async function getImportDataList<T>(params?: RecordItem): Promise<T> {
    return $axios.request({
      url: '/widget/xai/sp/question/import/list',
      method: 'POST',
      params,
    });
}
//builder-删除导入数据
export async function deleteImportData<T>(params?: RecordItem): Promise<T> {
    return $axios.request({
      url: '/widget/xai/sp/del/all',
      method: 'POST',
      params,
    });
}