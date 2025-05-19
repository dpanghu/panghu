import { Empty } from 'antd';
import React from 'react';
import ChartBar from './ChartBar';
import ChatLine from './ChartLine';
import styles from './index.less';
import SingleColumn from './SingleColumn';
import SingleDualAxes from './SingleDualAxes';

interface Props {
  currentList: any;
}
const Chats: React.FC<Props> = (props: Props) => {
  const { currentList } = props;

  return (
    <div>
      <p className={styles?.secondTitle}>碳排放</p>
      <div className={styles?.container} style={{ height: '330px' }}>
        <p className={styles?.secondTitle}>碳排放总量</p>
        <SingleDualAxes data={(currentList && currentList?.A0) || []} />
      </div>
      <div className={styles?.chatTwo}>
        <div className={styles.container} style={{ height: '330px', width: '60%' }}>
          <p className={styles?.secondTitle}>碳排放结构分析</p>
          <ChatLine data={(currentList && currentList?.A1) || []} />
        </div>
        <div className={styles.container} style={{ marginLeft: '12px', height: '330px', flex: 1 }}>
          <p className={styles?.secondTitle}>碳排放省份排名</p>
          {currentList && currentList?.A2 ? (
            <ChartBar data={[]} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
      </div>
      <p className={styles?.secondTitle}>碳交易</p>
      <div className={styles?.chatTwo}>
        <div className={styles.container} style={{ height: '330px' }}>
          <p className={styles?.secondTitle}>碳成交量</p>
          {currentList && currentList?.A3 ? (
            <SingleColumn data={[]} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
        <div className={styles.container} style={{ marginLeft: '12px', height: '330px' }}>
          <p className={styles?.secondTitle}>碳交易额</p>
          {currentList && currentList?.A4 ? (
            <SingleColumn data={[]} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Chats;
