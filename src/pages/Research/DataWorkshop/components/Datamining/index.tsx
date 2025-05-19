import React from 'react';
import Cookies from 'js-cookie';
import qs from 'qs';
import { base64 } from 'seent-tools';

const Datamining: React.FC = () => {
  const qsParam = {
    ...Cookies.get(),
    classId: '1733216648479596',
    teachClassId: '1733216648479596',
    caseVersionId: '8',
    activityId: '8',
    taskId: '8',
    courseElementId: '8',
    platformCode: '8',
    projectVersionId: '8',
    dbeProjectVersionId: '8',
  };
  window.addEventListener(
    'message',
    function (e) {
      console.log('EEeeeeee', e);
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

  // console.log('Cookies.get()', qsParam);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        frameBorder="no"
        src={`${'https://tedu.seentao.com'}/xbd_web/#/datamining?qs=${base64.encode(
          qs.stringify(qsParam),
        )}`}
        title="数据挖掘页面"
        width={'100%'}
        height={'100%'}
      />
    </div>
  );
};
export default Datamining;
