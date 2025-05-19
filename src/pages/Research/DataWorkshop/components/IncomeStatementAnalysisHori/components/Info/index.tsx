import React from 'react';
import styles from './index.less';

const Container: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>
          <img></img>
        </span>
        水平分析（报表年份-2022）
      </div>
      <div className={styles.content}>
        在2013年到2022年，*ST爱迪投资收益的报表项目金额10年趋势可表述为：前期呈上升趋势,但近1年呈下降超势；所在行业保险业报表项目金额10年趋势可表述为：前期呈上升趋势,但近2年呈下降超势。所在行业标杆公司为请选择公司或行业！，该标杆公司报表项目金额10年超势可表述为：无此项。
      </div>
    </div>
  );
};

export default Container;
