import { Column } from '@ant-design/plots';

interface Props {
  data: any;
}

const ChatColumn: React.FC<Props> = (props: Props) => {
  const { data } = props;

  const data1 =
    (data?.barList &&
      data?.barList.length > 0 &&
      data?.barList.map((item: any) => ({
        ...item,
        value: Number(Number(item.value).toFixed(2)),
      }))) ||
    [];

  console.log('data1', data, data1);

  const config = {
    data: data1,
    xField: 'key',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
  } as any;

  return <Column {...config} />;
};

export default ChatColumn;
