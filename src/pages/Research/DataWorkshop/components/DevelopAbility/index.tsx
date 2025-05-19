import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { DatePicker, Select } from 'antd';
import moment from 'moment';
import data from '../../mock.json';
import BarLine from '../Charts/BarLine';
import Pie from '../Charts/Pie';
import TransverseBar from '../Charts/TransverseBar';

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

  const [jlrzzl, setJlrzzl] = useState<RecordItem>({}); //净利润整张率

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

  useEffect(() => {
    const currentYearData = dataSource[currentRange[1]] || {};
    const lastYearData = dataSource[Number((currentRange[1] as any) - 1) - 1] || {};
    setCurrentData({
      currentYearData,
      lastYearData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRange]);

  //表格赋值
  useEffect(() => {
    const yearsArray = [];
    for (let i = currentRange[0] as any; i <= currentRange[1]; i++) {
      yearsArray.push(String(i));
    }

    //净利润增长率
    const jinglr = yearsArray.map((item) => dataSource.A8[item]?.A1?.value || 0);
    setJlrzzl({
      jinglr,
      xAxisData: yearsArray,
    });

    //发展能力趋势图
  }, [currentRange, dataSource]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.title}>发展能力分析</div>
          <div className={styles.action}>
            <RangePicker
              picker={'year'}
              disabledDate={disabledDate}
              value={[moment(currentRange[0]), moment(currentRange[1])]}
              onChange={(dates: any, dateStrings: [string, string]) => {
                setCurrentRange(dateStrings);
                // getDate(dateStrings[0], dateStrings[1]);
              }}
            />
            <Select placeholder="请选择行业" />
            <Select placeholder="请选择公司" />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.detail}>
            <div>营业总收入(%)</div>
            <div>{currentData.currentYearData?.A2?.value || 0}</div>
          </div>
          <div className={styles.detail}>
            <div>净利润(%)</div>
            <div>7.37</div>
          </div>
          <div className={styles.detail}>
            <div>资产总计(%)</div>
            <div>-0.66</div>
          </div>
          <div className={styles.detail}>
            <div>股东权益合计(%)</div>
            <div>6.77</div>
          </div>
        </div>
      </div>
      <div className={styles.charts}>
        <BarLine
          title="净利润增长率"
          xAxisData={jlrzzl.xAxisData || []}
          unit="%"
          id="maolilv"
          legendData={['净利润']}
          seriesData={[
            {
              name: '净利润',
              type: 'line',
              itemStyle: {
                color: '#5A73FF',
              },
              symbolSize: 0, // 隐藏圆点
              data: jlrzzl.jinglr || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="全部资产现金回收率"
          xAxisData={['资产总计', '股东权益合计', '营业总收入', '净利润']}
          unit=""
          id="quanbuzijinhuishou"
          legendData={['收入数据']}
          seriesData={[
            {
              name: '收入数据',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#7B8FFF',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: [70, 83, 25, 30],
            },
          ]}
        />
        <TransverseBar
          title="净资产增长率变化图"
          id="jzczzlbht"
          legendData={['股东权益合计']}
          seriesData={[
            {
              name: '股东权益合计',
              type: 'bar',
              barWidth: '5px',
              barGap: 40,
              itemStyle: {
                color: '#7B8FFF',
                borderRadius: [0, 8, 8, 0],
                padding: [30, 24, 0, 0],
              },
              data: [1200, 950, 700, 1700, 1900, 1200],
            },
          ]}
        />
        <BarLine
          title="综合增长能力分析"
          xAxisData={jlrzzl.xAxisData || []}
          unit="%"
          id="zonghenenglifenxi"
          legendData={['能力范围']}
          seriesData={[
            {
              name: '能力范围',
              type: 'line',
              itemStyle: {
                color: '#FF7C43',
              },
              symbolSize: 0, // 隐藏圆点
              data: jlrzzl.jinglr || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
      </div>
      <div className={styles.bottom}>
        <Pie
          title="总资产变化图"
          id="zzcbht"
          unit="亿元"
          pieData={[
            { value: 106.78, name: '2017' },
            { value: 104.66, name: '2018' },
            { value: 120.45, name: '2019' },
            { value: 128.25, name: '2020' },
            { value: 123.79, name: '2021' },
          ]}
        />
      </div>
    </div>
  );
};

export default Container;
