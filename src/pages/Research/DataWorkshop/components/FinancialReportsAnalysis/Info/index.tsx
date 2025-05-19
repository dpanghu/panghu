import React from 'react';
import styles from './index.less';

interface TProps {
  currentRange: [string, string];
  sourceData: RecordItem;
}

const Container: React.FC<TProps> = ({ currentRange }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>股票投资统计数据工坊</div>
      <div className={styles.content}>
        {currentRange[1]}
        年，全国居民人均可支配收入{0}
        元，同比增长{0}
        %；货物进口总额{0}
        亿元，同比增长10.29%亿元；贸易顺差{0}
        亿元，同比扩大34.31%。从主要经济领域看，第一产业增加值
        {0}
        亿元，同比增长7.30%；第二产业增加值 {0}
        亿元，同比增长39.90%；第三产业增加值 {0}
        亿元，同比增长52.80%；社会消费品零售总额{0}
        亿元，同比增-0.25%。从主要投资领域来看，固定资产投资（不含农户）
        {0}亿元，同比增长
        {0}%。
      </div>
    </div>
  );
};

export default Container;
