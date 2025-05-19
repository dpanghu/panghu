import { $axios } from '@/utils/http';

export async function getUserInfo(params?: RecordItem) {
  return $axios.request({
    url: 'test',
    method: 'GET',
    params,
  });
}
export async function getSchoolAuthModuls(params?: RecordItem) {
  return $axios.request({
    url: 'test',
    method: 'GET',
    params,
  });
}
