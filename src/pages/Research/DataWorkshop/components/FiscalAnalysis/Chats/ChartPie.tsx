import React from 'react';
import { Pie } from '@ant-design/plots';

interface Props {
  data: any;
}

const ChartPie: React.FC<Props> = (props: Props) => {
  const { data } = props;

  const data1 =
    (data &&
      data.length > 0 &&
      data.map((item: RecordItem) => ({
        ...item,
        value: Number(item.output || 0),
        // structure: enumData[item.structure],
      }))) ||
    [];

  const config = {
    data: data1,
    appendPadding: 10,
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
      '#FFAD89',
      '#5AD8A6',
      '#5A73FF',
      '#A481FF',
      '#FF99C2',
      '#9F5AFF',
      '#B3ECFF',
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
