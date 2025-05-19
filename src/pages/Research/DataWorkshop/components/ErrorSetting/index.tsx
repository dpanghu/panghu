import React from 'react';
import errorSet from '@/assets/images/errorSet.png';
import excImg from '@/assets/images/icon-exclamation-circle-fill.png';
import styles from './index.less';

const ErrorSetting: React.FC = () => {
  return (
    <div className={styles?.error}>
      <div>
        <img src={errorSet} width={161} />
      </div>
      <div>
        <img src={excImg} width={24} height={24} />
        <span className={styles?.errorInfo}>
          当前服务需<span style={{ color: '#FF7C20' }}>联网</span>，请联系学校管理员开通服务器外网
        </span>
      </div>
    </div>
  );
};
export default ErrorSetting;
