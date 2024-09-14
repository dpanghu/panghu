import { getConvertParamId } from '@/services/aiJobHunt';
import { useMount, useReactive } from 'ahooks';
import React from 'react';
import FileUpload from './FileUpload';
import styles from './index.less';

interface TState {
  paramsId: string;
}

const DocumentQA: React.FC = () => {
  const state = useReactive<TState>({
    paramsId: '',
  });

  const getParamId = async () => {
    try {
      const result = await getConvertParamId();
      state.paramsId = result;
    } catch (error) {}
  };

  useMount(() => {
    getParamId();
  });

  return (
    <div className={styles.DocumentQAContainer}>
      <div className={styles.header}></div>
      <div className={styles.main}>
        <div className={styles.content}>
          <FileUpload paramsId={state.paramsId} />
        </div>
      </div>
    </div>
  );
};

export default DocumentQA;
