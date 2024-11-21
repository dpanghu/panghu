import TreeGraph from '@/components/TreeGraph';
import { useReactive } from 'ahooks';
import { Tabs } from 'antd';
import { nanoid } from 'nanoid';
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
    activeKey: '1',
    mindData: {},
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
  // useEffect(() => {
  //   formatData();
  //   // state.activeKey = baseActiveKey;
  // }, [baseActiveKey]);

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
        key={summaryData.id}
        className={styles.content}
        style={{ overflowY: state.activeKey === '1' ? 'auto' : 'visible' }}
      >
        {state.activeKey === '1' ? (
          <Markdown content={summaryData?.summary} />
        ) : (
          Object.keys(state.mindData)?.length && (
            <TreeGraph
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
