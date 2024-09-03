import FilePreview from '@/components/FilePreview';
import React from 'react';
import AnalysisResult from './AnalysisResult';
import styles from './AnalysisSummary.less';

interface TProps {
  summaryData: RecordItem;
  getActiveTabKey: (key: string) => void;
  getMindGraph: (graph: any) => void;
}

const AnalysisSummary: React.FC<TProps> = ({
  summaryData,
  getActiveTabKey,
  getMindGraph,
}) => {
  return (
    <div className={styles.AnalysisSummaryContainer}>
      <div className={styles.fileContent}>
        <FilePreview
          learnUrl={summaryData.ossViewUrl}
          materialId={summaryData.materialId}
          fileName={summaryData.attachmentName}
        />
      </div>
      <div className={styles.AIcontent}>
        <AnalysisResult
          summaryData={summaryData}
          getActiveTabKey={getActiveTabKey}
          getMindGraph={getMindGraph}
        />
      </div>
    </div>
  );
};

export default AnalysisSummary;
