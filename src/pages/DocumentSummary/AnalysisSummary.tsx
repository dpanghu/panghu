import FilePreview from '@/components/FilePreview';
import TreeGraph from '@/components/TreeGraph';
import { useReactive } from 'ahooks';
import { nanoid } from 'nanoid';
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

  const addProperties = (data: any[], level = 2) => {
    data.forEach((item: any, index) => {
      item.level = level;
      item.id = nanoid();
      item.originId = nanoid();
      item.order = 1 + index;
      if (item.children && item.children.length > 0) {
        addProperties(item.children, level + 1);
      }
    });
  };

  const formatData = () => {
    const match = summaryData?.attachmentName?.replace(/\.[^.]*$/, '');
    const data = JSON.parse(summaryData?.mindMap || '[]');
    if (data?.length && data?.length === 1) {
      state.mindData = {
        ...data[0],
        id: nanoid(),
        originId: nanoid(),
        order: 1,
        level: 1,
      };
    } else if (data?.length && data?.length > 1) {
      state.mindData = {
        name: match,
        children: data,
        id: nanoid(),
        originId: nanoid(),
        order: 1,
        level: 1,
      };
    } else {
      state.mindData = {
        name: match,
        children: [],
        id: nanoid(),
        originId: nanoid(),
        order: 1,
        level: 1,
      };
    }
    addProperties(state.mindData.children);
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
        <TreeGraph
          dataSource={state.mindData}
          getMindGraph={getMindGraph}
          isFullscreen={state.fullscreen}
          changeFullscreen={handleFullscreen}
          key={summaryData.id}
          attachmentName={summaryData.attachmentName}
          attachmentSuffixname={summaryData.attachmentSuffixname}
        />
      ) : (
        // <MindMap
        //   dataSource={state.mindData}
        //   getMindGraph={getMindGraph}
        //   isFullscreen={state.fullscreen}
        //   changeFullscreen={handleFullscreen}
        //   attachmentName={summaryData.attachmentName}
        //   attachmentSuffixname={summaryData.attachmentSuffixname}
        // />
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
