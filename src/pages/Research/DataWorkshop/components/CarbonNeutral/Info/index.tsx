import React from 'react';
import styles from './index.less';

interface TProps {
  currentRange: [string, string];
  sourceData: RecordItem;
}

const Container: React.FC<TProps> = ({}) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>碳中和统计智能分析</div>
      <div className={styles.content}>
        2023 年，从碳排放方向看，全国碳排放总量 10523.5 吨，同比增长
        3.70%；全国碳市场碳排放配额（CEA）总成交量 50,889,493 吨，总成交额2，814,004,694.28
        元。挂牌协议年成交量 6,218,972 吨，年成交额357,855,798.67元，最高成交价 61.60
        元/吨，本年度最后一个交易日收盘价为 55.00 元/吨，较上年度最后一个交易日上涨
        1.44%。大宗协议年成交量 44,670,521 吨，年成交额2，456,148,895.61
        元。截止今年，全国碳市场碳排放配额（CEA）累计成交量......
      </div>
    </div>
  );
};

export default Container;
