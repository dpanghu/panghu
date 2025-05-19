import React from 'react';
import { menuItem } from '../..';
import { history } from 'umi';

import styles from '../../index.less';
const ConfigCenter: React.FC = () => {
  const handleClick = (name: string) => {
    console.log('点击', name);
    switch (name) {
      case '实验项目':
        history.push('/practice');

        break;

      default:
        break;
    }
  };

  return (
    <div className={styles.body}>
      {menuItem.map((item: any) => {
        return (
          <div className={styles.box} key={item} onClick={() => handleClick(item)}>
            {item}
          </div>
        );
      })}
    </div>
  );
};
export default ConfigCenter;
