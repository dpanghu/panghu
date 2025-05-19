import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { DatePicker, Select } from 'antd';
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
  const [currentRange, setCurrentRange] = useState<[string, string]>([
    String(tenYearsAgo),
    String(currentYear),
  ]);
  const [currentData, setCurrentData] = useState<RecordItem>({
    currentYearData: {},
    lastYearData: {},
  });

  const [maolv, setMaolv] = useState<RecordItem>({}); //毛利率
  const [jinglv, setJinglv] = useState<RecordItem>({}); //净利率
  // const [zongjinglv, setZongJinglv] = useState<RecordItem>({}); //总资产净利率
  const [jingzcsy, setJingzcsy] = useState<RecordItem>({}); //净资产收益率
  const [zongzczz, setZongzczz] = useState<RecordItem>({}); //总资产周转率

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

  //表格赋值
  useEffect(() => {
    const yearsArray = [];
    for (let i = currentRange[0] as any; i <= currentRange[1]; i++) {
      yearsArray.push(String(i));
    }
    // 毛利率
    const yingyemlv = yearsArray.map((item) => dataSource.A2[item]?.A1?.value || 0);
    const xiaoshoumlv = yearsArray.map((item) => dataSource.A9[item]?.A1?.value || 0);
    setMaolv({
      yingyemlv,
      xiaoshoumlv,
      xAxisData: yearsArray,
    });

    // 净利率
    const yingyejlv = yearsArray.map((item) => dataSource.A8[item]?.A1?.value || 0);
    const xiaoshoujlv = yearsArray.map((item) => dataSource.A8[item]?.A3?.value || 0);
    const zichanjlv = yearsArray.map((item) => dataSource.A8[item]?.A5?.value || 0);
    setJinglv({
      yingyejlv,
      xiaoshoujlv,
      zichanjlv,
      xAxisData: yearsArray,
    });

    // 总资产净利率
    // const zongzcjlv = yearsArray.map((item) => dataSource.A8[item]?.A1?.value || 0);
    // const hangyejz = yearsArray.map((item) => dataSource.A8[item]?.A3?.value || 0);
    // setZongJinglv({
    //   zongzcjlv,
    //   hangyejz,
    //   xAxis1Data: yearsArray,
    // });

    // 净资产收益率
    const jzcsy = yearsArray.map((item) => dataSource.A7[item]?.A4?.value || 0);
    const hyjz = yearsArray.map((item) => dataSource.A7[item]?.A5?.value || 0);
    setJingzcsy({
      jzcsy,
      hyjz,
      xAxisData: yearsArray,
    });

    // 总资产周转率
    const yysr = yearsArray.map((item) => dataSource.A2[item]?.A1?.value || 0);
    const zczj = yearsArray.map((item) => dataSource.A5[item]?.A4?.value || 0);
    const zzczz = yearsArray.map((item) => dataSource.A2[item]?.A1?.value || 0);
    setZongzczz({
      yysr,
      zczj,
      zzczz,
      xAxisData: yearsArray,
    });
  }, [currentRange, dataSource]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.title}>盈利能力分析</div>
          <div className={styles.action}>
            <RangePicker
              picker="year"
              disabledDate={disabledDate}
              value={[moment(currentRange[0]), moment(currentRange[1])]}
              onChange={(dates: any, dateStrings: [string, string]) => {
                setCurrentRange(dateStrings);
                getDate(dateStrings[0], dateStrings[1]);
              }}
            />
            <Select placeholder="请选择行业" />
            <Select placeholder="请选择公司" />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.detail}>
            <div>
              全部资产现
              <br />
              金回收率 (%)
            </div>
            <div>{currentData.currentYearData?.A2?.value || 0}</div>
          </div>
          <div className={styles.detail}>
            <div>
              销售
              <br />
              净利率 (%)
            </div>
            <div>7.37</div>
          </div>
          <div className={styles.detail}>
            <div>
              盈利现金 <br />
              比率 (%)
            </div>
            <div>-0.66</div>
          </div>
          <div className={styles.detail}>
            <div>
              总资产 <br />
              净利率 (%)
            </div>
            <div>6.77</div>
          </div>
          <div className={styles.detail}>
            <div>
              净资产 <br />
              收益率 (%)
            </div>
            <div>7.37</div>
          </div>
          <div className={styles.detail}>
            <div>
              基本每股 <br />
              收益 (%)
            </div>
            <div>-0.60</div>
          </div>
        </div>
      </div>
      <div className={styles.charts}>
        <BarLine
          title="毛利率"
          xAxisData={maolv.xAxisData || []}
          left="15%"
          unit="%"
          id="maolilv"
          legendData={['营业毛利率', '销售毛利率']}
          seriesData={[
            {
              name: '营业毛利率',
              type: 'line',
              itemStyle: {
                color: '#5A73FF',
              },
              symbolSize: 0, // 隐藏圆点
              data: maolv.yingyemlv || [],
              smooth: true, // 设置平滑
            },
            {
              name: '销售毛利率',
              type: 'line',
              itemStyle: {
                color: '#5AD8A6',
              },
              symbolSize: 0, // 隐藏圆点
              data: maolv.xiaoshoumlv || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="净利率"
          xAxisData={maolv.xAxisData || []}
          left="15%"
          unit="%"
          id="jinglilv"
          legendData={['营业净利率', '销售净利率', '资产净利率']}
          seriesData={[
            {
              name: '营业净利率',
              type: 'line',
              itemStyle: {
                color: '#5A73FF',
              },
              symbolSize: 0, // 隐藏圆点
              data: jinglv.yingyejlv || [],
              smooth: true, // 设置平滑
            },
            {
              name: '销售净利率',
              type: 'line',
              itemStyle: {
                color: '#5AD8A6',
              },
              symbolSize: 0, // 隐藏圆点
              data: jinglv.xiaoshoujlv || [],
              smooth: true, // 设置平滑
            },
            {
              name: '资产净利率',
              type: 'line',
              itemStyle: {
                color: '#FFAD89',
              },
              symbolSize: 0, // 隐藏圆点
              data: jinglv.zichanjlv || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="总资产净利率"
          xAxisData={maolv.xAxisData || []}
          left="15%"
          unit="%"
          id="zongzcjinglilv"
          legendData={['总资产净利率', '行业均值']}
          seriesData={[
            {
              name: '总资产净利率',
              type: 'line',
              itemStyle: {
                color: '#5A73FF',
              },
              symbolSize: 0, // 隐藏圆点
              data: maolv.yingyemlv || [],
              smooth: true, // 设置平滑
            },
            {
              name: '行业均值',
              type: 'line',
              itemStyle: {
                color: '#5AD8A6',
              },
              symbolSize: 0, // 隐藏圆点
              data: maolv.xiaoshoumlv || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        {/* <BarLine
          title="总资产净利率"
          xAxisData={zongjinglv.xAxisData || []}
          left="15%"
          unit="%"
          id="zongzcjinglilv"
          legendData={['总资产净利率', '行业均值']}
          seriesData={[
            {
              name: '总资产净利率',
              type: 'line',
              itemStyle: {
                color: '#5A73FF',
              },
              symbolSize: 0, // 隐藏圆点
              data: zongjinglv.zongzcjlv || [],
              smooth: true, // 设置平滑
            },
            {
              name: '行业均值',
              type: 'line',
              itemStyle: {
                color: '#FFAD89',
              },
              symbolSize: 0, // 隐藏圆点
              data: zongjinglv.hangyejz || [],
              smooth: true, // 设置平滑
              areaStyle: {
                // color: ''
              },
            },
          ]}
        /> */}
        <Gauge
          title="净资产收益率"
          id="jingzichanshouyilvGauge"
          value={8.42}
          minValue={1}
          maxValue={11}
          // splitNumber={5}
          chartName={'净资产收益率'}
        />
        <BarLine
          title="净资产收益率"
          xAxisData={jingzcsy.xAxisData || []}
          left="15%"
          unit="%"
          id="jingzichanshouyilvLine"
          legendData={['净资产收益率', '行业均值']}
          seriesData={[
            {
              name: '净资产收益率',
              type: 'line',
              itemStyle: {
                color: '#5A73FF',
              },
              symbolSize: 0, // 隐藏圆点
              data: jingzcsy.jzcsy || [],
              smooth: true, // 设置平滑
            },
            {
              name: '行业均值',
              type: 'line',
              itemStyle: {
                color: '#5AD8A6',
              },
              symbolSize: 0, // 隐藏圆点
              data: jingzcsy.hyjz || [],
              smooth: true, // 设置平滑
              areaStyle: {
                color: 'hsla(156, 62%, 60%, 0.3)',
              },
            },
          ]}
        />
        <BarLine
          title="总资产周转率"
          xAxisData={zongzczz.xAxisData || []}
          left="15%"
          unit="%"
          id="zongzichanzhouzhuan"
          legendData={['营业收入', '资产总计', '总资产周转率']}
          seriesData={[
            {
              name: '营业收入',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#7187FF',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: zongzczz.yysr || [],
            },
            {
              name: '资产总计',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#1EE2DA',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: zongzczz.zczj || [],
            },
            {
              name: '总资产周转率',
              type: 'line',
              itemStyle: {
                color: '#A481FF',
              },
              symbolSize: 0, // 隐藏圆点
              data: zongzczz.zzczz || [],
              smooth: true,
            },
          ]}
        />
      </div>
      <div className={styles.bottom}>
        <BarLine
          title="全部资产现金回收率"
          xAxisData={[
            '连城控股',
            '学大教育',
            'ST鑫光',
            '神州高铁',
            '神珠坊A',
            '丽珠集团',
            '西部创业',
          ]}
          left="15%"
          unit=""
          id="quanbuzijinhuishou"
          legendData={['现金回收率']}
          seriesData={[
            {
              name: '现金回收率',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#7187FF',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: [400, 480, 1000, 460, 700, 650, 720],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Container;
