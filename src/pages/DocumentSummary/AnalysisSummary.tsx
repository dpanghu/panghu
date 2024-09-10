import FilePreview from '@/components/FilePreview';
import MindMap from '@/components/MindMap';
import { useReactive } from 'ahooks';
import React, { useEffect } from 'react';
import AnalysisResult from './AnalysisResult';
import styles from './AnalysisSummary.less';

interface TProps {
  summaryData: RecordItem;
  baseActiveKey: string;
  getActiveTabKey: (key: string) => void;
  getMindGraph: (graph: any) => void;
}

const AnalysisSummary: React.FC<TProps> = ({
  summaryData,
  getActiveTabKey,
  getMindGraph,
  baseActiveKey,
}) => {
  const state = useReactive<any>({
    mindData: {},
    fullscreen: false,
    isExitFullscreen: false,
  });

  const formatData = () => {
    const data = JSON.parse(summaryData?.mindMap || '{}');
    if (data?.length) {
      state.mindData = {
        name: '文档总结',
        children: data,
      };
    } else {
      state.mindData = data;
    }
  };

  const handleFullscreen = (visible: boolean) => {
    state.fullscreen = visible;
    state.isExitFullscreen = true;
  };

  useEffect(() => {
    formatData();
  }, [summaryData]);

  return (
    <div className={styles.AnalysisSummaryContainer}>
      {state.fullscreen ? (
        <MindMap
          dataSource={state.mindData}
          getMindGraph={getMindGraph}
          isFullscreen={state.fullscreen}
          changeFullscreen={handleFullscreen}
          attachmentName={summaryData.attachmentName}
          attachmentSuffixname={summaryData.attachmentSuffixname}
        />
      ) : (
        <>
          <div className={styles.fileContent}>
            <FilePreview
              learnUrl={summaryData.ossViewUrl}
              materialId={summaryData.materialId}
              fileName={summaryData.attachmentName}
            />
          </div>
          <div className={styles.AIcontent}>
            <AnalysisResult
              baseActiveKey={baseActiveKey}
              summaryData={summaryData}
              getActiveTabKey={getActiveTabKey}
              getMindGraph={getMindGraph}
              isFullscreen={state.fullscreen}
              changeFullscreen={handleFullscreen}
              isExitFullscreen={state.isExitFullscreen}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisSummary;
