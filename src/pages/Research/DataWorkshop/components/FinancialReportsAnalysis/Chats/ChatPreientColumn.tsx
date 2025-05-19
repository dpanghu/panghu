import { Column } from '@ant-design/plots';

interface Props {
  data: any;
}

const ChatPreientColumn: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const data1 =
    (data?.barList &&
      data?.barList.length > 0 &&
      data?.barList.map((item: any) => ({
        ...item,
        value: Number(Number(item.value).toFixed(2)),
      }))) ||
    [];

  const config = {
    data: data1,
    xField: 'key',
    yField: 'value',
    seriesField: 'type',
    isPercent: true,
    isStack: true,
    label: {
      position: 'middle',
      content: (item: any) => {
        return item.value.toFixed(2);
      },
      style: {
        fill: '#fff',
      },
    },
  } as any;
  return <Column {...config} />;
};
export default ChatPreientColumn;
