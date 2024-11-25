import React from 'react';
import { useMount, useReactive } from 'ahooks';
import styles from './index.less';
import { useOutlet } from '@umijs/max';
interface TState {
  layoutData: any;
  currentLayout: any;
  page: any;
  limit: any;
}
const App: React.FC = () => {
  const outlet = useOutlet();
  const state = useReactive<TState>({
    page: 1,
    limit: 10,
    layoutData: [
      {
        name: '应用管理',
        id: '1',
      },
      {
        name: '知识库',
        id: '2',
      },
      {
        name: '团队管理',
        id: '3',
      },
      {
        name: '数据统计',
        id: '4',
      }
    ],
    currentLayout: '1'
  });

  useMount(() => {
  })

  return (
    <div className={styles.container} >
      1
    </div>
  );
};

export default App;
