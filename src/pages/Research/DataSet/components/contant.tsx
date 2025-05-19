const TAG = [
  {
    key: 'industry',
    name: '行业标签',
  },
  {
    key: 'domain',
    name: '领域标签',
  },
];

const DATA_VOLUME: any = [
  { key: '1', name: '百级' },
  { key: '2', name: '千级' },
  { key: '3', name: '万级' },
  { key: '4', name: '十万级' },
  { key: '5', name: '百万级' },
  { key: '6', name: '千万级' },
  { key: '7', name: '亿级' },
];

const DATA_VOLUME_VALUE: any = {
  1: '百级',
  2: '千级',
  3: '万级',
  4: '十万级',
  5: '百万级',
  6: '千万级',
  7: '亿级',
};

const TYPE: any = [
  { key: '1', name: '自建数据集' },
  { key: '2', name: 'API 接口数据集' },
  { key: '3', name: 'Xdata 数据集' },
  { key: '4', name: 'U8 数据集' },
];

const TYPE_VALUE: any = {
  1: '自建数据集',
  2: 'API 接口数据集',
  3: 'Xdata 数据集',
  4: 'U8 数据集',
};
const RECOMMEND = [
  { key: '', name: '不限' },
  { key: '1', name: '推荐' },
];

const PURCHASE = [
  { key: '', name: '不限' },
  { key: '0', name: '未购买' },
  { key: '1', name: '已购买' },
];

const DATA_TITLE = [
  { key: 'introduce', name: '数据集介绍' },
  { key: 'preview', name: '数据预览' },
];

export { TAG, DATA_VOLUME, TYPE, RECOMMEND, PURCHASE, DATA_TITLE, DATA_VOLUME_VALUE, TYPE_VALUE };
