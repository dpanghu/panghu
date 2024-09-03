import MindMap from '@/components/MindMap/index1';
import { useReactive } from 'ahooks';
import { Tabs } from 'antd';
import React from 'react';
import styles from './AnalysisResult.less';
import Markdown from './Mind';

interface TProps {
  summaryData: RecordItem;
  getActiveTabKey: (key: string) => void;
  getMindGraph: (graph: any) => void;
}

const AnalysisResult: React.FC<TProps> = ({
  summaryData,
  getActiveTabKey,
  getMindGraph,
}) => {
  const state = useReactive({
    activeKey: '1',
  });

  const onChange = (key: string) => {
    state.activeKey = key;
    getActiveTabKey(key);
  };

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
            dataSource={JSON.parse(summaryData?.mindMap || '{}')}
            getMindGraph={getMindGraph}
          />
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
