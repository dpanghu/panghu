import FilePreview from '@/components/FilePreview';
import React from 'react';
import AnalysisResult from './AnalysisResult';
import styles from './AnalysisSummary.less';

interface TProps {
  summaryData: RecordItem;
}

const AnalysisSummary: React.FC<TProps> = ({ summaryData }) => {
  console.log(summaryData);

  return (
    <div className={styles.AnalysisSummaryContainer}>
      <div className={styles.fileContent}>
        <FilePreview
          learnUrl={
            // 'https://oss-public.seentao.com/webapps/canvas/index.html?file=https://dbe3-public.oss-cn-beijing.aliyuncs.com/yozo/output/2024/08/28/MjQwODI4NDIyODU2MDM5/index.json'
            // 'https://dbe3-public.oss-cn-beijing.aliyuncs.com/bus-runner/1702694505366681/task/1724824319946/教学设计活动-班会.pdf'
            summaryData.ossViewUrl
          }
          materialId={summaryData.materialId}
          fileName={summaryData.attachmentName}
        />
      </div>
      <div className={styles.AIcontent}>
        <AnalysisResult summaryData={summaryData} />
      </div>
    </div>
  );
};

export default AnalysisSummary;
