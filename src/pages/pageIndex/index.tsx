import React from 'react';
import { useReactive } from 'ahooks';
import styles from './index.less';
interface TState {}
const Indexs: React.FC = () => {
  const state = useReactive<TState>({});
  return (
    <div className={styles.container}>
        自定义内容
    </div>
  );
}
export default Indexs;