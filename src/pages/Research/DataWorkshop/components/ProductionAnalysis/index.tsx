import React, { useState } from 'react';
import { DatePicker, message } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import Chats from './Chats';
import { useMount } from 'ahooks';
import { baseList, baseYearGet } from '@/services/workshopBase';
import { cloneDeep } from 'lodash-es';
import styles from './index.less';

const { RangePicker } = DatePicker;

interface TProps {
  sourceData: RecordItem;
  getDate: (start: string, end: string) => void;
}

const DateTypeMap = [
  { label: '月度', value: 'month', disabled: true },
  { label: '季度', value: 'quarter', disabled: true },
  { label: '年度', value: 'year' },
];

const ProductionAnalysis: React.FC<TProps> = () => {
  const currentYear = 2022;
  const tenYearsAgo = currentYear - 1;
  const [currentRange, setCurrentRange] = useState<[string, string]>([
    String(tenYearsAgo),
    String(currentYear),
  ]);
  const [segmentValue, setSegmentValue] = useState<string>('year');
  const [currentList, setCurrentList] = useState<RecordItem[] | any>([]);
  const [yearList, setYearList] = useState<RecordItem[] | any>([]);
  const [typeList, setTypeList] = useState<RecordItem | any>([]);
  const [checkList, setCheckList] = useState<RecordItem[] | any>('');

  const getYearList = () => {
    baseYearGet({
      menuCode: 'M_4_4',
    }).then((r: any) => {
      setYearList([r.startYear, r.endYear]);
      baseList({
        menuCode: 'M_4_4',
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
      menuCode: 'M_4_4',
      startYear: date1,
      endYear: date2,
    }).then((res) => {
      setCurrentList(cloneDeep(res));
    });
  };

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
          <div className={styles.title}>农业生产分析</div>
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
              value={[moment(currentRange[0]), moment(currentRange[1])]}
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
            <div>农产品产量 (万吨)</div>
            <div>{(currentList?.titelList && currentList?.titelList[0]?.output) || 0}</div>
            <div>
              上年: {(currentList?.titelList && currentList?.titelList[0]?.butOneOutput) || 0}（
              {(currentList?.titelList && currentList?.titelList[0]?.growthRate) || 0}）
            </div>
          </div>
          <div className={styles.detail}>
            <div>农产品生产价格指数</div>
            <div>{(currentList?.titelList && currentList?.titelList[1]?.output) || 0}</div>
            <div>
              上年: {(currentList?.titelList && currentList?.titelList[1]?.butOneOutput) || 0}（
              {(currentList?.titelList && currentList?.titelList[1]?.growthRate) || 0}）
            </div>
          </div>
          <div className={styles.detail}>
            <div>居民消费价格指数</div>
            <div>{(currentList?.titelList && currentList?.titelList[2]?.output) || 0}</div>
            <div>
              上年: {(currentList?.titelList && currentList?.titelList[2]?.butOneOutput) || 0}（
              {(currentList?.titelList && currentList?.titelList[2]?.growthRate) || 0}）
            </div>
          </div>
        </div>
      </div>
      <Chats
        typeList={typeList || []}
        setTypeList={setTypeList}
        checkList={checkList}
        setCheckList={setCheckList}
        currentList={currentList}
        searchList={cloneDeep(currentList)?.A3?.cropType}
      />
    </div>
  );
};

export default ProductionAnalysis;
