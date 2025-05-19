import React, { useState } from 'react';
import styles from './index.less';
import SelectQuery from './components/SelectQuery';
import data from '../../../../mock.json';
import SelectSection from './components/SelectSection';

const Container: React.FC = () => {
  const [dataSource] = useState<RecordItem>(data);
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>
          <img></img>
        </span>
        板块信息选择
      </div>
      <div className={styles.top}>
        <div className={styles.left}>
          <SelectQuery sourceData={dataSource} />
          <SelectQuery sourceData={dataSource} />
          <SelectQuery sourceData={dataSource} />
          <SelectQuery sourceData={dataSource} />
        </div>
        <div className={styles.right}>
          <SelectSection />
          <SelectSection />
          <SelectSection />
          <SelectSection />
          <SelectSection />
        </div>
      </div>
      <div className={styles.middle}>
        <div className={styles.left}>
          <SelectQuery sourceData={dataSource} />
        </div>
        <div className={styles.right}></div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.infoTitle}>{'//所选板块信息//'}</div>
        <div className={styles.content}>
          <div className={styles.info}>
            <span>证监会行业分类</span>
            <span>保险业</span>
          </div>
          <div className={styles.info}>
            <span>证监会行业分类</span>
            <span>保险业</span>
          </div>
          <div className={styles.info}>
            <span>证监会行业分类</span>
            <span>保险业</span>
          </div>
          <div className={styles.info}>
            <span>证监会行业分类</span>
            <span>保险业</span>
          </div>
          <div className={styles.info}>
            <span>证监会行业分类</span>
            <span>保险业</span>
          </div>
          <div className={styles.info}>
            <span>证监会行业分类</span>
            <span>保险业</span>
          </div>
          <div className={styles.info}>
            <span>证监会行业分类</span>
            <span>保险业</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
