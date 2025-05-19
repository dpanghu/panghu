import React from 'react';
import { Area } from '@ant-design/plots';
import styles from './index.less';

interface Props {
  data: any;
}

const enumData = {
  Raw: '煤炭',
  Crude: '石油',
  Natural: '天然气',
  Cement: '水泥制造',
} as any;

const ChatLine = (props: Props) => {
  const { data } = props;

  const reg1 = new RegExp('%', 'g'); // 加'g'，删除字符串里所有的"a"
  const newData =
    (data &&
      data.length > 0 &&
      data
        .map((item: RecordItem) => ({
          ...item,
          growthRate: Number(item.growthRate.replace(reg1, '') || 0),
          structure: enumData[item.structure],
        }))
        .sort((u: any, n: any) => u.year - n.year)) ||
    [];

  // const [data, setData] = useState([]);
  const config = {
    data: newData,
    xField: 'year',
    yField: 'growthRate',
    seriesField: 'structure',
    slider: {
      start: 0,
      end: 1,
    },
    // isPercent: true,
    yAxis: {
      label: {
        formatter: (value: any) => {
          return value + '%';
        },
      },
    },
    tooltip: {
      showMarkers: false,
      enterable: false,
      customContent: (title: any, items: any) => {
        // console.log('items', items);
        return (
          <>
            <div
              style={{
                height: 'fit-content',
                width: '150px',
                padding: '6px 6px',
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 1.6,
              }}
            >
              <p style={{ fontSize: '16px', fontWeight: 600 }}>{items[0]?.title}</p>
              <div>
                <p>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '100px',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    <span className={styles?.statusPoint} style={{ background: items[0]?.color }} />
                    {items[0]?.name}
                  </span>
                </p>
                <p>
                  <span style={{ float: 'right' }}>排放量：{items[0]?.data?.output}</span>
                </p>
                <p>
                  <span style={{ float: 'right' }}>占比：{items[0]?.data?.growthRate}%</span>
                </p>
              </div>
              <div>
                <p>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '100px',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    <span className={styles?.statusPoint} style={{ background: items[1]?.color }} />
                    {items[1]?.name}
                  </span>
                </p>
                <p>
                  <span style={{ float: 'right' }}>排放量：{items[1]?.data?.output}</span>
                </p>
                <p>
                  <span style={{ float: 'right' }}>占比：{items[1]?.data?.growthRate}%</span>
                </p>
              </div>
              <div>
                <p>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '100px',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    <span className={styles?.statusPoint} style={{ background: items[2]?.color }} />
                    {items[2]?.name}
                  </span>
                </p>
                <p>
                  <span style={{ float: 'right' }}>排放量：{items[2]?.data?.output}</span>
                </p>
                <p>
                  <span style={{ float: 'right' }}>占比：{items[2]?.data?.growthRate}%</span>
                </p>
              </div>
              <div>
                <p>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '100px',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    <span className={styles?.statusPoint} style={{ background: items[3]?.color }} />
                    {items[3]?.name}
                  </span>
                </p>
                <p>
                  <span style={{ float: 'right' }}>排放量：{items[3]?.data?.output}</span>
                </p>
                <p>
                  <span style={{ float: 'right' }}>占比：{items[3]?.data?.growthRate}%</span>
                </p>
              </div>
            </div>
          </>
        );
      },
      // },
    },
  };

  return <Area {...config} />;
};

export default ChatLine;
