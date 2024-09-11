import emptyPng from '@/assets/images/aiAtlas/empty.png';
import React from 'react';
import styles from './index.less';

type Props = { emptyMessage: string };
const Empty: React.FC<Props> = ({ emptyMessage }) => {
  return (
    <div className={styles['container']}>
      <img src={emptyPng} />
      <span>{emptyMessage}</span>
    </div>
  );
};

export default Empty;
