import React from 'react';
import { DualAxes, G2 } from '@ant-design/plots';
import { deepMix } from '@antv/util';

interface Props {
  data: any;
}
const SingleDualAxes: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const theme = G2.getTheme('light');

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
        value: Number(Number(item.value).toFixed(2)),
      }))) ||
    [];

  const config = {
    data: [data1 || [], data2 || []],
    xField: 'key',
    yField: ['value', 'value'],
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
        color: '#1EE2DA',
        seriesField: 'type',
        maxColumnWidth: 5,
        columnStyle: {
          radius: [5, 5, 0, 0],
        },
      },
      {
        geometry: 'line',
        smooth: true,
        color: '#7187FF',
        seriesField: 'type',
        lineStyle: {
          lineWidth: 1,
        },
      },
    ],
  };
  return <DualAxes {...config} />;
};

export default SingleDualAxes;
