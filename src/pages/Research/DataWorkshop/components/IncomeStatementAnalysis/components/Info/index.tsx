import React from 'react';
import styles from './index.less';

const Container: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>
          <img></img>
        </span>
        利润表(报表年份-2022)
      </div>
      <div className={styles.content}>
        行业相对值绝对值指标备注解释
        为了对比维度更加严谨，特做此说明。本报告内所有涉及到行业的绝对值指标都为行业均值，比如行业收入即为行业内所有公司的收入合计/行业内所有公司数量；本报告内所有涉及到行业的相对值指标都为行业总额为基础进行计算，比如行业收入增长率即为行业内所有公司的收入合计的增长率；
      </div>
    </div>
  );
};

export default Container;
