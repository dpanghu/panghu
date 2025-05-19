import React from 'react';
import ChartPie from './ChartPie';
import ChatDualAxes from './ChatDualAxes';
import styles from './index.less';
import SingleDualAxes from './SingleDualAxes';
import { Empty } from 'antd';

interface Props {
  currentList: any;
}

const Chats: React.FC<Props> = (props: Props) => {
  const { currentList } = props;
  const AO1X =
    (currentList?.A1 &&
      currentList?.A1.length > 0 &&
      currentList?.A1.map((item: RecordItem) => Number(item.year))) ||
    [];
  console.log('AO1X,AO1X', AO1X);

  return (
    <div>
      <p>国家财政收支分析</p>
      <div className={styles?.container} style={{ height: '330px' }}>
        <p>国家财政收支情况</p>
        {(currentList?.A0 && <ChatDualAxes data={currentList?.A0} />) || (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
        )}
      </div>
      <div className={styles?.chatTwo}>
        <div className={styles.container} style={{ height: '400px' }}>
          <p>财政收入结构</p>
          {(currentList?.A1 && <ChatDualAxes data={currentList?.A1} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
        <div className={styles.container} style={{ marginLeft: '12px', height: '400px' }}>
          <p>财政支出结构</p>
          <div>
            {(currentList?.A2 && <ChartPie data={currentList?.A2} />) || (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
            )}
          </div>
        </div>
      </div>
      <div className={styles?.chatTwo}>
        <div className={styles.container} style={{ height: '330px' }}>
          <p>增值税与消费税</p>
          {(currentList?.A3 && <ChatDualAxes data={currentList?.A3} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
        <div className={styles.container} style={{ marginLeft: '12px', height: '330px' }}>
          <p>个人所得税与企业所得税</p>
          {/* <ChatDualAxes data={currentList?.A4} /> */}
          {(currentList?.A4 && <ChatDualAxes data={currentList?.A4} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
      </div>
      <div className={styles?.container} style={{ height: '330px' }}>
        <p>财政赤字</p>
        {/* <SingleDualAxes data={currentList?.A5} /> */}
        {(currentList?.A5 && <SingleDualAxes data={currentList?.A5} />) || (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
        )}
      </div>
    </div>
  );
};
export default Chats;
