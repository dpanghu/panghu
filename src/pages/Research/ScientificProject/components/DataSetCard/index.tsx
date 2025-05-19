import React from 'react';
import styles from './index.less';
import dayjs from 'dayjs';
import { Checkbox, Tooltip } from 'antd';
interface TProps {
  dataSetData: RecordItem;
  isPreview?: boolean;
  checked?: boolean;
  isEdit?: any;
  onClick?: (chooseId: string) => void;
}

const Container: React.FC<TProps> = ({ dataSetData, isEdit, onClick, isPreview, checked }) => {
  return (
    <div
      className={styles.container}
      onClick={() => {
        onClick && onClick(dataSetData.id);
      }}
    >
      {!isPreview && <Checkbox checked={checked} className={styles.checkbox} />}
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.name} title={dataSetData?.name}>
            {dataSetData?.name}
          </span>
          {!!dataSetData?.isPropers && <span className={styles.mark}>推荐</span>}
        </div>
        {isEdit ? (
          <div className={styles.tag}>
            <Tooltip
              title={(dataSetData?.tagList || []).map((ele: RecordItem) => (
                <span key={ele.code} className={styles.span}>
                  {ele.name}
                </span>
              ))}
              overlayClassName={styles.tooltip}
            >
              <div className={styles.tagsel}>
                {(dataSetData?.tagList || []).map((ele: RecordItem) => (
                  <span key={ele.code}>{ele.name}</span>
                ))}
              </div>
            </Tooltip>
          </div>
        ) : (
          <div className={styles.tag}>
            <Tooltip
              title={[
                ...JSON.parse(dataSetData.domainLabel || '[]').flat(),
                ...JSON.parse(dataSetData.industryLabel || '[]').flat(),
              ].map((ele: RecordItem) => (
                <span key={ele.code} className={styles.span}>
                  {ele.name}
                </span>
              ))}
              overlayClassName={styles.tooltip}
            >
              <div className={styles.tagsel}>
                {[
                  ...JSON.parse(dataSetData.domainLabel || '[]').flat(),
                  ...JSON.parse(dataSetData.industryLabel || '[]').flat(),
                ].map((ele: RecordItem) => (
                  <span key={ele.code}>{ele.name}</span>
                ))}
              </div>
            </Tooltip>
          </div>
        )}
        <p className={styles.desc} title={dataSetData?.datasetDesc}>
          {dataSetData?.datasetDesc}
        </p>
      </div>
      <div className={styles.footer}>
        <div className={styles.detail}>
          <span>使用平台: </span>
          <span>YonBIP 3</span>
        </div>
        <div className={styles.detail}>
          <span>发布时间: </span>
          <span>{dayjs(Number(dataSetData?.modifyTime)).format('YYYY.MM.DD')}</span>
        </div>
        <div className={styles.detail}>
          <span>发布来源: </span>
          <span>
            {!!dataSetData?.referenceDatasets &&
              JSON.parse(dataSetData?.referenceDatasets || '[]')?.[0]?.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Container;
