import React from 'react';
import styles from './index.less';

interface TProps {
  currentRange: [string, string];
  sourceData: RecordItem;
}

const Container: React.FC<TProps> = ({ currentRange, sourceData }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>宏观统计智能分析</div>
      <div className={styles.content}>
        {currentRange[1]}
        年，全国居民人均可支配收入{sourceData.A2[currentRange[1]]?.A1?.value || 0}
        元，同比增长{sourceData.A2[currentRange[1]]?.A2?.value || 0}
        %；货物进口总额{sourceData.A5[currentRange[1]]?.A3?.value || 0}
        亿元，同比增长10.29%亿元；贸易顺差{sourceData.A5[currentRange[1]]?.A5?.value || 0}
        亿元，同比扩大34.31%。从主要经济领域看，第一产业增加值
        {sourceData.A7[currentRange[1]]?.A3?.value || 0}
        亿元，同比增长7.30%；第二产业增加值 {sourceData.A7[currentRange[1]]?.A4?.value || 0}
        亿元，同比增长39.90%；第三产业增加值 {sourceData.A7[currentRange[1]]?.A5?.value || 0}
        亿元，同比增长52.80%；社会消费品零售总额{sourceData.A10[currentRange[1]]?.A1?.value || 0}
        亿元，同比增-0.25%。从主要投资领域来看，固定资产投资（不含农户）
        {sourceData.A13[currentRange[1]]?.A3?.value || 0}亿元，同比增长
        {sourceData.A13[currentRange[1]]?.A4?.value || 0}%。
      </div>
    </div>
  );
};

export default Container;
