import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import * as echarts from 'echarts';

interface TProps {
  title: string;
  xAxisData: string[];
  left?: string;
  right?: string;
  id: string;
  legendData: string[];
  seriesData: RecordItem[];
  unit?: string;
  unitRight?: string;
  legendWidth?: number;
}
const Container: React.FC<TProps> = ({
  title,
  xAxisData,
  left,
  right,
  id,
  legendData,
  seriesData,
  unit = '',
  unitRight = '',
}) => {
  const myChartRef = useRef<any>(null);
  const initEcharts = () => {
    let chartDom = document.getElementById(id) as HTMLDivElement;
    myChartRef.current = echarts.init(chartDom);
    const option = {
      backgroundColor: '#fff',
      grid: {
        top: '14%',
        right: right || '5%',
        left: left || '10%',
        bottom: '22%', //也可设置left和right设置距离来控制图表的大小
      },
      legend: {
        left: 'left',
        data: legendData,
        itemWidth: 10, // 图例项宽度
        itemHeight: 10, // 图例项高度
        textStyle: {
          fontSize: 12, // 图例文本字体大小
          overflow: 'truncate',
          width: chartDom.clientWidth / legendData.length - 30,
        },
        top: -1,
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
      },
      dataZoom: [
        {
          type: 'slider', // 这个 dataZoom 组件是 slider 型数据区域缩放组件
          startValue: Number(xAxisData[xAxisData.length - 1]), // 左边在 10% 的位置。
          endValue: Number(xAxisData[xAxisData.length - 1]) - 10, // 右边在 60% 的位置。
          bottom: 10,
          right: 40,
          left: 40,
          height: 20,
        },
      ],
      xAxis: {
        data: xAxisData,
        axisLine: {
          show: true, //隐藏X轴轴线
          lineStyle: {
            color: '#EAE2FF',
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false, //隐藏X轴刻度
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#999', //X轴文字颜色
          },
        },
      },
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#FFFFFF',
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999',
              fontSize: 12,
            },
            overflow: 'truncate',
            formatter: function (value: string) {
              return value + unit;
            },
          },
        },
        {
          type: 'value',
          axisLine: {
            show: false, //隐藏X轴轴线
            lineStyle: {
              color: '#EAE2FF',
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false, //隐藏X轴刻度
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999', //X轴文字颜色
            },
            formatter: function (value: string) {
              return value + unitRight;
            },
          },
          // min: 0,
          // max: 25,
          // axisLabel: {
          //   formatter: '{value} °C',
          // },
        },
      ],
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
