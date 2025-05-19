import React from 'react';
import styles from './index.less';
import SingleDualAxes from './SingleDualAxes';
import ChatColumn from './ChatColumn';
import ChatPreientColumn from './ChatPreientColumn';
import { Empty } from 'antd';

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
          <p className={styles?.secondTitle}>股票发行总量</p>
          {(currentList?.A0 && <SingleDualAxes data={currentList?.A0} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
        <div className={styles?.container} style={{ height: '370px', marginLeft: '18px' }}>
          <p className={styles?.secondTitle}>股票发行量</p>
          {/* <ChatColumn data={currentList?.A1} /> */}
          {(currentList?.A1 && <ChatColumn data={currentList?.A1} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
      </div>
      <div className={styles?.chatTwo}>
        <div className={styles?.container} style={{ height: '370px' }}>
          <p className={styles?.secondTitle}>股票筹资总额</p>
          {/* <SingleDualAxes data={currentList?.A2} /> */}
          {(currentList?.A2 && <SingleDualAxes data={currentList?.A2} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
        <div className={styles?.container} style={{ height: '370px', marginLeft: '18px' }}>
          <p className={styles?.secondTitle}>股票筹资额</p>
          {/* <ChatPreientColumn data={currentList?.A3} /> */}
          {(currentList?.A2 && <ChatPreientColumn data={currentList?.A3} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Chats;
