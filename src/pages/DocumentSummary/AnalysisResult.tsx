import MindMap from '@/components/MindMap';
import { useReactive } from 'ahooks';
import { Tabs } from 'antd';
import React from 'react';
import styles from './AnalysisResult.less';
import Markdown from './Mind';

interface TProps {
  summaryData: RecordItem;
}

const AnalysisResult: React.FC<TProps> = ({ summaryData }) => {
  console.log(summaryData);

  const state = useReactive({
    activeKey: '2',
  });

  const onChange = (key: string) => {
    state.activeKey = key;
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
          <Markdown
            content={
              '# P01:课程介绍和环境搭建\n' +
              '[ **M** ] arkdown + E [ **ditor** ] = **Mditor**  \n' +
              '> Mditor 是一个简洁、易于集成、方便扩展、期望舒服的编写 markdown 的编辑器，仅此而已... \n\n' +
              '**这是加粗的文字**\n\n' +
              '*这是倾斜的文字*`\n\n' +
              '***这是斜体加粗的文字***\n\n' +
              '~~这是加删除线的文字~~ \n\n' +
              '`console.log(111)` \n\n' +
              '# p02:来个Hello World 初始Vue3.0\n' +
              '> aaaaaaaaa\n' +
              '>> bbbbbbbbb\n' +
              '>>> cccccccccc\n' +
              '***\n\n\n' +
              '# p03:Vue3.0基础知识讲解\n' +
              '> aaaaaaaaa\n' +
              '>> bbbbbbbbb\n' +
              '>>> cccccccccc\n\n' +
              '# p04:Vue3.0基础知识讲解\n' +
              '> aaaaaaaaa\n' +
              '>> bbbbbbbbb\n' +
              '>>> cccccccccc\n\n' +
              '#5 p05:Vue3.0基础知识讲解\n' +
              '> aaaaaaaaa\n' +
              '>> bbbbbbbbb\n' +
              '>>> cccccccccc\n\n' +
              '# p06:Vue3.0基础知识讲解\n' +
              '> aaaaaaaaa\n' +
              '>> bbbbbbbbb\n' +
              '>>> cccccccccc\n\n' +
              '# p07:Vue3.0基础知识讲解\n' +
              '> aaaaaaaaa\n' +
              '>> bbbbbbbbb\n' +
              '>>> cccccccccc\n\n' +
              '```var a=11; ```'
            }
          />
        ) : (
          <MindMap dataSource={JSON.parse(summaryData?.mindMap || '{}')} />
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
