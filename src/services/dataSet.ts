import { $axios } from '@/utils/http';
import { PrefixApi } from '../utils/enum';
const RUNNER = PrefixApi.RUNNER;

/**
 *
 * 科研工作台
 */

// 保存数据集卡片
export const saveDataSet = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/tara/pre/dataset/save',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 查询数据集卡片列表
export const getDataSetList = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/tara/pre/dataset/page',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 查询单个数据集卡片详情
export const getDataSetDetail = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/tara/pre/dataset/get',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 删除单个数据集卡片
export const delDataSet = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/tara/pre/dataset/del',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 导入-数据集卡片
export const importDataSet = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/tara/pre/dataset/getdataset',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};

// 数据集-选择数据源
export const getDataSet = (params?: RecordItem) => {
  return $axios.request({
    url: RUNNER + '/tara/pre/dataset/getdataset',
    method: 'POST',
    params,
    isScientificXHR: true,
  });
};
