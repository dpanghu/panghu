import React from 'react';
import { DualAxes, G2 } from '@ant-design/plots';
import { deepMix } from '@antv/util';
interface Props {
  data: RecordItem[];
}

const SingleDualAxes = (props: Props) => {
  const { data } = props;

  const reg1 = new RegExp('%', 'g'); // 加'g'，删除字符串里所有的"a"
  const newData =
    (data &&
      data.length > 0 &&
      data
        .map((item: RecordItem) => ({
          ...item,
          '碳排放总量（吨）': item.output,
          碳排放总量增长率: Number(item.growthRate.replace(reg1, '') || 0),
        }))
        .sort((u: any, n: any) => u.year - n.year)) ||
    [];
  const theme = G2.getTheme('light');
  const config = {
    data: [newData, newData],
    xField: 'year',
    yField: ['碳排放总量（吨）', '碳排放总量增长率'],
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: [
      {
        title: {
          text: '单位（吨）',
          position: 'end',
        },
        label: {
          formatter: (value: any) => {
            return value;
          },
        },
      },
      {
        label: {
          formatter: (value: any) => {
            return value + '%';
          },
        },
      },
    ],
    theme: deepMix({}, theme, {
      components: {
        scrollbar: {
          // 默认样式
          default: {
            style: {
              trackColor: 'rgba(255,255,255,0.05)',
              thumbColor: 'rgba(255,255,255,0.25)',
            },
          },
          // hover 时，可以设置滑块样式
          hover: {
            style: {
              thumbColor: 'rgba(255,255,255,0.6)',
            },
          },
        },
      },
    }),
    scrollbar: {
      type: 'horizontal',
    },
    geometryOptions: [
      {
        geometry: 'column',
        color: '#7187FF',
        maxColumnWidth: 5,
        columnStyle: {
          radius: [5, 5, 0, 0],
        },
      },
      {
        geometry: 'line',
        smooth: true,
        color: '#1EE2DA',
        lineStyle: {
          lineWidth: 2,
        },
        // yAxis: {
        //   label: {
        //     formatter: (value: any) => {
        //       return value + '%';
        //     },
        //   },
        // },
      },
    ],
    // slider: {
    //   start: 0,
    //   end: 1,
    // },
    tooltip: {
      showTitle: true,
      formatter: (item: RecordItem) => {
        return Object.keys(item)[1] === '碳排放总量增长率'
          ? { name: Object.keys(item)[1], value: Number(item['碳排放总量增长率']) + '%' }
          : { name: Object.keys(item)[1], value: Number(item['碳排放总量（吨）']) };
      },
    },
  } as any;
  return <DualAxes {...config} />;
};

export default SingleDualAxes;
