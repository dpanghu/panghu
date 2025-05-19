import React from 'react';
import { Bar } from '@ant-design/plots';

interface Props {
  data: any;
}
const ChartBar = (props: Props) => {
  const { data } = props;
  const config = {
    data,
    xField: 'sales',
    yField: 'type',
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
    minBarWidth: 5,
    maxBarWidth: 5,
    barStyle: {
      radius: [5, 5, 0, 0],
    },
  };
  return <Bar {...config} />;
};

export default ChartBar;
