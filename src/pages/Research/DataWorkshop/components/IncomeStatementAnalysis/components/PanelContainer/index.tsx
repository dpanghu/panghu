import { Table } from 'antd';
import Styles from './index.less';
import BarLine from '../../../Charts/BarLine';
import { useEffect, useState } from 'react';
interface TProps {
  currentRange: [string, string];
  sourceData: RecordItem;
}

const Container: React.FC<TProps> = ({ currentRange, sourceData }) => {
  const [top1, setTop1] = useState<RecordItem>({}); //图表数据
  const columns = [
    {
      key: 'lrbbxm',
      dataIndex: 'lrbbxm',
      title: '利润表报表项目',
      ellipsis: true,
      // width: 100,
    },
    { key: 'bqje', dataIndex: 'bqje', title: '本期金额', ellipsis: true },
    { key: 'qntq', dataIndex: 'qntq', title: '去年同期', ellipsis: true },
    { key: 'tqdb', dataIndex: 'tqdb', title: '同期对比%', ellipsis: true },
    { key: 'bqxmzb', dataIndex: 'bqxmzb', title: '本期项目占比%', ellipsis: true },
  ];
  const columns1 = [
    {
      key: 'xmmc',
      dataIndex: 'lrbbxm',
      title: '项目名称',
      ellipsis: true,
      // width: 100,
    },
    { key: 'bq', dataIndex: 'bq', title: '本期', ellipsis: true },
    { key: 'qntq', dataIndex: 'qntq', title: '去年同期', ellipsis: true },
    { key: 'tqdb', dataIndex: 'tqdb', title: '同期对比%', ellipsis: true },
  ];
  useEffect(() => {
    const yearsArray = [];
    for (let i = currentRange[0] as any; i <= currentRange[1]; i++) {
      yearsArray.push(String(i));
    }
    // 财务指标
    const ml = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const hxlr = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    const yylr = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const lrze = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    const jlr = yearsArray.map((item) => sourceData.A11[item]?.A1?.value || 0);
    setTop1({
      ml,
      hxlr,
      yylr,
      lrze,
      jlr,
      xAxisData: yearsArray,
    });
  }, [currentRange, sourceData.A11, sourceData.A2, sourceData.A9]);
  return (
    <div className={Styles.container}>
      <div className={Styles.left}>
        <div className={Styles.title}>利润表</div>
        <Table
          // page={currentPage}
          // limit={searchValue.limit}
          // list={schoolMembers}
          // total={returnCount}
          // onChange={handlePageChange}
          columns={columns}
          size="small"
          rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
          // scroll={{ y: 430 }}
        />
      </div>
      <div className={Styles.right}>
        <div className={Styles.top}>
          <div className={Styles.title}>利润表主要报表项目</div>{' '}
          <Table
            columns={columns1}
            size="small"
            rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            // scroll={{ y: 430 }}
          />
        </div>
        <div className={Styles.bottom}>
          {/* <div className={Styles.title}>利润项目趋势整体分析</div> */}
          <BarLine
            title="利润项目趋势整体分析"
            xAxisData={top1.xAxisData || []}
            left="15%"
            unit=""
            id="renjunkezhipeishouru"
            legendData={['毛利', '核心利润', '营业利润', '利润总额', '净利润']}
            seriesData={[
              {
                name: '毛利',
                type: 'line',
                symbolSize: 0, // 隐藏圆点
                data: top1.ml || [],
                smooth: true, // 设置平滑
                areaStyle: {},
              },
              {
                name: '核心利润',
                type: 'line',
                symbolSize: 0, // 隐藏圆点
                data: top1.hxlr || [],
                smooth: true, // 设置平滑
                areaStyle: {},
              },
              {
                name: '营业利润',
                type: 'line',
                symbolSize: 0, // 隐藏圆点
                data: top1.yylr || [],
                smooth: true, // 设置平滑
                areaStyle: {},
              },
              {
                name: '利润总额',
                type: 'line',
                symbolSize: 0, // 隐藏圆点
                data: top1.lrze || [],
                smooth: true, // 设置平滑
                areaStyle: {},
              },
              {
                name: '净利润',
                type: 'line',
                symbolSize: 0, // 隐藏圆点
                data: top1.jlr || [],
                smooth: true, // 设置平滑
                areaStyle: {},
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
export default Container;
