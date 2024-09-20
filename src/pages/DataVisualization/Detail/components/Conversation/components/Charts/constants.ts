export const ChartType = {
  bar: { name: 'bar', cname: '柱状图' },
  line: { name: 'line', cname: '折线图' },
  pie: { name: 'pie', cname: '饼状图' },
} as const;

export const ChartOptions = {
  [ChartType.bar.name]: function (data = { data: [], columns: [] }) {
    const xAxisData = data.data.map(function (item) {
      return item[0];
    });
    const series = data.columns.slice(1).map(function (seriesName, index) {
      return {
        name: seriesName,
        type: 'bar',
        data: data.data.map(function (k) {
          return k[index + 1];
        }),
      };
    });
    return {
      legend: {},
      grid: {
        left: '15%',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {},
      series: series,
    };
  },
  [ChartType.line.name]: function (data = { data: [], columns: [] }) {
    const xAxisData = data.data.map(function (item) {
      return item[0];
    });
    const series = data.columns.slice(1).map(function (seriesName, index) {
      return {
        name: seriesName,
        type: 'line',
        data: data.data.map(function (k) {
          return k[index + 1];
        }),
      };
    });
    return {
      legend: {},
      grid: {
        left: '15%',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {},
      series: series,
    };
  },
  [ChartType.pie.name]: function (data) {
    let seriesData = data.data.map(function (item) {
      return {
        value: item[1],
        name: item[0],
      };
    });
    return {
      legend: {},
      tooltip: {
        trigger: 'item',
      },
      xAxis: false,
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  },
};
