import React from 'react';
import { Bar } from '@ant-design/plots';

interface Props {
  data: any;
}
const ChartBar: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const data1 =
    (data &&
      data.length > 0 &&
      data.map((item: RecordItem) => ({
        ...item,
        输出量: Number(item.output || 0),
        // structure: enumData[item.structure],
      }))) ||
    [];
  // console.log('data', data);
  const config = {
    data: data1 || [],
    xField: '输出量',
    yField: 'structure',
    appendPadding: [0, 20, 0, 0],
    yAxis: {
      label: {
        autoHide: false,
        formatter(text: any) {
          // 字符太长添加省略号
          return text.length > 2 ? `${text.slice(0, 2)}...` : text;
        },
        style: {
          fontSize: 12,
        },
      },
    },
    xAxis: {
      tickCount: 3,
      label: {
        autoHide: false,
        style: {
          fontSize: 12,
        },
      },
      grid: {
        line: {
          style: {
            // stroke: '#f1f1f1',
            lineWidth: 1,
            lineDash: [4, 5],
            cursor: 'pointer',
          },
        },
        // tickLine: {
        //   style: {
        //     stroke: '#666',
        //     lineWidth: 2,
        //     cursor: 'pointer'
        //   }
        // }
      },
    },
    label: {
      // 可手动配置 label 数据标签位置
      position: 'right',
      // 'left', 'middle', 'right'
      offset: 4,
      formatter(text: any, item: any) {
        // console.log('e35353535353535:', text, item);
        // 字符太长添加省略号
        return text?.growthRate || 0;
      },
    },
    // yAxis: false,
    minBarWidth: 5,
    maxBarWidth: 5,
    barStyle: {
      radius: [5, 5, 0, 0],
    },
  } as any;
  return <Bar {...config} />;
};

export default ChartBar;
