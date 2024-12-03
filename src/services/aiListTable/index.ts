import { $axios } from '@/utils/http';

//获取表格数据
export async function getAiListTableData<T>(params?: RecordItem): Promise<T> {
    return $axios.request({
      url: '/ob/xai/plugin/autit/page',
      method: 'POST',
      params,
    });
}