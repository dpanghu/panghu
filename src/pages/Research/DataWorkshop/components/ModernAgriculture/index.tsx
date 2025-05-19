import React, { useState } from 'react';
import styles from './index.less';
import { DatePicker, message } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import Chats from './Chats';
import { useMount } from 'ahooks';
import { cloneDeep } from 'lodash-es';
import { baseList, baseYearGet } from '@/services/workshopBase';

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

const ModernAgriculture: React.FC<TProps> = () => {
  const [currentRange, setCurrentRange] = useState<any>([]);
  const [segmentValue, setSegmentValue] = useState<string>('year');
  const [currentList, setCurrentList] = useState<RecordItem>({});
  const [checkList, setCheckList] = useState<RecordItem[] | any>('');
  const [yearList, setYearList] = useState<RecordItem | any>([]);
  const [typeList, setTypeList] = useState<RecordItem | any>([]);

  const getYearList = () => {
    baseYearGet({
      menuCode: 'M_4_3',
    }).then((r: any) => {
      setYearList([r.startYear, r.endYear]);
      setCurrentRange([r.startYear, r.endYear]);
      baseList({
        menuCode: 'M_4_3',
        startYear: r.startYear,
        endYear: r.endYear,
      }).then((res) => {
        setCurrentList(cloneDeep(res));
        setCheckList(cloneDeep(res)?.typeList[0]);
        setTypeList(cloneDeep(res)?.typeList);
      });
    });
  };

  const getBaseList = (date1: any, date2: any) => {
    baseList({
      menuCode: 'M_4_3',
      startYear: date1,
      endYear: date2,
    }).then((res) => {
      setCurrentList(cloneDeep(res));
    });
  };

  console.log('currentRange', currentRange, currentList, checkList);

  const disabledDate = (current: any) => {
    // console.log('current', current, yearList[0]);
    return current && (current < new Date(yearList[0]) || current > new Date(yearList[1]));
  };

  useMount(() => {
    getYearList();
  });

  return (
    <div style={{ padding: '20px 24px' }}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.title}>农业贸易分析</div>
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
              }}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.detail}>
            <div>农产品产量 (万吨)</div>
            <div className={styles?.rateFont}>{currentList.titelMap?.output || 0}</div>
            <div>
              上年: {Number(currentList.titelMap?.butOneOutput || 0).toFixed(2)} （
              {currentList.titelMap?.growthRate || 0}%）
            </div>
          </div>
          <div className={styles.detail}>
            <div>进口量 (万吨)</div>
            <div className={styles?.rateFont}>{currentList.titelMap?.importVolume || 0}</div>
            <div>
              上年: {Number(currentList.titelMap?.butOneImportVolume || 0).toFixed(2)} （
              {currentList.titelMap?.importVolumeRate || 0}%）
            </div>
          </div>
          <div className={styles.detail}>
            <div>出口量 (万吨)</div>
            <div className={styles?.rateFont}>{currentList.titelMap?.exportVolume || 0}</div>
            <div>
              上年: {Number(currentList.titelMap?.butOneExportVolume || 0).toFixed(2)} （
              {currentList.titelMap?.exportVolumeRate || 0}%）
            </div>
          </div>
        </div>
      </div>
      {/* <Info currentRange={currentRange} sourceData={{}} /> */}
      <Chats
        typeList={typeList || []}
        setTypeList={setTypeList}
        checkList={checkList}
        setCheckList={setCheckList}
        currentList={currentList}
        searchList={cloneDeep(currentList)?.typeList}
      />
    </div>
  );
};

export default ModernAgriculture;
