import React from 'react';
import styles from './index.less';
import SingleDualAxes from './SingleDualAxes';
import { Empty } from 'antd';
import ChatDualAxes from './ChatDualAxes';
import ChatLine from './ChartLine';

interface Props {
  currentList: any;
}

const Chats: React.FC<Props> = (props: Props) => {
  const { currentList } = props;

  console.log('AO1X', currentList);

  return (
    <div>
      <div className={styles?.chatTwo}>
        <div className={styles?.container} style={{ height: '370px' }}>
          <p className={styles?.secondTitle}>上市股票数目</p>
          {(currentList?.A0 && <ChatDualAxes data={currentList?.A0} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '280px' }} />
          )}
        </div>
        <div className={styles?.container} style={{ height: '370px', marginLeft: '18px' }}>
          <p className={styles?.secondTitle}>境内上市公司数</p>
          {/* <ChatColumn data={currentList?.A1} /> */}
          {(currentList?.A1 && <SingleDualAxes data={currentList?.A1} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
      </div>
      <div className={styles?.chatTwo}>
        <div className={styles?.container} style={{ height: '370px' }}>
          <p className={styles?.secondTitle}>股票成交总额</p>
          {/* <SingleDualAxes data={currentList?.A2} /> */}
          {(currentList?.A2 && <SingleDualAxes data={currentList?.A2} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
      </div>
      <div className={styles?.chatTwo}>
        <div className={styles?.container} style={{ height: '370px' }}>
          <p className={styles?.secondTitle}>股票股本与市值</p>
          {(currentList?.A3 && <ChatDualAxes data={currentList?.A3} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '280px' }} />
          )}
        </div>
        <div className={styles?.container} style={{ height: '370px', marginLeft: '18px' }}>
          <p className={styles?.secondTitle}>股票综合指数</p>
          {(currentList?.A4 && <ChatLine data={(currentList && currentList?.A4) || []} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Chats;
