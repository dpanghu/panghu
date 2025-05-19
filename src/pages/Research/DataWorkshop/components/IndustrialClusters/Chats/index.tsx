import React from 'react';
// import BarLine from '../../Charts/BarLine';
import SingleDualAxes from './SingleDualAxes';
import * as echarts from 'echarts';
import styles from './index.less';
import { useMount } from 'ahooks';
import ChatColumn from './ChartColumns';
import { Checkbox, Col, Row, Select } from 'antd';

const Chats: React.FC = () => {
  const getScoreCharts = () => {
    const ScoreCharts = echarts.init(document.getElementById('ScoreCharts') as HTMLDivElement);
    ScoreCharts.setOption({
      grid: {
        x: 5,
        y: 30,
        x2: 20,
        y2: 5,
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        axisLine: {
          show: false, // 不显示坐标轴线
        },
        splitLine: {
          show: false, // 不显示网格线
        },
        axisLabel: false,
      },
      yAxis: {
        type: 'value',
        show: false,
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        axisLabel: false,
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          smooth: true,
          color: '#5A73FF',
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
                  color: 'rgba(147,171,255,0.32)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(90,115,255,0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
  };

  const getScoreChartsTwo = () => {
    const ScoreCharts = echarts.init(document.getElementById('ScoreChartsTwo') as HTMLDivElement);
    ScoreCharts.setOption({
      grid: {
        x: 5,
        y: 30,
        x2: 20,
        y2: 5,
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        axisLine: {
          show: false, // 不显示坐标轴线
        },
        splitLine: {
          show: false, // 不显示网格线
        },
        axisLabel: false,
      },
      yAxis: {
        type: 'value',
        show: false,
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        axisLabel: false,
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          smooth: true,
          color: '#A175F6',
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

  const getScoreChartsThree = () => {
    const ScoreCharts = echarts.init(document.getElementById('ScoreChartsThree') as HTMLDivElement);
    ScoreCharts.setOption({
      grid: {
        x: 5,
        y: 30,
        x2: 20,
        y2: 5,
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        axisLine: {
          show: false, // 不显示坐标轴线
        },
        splitLine: {
          show: false, // 不显示网格线
        },
        axisLabel: false,
      },
      yAxis: {
        type: 'value',
        show: false,
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        axisLabel: false,
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          smooth: true,
          color: '#1EE2DA',
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
                  color: 'rgba(147,255,244,0.32)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(90,224,255,0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
  };

  const getScoreChartsFour = () => {
    const ScoreCharts = echarts.init(document.getElementById('ScoreChartsFour') as HTMLDivElement);
    ScoreCharts.setOption({
      grid: {
        x: 5,
        y: 30,
        x2: 20,
        y2: 5,
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        axisLine: {
          show: false, // 不显示坐标轴线
        },
        splitLine: {
          show: false, // 不显示网格线
        },
        axisLabel: false,
      },
      yAxis: {
        type: 'value',
        show: false,
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        axisLabel: false,
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          smooth: true,
          color: '#7B8FFF',
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
                  color: 'rgba(147,171,255,0.32)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(90,115,255,0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
  };

  const getScoreChartsFive = () => {
    const ScoreCharts = echarts.init(document.getElementById('ScoreChartsFive') as HTMLDivElement);
    ScoreCharts.setOption({
      grid: {
        x: 5,
        y: 30,
        x2: 20,
        y2: 5,
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        axisLine: {
          show: false, // 不显示坐标轴线
        },
        splitLine: {
          show: false, // 不显示网格线
        },
        axisLabel: false,
      },
      yAxis: {
        type: 'value',
        show: false,
        axisTick: {
          show: false, // 这里设置为false去除x轴刻度线
        },
        axisLabel: false,
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          smooth: true,
          color: '#1EE2DA',
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
                  color: 'rgba(147,249,255,0.32)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(90,232,255,0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
  };

  const getLineOne = () => {
    const ScoreCharts = echarts.init(document.getElementById('lineOne') as HTMLDivElement);
    ScoreCharts.setOption({
      title: {
        text: '固定资产增长率',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
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

  const getLineTwo = () => {
    const ScoreCharts = echarts.init(document.getElementById('lineTwo') as HTMLDivElement);
    ScoreCharts.setOption({
      title: {
        text: '固定资产增长率',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
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

  const onChange = (checkedValues: any[]) => {
    console.log('checked = ', checkedValues);
  };

  useMount(() => {
    getScoreCharts();
    getScoreChartsTwo();
    getScoreChartsThree();
    getScoreChartsFour();
    getScoreChartsFive();
    getLineOne();
    getLineTwo();
  });

  return (
    <div>
      <p className={styles?.secondTitle}>行业整体分析</p>
      <div className={styles?.chartOne}>
        <div className={styles?.chartOneLeft}>
          <div className={styles?.container} style={{ height: '330px' }}>
            <p className={styles?.secondTitle}>行业固定资产占营业收入比率</p>
            <SingleDualAxes />
          </div>
          <div className={styles?.container} style={{ height: '330px' }}>
            <p className={styles?.secondTitle}>行业固定资产占总资产比率</p>
            <SingleDualAxes />
          </div>
          <div className={styles?.container} style={{ height: '330px' }}>
            <p className={styles?.secondTitle}>行业毛利率</p>
            <SingleDualAxes />
          </div>
        </div>
        <div className={styles?.chartOneRight}>
          <div className={styles?.chartOneRightCard} style={{ marginBottom: '16px' }}>
            <p className={styles?.secondTitle}>行业固定资产占总资产历年平均值</p>
            <div>
              <div id="ScoreCharts" style={{ width: '100%', height: '123px' }} />
            </div>
          </div>
          <div className={styles?.chartOneRightCard} style={{ marginBottom: '16px' }}>
            <p className={styles?.secondTitle}>整体固定资产占总资产历年平均值</p>
            <div>
              <div id="ScoreChartsTwo" style={{ width: '100%', height: '123px' }} />
            </div>
          </div>
          <div className={styles?.chartOneRightCard} style={{ marginBottom: '16px' }}>
            <p className={styles?.secondTitle}>行业固定资产周转率历年平均值</p>
            <div>
              <div id="ScoreChartsThree" style={{ width: '100%', height: '123px' }} />
            </div>
          </div>
          <div className={styles?.chartOneRightCard} style={{ marginBottom: '16px' }}>
            <p className={styles?.secondTitle}>整体固定资产周转率历年均值</p>
            <div>
              <div id="ScoreChartsFour" style={{ width: '100%', height: '123px' }} />
            </div>
          </div>
          <div className={styles?.chartOneRightCard}>
            <p className={styles?.secondTitle}>行业毛利率%历年均值</p>
            <div>
              <div id="ScoreChartsFive" style={{ width: '100%', height: '123px' }} />
            </div>
          </div>
        </div>
      </div>
      <p className={styles?.secondTitle} style={{ marginBottom: '12px' }}>
        行业固定资产分析
      </p>
      <div className={styles?.chartTwo}>
        <div className={styles?.chartTwoLeft}>
          <Select placeholder="搜索固定资产明细" style={{ width: '100%', marginTop: '12px' }} />
          <div>
            <Checkbox.Group style={{ width: '100%', marginTop: '12px' }} onChange={onChange}>
              <Row>
                <Col span={24}>
                  <Checkbox value="A">A</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="B">B</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="C">C</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="D">D</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="E">E</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </div>
        </div>
        <div className={styles?.chartTwoRight}>
          <div className={styles?.container} style={{ height: '330px' }}>
            <p className={styles?.secondTitle}>固定资产明细</p>
            <ChatColumn />
          </div>
          <div className={styles?.container}>
            {/* <p>固定资产增长率</p> */}
            <div id="lineOne" style={{ width: '100%', height: '300px' }} />
          </div>
          <div className={styles?.container} style={{ height: '330px' }}>
            <p className={styles?.secondTitle}>固定资产减值明细</p>
            <ChatColumn />
          </div>
          <div className={styles?.container} style={{ height: '330px' }}>
            {/* <p>固定资产减值率</p> */}
            <div id="lineTwo" style={{ width: '100%', height: '300px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chats;
