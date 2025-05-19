import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { DatePicker, Select, Table } from 'antd';
import moment from 'moment';
import data from '../../mock.json';
import BarLine from '../Charts/BarLine';
import Gauge from '../Charts/Gauge';

interface TProps {
  sourceData: RecordItem;
  getDate: (start: string, end: string) => void;
}

const { RangePicker } = DatePicker;

const Container: React.FC<TProps> = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() - 1;
  const tenYearsAgo = currentYear - 10;
  const [dataSource] = useState<RecordItem>(data);

  const [chartsData, setChartsData] = useState<RecordItem>({});

  const [currentRange, setCurrentRange] = useState<[string, string]>([
    String(tenYearsAgo),
    String(currentYear),
  ]);
  const [currentData, setCurrentData] = useState<RecordItem>({
    currentYearData: {},
    lastYearData: {},
  });

  const disabledDate = (current: any) => {
    return (
      current &&
      (current < new Date('1949-01-01') ||
        current > new Date(`${new Date().getFullYear() - 1}-01-01`))
    );
  };

  const getDate = (start: string, end: string) => {
    setCurrentRange([start, end]);
  };

  useEffect(() => {
    const currentYearData = dataSource[currentRange[1]] || {};
    const lastYearData = dataSource[Number((currentRange[1] as any) - 1) - 1] || {};
    setCurrentData({
      currentYearData,
      lastYearData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRange]);

  //图表赋值
  useEffect(() => {
    const yearsArray = [];
    for (let i = currentRange[0] as any; i <= currentRange[1]; i++) {
      yearsArray.push(String(i));
    }
    //
    const ldbl = yearsArray.map((item) => dataSource.A8[item]?.A3?.value || 0);
    const cqbl = yearsArray.map((item) => dataSource.A8[item]?.A3?.value || 0);
    const zcfzl = yearsArray.map((item) => dataSource.A8[item]?.A3?.value || 0);
    const yhlxbs = yearsArray.map((item) => dataSource.A8[item]?.A3?.value || 0);
    const qycs = yearsArray.map((item) => dataSource.A8[item]?.A3?.value || 0);
    const xjzwzebl = yearsArray.map((item) => dataSource.A8[item]?.A3?.value || 0);
    const sdbl = yearsArray.map((item) => dataSource.A8[item]?.A3?.value || 0);
    setChartsData({
      ldbl,
      cqbl,
      zcfzl,
      yhlxbs,
      qycs,
      xjzwzebl,
      sdbl,
      xAxisData: yearsArray,
    });
  }, [currentRange, dataSource]);

  const columns: any = [
    {
      title: '第一报表日期',
      dataIndex: 'date',
      align: 'center',
    },
    {
      title: '现金比率',
      dataIndex: 'xjbl',
      align: 'center',
    },
    {
      title: '已获利息倍数',
      dataIndex: 'yhlxbs',
      align: 'center',
      width: 78,
    },
    {
      title: '资产负债率',
      dataIndex: 'zcfzl',
      align: 'center',
      width: 78,
    },
    {
      title: '流动比率',
      dataIndex: 'ldbl',
      align: 'center',
    },
    {
      title: '速动比率',
      dataIndex: 'sdbl',
      align: 'center',
    },
    {
      title: '产权比率',
      dataIndex: 'cqbl',
      align: 'center',
      width: 80,
    },
  ];

  const tableData: any = [
    {
      key: '1',
      date: 2012,
      xjbl: 0.14,
      yhlxbs: 0.12,
      zcfzl: 0.14,
      ldbl: 0.14,
      sdbl: 0.14,
      cqbl: 0.12,
    },
    {
      key: '2',
      date: 2013,
      xjbl: 0.14,
      yhlxbs: 0.12,
      zcfzl: 0.14,
      ldbl: 0.14,
      sdbl: 0.14,
      cqbl: 0.12,
    },
    {
      key: '2',
      date: 2013,
      xjbl: 0.14,
      yhlxbs: 0.12,
      zcfzl: 0.14,
      ldbl: 0.14,
      sdbl: 0.14,
      cqbl: 0.12,
    },
    {
      key: '2',
      date: 2013,
      xjbl: 0.14,
      yhlxbs: 0.12,
      zcfzl: 0.14,
      ldbl: 0.14,
      sdbl: 0.14,
      cqbl: 0.12,
    },
    {
      key: '2',
      date: '合计',
      xjbl: 0.14,
      yhlxbs: 0.12,
      zcfzl: 0.14,
      ldbl: 0.14,
      sdbl: 0.14,
      cqbl: 0.12,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.title}>偿债能力分析</div>
          <div className={styles.action}>
            <RangePicker
              style={{ width: 200 }}
              picker="year"
              disabledDate={disabledDate}
              value={[moment(currentRange[0]), moment(currentRange[1])]}
              onChange={(dates: any, dateStrings: [string, string]) => {
                setCurrentRange(dateStrings);
                getDate(dateStrings[0], dateStrings[1]);
              }}
            />
            <Select placeholder="请选择企业" style={{ width: 150 }} />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.detail}>
            <div>现金比率 (%)</div>
            <div>{currentData.currentYearData?.A2?.value || 0}</div>
          </div>
          <div className={styles.detail}>
            <div>已获利息倍数 (%)</div>
            <div>7.37</div>
          </div>
          <div className={styles.detail}>
            <div>资产负债率 (%)</div>
            <div>-0.66</div>
          </div>
          <div className={styles.detail}>
            <div>流劯比率 (%)</div>
            <div>6.77</div>
          </div>
          <div className={styles.detail}>
            <div>速动比率 (%)</div>
            <div>7.37</div>
          </div>
          <div className={styles.detail}>
            <div>产权比率 (%)</div>
            <div>-0.60</div>
          </div>
        </div>
      </div>
      <div className={styles.charts}>
        <BarLine
          title="流动比率（与行业比）"
          xAxisData={chartsData.xAxisData || []}
          left="15%"
          unit="%"
          id="maolilv"
          legendData={[]}
          seriesData={[
            {
              name: '流动比率',
              type: 'line',
              itemStyle: {
                color: '#96DA14',
              },
              symbolSize: 0, // 隐藏圆点
              data: chartsData.ldbl || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <div className={styles.tableContent}>
          <div className={styles.tableTitle}>偿债能力趋势表</div>
          <div className={styles.tableBox}>
            <Table
              columns={columns}
              dataSource={tableData}
              className={styles.table}
              pagination={false}
              rowKey="id"
            />
          </div>
        </div>
        <BarLine
          title="产权比率（与行业比）"
          xAxisData={chartsData.xAxisData || []}
          left="15%"
          unit="%"
          id="zongjinglilv"
          legendData={[]}
          seriesData={[
            {
              name: '产权比率',
              type: 'line',
              itemStyle: {
                color: '#5A73FF',
              },
              symbolSize: 0, // 隐藏圆点
              data: chartsData.cqbl || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="资产负债率（与行业比）"
          xAxisData={chartsData.xAxisData || []}
          left="15%"
          unit="%"
          id="zichanfuzhai"
          legendData={[]}
          seriesData={[
            {
              name: '资产负债率',
              type: 'line',
              itemStyle: {
                color: '#FF7C43',
              },
              symbolSize: 0, // 隐藏圆点
              data: chartsData.zcfzl || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <Gauge
          title="现金比率（与行业比）"
          id="xianjinbilv"
          value={8.42}
          minValue={1}
          maxValue={11}
          // splitNumber={5}
          chartName={'现金比率'}
        />
        <Gauge
          title="资产负债率（与行业比）"
          id="zichanfuzhaiGauge"
          value={8.42}
          minValue={1}
          maxValue={11}
          // splitNumber={5}
          chartName={'资产负债率'}
        />
        <BarLine
          title="己获利息倍数（与行业比)"
          xAxisData={chartsData.xAxisData || []}
          left="15%"
          unit="%"
          id="yihuolixi"
          legendData={[]}
          seriesData={[
            {
              name: '己获利息倍数',
              type: 'line',
              itemStyle: {
                color: '#AA7EFF',
              },
              symbolSize: 0, // 隐藏圆点
              data: chartsData.yhlxbs || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="权益乘数（与行业比）"
          xAxisData={chartsData.xAxisData || []}
          left="15%"
          unit="%"
          id="quanyichengshu"
          legendData={[]}
          seriesData={[
            {
              name: '权益乘数',
              type: 'line',
              itemStyle: {
                color: '#1EE2DA',
              },
              symbolSize: 0, // 隐藏圆点
              data: chartsData.qycs || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="现金债务总额比率（与行业比)"
          xAxisData={chartsData.xAxisData || []}
          left="15%"
          unit="%"
          id="xianjinzhaiwu"
          legendData={[]}
          seriesData={[
            {
              name: '现金债务总额比率',
              type: 'line',
              itemStyle: {
                color: '#5A73FF',
              },
              symbolSize: 0, // 隐藏圆点
              data: chartsData.xjzwzebl || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="速动比率（与行业比）"
          xAxisData={chartsData.xAxisData || []}
          left="15%"
          unit="%"
          id="sudong"
          legendData={[]}
          seriesData={[
            {
              name: '速动比率',
              type: 'line',
              itemStyle: {
                color: '#FF7C43',
              },
              symbolSize: 0, // 隐藏圆点
              data: chartsData.sdbl || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Container;
