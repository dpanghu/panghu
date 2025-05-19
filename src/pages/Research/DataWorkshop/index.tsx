import React from 'react';
import styles from './index.less';
import Aside from './components/Aside';
import { connect } from 'umi';

const Container: React.FC<any> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.aside}>
        <Aside />
      </div>
      <div className={styles.main}>{props.children}</div>
    </div>
  );
};

export default connect()(Container);
