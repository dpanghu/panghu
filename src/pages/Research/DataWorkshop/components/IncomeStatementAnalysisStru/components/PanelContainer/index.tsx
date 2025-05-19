import Styles from './index.less';
import { useEffect, useState } from 'react';
import BarLine from '../../../Charts/BarLine';
interface TProps {
  currentRange: [string, string];
  sourceData: RecordItem;
}

const Container: React.FC<TProps> = ({ currentRange, sourceData }) => {
  const [left1, setLeft1] = useState<RecordItem>({});
  const [, setLeft2] = useState<RecordItem>({});
  const [, setRight1] = useState<RecordItem>({});
  const [, setRight2] = useState<RecordItem>({});
  useEffect(() => {
    const yearsArray = [];
    for (let i = currentRange[0] as any; i <= currentRange[1]; i++) {
      yearsArray.push(String(i));
    }

    const tg = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const jd = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    const zj = yearsArray.map((item) => sourceData.A11[item]?.A1?.value || 0);

    setLeft1({
      tg,
      jd,
      zj,
      xAxisData: yearsArray,
    });
    setLeft2({
      tg,
      jd,
      zj,
      xAxisData: yearsArray,
    });
    setRight1({
      tg,
      jd,
      zj,
      xAxisData: yearsArray,
    });
    setRight2({
      tg,
      jd,
      zj,
      xAxisData: yearsArray,
    });
  }, [currentRange, sourceData.A11, sourceData.A2, sourceData.A9]);
  return (
    <div className={Styles.container}>
      <div className={Styles.left1}>
        <BarLine
          title="毛利构成"
          xAxisData={left1.xAxisData || []}
          left="20%"
          unit="亿元"
          legendWidth={200}
          id="mlgc"
          legendData={['提高', '降低', '总计']}
          seriesData={[
            {
              name: '营业成本',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.tg || [],
            },
            {
              name: '营业收入',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.jd || [],
            },
            {
              name: '总计',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.zj || [],
            },
          ]}
        />
      </div>
      <div className={Styles.left2}>
        <BarLine
          title="核心利润构成"
          xAxisData={left1.xAxisData || []}
          left="20%"
          unit="亿元"
          legendWidth={200}
          id="hxlrgc"
          legendData={['提高', '降低', '总计']}
          seriesData={[
            {
              name: '销售费用',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.tg || [],
            },
            {
              name: '税金附加',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.jd || [],
            },
            {
              name: '营业成本',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.zj || [],
            },
            {
              name: '营业收入',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.zj || [],
            },
            {
              name: '总计总计',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.zj || [],
            },
          ]}
        />
      </div>
      <div className={Styles.right1}>
        <BarLine
          title="净利润构成"
          xAxisData={left1.xAxisData || []}
          left="20%"
          unit="亿元"
          legendWidth={200}
          id="jlrgc"
          legendData={['提高', '降低', '总计']}
          seriesData={[
            {
              name: '销售费用',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.tg || [],
            },
            {
              name: '税金附加',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.jd || [],
            },
            {
              name: '营业成本',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.zj || [],
            },
            {
              name: '营业收入',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.zj || [],
            },
            {
              name: '总计总计',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.zj || [],
            },
          ]}
        />
      </div>
      <div className={Styles.right2}>
        <BarLine
          title="各收益项目占利润总额比重"
          xAxisData={left1.xAxisData || []}
          left="20%"
          unit="亿元"
          legendWidth={200}
          id="gsrxmzlrzebz"
          legendData={['提高', '降低', '总计']}
          seriesData={[
            {
              name: '营业成本',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.tg || [],
            },
            {
              name: '营业收入',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.jd || [],
            },
            {
              name: '总计',
              type: 'bar',
              symbolSize: 0, // 隐藏圆点
              data: left1.zj || [],
            },
          ]}
        />
      </div>
    </div>
  );
};
export default Container;
