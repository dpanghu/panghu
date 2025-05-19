import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import BarLine from '../../../Charts/BarLine';

interface TProps {
  currentRange: [string, string];
  sourceData: RecordItem;
}
const Container: React.FC<TProps> = ({ currentRange, sourceData }) => {
  const treeData: TreeDataNode[] = [
    {
      title: '财务增值能力',
      key: '0-0',
      children: [
        {
          title: '权益资本创值率',
          key: '0-0-0',
          children: [],
        },
        {
          title: '市场增加值',
          key: '0-0-1',
          children: [],
        },
      ],
    },
    {
      title: '发展能力',
      key: '0-1',
      children: [
        {
          title: '股东权益增长率',
          key: '0-1-0',
          children: [],
        },
        {
          title: '经营净现金增长率',
          key: '0-1-1',
          children: [],
        },
        {
          title: '净利润增长率',
          key: '0-1-2',
          children: [],
        },
        {
          title: '收入增长率',
          key: '0-1-3',
          children: [],
        },
        {
          title: '营业利润增长率',
          key: '0-1-4',
          children: [],
        },
        {
          title: '资产增长率',
          key: '0-1-5',
          children: [],
        },
      ],
    },
  ];

  const [inputVal, setInputVal] = useState(''); //搜索框内容
  const [top1, setTop1] = useState<RecordItem>({}); //图表数据
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]); // 树选中的key
  // 获取输入框内容
  const onValChange = (e: any) => {
    setInputVal(e.target.value);
  };
  // // 修改图表指标内容
  // const handleGraph = () => {};
  // 获取查询指标
  const getQuery = () => {
    const yearsArray = [];
    for (let i = currentRange[0] as any; i <= currentRange[1]; i++) {
      yearsArray.push(String(i));
    }
    const qyzbczl = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const sczjz = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    const gdqyzzl = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const jyjxjzzl = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    const jlrzzl = yearsArray.map((item) => sourceData.A11[item]?.A1?.value || 0);
    const srzzl = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const yylrzzl = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    const zczzl = yearsArray.map((item) => sourceData.A11[item]?.A1?.value || 0);
    if (inputVal === '发展能力') {
      setTop1({
        gdqyzzl,
        jyjxjzzl,
        jlrzzl,
        srzzl,
        yylrzzl,
        zczzl,
        xAxisData: yearsArray,
      });
    } else if (inputVal.includes('财务增殖能力')) {
      setTop1({
        qyzbczl,
        sczjz,
        xAxisData: yearsArray,
      });
    } else if (inputVal === '财务增殖能力' + '发展能力' || '发展能力' + '财务增殖能力') {
      setTop1({
        qyzbczl,
        sczjz,
        gdqyzzl,
        jyjxjzzl,
        jlrzzl,
        srzzl,
        yylrzzl,
        zczzl,
        xAxisData: yearsArray,
      });
    } else if (inputVal === '权益资本创值率') {
      setTop1({
        qyzbczl,
        xAxisData: yearsArray,
      });
    } else if (inputVal === '市场增加值') {
      setTop1({
        sczjz,
        xAxisData: yearsArray,
      });
    } else if (inputVal === '股东权益增长率') {
      setTop1({
        gdqyzzl,
        xAxisData: yearsArray,
      });
    }
  };
  const onSelect = (keys: any) => {
    setSelectedKeys(keys);
    console.log(keys, selectedKeys);
  };

  useEffect(() => {
    const yearsArray = [];
    for (let i = currentRange[0] as any; i <= currentRange[1]; i++) {
      yearsArray.push(String(i));
    }
    // 财务指标
    const qyzbczl = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const sczjz = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    const gdqyzzl = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const jyjxjzzl = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    const jlrzzl = yearsArray.map((item) => sourceData.A11[item]?.A1?.value || 0);
    const srzzl = yearsArray.map((item) => sourceData.A2[item]?.A1?.value || 0);
    const yylrzzl = yearsArray.map((item) => sourceData.A9[item]?.A1?.value || 0);
    const zczzl = yearsArray.map((item) => sourceData.A11[item]?.A1?.value || 0);
    setTop1({
      qyzbczl,
      sczjz,
      gdqyzzl,
      jyjxjzzl,
      jlrzzl,
      srzzl,
      yylrzzl,
      zczzl,
      xAxisData: yearsArray,
    });
  }, [currentRange, sourceData.A11, sourceData.A2, sourceData.A9]);
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.top}>
          <Input
            placeholder="指标类型/财务指标名称搜索"
            onChange={onValChange}
            value={inputVal}
            className={styles.inputMsg}
            onPressEnter={getQuery}
            suffix={<SearchOutlined onClick={getQuery} />}
          />
        </div>
        <div className={styles.bottom}>
          <Tree
            checkable
            defaultExpandedKeys={['0-0', '0-1']}
            defaultSelectedKeys={['0-0', '0-1']}
            defaultCheckedKeys={['0-0', '0-1']}
            onSelect={onSelect}
            treeData={treeData}
          />
        </div>
      </div>
      <div className={styles.right}>
        <BarLine
          title="财务指标"
          xAxisData={top1.xAxisData || []}
          left="15%"
          unit="元"
          id="renjunkezhipeishouru"
          legendData={[
            '权益资本创值率',
            '市场增加值',
            '股东权益增长率',
            '经营净现金增长率',
            '净利润增长率',
            '收入增长率',
            '营业利润增长率',
            '资产增长率',
          ]}
          seriesData={[
            {
              name: '权益资本创值率',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: top1.qyzbczl || [],
              smooth: true, // 设置平滑
            },
            {
              name: '市场增加值',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: top1.sczjz || [],
              smooth: true, // 设置平滑
            },
            {
              name: '股东权益增长率',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: top1.gdqyzzl || [],
              smooth: true, // 设置平滑
            },
            {
              name: '经营净现金增长率',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: top1.jyjxjzzl || [],
              smooth: true, // 设置平滑
            },
            {
              name: '净利润增长率',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: top1.jlrzzl || [],
              smooth: true, // 设置平滑
            },
            {
              name: '收入增长率',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: top1.srzzl || [],
              smooth: true, // 设置平滑
            },
            {
              name: '营业利润增长率',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: top1.yylrzzl || [],
              smooth: true, // 设置平滑
            },
            {
              name: '资产增长率',
              type: 'line',
              symbolSize: 0, // 隐藏圆点
              data: top1.zczzl || [],
              smooth: true, // 设置平滑
            },
          ]}
        />
      </div>
    </div>
  );
};
export default Container;
