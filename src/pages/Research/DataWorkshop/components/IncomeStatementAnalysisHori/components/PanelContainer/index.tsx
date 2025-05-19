import Styles from './index.less';
import BarLine from '../../../Charts/BarLine';
import { useEffect, useState } from 'react';
interface TProps {
  currentRange: [string, string];
  sourceData: RecordItem;
}

const Container: React.FC<TProps> = ({ currentRange, sourceData }) => {
  const [left, setLeft] = useState<RecordItem>({}); //图表数据
  const [right1, setRight1] = useState<RecordItem>({}); //图表数据
  const [right2, setRight2] = useState<RecordItem>({});

  useEffect(() => {
    const yearsArray = [];
    for (let i = currentRange[0] as any; i <= currentRange[1]; i++) {
      yearsArray.push(String(i));
    }
    // 财务指标
    const gs = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const hy = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    setLeft({
      gs,
      hy,
      xAxisData: yearsArray,
    });
    setRight1({
      gs,
      xAxisData: yearsArray,
    });
    setRight2({
      hy,
      xAxisData: yearsArray,
    });
  }, [currentRange, sourceData.A11, sourceData.A2, sourceData.A9]);

  return (
    <div className={Styles.container}>
      <div className={Styles.left}>
        <BarLine
          title="行业&标杆整体对比项目增长率（%）"
          xAxisData={left.xAxisData || []}
          left="15%"
          unit="%"
          id="hybgztxmbl"
          legendData={['公司', '行业']}
          seriesData={[
            {
              name: '公司',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: left.gs || [],
              smooth: true, // 设置平滑
              areaStyle: {
                color: {
                  type: 'linear', // linear 线性渐变  radial径向渐变
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(91,143,249,0.2)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(91,143,249,0)', // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
              lineStyle: {
                color: '#5A73FF',
                width: 2,
                type: 'solid',
              },
            },
            {
              name: '行业',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: left.hy || [],
              smooth: true, // 设置平滑
              areaStyle: {
                color: {
                  type: 'linear', // linear 线性渐变  radial径向渐变
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(90,216,166,0.2)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(90,216,166,0)', // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
              lineStyle: {
                color: '#53DA14',
                width: 2,
                type: 'solid',
              },
            },
          ]}
        />
      </div>
      <div className={Styles.right}>
        <div className={Styles.top}>
          <BarLine
            title="//公司历年平均增长率//"
            xAxisData={right1.xAxisData || []}
            left="15%"
            unit="%"
            id="gslnpjzzl"
            legendData={['公司']}
            seriesData={[
              {
                name: '公司',
                type: 'line',
                symbolSize: 0, // 隐藏圆点
                data: right1.gs || [],
                smooth: true, // 设置平滑
                areaStyle: {
                  color: {
                    type: 'linear', // linear 线性渐变  radial径向渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(90,216,166,0.2)', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'rgba(90,216,166,0)', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
                lineStyle: {
                  color: '#53DA14',
                  width: 2,
                  type: 'solid',
                },
              },
            ]}
          />
        </div>
        <div className={Styles.bottom}>
          <BarLine
            title="//行业历年平均增长率//"
            xAxisData={right2.xAxisData || []}
            left="15%"
            unit="%"
            id="hylnpjzzl"
            legendData={['行业']}
            seriesData={[
              {
                name: '行业',
                type: 'line',
                symbolSize: 0, // 隐藏圆点
                data: right2.hy || [],
                smooth: true, // 设置平滑
                areaStyle: {
                  color: {
                    type: 'linear', // linear 线性渐变  radial径向渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(91,143,249,0.2)', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'rgba(91,143,249,0)', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
                lineStyle: {
                  color: '#5A73FF',
                  width: 2,
                  type: 'solid',
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
export default Container;
