import loadingPng from '@/assets/images/aiAtlas/loading.png';
import React from 'react';
import styles from '../Empty/index.less';

type Props = { loadingMessage: string };
const Loading: React.FC<Props> = ({ loadingMessage }) => {
  return (
    <div className={styles['container']}>
      <img src={loadingPng} className={styles['rotate']} />
      <span>{loadingMessage}</span>
    </div>
  );
};

export default Loading;
