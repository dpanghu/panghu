import React, { useState } from 'react';
import styles from './index.less';
import Header from './components/Header';
import data from '../../mock.json';
import PanelContainer from './components/PanelContainer';
const Container: React.FC = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() - 1;
  const tenYearsAgo = currentYear - 10;

  const [dataSource] = useState<RecordItem>(data);
  const [, setCurrentRange] = useState<[string, string]>([
    String(tenYearsAgo),
    String(currentYear),
  ]);

  const getDate = (start: string, end: string) => {
    setCurrentRange([start, end]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Header sourceData={dataSource.A0} getDate={getDate} />
        <PanelContainer />
      </div>
    </div>
  );
};
export default Container;
