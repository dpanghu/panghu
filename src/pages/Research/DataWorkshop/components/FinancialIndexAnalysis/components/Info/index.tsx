import React from 'react';
import styles from './index.less';

const Container: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>
          <img></img>
        </span>
        公司多指标对比分析
      </div>
      <div className={styles.content}>
        此区域可进行公司的多指标对比分析。具体操作方法如下：按着C切键的同时，选中要观察的多个财务指标，可对公司内多个指标在同一个页面进行对比分析。此区域可进行公司的多指标对比分析。具体操作方法如下：按着C切键的同时，选中要观察的多个财务指标，可对公司内多个指标在同一个页面进行对比分析。
      </div>
    </div>
  );
};

export default Container;
