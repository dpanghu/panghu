import React from 'react';
import { Line } from '@ant-design/plots';
interface Props {
  data: any;
}
const ChatLine: React.FC<Props> = (props: Props) => {
  const { data } = props;

  console.log('data', data);
  const config = {
    data,
    xField: 'key',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    color: [
      '#FFAD89',
      '#5AD8A6',
      '#5A73FF',
      '#FF7FDE',
      '#7187FF',
      '#6ADCAF',
      '#0CE8E8',
      '#FFF42B',
      '#F7A42E',
      '#BA91FF',
      '#BA91FF',
      '#CBCBCB',
      '#A481FF',
      '#FF99C2',
      '#9F5AFF',
      '#B3ECFF',
    ],
    // xAxis: {
    //   type: 'time',
    // },
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`) + '%',
      },
    },
    tooltip: {
      showTitle: true,
      formatter: (item: RecordItem) => {
        return {
          name: item.key,
          value: item?.value + '%',
        };
      },
    },
  };

  return <Line {...config} />;
};

export default ChatLine;
