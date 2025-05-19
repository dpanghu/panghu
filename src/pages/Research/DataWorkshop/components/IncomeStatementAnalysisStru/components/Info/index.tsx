import React from 'react';
import styles from './index.less';

const Container: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>
          <img></img>
        </span>
        结构分析（报表年份-2022）
      </div>
      <div className={styles.content}>
        我们可以从营收增长率看公司经营状况，此时一般结合净利润率。*ST爱迪公司2022年营业收入为6,303,297,754.52，与上一年营业收入相比上升555,071,491.02，营业收入增长率为9.66%;2022年净利润为568.969.572.56，与上一年净利润相比上升10,718,848.62，净利润增长率为1.92%，可以看得出，公司收入上升，利润也上升，应考虑目前公司
      </div>
      <div className={styles.content}>
        对利润质量的评价，可以从以下行业和公司的以下几个方面来进行分析。首先，观察*ST爱迪公司2022年投资收益占利润总额的比例为21.67%，所在保险业行业2022年投资收益占利润总额的比例为21.67%;然后，观察2022年公允价值变动损益占利润总额的比例为-2.66%，所在行业2022年公允价值变动损益占利润总额的比例为-2.66%;最后，观察
      </div>
    </div>
  );
};

export default Container;
