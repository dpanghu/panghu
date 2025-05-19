import React from 'react';
import { Pie } from '@ant-design/plots';

const ChartPie = () => {
  const data = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
    {
      type: '其他',
      value: 5,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    height: 295,
    angleField: 'value',
    colorField: 'type',
    color: [
      '#0CE8E8',
      '#6ADCAF',
      '#7187FF',
      '#BA91FF',
      '#F7A42E',
      '#CBCBCB',
      '#FF7FDE',
      '#FFF42B',
      '#7BACFF',
    ],
    radius: 0.8,
    label: {
      type: 'spider',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};

export default ChartPie;
