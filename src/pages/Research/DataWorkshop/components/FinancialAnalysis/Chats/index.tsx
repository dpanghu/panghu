import React, { useEffect } from 'react';
import ChartBar from './ChartBar';
import ChatDualAxes from './ChatDualAxes';
import styles from './index.less';
import SingleDualAxes from './SingleDualAxes';
// import * as echarts from 'echarts';
import SingleDualAxesOne from './SingleDualAxesOne';
import SingleDualAxesTwo from './SingleDualAxesTwo';
import SingleDualAxesThree from './SingleDualAxesThree';
import SingleDualAxesFour from './SingleDualAxesFour';
import SingleDualAxesFive from './SingleDualAxesFive';

interface Props {
  currentList: any;
}
const Chats: React.FC<Props> = (props: Props) => {
  const { currentList } = props;

  const AO1X =
    (currentList?.A1 &&
      currentList?.A1.length > 0 &&
      currentList?.A1.map((item: RecordItem) => Number(item.year))) ||
    [];

  const AO1Data1 =
    (currentList?.A1 &&
      currentList?.A1.length > 0 &&
      currentList?.A1.map((item: RecordItem) =>
        Number((Number(item.output) / 10000).toFixed(2)),
      ).sort((u: any, n: any) => u - n)) ||
    [];
  const reg1 = new RegExp('%', 'g'); // 加'g'，删除字符串里所有的"a"
  const AO1Data2 =
    (currentList?.A1 &&
      currentList?.A1.length > 0 &&
      currentList?.A1.map((item: RecordItem) =>
        Number(item.growthRate.replace(reg1, '') || 0),
      ).sort((u: any, n: any) => u - n)) ||
    [];

  // const AO2X =
  //   (currentList?.A2 &&
  //     currentList?.A2.length > 0 &&
  //     currentList?.A2.map((item: RecordItem) => Number(item.year))) ||
  //   [];

  // const AO2Data1 =
  //   (currentList?.A2 &&
  //     currentList?.A2.length > 0 &&
  //     currentList?.A2.map((item: RecordItem) =>
  //       Number((Number(item.output) / 10000).toFixed(2)),
  //     ).sort((u: any, n: any) => u - n)) ||
  //   [];
  // const AO2Data2 =
  //   (currentList?.A2 &&
  //     currentList?.A2.length > 0 &&
  //     currentList?.A2.map((item: RecordItem) =>
  //       Number(item.growthRate.replace(reg1, '') || 0),
  //     ).sort((u: any, n: any) => u - n)) ||
  //   [];

  // const AO3X =
  //   (currentList?.A3 &&
  //     currentList?.A3.length > 0 &&
  //     currentList?.A3.map((item: RecordItem) => Number(item.year))) ||
  //   [];

  // const AO3Data1 =
  //   (currentList?.A3 &&
  //     currentList?.A3.length > 0 &&
  //     currentList?.A3.map((item: RecordItem) =>
  //       Number((Number(item.output) / 10000).toFixed(2)),
  //     ).sort((u: any, n: any) => u - n)) ||
  //   [];
  // const AO3Data2 =
  //   (currentList?.A3 &&
  //     currentList?.A3.length > 0 &&
  //     currentList?.A3.map((item: RecordItem) =>
  //       Number(item.growthRate.replace(reg1, '') || 0),
  //     ).sort((u: any, n: any) => u - n)) ||
  //   [];

  // const AO6X =
  //   (currentList?.A6 &&
  //     currentList?.A6.length > 0 &&
  //     currentList?.A6.map((item: RecordItem) => Number(item.year))) ||
  //   [];

  // const AO6Data1 =
  //   (currentList?.A6 &&
  //     currentList?.A6.length > 0 &&
  //     currentList?.A6.map((item: RecordItem) =>
  //       Number((Number(item.output) / 100).toFixed(2)),
  //     ).sort((u: any, n: any) => u - n)) ||
  //   [];
  // const AO6Data2 =
  //   (currentList?.A6 &&
  //     currentList?.A6.length > 0 &&
  //     currentList?.A6.map((item: RecordItem) =>
  //       Number(item.growthRate.replace(reg1, '') || 0),
  //     ).sort((u: any, n: any) => u - n)) ||
  //   [];

  console.log('AO1X', AO1X, AO1Data1, AO1Data2);

  // const getLineClumns = () => {
  //   const ScoreCharts = echarts.init(document.getElementById('lineTwo') as HTMLDivElement);
  //   const art = {
  //     grid: {
  //       x: 60,
  //       y: 60,
  //       x2: 50,
  //       y2: 30,
  //     },
  //     // title: {
  //     //   text: '报表项目分析',
  //     // },
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'cross',
  //         crossStyle: {
  //           color: '#999',
  //         },
  //       },
  //     },
  //     legend: {
  //       data: ['金融机构人民币信贷资金来源(亿元)', '货币和准货币(M2)供应量增长率'],
  //     },
  //     xAxis: [
  //       {
  //         type: 'category',
  //         axisTick: {
  //           show: false, // 这里设置为false去除x轴刻度线
  //         },
  //         data: AO1X || [],
  //         axisLine: {
  //           // type: 'dotted',
  //           lineStyle: {
  //             color: '#DCCAFF',
  //           },
  //         },
  //         axisLabel: {
  //           color: '#333',
  //           fontWeight: 400,
  //         },
  //         axisPointer: {
  //           type: 'shadow',
  //         },
  //       },
  //     ],
  //     yAxis: [
  //       {
  //         type: 'value',
  //         min: 0,
  //         // name: '金融机构人民币信贷资金来源(亿元)',
  //         // max: 1,
  //         axisTick: {
  //           show: false, // 这里设置为false去除x轴刻度线
  //         },
  //         axisLabel: {
  //           formatter: '{value}万元',
  //         },
  //         // show: false,
  //         // max: 400000000,
  //       },
  //       {
  //         type: 'value',
  //         min: 0,
  //         max: 20,
  //         // name: '货币和准货币(M2)供应量增长率',
  //         interval: 5,
  //         axisLabel: {
  //           formatter: '{value}%',
  //         },
  //       },
  //     ],
  //     series: [
  //       {
  //         type: 'line',
  //         name: '货币和准货币(M2)供应量增长率',
  //         tooltip: {
  //           valueFormatter: function (value: any) {
  //             return value + ' %';
  //           },
  //         },
  //         // symbol: "circle",
  //         data: AO1Data2 || [],
  //         smooth: true, // 使折线平滑
  //         color: '#32D2FF',
  //         areaStyle: {
  //           color: {
  //             type: 'linear', // linear 线性渐变  radial径向渐变
  //             x: 0,
  //             y: 0,
  //             x2: 0,
  //             y2: 1,
  //             colorStops: [
  //               {
  //                 offset: 0,
  //                 color: 'rgba(147,255,230,0.32)', // 0% 处的颜色
  //               },
  //               {
  //                 offset: 1,
  //                 color: 'rgba(90,115,255,0)', // 100% 处的颜色
  //               },
  //             ],
  //             global: false, // 缺省为 false
  //           },
  //         },
  //         lineStyle: {
  //           color: '#32D2FF',
  //           width: 2,
  //           type: 'solid',
  //         },
  //       },
  //       {
  //         type: 'bar',
  //         name: '金融机构人民币信贷资金来源(亿元)',
  //         tooltip: {
  //           valueFormatter: function (value: any) {
  //             return value + ' 万元';
  //           },
  //         },
  //         data: AO1Data1 || [],

  //         itemStyle: {
  //           borderRadius: [5, 5, 0, 0], // 这里设置圆角的大小
  //           color: '#7B8FFF',
  //         },
  //         barWidth: 5,
  //         showBackground: false,
  //         // backgroundStyle: {
  //         //   color: '#EEF1FF',
  //         // },
  //       },
  //     ],
  //   };
  //   AO1X && AO1X.length > 0 && ScoreCharts.setOption(art);
  // };

  // const getLineClumnsOne = () => {
  //   const ScoreCharts = echarts.init(document.getElementById('lineThree') as HTMLDivElement);

  //   const art1 = {
  //     grid: {
  //       x: 60,
  //       y: 60,
  //       x2: 50,
  //       y2: 30,
  //     },
  //     // title: {
  //     //   text: '报表项目分析',
  //     // },
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'cross',
  //         crossStyle: {
  //           color: '#999',
  //         },
  //       },
  //     },
  //     legend: {
  //       data: ['货币(M1)供应量', '货币(M1)供应量增长率'],
  //     },
  //     xAxis: [
  //       {
  //         type: 'category',
  //         axisTick: {
  //           show: false, // 这里设置为false去除x轴刻度线
  //         },
  //         data: AO2X || [],
  //         axisLine: {
  //           // type: 'dotted',
  //           lineStyle: {
  //             color: '#DCCAFF',
  //           },
  //         },
  //         axisLabel: {
  //           color: '#333',
  //           fontWeight: 400,
  //         },
  //         axisPointer: {
  //           type: 'shadow',
  //         },
  //       },
  //     ],
  //     yAxis: [
  //       {
  //         type: 'value',
  //         min: 0,
  //         // name: '金融机构人民币信贷资金来源(亿元)',
  //         // max: 1,
  //         axisTick: {
  //           show: false, // 这里设置为false去除x轴刻度线
  //         },
  //         axisLabel: {
  //           formatter: '{value}万元',
  //         },
  //         // show: false,
  //         // max: 400000000,
  //       },
  //       {
  //         type: 'value',
  //         min: 0,
  //         max: 20,
  //         // name: '货币和准货币(M2)供应量增长率',
  //         interval: 5,
  //         axisLabel: {
  //           formatter: '{value}%',
  //         },
  //       },
  //     ],
  //     series: [
  //       {
  //         type: 'line',
  //         name: '货币(M1)供应量增长率',
  //         tooltip: {
  //           valueFormatter: function (value: any) {
  //             return value + ' %';
  //           },
  //         },
  //         // symbol: "circle",
  //         data: AO2Data2 || [],
  //         smooth: true, // 使折线平滑
  //         color: '#5AD8A6',
  //         areaStyle: {
  //           color: {
  //             type: 'linear', // linear 线性渐变  radial径向渐变
  //             x: 0,
  //             y: 0,
  //             x2: 0,
  //             y2: 1,
  //             colorStops: [
  //               {
  //                 offset: 0,
  //                 color: 'rgba(90,216,166,0.3)', // 0% 处的颜色
  //               },
  //               {
  //                 offset: 1,
  //                 color: 'rgba(90,216,166,0)', // 100% 处的颜色
  //               },
  //             ],
  //             global: false, // 缺省为 false
  //           },
  //         },
  //         lineStyle: {
  //           color: '#5AD8A6',
  //           width: 2,
  //           type: 'solid',
  //         },
  //       },
  //       {
  //         type: 'bar',
  //         name: '货币(M1)供应量',
  //         tooltip: {
  //           valueFormatter: function (value: any) {
  //             return value + ' 万元';
  //           },
  //         },
  //         data: AO2Data1 || [],

  //         itemStyle: {
  //           borderRadius: [5, 5, 0, 0], // 这里设置圆角的大小
  //           color: '#7B8FFF',
  //         },
  //         barWidth: 5,
  //         showBackground: false,
  //         // backgroundStyle: {
  //         //   color: '#EEF1FF',
  //         // },
  //       },
  //     ],
  //   };
  //   ScoreCharts.setOption(art1);
  // };

  // const getLineClumnsTwo = () => {
  //   const ScoreCharts = echarts.init(document.getElementById('lineFour') as HTMLDivElement);
  //   const art2 = {
  //     grid: {
  //       x: 60,
  //       y: 60,
  //       x2: 50,
  //       y2: 30,
  //     },
  //     // title: {
  //     //   text: '报表项目分析',
  //     // },
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'cross',
  //         crossStyle: {
  //           color: '#999',
  //         },
  //       },
  //     },
  //     legend: {
  //       data: ['流通中现金(MO)供应量', '流通中现金(MO)供应量增长率'],
  //     },
  //     xAxis: [
  //       {
  //         type: 'category',
  //         axisTick: {
  //           show: false, // 这里设置为false去除x轴刻度线
  //         },
  //         data: AO3X || [],
  //         axisLine: {
  //           // type: 'dotted',
  //           lineStyle: {
  //             color: '#DCCAFF',
  //           },
  //         },
  //         axisLabel: {
  //           color: '#333',
  //           fontWeight: 400,
  //         },
  //         axisPointer: {
  //           type: 'shadow',
  //         },
  //       },
  //     ],
  //     yAxis: [
  //       {
  //         type: 'value',
  //         min: 0,
  //         // name: '金融机构人民币信贷资金来源(亿元)',
  //         // max: 1,
  //         axisTick: {
  //           show: false, // 这里设置为false去除x轴刻度线
  //         },
  //         axisLabel: {
  //           formatter: '{value}万元',
  //         },
  //         // show: false,
  //         // max: 400000000,
  //       },
  //       {
  //         type: 'value',
  //         min: 0,
  //         max: 20,
  //         // name: '货币和准货币(M2)供应量增长率',
  //         interval: 5,
  //         axisLabel: {
  //           formatter: '{value}%',
  //         },
  //       },
  //     ],
  //     series: [
  //       {
  //         type: 'line',
  //         name: '流通中现金(MO)供应量增长率',
  //         tooltip: {
  //           valueFormatter: function (value: any) {
  //             return value + ' %';
  //           },
  //         },
  //         // symbol: "circle",
  //         data: AO3Data2 || [],
  //         smooth: true, // 使折线平滑
  //         color: '#FFAD89',
  //         areaStyle: {
  //           color: {
  //             type: 'linear', // linear 线性渐变  radial径向渐变
  //             x: 0,
  //             y: 0,
  //             x2: 0,
  //             y2: 1,
  //             colorStops: [
  //               {
  //                 offset: 0,
  //                 color: 'rgba(255,173,137,0.3)', // 0% 处的颜色
  //               },
  //               {
  //                 offset: 1,
  //                 color: 'rgba(255,173,137,0)', // 100% 处的颜色
  //               },
  //             ],
  //             global: false, // 缺省为 false
  //           },
  //         },
  //         lineStyle: {
  //           color: '#FFAD89',
  //           width: 2,
  //           type: 'solid',
  //         },
  //       },
  //       {
  //         type: 'bar',
  //         name: '流通中现金(MO)供应量',
  //         tooltip: {
  //           valueFormatter: function (value: any) {
  //             return value + ' 万元';
  //           },
  //         },
  //         data: AO3Data1 || [],

  //         itemStyle: {
  //           borderRadius: [5, 5, 0, 0], // 这里设置圆角的大小
  //           color: '#7B8FFF',
  //         },
  //         barWidth: 5,
  //         showBackground: false,
  //         // backgroundStyle: {
  //         //   color: '#EEF1FF',
  //         // },
  //       },
  //     ],
  //   };
  //   ScoreCharts.setOption(art2);
  // };

  // const getLineClumnsThree = () => {
  //   const ScoreCharts = echarts.init(document.getElementById('lineFive') as HTMLDivElement);
  //   const art2 = {
  //     grid: {
  //       x: 60,
  //       y: 60,
  //       x2: 50,
  //       y2: 30,
  //     },
  //     // title: {
  //     //   text: '报表项目分析',
  //     // },
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'cross',
  //         crossStyle: {
  //           color: '#999',
  //         },
  //       },
  //     },
  //     legend: {
  //       data: ['黄金储备', '黄金储备增长率'],
  //     },
  //     xAxis: [
  //       {
  //         type: 'category',
  //         axisTick: {
  //           show: false, // 这里设置为false去除x轴刻度线
  //         },
  //         data: AO6X || [],
  //         axisLine: {
  //           // type: 'dotted',
  //           lineStyle: {
  //             color: '#DCCAFF',
  //           },
  //         },
  //         axisLabel: {
  //           color: '#333',
  //           fontWeight: 400,
  //         },
  //         axisPointer: {
  //           type: 'shadow',
  //         },
  //       },
  //     ],
  //     yAxis: [
  //       {
  //         type: 'value',
  //         min: 0,
  //         // name: '金融机构人民币信贷资金来源(亿元)',
  //         // max: 1,
  //         axisTick: {
  //           show: false, // 这里设置为false去除x轴刻度线
  //         },
  //         axisLabel: {
  //           formatter: '{value}百元',
  //         },
  //         // show: false,
  //         // max: 400000000,
  //       },
  //       {
  //         type: 'value',
  //         min: 0,
  //         max: 20,
  //         // name: '货币和准货币(M2)供应量增长率',
  //         interval: 5,
  //         axisLabel: {
  //           formatter: '{value}%',
  //         },
  //       },
  //     ],
  //     series: [
  //       {
  //         type: 'line',
  //         name: '黄金储备增长率',
  //         tooltip: {
  //           valueFormatter: function (value: any) {
  //             return value + ' %';
  //           },
  //         },
  //         // symbol: "circle",
  //         data: AO6Data2 || [],
  //         smooth: true, // 使折线平滑
  //         color: '#FFAD89',
  //         areaStyle: {
  //           color: {
  //             type: 'linear', // linear 线性渐变  radial径向渐变
  //             x: 0,
  //             y: 0,
  //             x2: 0,
  //             y2: 1,
  //             colorStops: [
  //               {
  //                 offset: 0,
  //                 color: 'rgba(255,173,137,0.3)', // 0% 处的颜色
  //               },
  //               {
  //                 offset: 1,
  //                 color: 'rgba(255,173,137,0)', // 100% 处的颜色
  //               },
  //             ],
  //             global: false, // 缺省为 false
  //           },
  //         },
  //         lineStyle: {
  //           color: '#FFAD89',
  //           width: 2,
  //           type: 'solid',
  //         },
  //       },
  //       {
  //         type: 'bar',
  //         name: '黄金储备',
  //         tooltip: {
  //           valueFormatter: function (value: any) {
  //             return value + ' 百元';
  //           },
  //         },
  //         data: AO6Data1 || [],

  //         itemStyle: {
  //           borderRadius: [5, 5, 0, 0], // 这里设置圆角的大小
  //           color: '#7B8FFF',
  //         },
  //         barWidth: 5,
  //         showBackground: false,
  //         // backgroundStyle: {
  //         //   color: '#EEF1FF',
  //         // },
  //       },
  //     ],
  //   };
  //   ScoreCharts.setOption(art2);
  // };

  useEffect(() => {
    // AO1Data1 && AO1Data1.length > 0 && getLineClumns();
    // getLineClumnsOne();
    // getLineClumnsTwo();
    // getLineClumnsThree();
  }, [AO1Data1]);

  return (
    <div>
      <p className={styles?.secondTitle}>金融机构人民币信贷资金平衡分析</p>
      <div className={styles?.container} style={{ height: '330px' }}>
        <p className={styles?.secondTitle}>金融机构人民币信贷资金平衡分析</p>
        <ChatDualAxes data={currentList?.A0} />
      </div>
      <p className={styles?.secondTitle}>货币供应量分析</p>
      <div className={styles?.chatTwo}>
        <div className={styles.container} style={{ height: '330px' }}>
          <p className={styles?.secondTitle}>货币和准货币（M2）供应量</p>
          {/* <SingleDualAxes /> */}
          {/* {<div id="lineTwo" style={{ width: '100%', height: '300px' }} />} */}
          <SingleDualAxesFive data={currentList?.A1} />
        </div>
        <div className={styles.container} style={{ marginLeft: '12px', height: '330px' }}>
          <p className={styles?.secondTitle}>货币（M1）供应量</p>
          {/* <div id="lineThree" style={{ width: '100%', height: '300px' }} /> */}
          <SingleDualAxesFour data={currentList?.A2} />
        </div>
        <div className={styles.container} style={{ marginLeft: '12px', height: '330px' }}>
          <p className={styles?.secondTitle}>流通中现金（M0）供应量</p>
          <SingleDualAxesThree data={currentList?.A3} />
          {/* <div id="lineFour" style={{ width: '100%', height: '300px' }} /> */}
        </div>
      </div>
      <p className={styles?.secondTitle}>货币当局</p>
      <div className={styles?.chatTwo}>
        <div className={styles.container} style={{ height: '330px', flex: 1 }}>
          <p className={styles?.secondTitle}>货币当局资产</p>
          <ChartBar data={currentList?.A4} />
        </div>
        <div className={styles.container} style={{ marginLeft: '12px', height: '330px', flex: 1 }}>
          <p className={styles?.secondTitle}>货币当局负债</p>
          <ChartBar data={currentList?.A5} />
        </div>
        <div className={styles.container} style={{ marginLeft: '12px', height: '330px', flex: 1 }}>
          <p className={styles?.secondTitle}>黄金外汇储备</p>
          <SingleDualAxesTwo data={currentList?.A6} />
          {/* <div id="lineFive" style={{ width: '100%', height: '300px' }} /> */}
        </div>
      </div>
      <p className={styles?.secondTitle}>社会融资</p>
      <div className={styles?.chatTwo}>
        <div className={styles.container} style={{ height: '330px' }}>
          <p className={styles?.secondTitle}>社会融资规模</p>
          <SingleDualAxes data={currentList?.A7} />
        </div>
        <div className={styles.container} style={{ marginLeft: '12px', height: '330px' }}>
          <p className={styles?.secondTitle}>人民币贷款社会融资规模</p>
          <SingleDualAxesOne data={currentList?.A8} />
        </div>
      </div>
    </div>
  );
};
export default Chats;
