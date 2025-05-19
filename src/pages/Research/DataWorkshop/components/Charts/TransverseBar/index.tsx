import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import * as echarts from 'echarts';

interface TProps {
  title: string;
  xAxisData?: string[];
  left?: string;
  right?: string;
  id: string;
  legendData: string[];
  seriesData: RecordItem[];
  unit?: string;
  unitRight?: string;
  legendWidth?: number;
}
const Container: React.FC<TProps> = ({ title, xAxisData, id, seriesData }) => {
  const myChartRef = useRef<any>(null);
  const initEcharts = () => {
    let chartDom = document.getElementById(id) as HTMLDivElement;
    myChartRef.current = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        left: 'left',
      },
      grid: {
        top: 20,
        left: 10,
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitLine: {
          show: true,
          lineStyle: {
            color: '#EEF1FF',
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: ['2018', '2019', '2020', '2021', '2022', '2023'],
        axisLabel: {
          padding: [0, 0, 10, -8],
          fontSize: 12,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },

      series: seriesData,
    };
    myChartRef.current.setOption(option);
  };

  useEffect(() => {
    if (xAxisData?.length) {
    }
    initEcharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xAxisData, seriesData]);

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
