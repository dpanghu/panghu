import React from 'react';
import { Column } from '@ant-design/plots';

interface Props {
  data: any;
}
const SingleColumn: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const config = {
    data,
    xField: 'type',
    yField: 'sales',
    color: '#7187FF',
    maxColumnWidth: 5,
    columnStyle: {
      radius: [5, 5, 0, 0],
      // fill: '#93ABFF',
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
  } as any;
  return <Column {...config} />;
};

export default SingleColumn;
