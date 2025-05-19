import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import * as echarts from 'echarts';

interface TProps {
  title: string;
  left?: string;
  right?: string;
  unit?: string;
  id: string;
  pieData: any;
}
const Container: React.FC<TProps> = ({ title, id, pieData, unit = '' }) => {
  const myChartRef = useRef<any>(null);
  const initEcharts = () => {
    let chartDom = document.getElementById(id) as HTMLDivElement;
    myChartRef.current = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: `{b}:{d} {c} ${unit}`, // 设置鼠标悬浮提示框的格式
      },
      legend: {
        left: 'left',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'left',
            formatter: `{b}:{d} {c} ${unit}`,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 400,
            },
          },
          data: pieData,
        },
      ],
    };
    myChartRef.current.setOption(option);
  };

  useEffect(() => {
    initEcharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieData]);

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
