import React from 'react';
import styles from './index.less';

const Container: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.title}>穿透式财报分析</div>
        <div className={styles.content}>
          Visual Data Center-Penetrating Financial Reporting Analysis©2023 Yueke Education
          Technology Co., Ltd.
        </div>
      </div>
      <div className={styles.right}></div>
    </div>
  );
};

export default Container;
