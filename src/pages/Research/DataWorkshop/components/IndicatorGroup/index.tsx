import React, { useState } from 'react';
import md5 from 'blueimp-md5';
import Cookies from 'js-cookie';
import { useMount } from 'ahooks';
import ErrorSetting from '../ErrorSetting';
import BindPhone from '../BindPhone';
const { userName } = Cookies.get();

const IndicatorGroup: React.FC = () => {
  const [url, setUrl] = useState('');

  // hasBeenUsedCheck
  const getToken = async () => {
    fetch(`https://data.yonyoucloud.com/fsb/seentao/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        mobile: userName,
        entId: 'e321161c8ccb56f1f99ac83a66fb62ff8',
        nonce: '1234566',
        signature: md5('e321161c8ccb56f1f99ac83a66fb62ff8' + '1234566'),
      }),
    }).then((response) => {
      let result = response.text();
      result.then(async (res: any) => {
        const aaa = (res && JSON.parse(res)) || {};
        // console.log(res, res && JSON.parse(res), aaa.data);
        await fetch(
          `https://data.yonyoucloud.com/fsb/seentao/direct?token=${aaa.data}&key=IndicatorGroup`,
          {
            method: 'GET',
            redirect: 'manual', // manual, *follow, error
          },
        ).then((resp: any) => {
          setUrl(resp?.url);
        });
      });
    });
  };

  useMount(() => {
    getToken();
  });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {!Number.isNaN(Number(userName)) ? (
        <BindPhone />
      ) : (
        <iframe frameBorder="no" src={url} title="指标组页面" width={'100%'} height={'100%'} />
      )}
      {/* <ErrorSetting/> */}
    </div>
  );
};
export default IndicatorGroup;
