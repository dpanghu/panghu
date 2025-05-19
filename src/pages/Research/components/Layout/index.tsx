import type { ReactNode } from 'react';
import React from 'react';
import styles from './index.less';

interface TProps {
  children?: ReactNode;
}

const Container: React.FC<TProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Container;
