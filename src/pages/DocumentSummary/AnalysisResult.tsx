import MindMap from '@/components/MindMap';
import { useReactive } from 'ahooks';
import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import styles from './AnalysisResult.less';
import CopyButton from './CopyButton';
import Markdown from './Mind';

interface TProps {
  summaryData: RecordItem;
  baseActiveKey: string;
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
  baseActiveKey,
}) => {
  const state = useReactive<any>({
    activeKey: baseActiveKey || '1',
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

  const markdownToPlainText = (markdown: string) => {
    return markdown
      .replace(/#+\s/g, '') // 移除标题
      .replace(/\n/g, ' ') // 移除换行符
      .replace(/\*\*(.*?)\*\*/g, '$1') // 移除加粗标记
      .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
      .replace(/!\[(.*?)\]\((.*?)\)/g, '$1') // 移除图片链接
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // 移除普通链接
      .replace(/`(.*?)`/g, '$1') // 移除代码标记
      .replace(/__(.*?)__/g, '$1') // 移除下划线
      .trim(); // 移除首尾空格
  };

  useEffect(() => {
    formatData();
  }, [summaryData]);

  useEffect(() => {
    state.activeKey = isExitFullscreen ? '2' : '1';
  }, [isExitFullscreen]);
  useEffect(() => {
    formatData();
    state.activeKey = baseActiveKey;
  }, [baseActiveKey]);

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
            label: `思维导图`,
            key: '2',
          },
        ]}
      />
      {state.activeKey === '1' && (
        <CopyButton
          content={markdownToPlainText(summaryData?.summary || '') as string}
          cssStyles={{
            top: 10,
            right: 10,
          }}
        />
      )}
      <div
        className={styles.content}
        style={{ overflowY: state.activeKey === '1' ? 'auto' : 'visible' }}
      >
        {state.activeKey === '1' ? (
          <Markdown content={summaryData?.summary} />
        ) : (
          Object.keys(state.mindData)?.length && (
            <MindMap
              dataSource={state.mindData}
              getMindGraph={getMindGraph}
              isFullscreen={isFullscreen}
              changeFullscreen={changeFullscreen}
              key={summaryData.id}
            />
          )
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
