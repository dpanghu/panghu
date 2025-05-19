import React, { useState } from 'react';
import styles from './index.less';
import { DatePicker, message } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import Info from './Info';
import Chats from './Chats';
import { baseList, baseYearGet } from '@/services/workshopBase';
import { cloneDeep } from 'lodash-es';
import { useMount } from 'ahooks';

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

const CarbonNeutral: React.FC<TProps> = ({}) => {
  const [currentRange, setCurrentRange] = useState<any>([]);
  const [segmentValue, setSegmentValue] = useState<string>('year');
  const [currentList, setCurrentList] = useState<RecordItem[] | any>([]);
  const [yearList, setYearList] = useState<RecordItem[] | any>([]);

  const getYearList = () => {
    baseYearGet({
      menuCode: 'M_3_4',
    }).then((r: any) => {
      setYearList([r.startYear, r.endYear]);
      baseList({
        menuCode: 'M_3_4',
        startYear: r.startYear,
        endYear: r.endYear,
      }).then((res) => {
        setCurrentList(cloneDeep(res));
        setCurrentRange([r.startYear, r.endYear]);
      });
    });
  };

  const getBaseList = (date1: any, date2: any) => {
    baseList({
      menuCode: 'M_3_4',
      startYear: date1,
      endYear: date2,
    }).then((res) => {
      setCurrentList(cloneDeep(res));
    });
  };

  console.log('currentList', currentList);

  const disabledDate = (current: any) => {
    return current && (current < new Date(yearList[0]) || current > new Date(yearList[1]));
  };

  useMount(() => {
    getYearList();
  });

  return (
    <div style={{ padding: '20px 24px' }}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.title}>碳中和</div>
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
              allowClear={false}
              picker={segmentValue as any}
              disabledDate={disabledDate}
              value={[moment(currentRange[0]) || null, moment(currentRange[1]) || null]}
              onChange={(dates: any, dateStrings: [string, string]) => {
                setCurrentRange(dateStrings);
                getBaseList(dateStrings[0], dateStrings[1]);
                // getDate(dateStrings[0], dateStrings[1]);
              }}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.detail}>
            <div>全国碳排放总量</div>
            <div>{(currentList?.titelMap && currentList?.titelMap[0]?.output) || 0}</div>
            <div>
              上年: {(currentList?.titelMap && currentList?.titelMap[0]?.butOneOutput) || 0} (
              {currentList?.titelMap && currentList?.titelMap[0]?.growthRate})
            </div>
          </div>
          <div className={styles.detail}>
            <div>碳成交量</div>
            <div>{0}</div>
            <div>上年: {0}</div>
          </div>
          <div className={styles.detail}>
            <div>碳交易额</div>
            <div>{0}</div>
            <div>上年: {0}</div>
          </div>
        </div>
      </div>
      <Info currentRange={currentRange} sourceData={{}} />
      <Chats currentList={currentList} />
    </div>
  );
};

export default CarbonNeutral;
