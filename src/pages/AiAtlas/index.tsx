// ai图谱
import React from 'react';
import Loading from './components/Loading';
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
          <header>知识图谱</header>
          <section>
            <Loading loadingMessage="待生成知识图谱" />
          </section>
        </div>
      </section>
    </div>
  );
};

export default AiAtlas;
