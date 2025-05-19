/**
 * @author  zhangjn
 * @description  产品配置中心首页
 */
import React from 'react';
import styles from './index.less';
import { base64 } from 'seent-tools';
import Cookies from 'js-cookie';
import qs from 'qs';
const { userId, userName, userToken, schoolMemberId, schoolId, memberType } = Cookies.get();
const qsParams = base64.encode(
  qs.stringify({
    userId,
    userToken,
    userName,
    memberId: schoolMemberId,
    schoolId,
    memberType: memberType,
    orgId: schoolId,
  }),
);
const ConfigCenter: React.FC = () => {
  return (
    <div className={styles.config_container}>
      <iframe
        className={styles.frame_style}
        width={'100%'}
        height={'98%'}
        src={`/bus_bill_web/bill/billList?qs=${qsParams}`}
      ></iframe>
    </div>
  );
};

export default ConfigCenter;
