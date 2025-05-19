import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { DatePicker, Select } from 'antd';
import moment from 'moment';
interface TProps {
  sourceData: RecordItem;
  getDate: (start: string, end: string) => void;
}
const { RangePicker } = DatePicker;

const Container: React.FC<TProps> = ({ sourceData, getDate }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() - 1;
  const tenYearsAgo = currentYear - 10;

  const [currentRange, setCurrentRange] = useState<[string, string]>([
    String(tenYearsAgo),
    String(currentYear),
  ]);
  // const [segmentValue, setSegmentValue] = useState<string>('year');
  const [currentData, setCurrentData] = useState<RecordItem>({
    currentYearData: {},
    lastYearData: {},
  });

  const disabledDate = (current: any) => {
    return (
      current &&
      (current < new Date('1949-01-01') ||
        current > new Date(`${new Date().getFullYear() - 1}-01-01`))
    );
  };

  useEffect(() => {
    const currentYearData = sourceData[currentRange[1]] || {};
    const lastYearData = sourceData[Number((currentRange[1] as any) - 1) - 1] || {};
    setCurrentData({
      currentYearData,
      lastYearData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRange]);
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.title}>财务指标分析</div>
        <div className={styles.action}>
          <RangePicker
            picker={'year' as any}
            disabledDate={disabledDate}
            value={[moment(currentRange[0]), moment(currentRange[1])]}
            onChange={(dates: any, dateStrings: [string, string]) => {
              setCurrentRange(dateStrings);
              getDate(dateStrings[0], dateStrings[1]);
            }}
          />
          <Select></Select>
          <Select></Select>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.detail}>
          <div className={styles.indexName}>总资产负债率</div>
          <div className={styles.percent}>{currentData.currentYearData?.A1?.value || 0}</div>
          <div className={styles.percent1}>上年: </div>
        </div>
        <div className={styles.detail}>
          <div className={styles.indexName}>销售净利率</div>
          <div className={styles.percent}>{currentData.currentYearData?.A2?.value || 0}</div>
          <div className={styles.percent1}>上年: </div>
        </div>
        <div className={styles.detail}>
          <div className={styles.indexName}>净利润的现金含量</div>
          <div className={styles.percent}>{currentData.currentYearData?.A3?.value || 0}</div>
          <div className={styles.percent1}>上年: </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
