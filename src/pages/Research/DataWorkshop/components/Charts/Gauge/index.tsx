import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import * as echarts from 'echarts';

interface TProps {
  title: string;
  left?: string;
  right?: string;
  id: string;
  unit?: string;
  unitRight?: string;
  legendWidth?: number;
  value: number;
  minValue: number;
  maxValue: number;
  // splitNumber: number;
  chartName: string;
}

const Container: React.FC<TProps> = ({ title, id, value, minValue, maxValue, chartName }) => {
  const myChartRef = useRef<any>(null);
  const initEcharts = () => {
    let chartDom = document.getElementById(id) as HTMLDivElement;
    myChartRef.current = echarts.init(chartDom);
    const option = {
      title: [
        {
          //标题
          text: chartName,
          left: 'center',
          top: '63%',
          textStyle: {
            //标题样式
            color: '#999',
            fontSize: 14,
            fontWeight: 400,
          },
        },
      ],
      series: [
        {
          type: 'gauge',
          min: minValue,
          max: maxValue,
          radius: '80%',
          progress: {
            show: true,
            overlap: true,
            roundCap: true,
            itemStyle: {
              color: {
                type: 'linear',
                x: 1,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'hsla(302, 100%, 68%, 1)', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'hsla(231, 100%, 68%, 1)', // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          pointer: {
            width: 5,
            length: '60%',
            itemStyle: {
              color: '#D0D1D1',
            },
          },
          axisLine: {
            width: 9,
            lineStyle: {
              width: 9, // 仪表盘宽度
              // color: '#F1F2F2'
            },
          },
          axisTick: {
            show: true,
            distance: 0, //刻度线距仪表盘的距离
            length: 5, //刻度线长度
            lineStyle: {
              color: '#CCC',
              width: 1, //刻度线线宽
            },
          },
          splitLine: {
            length: 6,
            distance: 0,
            lineStyle: {
              width: 1,
              color: '#CCC',
            },
          },
          axisLabel: {
            distance: 12,
            color: '#333',
            fontSize: 14,
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 15,
            itemStyle: {
              borderWidth: 5,
              borderColor: '#D0D1D1',
            },
          },
          title: {
            show: true,
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, '70%'],
            formatter: '{value} %',
            color: '#5A79FF',
          },
          data: [
            {
              value,
            },
          ],
        },
      ],
    };
    myChartRef.current.setOption(option);
  };

  useEffect(() => {
    initEcharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    // 350
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content} id={id}></div>
    </div>
  );
};

export default Container;
