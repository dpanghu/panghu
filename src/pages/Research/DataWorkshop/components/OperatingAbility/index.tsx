import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { DatePicker, Select } from 'antd';
import moment from 'moment';
import data from '../../mock.json';
import BarLine from '../Charts/BarLine';

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

  const [yszkzzl, setYszkzzl] = useState<RecordItem>({}); //应收账款周转率
  const [zzczzl, setZzczzl] = useState<RecordItem>({}); //总资产周转率
  // const [yszkzzts, setYszkzzts] = useState<RecordItem>({}); //应收账款周转天数
  const [gdzczzl, setGdzczzl] = useState<RecordItem>({}); //固定资产周转率
  // const [yynlqsb, setYynlqsb] = useState<RecordItem>({}); //营运能力趋势表
  const [ldzczzts, setLdzczzts] = useState<RecordItem>({}); //流动资产周转天数
  const [zzczzts, setZzczzts] = useState<RecordItem>({}); //总资产周转天数
  const [yyzbqst, setYyzbqst] = useState<RecordItem>({}); //营运资本趋势图
  const [ldzczzl, setLdzczzl] = useState<RecordItem>({}); //流动资产周转率

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
    // 应收账款周转率
    const yszkzzl_in = yearsArray.map((item) => dataSource.A12[item]?.A12?.value || 0);
    setYszkzzl({
      yszkzzl_in,
      xAxisData: yearsArray,
    });

    // 应收账款周转天数
    // const yszkzzts_in = yearsArray.map((item) => dataSource.A12[item]?.A12?.value || 0);
    // console.log('应收账款周转天数', yszkzzts_in);
    // setYszkzzts({
    //   yszkzzts_in,
    //   xAxis1Data: yearsArray,
    // });

    // 固定资产周转率
    const gdzczzl_in = yearsArray.map((item) => dataSource.A12[item]?.A12?.value || 0);
    setGdzczzl({
      gdzczzl_in,
      xAxisData: yearsArray,
    });

    //营运能力趋势表

    // 流动资产周转天数
    const ldzczzts_in = yearsArray.map((item) => dataSource.A7[item]?.A4?.value || 0);
    setLdzczzts({
      ldzczzts_in,
      xAxisData: yearsArray,
    });

    // 总资产周转率
    const yysr = yearsArray.map((item) => dataSource.A2[item]?.A1?.value || 0);
    const zczj = yearsArray.map((item) => dataSource.A5[item]?.A4?.value || 0);
    const zzczz = yearsArray.map((item) => dataSource.A2[item]?.A1?.value || 0);
    setZzczzl({
      yysr,
      zczj,
      zzczz,
      xAxisData: yearsArray,
    });

    // 总资产周转天数
    const zzczzts_in = yearsArray.map((item) => dataSource.A7[item]?.A4?.value || 0);
    setZzczzts({
      zzczzts_in,
      xAxisData: yearsArray,
    });

    // 营运资本趋势图
    const yyzb = yearsArray.map((item) => dataSource.A7[item]?.A4?.value || 0);
    setYyzbqst({
      yyzb,
      xAxisData: yearsArray,
    });

    // 流动资产周转率
    const ldzczzl_in = yearsArray.map((item) => dataSource.A7[item]?.A4?.value || 0);
    setLdzczzl({
      ldzczzl_in,
      xAxisData: yearsArray,
    });
  }, [currentRange, dataSource]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.title}>营运能力分析</div>
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
            <div>流动资产周转率(%)</div>
            <div>{currentData.currentYearData?.A2?.value || 0}</div>
          </div>
          <div className={styles.detail}>
            <div>应收账款周转率(%)</div>
            <div>7.37</div>
          </div>
          <div className={styles.detail}>
            <div>固定资产周转率(%)</div>
            <div>-0.66</div>
          </div>
          <div className={styles.detail}>
            <div>总资产周转率(%)</div>
            <div>6.77</div>
          </div>
          <div className={styles.detail}>
            <div>存货周裝率(%)</div>
            <div>7.37</div>
          </div>
        </div>
      </div>
      <div className={styles.charts}>
        <BarLine
          title="应收账款周转率（与行业比）"
          xAxisData={yszkzzl.xAxisData || []}
          left="15%"
          unit="%"
          id="yszkzzl"
          legendData={['应收账款周转率']}
          seriesData={[
            {
              name: '应收账款周转率',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#7B8FFF',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: yszkzzl.yszkzzl_in || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="总资产周转率"
          xAxisData={zzczzl.xAxisData || []}
          left="15%"
          unit="%"
          id="zzczzl"
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
              data: zzczzl.yysr || [],
              smooth: true, // 设置平滑
            },
            {
              name: '资产总计',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#A481FF',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: zzczzl.zczj || [],
              smooth: true, // 设置平滑
            },
            {
              name: '总资产周转率',
              type: 'line',
              itemStyle: {
                color: '#1EE2DA',
              },
              symbolSize: 0, // 隐藏圆点
              data: zzczzl.zzczz || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="应收账款周转天数（与行业比）"
          xAxisData={ldzczzts.xAxisData || []}
          left="15%"
          unit="%"
          id="yszkzzts1"
          legendData={['应收账款周转天数']}
          seriesData={[
            {
              name: '应收账款周转天数',
              type: 'line',
              itemStyle: {
                color: '#32D2FF',
              },
              data: ldzczzts.ldzczzts_in || [],
            },
          ]}
        />
        <BarLine
          title="固定资产周转率（与行业比）"
          xAxisData={gdzczzl.xAxisData || []}
          left="15%"
          unit="%"
          id="gdzczzl1"
          legendData={['固定资产周转率']}
          seriesData={[
            {
              name: '固定资产周转率',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#96DA14',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: gdzczzl.gdzczzl_in || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="营运能力趋势表"
          xAxisData={gdzczzl.xAxisData || []}
          left="15%"
          unit="%"
          id="yynlqsb"
          legendData={['存货…', '固定…', '总资…', '农村…', '流动…']}
          seriesData={[
            {
              name: '存货…',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: gdzczzl.gdzczzl_in || [],
              smooth: true, // 设置平滑
              areaStyle: {
                color: 'hsla(234, 100%, 79%, 1)',
              },
            },
            {
              name: '固定…',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: zzczzl.yysr || [],
              smooth: true, // 设置平滑
              areaStyle: {
                color: 'hsla(336, 100%, 80%, 1)',
              },
            },
            {
              name: '总资…',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: zzczzl.zczj || [],
              smooth: true, // 设置平滑
              areaStyle: {
                color: 'hsla(18, 100%, 77%, 1)',
              },
            },
            {
              name: '农村…',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: gdzczzl.gdzczzl_in || [],
              smooth: true, // 设置平滑
              areaStyle: {
                color: 'hsla(81, 83%, 47%, 1)',
              },
            },
            {
              name: '流动…',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: zzczzl.zzczz || [],
              smooth: true, // 设置平滑
              areaStyle: {
                color: 'hsla(265, 100%, 80%, 1)',
              },
            },
          ]}
        />
        <BarLine
          title="流动资产周转天数（与行业比）"
          xAxisData={ldzczzts.xAxisData || []}
          left="15%"
          unit="%"
          id="ldzczzts"
          legendData={['流动资产周转天数']}
          seriesData={[
            {
              name: '流动资产周转天数',
              type: 'line',
              itemStyle: {
                color: '#A481FF',
              },
              data: ldzczzts.ldzczzts_in || [],
            },
          ]}
        />
        <BarLine
          title="固定资产周转率（与行业比）"
          xAxisData={gdzczzl.xAxisData || []}
          left="15%"
          unit="%"
          id="gdzczzl2"
          legendData={['固定资产周转率']}
          seriesData={[
            {
              name: '固定资产周转率',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#FFAD89',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: gdzczzl.gdzczzl_in || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="固定资产周转率（与行业比）"
          xAxisData={gdzczzl.xAxisData || []}
          left="15%"
          unit="%"
          id="gdzczzl3"
          legendData={['固定资产周转率']}
          seriesData={[
            {
              name: '固定资产周转率',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#7B8FFF',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: gdzczzl.gdzczzl_in || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
        <BarLine
          title="总资产周转天数（与行业比）"
          xAxisData={zzczzts.xAxisData || []}
          left="15%"
          unit="%"
          id="zzczzts"
          legendData={['总资产周转天数']}
          seriesData={[
            {
              name: '总资产周转天数',
              type: 'line',
              itemStyle: {
                color: '#FFAD89',
              },
              data: zzczzts.zzczzts_in || [],
            },
          ]}
        />
        <BarLine
          title="营运资本趋势图"
          xAxisData={yyzbqst.xAxisData || []}
          left="15%"
          unit="%"
          id="yyzbqst"
          legendData={['营运资本']}
          seriesData={[
            {
              name: '营运资本',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#A481FF',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: yyzbqst.yyzb || [],
            },
          ]}
        />
        <BarLine
          title="流动资产周转率"
          xAxisData={yyzbqst.xAxisData || []}
          left="15%"
          unit="%"
          id="ldzczzl"
          legendData={['流动资产周转率']}
          seriesData={[
            {
              name: '流动资产周转率',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: '#32D2FF',
                borderRadius: [8, 8, 0, 0],
              },
              symbolSize: 0, // 隐藏圆点
              data: ldzczzl.ldzczzl_in || [],
            },
          ]}
        />
        {/* <BarLine
          title="应收账款周转天数（与行业比）"
          xAxisData={yszkzzts.xAxisData || []}
          left="15%"
          unit="%"
          id="yszkzzts2"
          legendData={['应收账款周转天数']}
          seriesData={[
            {
              name: '应收账款周转天数',
              type: 'line',
              itemStyle: {
                color: '#32D2FF',
              },
              data: yszkzzts.yszkzzts_in || [],
            },
          ]}
        /> */}
        <BarLine
          title="应收账款周转天数（与行业比）"
          xAxisData={ldzczzts.xAxisData || []}
          left="15%"
          unit="%"
          id="yszkzzts2"
          legendData={['应收账款周转天数']}
          seriesData={[
            {
              name: '应收账款周转天数',
              type: 'line',
              itemStyle: {
                color: '#32D2FF',
              },
              data: ldzczzts.ldzczzts_in || [],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Container;
