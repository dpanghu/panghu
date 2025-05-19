import { Badge, Descriptions, Select } from 'antd';
import React, { useEffect } from 'react';
import ChartOrganizationGraph from './ChartOrganizationGraph';
import * as echarts from 'echarts';
import styles from './index.less';

const Chats: React.FC = () => {
  const getLineTwo = () => {
    const ScoreCharts = echarts.init(document.getElementById('lineTwo') as HTMLDivElement);
    ScoreCharts.setOption({
      grid: {
        x: 30,
        y: 50,
        x2: 30,
        y2: 30,
      },
      title: {
        text: '会计属性',
      },
      // legend: {
      //   data: ['Allocated Budget', 'Actual Spending'],
      // },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: 'Sales', max: 650 },
          { name: 'Admin', max: 560 },
          { name: 'Information', max: 300 },
          { name: 'Customer', max: 380 },
          { name: 'Development', max: 520 },
          { name: 'Marketing', max: 250 },
        ],
      },
      series: [
        {
          name: 'Budget',
          type: 'radar',
          data: [
            {
              value: [120, 300, 200, 350, 100, 180],
              name: 'Allocated',
            },
            {
              value: [50, 100, 280, 260, 120, 210],
              name: 'Actual',
            },
          ],
        },
      ],
    });
  };

  useEffect(() => {
    getLineTwo();
  }, []);

  return (
    <div className={styles?.card}>
      <div className={styles?.enterTitle}>
        <div className={styles?.enterTitleBtn}>公司基本信息</div>
      </div>
      <div className={styles?.cardInfo}>
        <div className={styles?.cardInfoTop}>
          <div className={styles?.cardInfoTopLeft}>
            <Descriptions bordered>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
              <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
              <Descriptions.Item label="Order time">2018-04-24 18:00:00</Descriptions.Item>
              <Descriptions.Item label="Usage Time" span={2}>
                2019-04-24 18:00:00
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={3}>
                <Badge status="processing" text="Running" />
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className={styles?.cardInfoTopRight}>
            {/* <p>会计属性</p> */}
            <div id="lineTwo" style={{ width: '100%', height: '210px' }}></div>
          </div>
        </div>
        <div className={styles?.cardInfoBottom}>
          <p>行业内排名</p>
          <div className={styles?.infoTitle}>
            <div>
              <p>21</p>
              <p>行业内收入排名</p>
            </div>
            <div>
              <p>22</p>
              <p>行业内净利润排名</p>
            </div>
            <div>
              <p>21</p>
              <p>行业内资产排名</p>
            </div>
            <div>
              <p>21</p>
              <p>行业内负债排名</p>
            </div>
            <div>
              <p>21</p>
              <p>行业内权益排名</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles?.enterTitleBtn} style={{ marginTop: '12px' }}>
        公司基本信息
      </div>
      <div className={styles?.infoContent}>
        <div
          className={styles.container}
          style={{ marginLeft: '12px', height: '530px', width: '100%' }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <p>收入分析</p>
            <Select placeholder="一季度报" />
          </div>
          <ChartOrganizationGraph />
        </div>
      </div>
    </div>
  );
};
export default Chats;
