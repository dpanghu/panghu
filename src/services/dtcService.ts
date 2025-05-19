import { $axios } from '@/utils/http';
import { PrefixApi } from '../utils/enum';
const DTC = PrefixApi.DTC;

// 创建私聊
export const createSingleChat = (params?: RecordItem) => {
  return $axios.request({
    url: DTC + '/chat.chatSession.addOrOpen',
    method: 'POST',
    params,
  });
};
// 创建私聊
export const createRroupChat = (params?: RecordItem) => {
  return $axios.request({
    url: DTC + '/chat.group.create',
    method: 'POST',
    params,
  });
};
