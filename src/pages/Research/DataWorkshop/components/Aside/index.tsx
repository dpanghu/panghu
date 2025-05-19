import React, { useEffect, useState } from 'react';
import styles from './index.less';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import shujvgongfang from '@/assets/images/reSearch/workShop/shujvgongfang.png';
import chanyefenxi from '@/assets/images/reSearch/workShop/chanyefenxi.png';
import caiwufenxi from '@/assets/images/reSearch/workShop/caiwufenxi.png';
import renlifenxi from '@/assets/images/reSearch/workShop/shujvgongfang.png';
import yingxiaofenxi from '@/assets/images/reSearch/workShop/yingxiaofenxi.png';
import shujvgongfang_active from '@/assets/images/reSearch/workShop/shujvgongfang_active.png';
import caiwufenxi_active from '@/assets/images/reSearch/workShop/caiwufenxi_active.png';
import qiyeData from '@/assets/images/核收记录.png';
import qiyeData_active from '@/assets/images/核收记录Select.png';
import openData from '@/assets/images/营销分析.png';
import openData_active from '@/assets/images/营销分析Select.png';
import dataWajue from '@/assets/images/数据挖掘.png';
import dataWajue_active from '@/assets/images/数据挖掘Select.png';
import qiyeWajue from '@/assets/images/企业经营健康监测.png';
import qiyeWajue_active from '@/assets/images/企业健康Select.png';
import { history } from 'umi';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[] | string,
  type?: 'group',
  disabled?: boolean,
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
    type,
    disabled,
  } as MenuItem;
}

