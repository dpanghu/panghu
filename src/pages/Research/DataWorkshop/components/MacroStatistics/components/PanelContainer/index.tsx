/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
// import Line from '../Charts/Line';
import BarLine from '../../../Charts/BarLine';

interface TProps {
  currentRange: [string, string];
  sourceData: RecordItem;
}

const Container: React.FC<TProps> = ({ currentRange, sourceData }) => {
  const [top1, setTop1] = useState<RecordItem>({});
  const [top2, setTop2] = useState<RecordItem>({});
  const [top3, setTop3] = useState<RecordItem>({});
  const [middle1, setMiddle1] = useState<RecordItem>({});
  const [middle2, setMiddle2] = useState<RecordItem>({});
  const [middle3, setMiddle3] = useState<RecordItem>({});
  const [bottom1, setBottom1] = useState<RecordItem>({});
  const [bottom2, setBottom2] = useState<RecordItem>({});
  const [bottom3, setBottom3] = useState<RecordItem>({});

  useEffect(() => {
    const yearsArray = [];
    for (let i = currentRange[0] as any; i <= currentRange[1]; i++) {
      yearsArray.push(String(i));
    }
    // 人均可支配收入
    const jmrj = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const czjmrj = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    const ncjmrj = yearsArray.map((item) => sourceData.A11[item]?.A1?.value || 0);
    setTop1({
      jmrj,
      czjmrj,
      ncjmrj,
      xAxisData: yearsArray,
    });

    // 消费对经济增长贡献
    const zbxc = yearsArray.map((item) => sourceData.A8[item]?.A1?.value || 0);
    const zzxf = yearsArray.map((item) => sourceData.A8[item]?.A3?.value || 0);
    const hw = yearsArray.map((item) => sourceData.A8[item]?.A5?.value || 0);
    setTop2({
      zbxc,
      zzxf,
      hw,
      xAxisData: yearsArray,
    });

    // 社会消费品零售
    const shxf = yearsArray.map((item) => sourceData.A10[item]?.A1?.value || 0);
    setTop3({
      shxf,
      xAxis1Data: yearsArray,
    });

    // 固定资产投资
    const gdzc = yearsArray.map((item) => sourceData.A13[item]?.A3?.value || 0);
    const gdzczjl = yearsArray.map((item) => sourceData.A13[item]?.A4?.value || 0);
    setMiddle1({
      gdzc,
      gdzczjl,
      xAxisData: yearsArray,
    });

    // 进出口总额 差额
    const jckze = yearsArray.map((item) => sourceData.A5[item]?.A1?.value || 0);
    const jckce = yearsArray.map((item) => sourceData.A5[item]?.A4?.value || 0);
    setMiddle2({
      jckze,
      jckce,
      xAxisData: yearsArray,
    });

    // 进出口规模 出口  进口
    const jckgmck = yearsArray.map((item) => sourceData.A5[item]?.A2?.value || 0);
    const jckgmjk = yearsArray.map((item) => sourceData.A5[item]?.A3?.value || 0);
    setMiddle3({
      jckgmck,
      jckgmjk,
      xAxisData: yearsArray,
    });

    // 实际利用外资额
    const sjlywze = yearsArray.map((item) => sourceData.A1[item]?.A1?.value || 0);
    setBottom1({
      sjlywze,
      xAxisData: yearsArray,
    });

    // 产业增加值
    const dycyzjz = yearsArray.map((item) => sourceData.A7[item]?.A3?.value || 0);
    const decyzjz = yearsArray.map((item) => sourceData.A7[item]?.A4?.value || 0);
    const dscyzjz = yearsArray.map((item) => sourceData.A7[item]?.A5?.value || 0);
    setBottom2({
      dycyzjz,
      decyzjz,
      dscyzjz,
      xAxisData: yearsArray,
    });

    // 粮食产量
    const lscl = yearsArray.map((item) => sourceData.A6[item]?.A1?.value || 0);
    setBottom3({
      lscl,
      xAxisData: yearsArray,
    });
  }, [currentRange]);

  return (
    <div className={styles.container}>
      <BarLine
        title="人均可支配收入"
        xAxisData={top1.xAxisData || []}
        left="15%"
        unit="元"
        id="renjunkezhipeishouru"
        legendData={['居民人均可支配收入', '城镇居民人均可支配收入', '农村居民人均可支配收入']}
        seriesData={[
          {
            name: '居民人均可支配收入',
            type: 'line',
            symbolSize: 0, // 隐藏圆点
            data: top1.jmrj || [],
            smooth: true, // 设置平滑
          },
          {
            name: '城镇居民人均可支配收入',
            type: 'line',
            symbolSize: 0, // 隐藏圆点
            data: top1.czjmrj || [],
            smooth: true, // 设置平滑
          },
          {
            name: '农村居民人均可支配收入',
            type: 'line',
            symbolSize: 0, // 隐藏圆点
            data: top1.ncjmrj || [],
            smooth: true, // 设置平滑
          },
        ]}
      />
      <BarLine
        title="消费对经济增长贡献"
        xAxisData={top1.xAxisData || []}
        id="xiaofeiduijingjizengzhanggongxian"
        legendData={[
          '资本形成总额对国内生产总值增长贡献率(%) ',
          '最终消费支出对国内生产总值增长贡献率(%)',
          '货物和服务净出口对国内生产总值增长贡献率(%)',
        ]}
        seriesData={[
          {
            name: '资本形成总额对国内生产总值增长贡献率(%) ',
            type: 'line',
            symbolSize: 0, // 隐藏圆点
            data: top2.zbxc || [],
            smooth: true, // 设置平滑
          },
          {
            name: '最终消费支出对国内生产总值增长贡献率(%)',
            type: 'line',
            symbolSize: 0, // 隐藏圆点
            data: top2.zzxf || [],
            smooth: true, // 设置平滑
          },
          {
            name: '货物和服务净出口对国内生产总值增长贡献率(%)',
            type: 'line',
            symbolSize: 0, // 隐藏圆点
            data: top2.hw || [],
            smooth: true, // 设置平滑
          },
        ]}
      />
      <BarLine
        title="社会消费品零售总额"
        xAxisData={top1.xAxisData || []}
        left="20%"
        unit="亿元"
        legendWidth={200}
        id="shehuixiaofeipinlingshou"
        legendData={['社会消费品零售总额(亿元)']}
        seriesData={[
          {
            name: '社会消费品零售总额(亿元)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: top3.shxf || [],
          },
        ]}
      />
      <BarLine
        title="固定资产投资"
        xAxisData={middle1.xAxisData || []}
        left="20%"
        unit="亿元"
        unitRight="%"
        legendWidth={200}
        right="10%"
        id="gudingzichantouzi"
        legendData={['固定资产投资(亿元)', '固定资产投资_比上年增长(%)']}
        seriesData={[
          {
            name: '固定资产投资(亿元)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: middle1.gdzc || [],
          },
          {
            name: '固定资产投资_比上年增长(%)',
            type: 'line',
            symbolSize: 0, // 隐藏圆点
            data: middle1.gdzczjl || [],
            yAxisIndex: 1,
          },
        ]}
      />
      <BarLine
        title="进出口规模-总额、差额"
        xAxisData={middle2.xAxisData || []}
        left="20%"
        legendWidth={200}
        unit="亿元"
        // unitRight="%"
        // right="10%"
        id="jinchukouguimozongechae"
        legendData={['进出口总额(人民币)(亿元)', '进出口差额(人民币)(亿元)']}
        seriesData={[
          {
            name: '进出口总额(人民币)(亿元)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: middle2.jckze || [],
          },
          {
            name: '进出口差额(人民币)(亿元)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: middle2.jckce || [],
          },
        ]}
      />
      <BarLine
        title="进出口规模—出口、进口"
        xAxisData={middle3.xAxisData || []}
        left="20%"
        unit="亿元"
        legendWidth={200}
        // unitRight="%"
        // right="10%"
        id="jinchukouguimochukoujinkou"
        legendData={['出口总额(人民币)(亿元)', '进口总额(人民币)(亿元)']}
        seriesData={[
          {
            name: '出口总额(人民币)(亿元)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: middle3.jckgmck || [],
          },
          {
            name: '进口总额(人民币)(亿元)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: middle3.jckgmjk || [],
          },
        ]}
      />
      <BarLine
        title="实际利用外资"
        xAxisData={bottom1.xAxisData || []}
        left="24%"
        unit="万美元"
        legendWidth={200}
        // unitRight="%"
        // right="10%"
        id="shijiliyongwaizi"
        legendData={['实际利用外资额(万美元)']}
        seriesData={[
          {
            name: '实际利用外资额(万美元)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: bottom1.sjlywze || [],
          },
        ]}
      />
      <BarLine
        title="产业增加值"
        xAxisData={bottom2.xAxisData || []}
        left="20%"
        unit="亿元"
        // unitRight="%"
        // right="10%"
        id="chanyezengjiazhi"
        legendData={['第一产业增加值(亿元)', '第二产业增加值(亿元)', '第三产业增加值(亿元)']}
        seriesData={[
          {
            name: '第一产业增加值(亿元)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: bottom2.dycyzjz || [],
          },
          {
            name: '第二产业增加值(亿元)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: bottom2.decyzjz || [],
          },
          {
            name: '第三产业增加值(亿元)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: bottom2.dscyzjz || [],
          },
        ]}
      />
      <BarLine
        title="粮食产量"
        xAxisData={bottom3.xAxisData || []}
        left="20%"
        unit="万吨"
        // unitRight="%"
        // right="10%"
        id="liangshichanliang"
        legendData={['粮食产量(万吨)']}
        seriesData={[
          {
            name: '粮食产量(万吨)',
            type: 'bar',
            symbolSize: 0, // 隐藏圆点
            data: bottom3.lscl || [],
          },
        ]}
      />
    </div>
  );
};

export default Container;
