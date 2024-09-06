// ai图谱
import React from 'react';
import styles from './index.less';

type Props = {};
const AiAtlas: React.FC<Props> = ({}) => {
  return (
    <div className={styles['container']}>
      <header>AI图谱生成</header>
      <section>
        <div className={styles['area-content']}>
          <div className={styles['area-text-container']}>
            <div></div>
          </div>
        </div>
        <div className={styles['area-atlas-container']}>
          <header></header>
          <section></section>
        </div>
      </section>
    </div>
  );
};

export default AiAtlas;
