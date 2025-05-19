import '../public/font.css';
import '../public/fonts/iconfont.css';
import './report';
import { history } from 'umi';
import { getItemInStorage } from '@/utils/utils';
import { clearCookie } from '@/utils/enum';
import { logout } from '@/services/workspace';

// 如果runner中嵌套的iframe提示登录失效 则runner清除cookie后 回退到登录页
window.addEventListener(
  'message',
  function (e) {
    // console.log('EEeeeeee', e);
    try {
      if (e.data === 'iframe_logout') {
        //直接在浏览器中输入地址栏
        let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
          for (let i = keys.length; i--; ) {
            document.cookie = `${keys[i]}=0;expires=${new Date(0).toUTCString()}`;
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString(); //清除当前域名下的,例如：m.kevis.com
          }
        }
        window.sessionStorage.clear();
        window.localStorage.clear();
        window.location.href = '/bus_tara_web/login';
      }
    } catch (error) {}
  },
  true,
);

export function useQiankunStateForSlave() {
  // 子应用中调用父应用 路由跳转history
  const masterHistoryPush = (url: string) => {
    history.push(url);
  };

  // 子应用中调用父应用退出登录
  const masterLogout = () => {
    const hostMap: any = {
      'https://tedu.seentao.com': 'https://tcloud.seentao.com',
      'https://dedu.seentao.com': 'https://dcloud.seentao.com',
      'https://edu.seentao.com': 'https://cloud.seentao.com',
    };
    logout({}).then(() => {
      let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (let i = keys.length; i--; ) {
          if (clearCookie.includes(keys[i])) {
            document.cookie = `${keys[i]}=0;expires=${new Date(0).toUTCString()}`;
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString(); //清除当前域名下的,例如：m.kevis.com
          }
        }
      }
      console.log("getItemInStorage('environment') ", getItemInStorage('environment'));
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

  return { masterHistoryPush, masterLogout };
}
