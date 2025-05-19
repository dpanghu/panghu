import React from 'react';
// import BarLine from '../../Charts/BarLine';
import styles from './index.less';
import { useMount } from 'ahooks';
import { Button, Select } from 'antd';
import * as echarts from 'echarts';
import ChartArea from './ChartArea';

const Chats: React.FC = () => {
  const getScoreCharts = () => {
    const ScoreCharts = echarts.init(document.getElementById('ScoreCharts') as HTMLDivElement);
    ScoreCharts.setOption({
      grid: {
        x: 30,
        y: 50,
        x2: 30,
        y2: 30,
      },
      title: {
        text: '报表项目分析',
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        data: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
        axisLine: {
          lineStyle: {
            color: '#DCCAFF',
          },
        },
        axisLabel: {
          color: '#333',
          fontWeight: 400,
        },
      },
      yAxis: {
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        // show: false,
        max: 40,
      },
      series: [
        {
          type: 'line',
          // symbol: "circle",
          data: [28, 20, 12, 22, 32, 33, 35, 23, 14, 10, 9],
          smooth: true, // 使折线平滑
          color: '#7B8FFF',
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
                  color: 'rgba(147,255,230,0.32)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(90,115,255,0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          lineStyle: {
            color: '#32D2FF',
            width: 2,
            type: 'solid',
          },
        },
        {
          data: [28, 20, 12, 22, 32, 33, 35, 23, 14, 10, 9],
          type: 'bar',
          itemStyle: {
            borderRadius: [5, 5, 0, 0], // 这里设置圆角的大小
            color: '#7B8FFF',
          },
          barWidth: 5,
          showBackground: true,
          // backgroundStyle: {
          //   color: '#EEF1FF',
          // },
        },
      ],
    });
  };

  const getLineTwo = () => {
    const ScoreCharts = echarts.init(document.getElementById('lineTwo') as HTMLDivElement);
    ScoreCharts.setOption({
      title: {
        text: '财务指标分析',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        position: 'top-left',
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      color: ['#5A73FF', '#A175F6'],
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210],
          smooth: true, // 使折线平滑
          areaStyle: {
            color: {
              type: 'linear ', // linear 线性渐变  radial径向渐变
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(206,147,255,0.32)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(213,90,255,0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          // lineStyle: {
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310],
          smooth: true, // 使折线平滑
          areaStyle: {
            color: {
              type: 'linear ', // linear 线性渐变  radial径向渐变
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(206,147,255,0.32)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(213,90,255,0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
  };

  useMount(() => {
    getScoreCharts();
    // getScoreCharts();
    // getLineOne();
    getLineTwo();
  });

  return (
    <div>
      <div className={styles?.titileValue}>行业阶段分布</div>
      <div className={styles?.container} style={{ height: '330px' }}>
        <p>行业阶段数量分布趋势</p>
        <ChartArea />
      </div>
      <p className={styles?.titileValue}>财务指标分析</p>
      <div className={styles?.antBtn} style={{ margin: '12px 0' }}>
        <Button type="default" className={styles?.antBtn}>
          初创期
        </Button>
        <Button type="default" className={styles?.antBtn} style={{ marginLeft: '10px' }}>
          发展期
        </Button>
        <Button type="default" className={styles?.antBtn} style={{ marginLeft: '10px' }}>
          成熟期
        </Button>
        <Button type="default" className={styles?.antBtn} style={{ marginLeft: '10px' }}>
          衰退期
        </Button>
      </div>
      <div className={styles?.chartTwo}>
        <div className={styles?.chartTwoLeft}>
          <div className={styles?.contentLeftInfo}>
            <Select placeholder="搜索" style={{ width: '100%' }} />
          </div>
        </div>
        <div className={styles?.chartTwoRight}>
          <div className={styles?.container} style={{ height: '330px' }}>
            {/* <p>财务指标分析</p> */}
            {/* ScoreCharts */}
            <div id="lineTwo" style={{ width: '100%', height: '300px' }} />
          </div>
        </div>
      </div>
      <div className={styles?.titileValue}>报表项目均值</div>
      <div className={styles?.antBtn} style={{ margin: '12px 0' }}>
        <Button type="default">初创期</Button>
        <Button type="default" style={{ marginLeft: '10px' }}>
          发展期
        </Button>
        <Button type="default" style={{ marginLeft: '10px' }}>
          成熟期
        </Button>
        <Button type="default" style={{ marginLeft: '10px' }}>
          衰退期
        </Button>
      </div>
      <div className={styles?.chartTwo} style={{ margin: '12px 0' }}>
        <div className={styles?.chartTwoLeft}>
          <div className={styles?.contentLeftInfo}>
            <Select placeholder="搜索" style={{ width: '100%' }} />
          </div>
        </div>
        <div className={styles?.chartTwoRight}>
          <div className={styles?.container} style={{ height: '330px' }}>
            {/* <p>报表项目分析</p> */}
            {/* ScoreCharts */}
            <div id="ScoreCharts" style={{ width: '100%', height: '360px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chats;