const Container: React.FC = () => {
  const [openKeys, setOpenKeys] = useState(['', 't6', 't1']); //t1
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['macroStatistics']);

  const items: MenuItem[] = [
    getItem(
      '公开数据统计分析',
      't6',
      <img
        src={selectedKeys[0].includes('t6') ? openData_active : openData}
        alt=""
        style={{ width: 18 }}
      />,
      [
        getItem(
          '宏观统计',
          't1',
          <img
            src={selectedKeys[0].includes('t1') ? shujvgongfang_active : shujvgongfang}
            alt=""
            style={{ width: 18 }}
          />,
          [
            getItem('宏观统计', 't6_t1_macroStatistics', null),
            getItem('财政分析', 't6_t1_fiscalAnalysis', null),
            getItem('金融分析', 't6_t1_financialAnalysis', null),
            getItem('碳中和', 't6_t1_carbonNeutral', null),
          ],
        ),
        getItem(
          '产业分析',
          't2',
          <img
            src={selectedKeys[0].includes('t2') ? shujvgongfang_active : chanyefenxi}
            alt=""
            style={{ width: 18 }}
          />,
          [
            getItem('产业集群', 't6_t2_industrialClusters', null),
            getItem('行业发展', 't6_t2_industryDevelopment', null),
            getItem('勒纳指数', 't6_t2_financialAnalysis', null),
            getItem(
              '现代农业',
              't3',
              null,
              [
                getItem('农业贸易分析', 't6t2t3modernAgriculture', null),
                getItem('农业生产分析', 't6t2t3productionAnalysis', null),
              ],
              // 'group',
            ),
          ],
        ),
        getItem(
          '财务分析',
          't4',
          <img
            src={selectedKeys[0].includes('t4') ? caiwufenxi_active : caiwufenxi}
            alt=""
            style={{ width: 18 }}
          />,
          [
            getItem(
              '财务报表分析',
              'l1',
              null,
              [
                getItem('资产负债表', 't4l1m1productionAnalysis', null, undefined),
                getItem('资产负债表变化', 't4l1m2profitAbility', null),
                getItem('偿债能力', 't4l1m2debtPaying', null),
                getItem('营运能力', 't4l1m3operatingAbility', null),
                getItem('发展能力', 't4l1m4developAbility', null),
                getItem('财务指标分析', 't4l1m5FinancialIndexAnalysis', null),
                getItem('杜邦分析', 't4l1m6duPontAnalytics', null),
                getItem('利润表分析', 't4l1m7IncomeStatementAnalysis', null),
                getItem('利润表分析2', 't4l1m8IncomeStatementAnalysisHori', null),
                getItem('利润表分析3', 't4l1m9IncomeStatementAnalysisStru', null),
                getItem('穿透式财报分析', 't4l1o1PenetratingFinancialAnalysis', null),
                getItem('穿透式财报分析2', 't4l1o2PenetratingFinancialAnalysisSection', null),
                getItem('股票分析', 't4l1o3financialReportsAnalysis', null),
              ],
              undefined,
              true,
            ),
            getItem(
              '证券交易分析',
              'l2',
              null,
              [
                getItem('股票交易分析', 't6_t4_financialTradeAnalysis', null),
                getItem('股票投资分析', 't6_t4_financialReportsAnalysis', null),
              ],
              // 'group',
            ),
          ],
          // undefined,
          // true,
        ),
        getItem(
          '人力分析',
          't5',
          <img
            src={selectedKeys[0].includes('t41') ? shujvgongfang_active : renlifenxi}
            alt=""
            style={{ width: 18 }}
          />,
          [],
          undefined,
          true,
        ),
        getItem(
          '营销分析',
          '_t5',
          <img
            src={openKeys.includes('t51') ? shujvgongfang_active : yingxiaofenxi}
            alt=""
            style={{ width: 18 }}
          />,
          [],
          undefined,
          true,
        ),
      ],
    ),
    getItem(
      '行业对标数据统计',
      't7',
      <img
        src={selectedKeys[0].includes('t7') ? qiyeData_active : qiyeData}
        alt=""
        style={{ width: 18 }}
      />,
      [
        getItem('指标组管理', 't7_b1_indicatorGroup', null),
        getItem('范围组管理', 't7_b1_rangeGroup', null),
        getItem('行业对标', 't7_b1_benchmarking', null),
        getItem('对标记录', 't7_b1_compareSummary', null),
      ],
    ),
    getItem(
      '企业经营健康诊断',
      't8',
      <img
        src={selectedKeys[0].includes('t8') ? qiyeWajue_active : qiyeWajue}
        alt=""
        style={{ width: 18 }}
      />,
      [
        getItem('公开上市企业诊断', 't8_r1_publicReport', null),
        getItem('自定义企业诊断申请', 't8_r1_reportApply', null),
        getItem('诊断报告记录', 't8_r1_reportRecord', null),
      ],
    ),
    getItem(
      '数据挖掘（简易版）',
      't9_n1_datamining',
      <img
        src={selectedKeys[0].includes('t9') ? dataWajue_active : dataWajue}
        alt=""
        style={{ width: 18 }}
      />,
      // 't9_n1_datamining',
      // [getItem('诊断申请记录', , null)],
      // 'group',
      // true,
    ),
  ];

  const onOpenChange: MenuProps['onOpenChange'] = (keys: any) => {
    console.log('keys', keys);
    // const arr = ['t1','t2']
    // if (keys.length) {
    setOpenKeys(keys);
    // } else {
    //   message.warning('功能开发中，敬请期待~');
    //   return;
    // }
  };

  const onSelect: MenuProps['onSelect'] = ({ selectedKeys: select }) => {
    console.log(select, select.slice(6));
    // if (select[0]?.substring(0, 1) === '_') {
    //   message.warning('功能开发中，敬请期待~');
    //   return;
    // }
    // return;
    sessionStorage.setItem('selectKeys', select as any);
    setSelectedKeys(select);
    history.push(`/dataWorkshop/${select[0].slice(6)}`);
  };

  useEffect(() => {
    if (sessionStorage.getItem('selectKeys')) {
      setSelectedKeys(sessionStorage.getItem('selectKeys') as any);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>数据工坊</div>
      <Menu
        mode="inline"
        openKeys={openKeys}
        // defaultOpenKeys={['t6']}
        selectedKeys={selectedKeys}
        onOpenChange={onOpenChange}
        style={{ width: 214, border: 'none' }}
        onSelect={onSelect}
        items={items}
      />
    </div>
  );
};

export default Container;
