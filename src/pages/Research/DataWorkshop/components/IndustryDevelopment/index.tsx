import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { DatePicker, message } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import Chats from './Chats';

interface TProps {
  sourceData: RecordItem;
  getDate: (start: string, end: string) => void;
}

const { RangePicker } = DatePicker;

const DateTypeMap = [
  { label: '月度', value: 'month', disabled: true },
  { label: '季度', value: 'quarter', disabled: true },
  { label: '年度', value: 'year' },
];

const IndustryDevelopment: React.FC<TProps> = ({ sourceData, getDate }) => {
  const currentYear = 2022;
  const tenYearsAgo = currentYear - 10;
  const [currentRange, setCurrentRange] = useState<[string, string]>([
    String(tenYearsAgo),
    String(currentYear),
  ]);
  const [segmentValue, setSegmentValue] = useState<string>('year');
  const [currentData, setCurrentData] = useState<RecordItem>({
    currentYearData: {},
    lastYearData: {},
  });

  const disabledDate = (current: any) => {
    console.log(sourceData);
    console.log(setCurrentData);
    return (
      current &&
      (current < new Date('1949-01-01') ||
        current > new Date(`${new Date().getFullYear() - 1}-01-01`))
    );
  };

  useEffect(() => {
    // const currentYearData = sourceData[currentRange[1]] || {};
    // const lastYearData = sourceData[Number((currentRange[1] as any) - 1) - 1] || {};
    // setCurrentData({
    //   currentYearData,
    //   lastYearData,
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRange]);

  return (
    <div style={{ padding: '20px 24px' }}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.title}>行业发展</div>
          <div className={styles.action}>
            <div className={styles.dateLabel}>
              {DateTypeMap.map((item) => (
                <div
                  className={classNames(
                    styles.dateItem,
                    item.value === segmentValue && styles.activeItem,
                  )}
                  key={item.value}
                  onClick={() => {
                    if (item.disabled) {
                      message.warning('该维度尚未开放');
                      return;
                    }
                    setSegmentValue(item.value);
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
            <RangePicker
              picker={segmentValue as any}
              disabledDate={disabledDate}
              value={[moment(currentRange[0]), moment(currentRange[1])]}
              onChange={(dates: any, dateStrings: [string, string]) => {
                setCurrentRange(dateStrings);
                getDate(dateStrings[0], dateStrings[1]);
              }}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.detail}>
            <div>初步发展阶段数量</div>
            <div>{currentData.currentYearData?.A1?.value || 0}</div>
            <div>上年: {currentData.lastYearData?.A1?.value || 0}</div>
          </div>
          <div className={styles.detail}>
            <div>快速成长阶段数量</div>
            <div>{currentData.currentYearData?.A2?.value || 0}</div>
            <div>上年: {currentData.lastYearData?.A2?.value || 0}</div>
          </div>
          <div className={styles.detail}>
            <div>成熟发展阶段数量</div>
            <div>{currentData.currentYearData?.A3?.value || 0}</div>
            <div>上年: {currentData.lastYearData?.A3?.value || 0}</div>
          </div>
          <div className={styles.detail}>
            <div>衰退阶段数量</div>
            <div>{currentData.currentYearData?.A3?.value || 0}</div>
            <div>上年: {currentData.lastYearData?.A3?.value || 0}</div>
          </div>
        </div>
      </div>
      <Chats />
    </div>
  );
};

export default IndustryDevelopment;
