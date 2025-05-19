export const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  toolbox: false,
  legend: false,
  xAxis: [
    {
      type: 'category',
      axisTick: {
        show: false, // 这里设置为false去除x轴刻度线
      },

      data: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
      axisPointer: {
        type: 'shadow',
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      // name: 'Precipitation',
      min: 0,
      max: 250,
      interval: 50,
      axisTick: {
        show: false, // 这里设置为false去除x轴刻度线
      },
      axisLabel: false,
    },
    {
      type: 'value',
      axisTick: {
        show: false, // 这里设置为false去除x轴刻度线
      },
      // name: 'Temperature',
      min: 0,
      max: 25,
      interval: 5,
      axisLabel: false,
    },
  ],
  series: [
    {
      name: 'Evaporation',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value: any) {
          return value + ' ml';
        },
      },
      smooth: true, // 使折线平滑
      areaStyle: {
        color: 'linear-gradient( 180deg, rgba(198,147,255,0.32) 0%, rgba(157,90,255,0) 100%)',
        opacity: 0.1,
      },
      lineStyle: {
        color: 'linear-gradient( 180deg, rgba(198,147,255,0.32) 0%, rgba(157,90,255,0) 100%)',
        width: 0,
        type: 'solid',
      },

      // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
    },

    {
      name: 'Precipitation',
      type: 'bar',
      // tooltip: {
      //   valueFormatter: function (value: any) {
      //     return value + ' ml';
      //   },
      // },
      //#FFB503
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3, 1.1, 1, 2.2, 2, 3.3, 3,
        1.1, 1,
      ],
    },
    {
      name: 'Temperature',
      type: 'line',
      yAxisIndex: 1,
      // tooltip: {
      //   valueFormatter: function (value: any) {
      //     return value + ' °C';
      //   },
      // },
      data: [
        2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2, 1.1, 1, 2.2, 2, 3.3, 3,
        1.1, 1,
      ],
    },
  ],
};

// workCount({}).then((res: any) => {
//   let x_arr: any = [];
//   let y_arr: any = [];
//   res && res.map((el: any) => {
//       x_arr.push(el.workArchives);
//       y_arr.push(el.total);
//   });
//   let myChart_assetWork: any = echarts.init(document.getElementById('assetWork'));
