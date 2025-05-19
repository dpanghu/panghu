import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
import { history } from 'umi';

const Container: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.temp}>
        <Button
          type="primary"
          onClick={() => {
            history.push('/case');
          }}
        >
          案例
        </Button>
        <Button
          type="primary"
          onClick={() => {
            history.push('/dataSet');
          }}
        >
          数据集
        </Button>
      </div>
    </div>
  );
};

export default Container;
