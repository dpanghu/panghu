import React from 'react';
import { DualAxes } from '@ant-design/plots';

interface Props {
  data: any;
}
const SingleDualAxesOne: React.FC<Props> = (props: Props) => {
  const { data } = props;
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

  const reg1 = new RegExp('%', 'g'); // 加'g'，删除字符串里所有的"a"
  const data2 =
    (data &&
      data.length > 0 &&
      data
        .map((item: RecordItem) => ({
          ...item,
          value: Number(item.growthRate.replace(reg1, '') || 0),
          type: '人民币贷款社会融资规模增长率',
          // structure: enumData[item.structure],
        }))
        .sort((u: any, n: any) => Number(u.year) - Number(n.year))) ||
    [];

  const config = {
    data: [data1, data2],
    xField: 'year',
    yField: ['value', 'value'],
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
        color: '#7187FF',
        seriesField: 'type',
        maxColumnWidth: 5,
        columnStyle: {
          radius: [5, 5, 0, 0],
        },
      },
      {
        geometry: 'line',
        smooth: true,
        seriesField: 'type',
        color: '#1EE2DA',
        lineStyle: {
          lineWidth: 1,
        },
      },
    ],
  };
  return <DualAxes {...config} />;
};

export default SingleDualAxesOne;
