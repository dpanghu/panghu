import FilePreview from '@/components/FilePreview';
import React from 'react';
import AnalysisResult from './AnalysisResult';
import styles from './AnalysisSummary.less';

interface TProps {
  summaryData: RecordItem;
}

const AnalysisSummary: React.FC<TProps> = ({ summaryData }) => {
  return (
    <div className={styles.AnalysisSummaryContainer}>
      <div className={styles.fileContent}>
        <FilePreview
          learnUrl={
            'https://oss-public.seentao.com/webapps/canvas/index.html?file=https://dbe3-public.oss-cn-beijing.aliyuncs.com/yozo/output/2024/08/28/MjQwODI4NDIyODU2MDM5/index.json'
          }
          materialId={'925928795930828800'}
          fileName="附件：Gitlab配置开启双因子快速指南.docx"
        />
      </div>
      <div className={styles.AIcontent}>
        <AnalysisResult summaryData={summaryData} />
      </div>
    </div>
  );
};

export default AnalysisSummary;
