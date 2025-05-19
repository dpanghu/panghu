import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import styles from './index.less';

type IProps = {
  tip?: string;
};

const antIcon = <Loading3QuartersOutlined spin />;

const PageLoading: React.FC<IProps> = ({ tip = '加载中，请稍后...' }) => {
  return (
    <div className={styles.pageLoading} id="custom_loading">
      <Spin indicator={antIcon} size="large" tip={tip} />
    </div>
  );
};

export default PageLoading;
