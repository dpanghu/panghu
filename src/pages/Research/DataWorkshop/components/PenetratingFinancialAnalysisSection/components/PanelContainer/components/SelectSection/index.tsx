import React from 'react';
import styles from './index.less';
import { Radio, Space } from 'antd';

const Container: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>收入规模</div>
      <div className={styles.content}>
        <Space direction="vertical">
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="a">低</Radio.Button>
            <Radio.Button value="b">较低</Radio.Button>
            <Radio.Button value="c">较高</Radio.Button>
            <Radio.Button value="d">一般</Radio.Button>
          </Radio.Group>
        </Space>
      </div>
    </div>
  );
};

export default Container;
