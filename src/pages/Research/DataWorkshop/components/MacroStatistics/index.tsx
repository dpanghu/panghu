import React, { useState } from 'react';
import Header from './components/Header';
import Info from './components/Info';
import PanelContainer from './components/PanelContainer';
import data from '../../mock.json';

const MacroStatistics: React.FC = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() - 1;
  const tenYearsAgo = currentYear - 10;

  const [dataSource] = useState<RecordItem>(data);
  const [currentRange, setCurrentRange] = useState<[string, string]>([
    String(tenYearsAgo),
    String(currentYear),
  ]);

  const getDate = (start: string, end: string) => {
    setCurrentRange([start, end]);
  };

  return (
    <div style={{ padding: '20px 24px' }}>
      <Header sourceData={dataSource.A0} getDate={getDate} />
      <Info currentRange={currentRange} sourceData={dataSource} />
      <PanelContainer currentRange={currentRange} sourceData={dataSource} />
    </div>
  );
};

export default MacroStatistics;
