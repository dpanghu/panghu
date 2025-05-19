import React from 'react';
import { Column } from '@ant-design/plots';
interface Props {
  data: any;
}
const CircleColumn: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const data1 =
    (data &&
      data?.barList.length > 0 &&
      data?.barList.map((item: RecordItem) => ({
        ...item,
        value: Number(item.value || 0),
        // structure: enumData[item.structure],
      }))) ||
    [];
  console.log('data', data);

  const config = {
    data: data1,
    xField: 'key',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    color: ['#7187FF', '#1EE2DA', '#A481FF'],
    minColumnWidth: 5,
    maxColumnWidth: 5,
    dodgePadding: 3,
    columnStyle: {
      radius: [5, 5, 0, 0],
    },
  };

  return <Column {...config} />;
};

export default CircleColumn;
