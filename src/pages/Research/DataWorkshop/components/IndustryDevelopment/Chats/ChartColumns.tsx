import React from 'react';
import { Column } from '@ant-design/plots';

const data = [
  {
    product_type: '办公用品',
    sex: '男',
    order_amt: 8,
    product_sub_type: '橡皮擦',
  },
  {
    product_type: '办公用品',
    sex: '男',
    order_amt: 10,
    product_sub_type: '书架',
  },
  {
    product_type: '办公用品',
    sex: '男',
    order_amt: 20,
    product_sub_type: '砚台',
  },
  {
    product_type: '办公用品',
    sex: '女',
    order_amt: 13,
    product_sub_type: '砚台',
  },
  {
    product_type: '办公用品',
    sex: '女',
    order_amt: 21,
    product_sub_type: '橡皮擦',
  },
  {
    product_type: '办公用品',
    sex: '女',
    order_amt: 21,
    product_sub_type: '书架',
  },
  {
    product_type: '家电家具',
    sex: '男',
    order_amt: 13,
    product_sub_type: '洗衣机',
  },
  {
    product_type: '家电家具',
    sex: '女',
    order_amt: 2,
    product_sub_type: '洗衣机',
  },
  {
    product_type: '家电家具',
    sex: '男',
    order_amt: 5,
    product_sub_type: '微波炉',
  },
  {
    product_type: '家电家具',
    sex: '男',
    order_amt: 14,
    product_sub_type: '电磁炉',
  },
  {
    product_type: '家电家具',
    sex: '女',
    order_amt: 23,
    product_sub_type: '微波炉',
  },
  {
    product_type: '家电家具',
    sex: '女',
    order_amt: 23,
    product_sub_type: '电磁炉',
  },
  {
    product_type: '电子产品',
    sex: '男',
    order_amt: 33,
    product_sub_type: '电脑',
  },
  {
    product_type: '电子产品',
    sex: '女',
    order_amt: 4,
    product_sub_type: '电脑',
  },
  {
    product_type: '电子产品',
    sex: '女',
    order_amt: 23,
    product_sub_type: 'switch',
  },
  {
    product_type: '电子产品',
    sex: '男',
    order_amt: 20.9,
    product_sub_type: 'switch',
  },
  {
    product_type: '电子产品',
    sex: '男',
    order_amt: 5.9,
    product_sub_type: '鼠标',
  },
  {
    product_type: '电子产品',
    sex: '女',
    order_amt: 5.9,
    product_sub_type: '鼠标',
  },
];

const ChatColumn = () => {
  const config = {
    data,
    xField: 'product_type',
    yField: 'order_amt',
    isGroup: true,
    isStack: true,
    seriesField: 'product_sub_type',
    groupField: 'sex',
    maxColumnWidth: 48,
    color: ['#20EFE6', '#A481FF', '#32D2FF', '#FFD700', '#5A73FF'],
  };

  return <Column {...config} />;
};

export default ChatColumn;
