import React from 'react';
import { DualAxes, G2 } from '@ant-design/plots';
// import { deepMix } from '@antv/util';
interface Props {
  data?: any;
}

const SingleDualAxes: React.FC<Props> = (props: Props) => {
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
        value: Number(Number(item.value).toFixed(2)),
      }))) ||
    [];
  // console.log(data1, data?.barList, 'handleSearch');
  // const theme = G2.getTheme('light');
  const config = {
    data: [data1 || [], data2 || []],
    xField: 'key',
    yField: ['value', 'value'],
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
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
          name: item.key,
          value: item?.type.includes('增长率') ? item?.value + '%' : item?.value,
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
        color: '#7B8FFF',
        maxColumnWidth: 5,
        label: false,
        columnStyle: {
          radius: [5, 5, 0, 0],
          // fill: '#93ABFF',
        },
      },
      {
        geometry: 'line',
        seriesField: 'type',
        smooth: true,
        color: '#FF54BA',
        padding: [16, 8, 16, 8],
      },
    ],
  } as any;
  return <DualAxes {...config} />;
};
export default SingleDualAxes;
