import React from 'react';
import { DualAxes, G2 } from '@ant-design/plots';
import { deepMix } from '@antv/util';

interface Props {
  data: any;
}

const ChatDualAxes: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const reg1 = new RegExp('%', 'g'); // 加'g'，删除字符串里所有的"a"
  const data1 =
    (data &&
      data.length > 0 &&
      data
        .map((item: RecordItem) => ({
          ...item,
          value: Number(item.output || 0),
          // structure: enumData[item.structure],
        }))
        .sort((u: any, n: any) => Number(u.year) - Number(n.year))) ||
    [];

  const data2 =
    (data &&
      data.length > 0 &&
      data
        .map((item: RecordItem) => ({
          ...item,
          value: Number(item.growthRate.replace(reg1, '') || 0),
          type: item.type?.includes('资金运用')
            ? '金融机构人民币信贷资金运用增长率'
            : '金融机构人民币信贷资金来源增长率',
          // 碳排放总量增长率: Number(item.growthRate.replace(reg1, '') || 0),
          // structure: enumData[item.structure],
        }))
        .sort((u: any, n: any) => n.year - u.year)) ||
    [];

  console.log('data2', data2);
  const theme = G2.getTheme('light');
  const config = {
    data: [data1 || [], data2 || []],
    xField: 'year',
    yField: ['value', 'value'],
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
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

    yAxis: [
      {
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
    tooltip: {
      showTitle: true,
      formatter: (item: RecordItem) => {
        return {
          name: item.type,
          value: item.type.includes('增长') ? `${Number(Number(item?.value))} %` : item?.value,
        };
      },
    },
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'type',
        columnWidthRatio: 0.4,
        dodgePadding: 4,
        color: ['#7B8FFF', '#1EE2DA'],
        maxColumnWidth: 5,
        label: false,
        columnStyle: {
          radius: [5, 5, 0, 0],
          // fill: '#93ABFF',
        },
        // columnBackground: {
        //   style: {
        //     fill: '#EEF1FF',
        //     fillOpacity: 0.25,
        //   },
        // },
      },
      {
        geometry: 'line',
        seriesField: 'type',
        smooth: true,
        color: ['#FF54BA', '#FFA54B'],
        padding: [16, 8, 16, 8],
        // isStack: true,
        // lineStyle: {
        //   lineWidth: 2,
        //   fill: '#93ABFF',
        //   fillOpacity: 0.1,
        // },
        // lineStyle: ({ type }: any) => {
        //   if (type === 'a') {
        //     return {
        //       lineDash: [1, 4],
        //       opacity: 1,
        //     };
        //   }
        //   return {
        //     opacity: 0.5,
        //   };
        // },
      },
    ],
  } as any;
  return <DualAxes {...config} />;
};
export default ChatDualAxes;
