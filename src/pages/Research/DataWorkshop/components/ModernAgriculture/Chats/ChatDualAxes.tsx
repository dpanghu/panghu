import React from 'react';
import { DualAxes, G2 } from '@ant-design/plots';
import { deepMix } from '@antv/util';
interface Props {
  data?: any;
}

const ChatDualAxes: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const data1 =
    (data?.barList &&
      data?.barList.length > 0 &&
      data?.barList.map((item: any) => ({
        ...item,
        value: Number(Number(item.value).toFixed(2)),
      }))) ||
    [];
  const data2 =
    (data?.lineList &&
      data?.lineList.length > 0 &&
      data?.lineList.map((item: any) => ({
        ...item,
        value: Number((Number(item.value) * 100).toFixed(2)),
      }))) ||
    [];
  // console.log(data1, data?.barList, 'handleSearch');
  const theme = G2.getTheme('light');
  const config = {
    data: [data1 || [], data2 || []],
    xField: 'key',
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
          value: item.type.includes('同比') ? `${Number(Number(item?.value))} %` : item?.value,
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
