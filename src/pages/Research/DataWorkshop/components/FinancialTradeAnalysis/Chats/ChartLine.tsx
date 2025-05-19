import { Line } from '@ant-design/plots';

interface Props {
  data: any;
}

// const enumData = {
//   Raw: '煤炭',
//   Crude: '石油',
//   Natural: '天然气',
//   Cement: '水泥制造',
// } as any;

const ChatLine = (props: Props) => {
  const { data } = props;

  const newData =
    (data?.lineList &&
      data.lineList.length > 0 &&
      data.lineList
        .map((item: RecordItem) => ({
          ...item,
          value: item?.value,
          // structure: enumData[item.structure],
        }))
        .sort((u: any, n: any) => u.year - n.year)) ||
    [];

  // const [data, setData] = useState([]);
  const config = {
    data: newData,
    xField: 'key',
    yField: 'value',
    seriesField: 'type',
    xAxis: {
      type: 'time',
    },
    // yAxis: {
    //   label: {
    //     // 数值格式化为千分位
    //     // formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    //   },
    // },
  };

  return <Line {...config} />;
};

export default ChatLine;
