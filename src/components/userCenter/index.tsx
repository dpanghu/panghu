/*
 *@description: 账户设置
 *@author: aizhf
 *@date: 2023-04-25 10:00:13
 */
// import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import styles from './index.less';
import { getBaseInfo } from '@/services/public';
import user_center1 from '../../assets/images/user_center1.svg';
import user_center2 from '../../assets/images/user_center2.svg';
import user_center3 from '../../assets/images/user_center3.svg';
import { logout } from '@/services/workspace';
import { getItemInStorage } from '@/utils/utils';
// import { clearCookie } from '../../utils/enum';
import { itemEnum, sendTracker } from '@/utils/tracker';
import Cookies from 'js-cookie';
const hostMap: any = {
  'https://tedu.seentao.com': 'https://tcloud.seentao.com',
  'https://dedu.seentao.com': 'https://dcloud.seentao.com',
  'https://edu.seentao.com': 'https://cloud.seentao.com',
};
const AccountSet: React.FC = () => {
  const [info, setInfo] = useState('');

  //清除所有cookie函(数
  const clearAllCookie = () => {
    logout({}).then(async () => {
      // 埋点上送
      sendTracker(itemEnum.logoutButton, { funCode: 'logout' });
      let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (let i = keys.length; i--; ) {
          document.cookie = `${keys[i]}${new Date(0).toUTCString()}`;
          document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString(); //清除当前域名下的,例如：m.kevis.com
        }
      }
      if (getItemInStorage('environment') == 'DTC') {
        window.sessionStorage.clear();
        window.localStorage.clear();
        setTimeout(() => {
          window.location.href = hostMap[window.location.origin];
        }, 500);
      } else {
        window.sessionStorage.clear();
        window.localStorage.clear();
        setTimeout(() => {
          window.location.href = '/bus_tara_web/login';
        }, 500);
      }
    });
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div>
          <img src={user_center1} />
          <Link to="/role" className={styles.text}>
            切换角色
          </Link>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div>
          <img src={user_center2} />
          <Link to="/account-setting" className={styles.text}>
            个人资料
          </Link>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div onClick={clearAllCookie}>
          <img src={user_center3} />
          <span className={styles.text}>退出登录</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBaseInfo({}).then((res: any) => {
      setInfo(res?.headImgUrl || '');
      Cookies.set('userInfo', JSON.stringify(res));
    });
  }, []);

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      overlayStyle={{
        width: '130px',
        height: 'auto',
      }}
    >
      <div className={styles.account}>
        <img src={info} />
      </div>
    </Dropdown>
  );
};
export default AccountSet;
