import MindMap from '@/components/MindMap';
import { useReactive } from 'ahooks';
import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import styles from './AnalysisResult.less';
import Markdown from './Mind';

interface TProps {
  summaryData: RecordItem;
  isFullscreen?: boolean;
  isExitFullscreen?: boolean;
  getActiveTabKey: (key: string) => void;
  getMindGraph: (graph: any) => void;
  changeFullscreen?: (isFullscreen: boolean) => void;
}

const AnalysisResult: React.FC<TProps> = ({
  summaryData,
  getActiveTabKey,
  getMindGraph,
  changeFullscreen,
  isFullscreen,
  isExitFullscreen,
}) => {
  const state = useReactive<any>({
    activeKey: '1',
    mindData: {},
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
  const onChange = (key: string) => {
    state.activeKey = key;
    getActiveTabKey(key);
  };

  useEffect(() => {
    formatData();
  }, [summaryData]);

  useEffect(() => {
    state.activeKey = isExitFullscreen ? '2' : '1';
  }, [isExitFullscreen]);

  return (
    <div className={styles.AnalysisResultContainer}>
      <Tabs
        activeKey={state.activeKey}
        onChange={onChange}
        items={[
          {
            label: `导读`,
            key: '1',
          },
          {
            label: `脑图`,
            key: '2',
          },
        ]}
      />
      <div
        className={styles.content}
        style={{ overflowY: state.activeKey === '1' ? 'auto' : 'visible' }}
      >
        {state.activeKey === '1' ? (
          <Markdown content={summaryData?.summary} />
        ) : (
          <MindMap
            dataSource={state.mindData}
            getMindGraph={getMindGraph}
            isFullscreen={isFullscreen}
            changeFullscreen={changeFullscreen}
            key={summaryData.id}
          />
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
