import React from 'react';
import styles from './index.less';
import { initTab } from './config';
import { message } from 'antd';
import { history } from 'umi';

interface TTab {
  title: string;
  icon: any;
  key: string;
  url?: string;
}

const Container: React.FC = () => {
  const handleJump = (params: TTab) => {
    if (!params?.url) {
      message.warning('该功能暂未开放');
      return;
    }
    history.push(params.url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>科研初始化</div>
      <div className={styles.main}>
        {initTab.map((item) => (
          <div
            className={styles.tab}
            key={item.key}
            onClick={() => {
              handleJump(item);
            }}
          >
            <img src={item.icon} alt="" />
            <div>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Container;
