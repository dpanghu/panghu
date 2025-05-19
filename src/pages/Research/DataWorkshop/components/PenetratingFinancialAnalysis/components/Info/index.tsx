import React from 'react';
import styles from './index.less';

const Container: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {' '}
        <div className={styles.title}>
          <span>
            <img></img>
          </span>
          数据基础
        </div>
        <div className={styles.content}>
          上市公司属性及年度报表数据获取日期截至2023年5月31日。
          公司属性表中共有5,218家上市公司。A股有132家上市公司；B股有86家上市公司。
        </div>
      </div>
      <div className={styles.right}>
        {' '}
        <div className={styles.title}>
          <span>
            <img></img>
          </span>
          数据更新日期
        </div>
        <div className={styles.content}>
          根据中国证监会《上市公司信息披露管理办法》的规定，上市公司年报的披露时间为每个会计年度结束之日起4个月内，即一至四月份，具体的时间以上市公
          司的公告为准。最晚披露时间为4月30日，故年度报告数据于5月1日进行年度报告数据爬取下载及数据整理。
          数据可视报表数据将于6月初至7月未进行文件数据统一更新，8月中下旬上线至平台中。
          例，2023年秋季学期及2024年春季学期将使用2022年年度报告数据为分析数据。2024年秋季学期及2025年春季学期将使用2023年年度报告数据为分析数
          据。
        </div>
      </div>
    </div>
  );
};

export default Container;
