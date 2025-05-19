import React from 'react';
import styles from './index.less';
import { Radio, Tooltip } from 'antd';
import { getCoverByIndex } from '@/pages/Research/components/CoverModal';

interface TProps {
  caseData: RecordItem;
  isPreview?: boolean;
  checked?: boolean;
  isEdit?: any;
  onClick?: (chooseId: string) => void;
}

const Container: React.FC<TProps> = ({ caseData, isEdit, checked, onClick, isPreview }) => {
  return (
    <div
      className={styles.container}
      onClick={() => {
        onClick && onClick(caseData.id);
      }}
    >
      <div className={styles.top}>
        <img src={getCoverByIndex(caseData.casesCover)} alt="" draggable={false} />
        {!isPreview && <Radio checked={checked} className={styles.radio} />}
        {isEdit ? (
          <div className={styles.caseTag}>
            <Tooltip
              title={(caseData?.tagList || []).map((ele: RecordItem) => (
                <span key={ele.code} className={styles.span}>
                  {ele.name}
                </span>
              ))}
              overlayClassName={styles.tooltip}
            >
              <div className={styles.tagsel}>
                {(caseData?.tagList || []).map((ele: RecordItem) => (
                  <span key={ele.code}>{ele.name}</span>
                ))}
              </div>
            </Tooltip>
          </div>
        ) : (
          <div className={styles.caseTag}>
            <Tooltip
              title={[
                ...JSON.parse(caseData.pertainDomain || '[]').flat(),
                ...JSON.parse(caseData.involvingTechnology || '[]').flat(),
              ].map((ele: RecordItem) => (
                <span key={ele.code} className={styles.span}>
                  {ele.name}
                </span>
              ))}
              overlayClassName={styles.tooltip}
            >
              <div className={styles.tagsel}>
                {[
                  ...JSON.parse(caseData.pertainDomain || '[]').flat(),
                  ...JSON.parse(caseData.involvingTechnology || '[]').flat(),
                ].map((ele: RecordItem) => (
                  <span key={ele.code}>{ele.name}</span>
                ))}
              </div>
            </Tooltip>
          </div>
        )}
      </div>
      <div className={styles.main}>
        <div className={styles.name}>
          <span title={caseData.casesName}>{caseData.casesName}</span>
          {!!caseData.isPropose && <span className={styles.isProposeMark}>推荐</span>}
        </div>
        <div className={styles.desc} title={caseData.casesDesc}>
          {caseData.casesDesc}
        </div>
        <div className={styles.platform}>
          <span>使用平台: </span>
          <span>YonBIP 3</span>
        </div>
        <div className={styles.case}>
          <span>引用案例: </span>
          <span title={caseData.platformCasesName}>{caseData.platformCasesName}</span>
        </div>
      </div>
    </div>
  );
};

export default Container;
