import React, { useState } from 'react';
import md5 from 'blueimp-md5';
import Cookies from 'js-cookie';
import { useMount } from 'ahooks';
import BindPhone from '../BindPhone';
const { userId, userToken, schoolMemberId, userName, memberCode } = Cookies.get();

const ReportRecord: React.FC = () => {
  const [url, setUrl] = useState('');
  const getToken = async () => {
    // console.log(md5('e321161c8ccb56f1f99ac83a66fb62ff8'+'1234566'))
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
        console.log(res, res && JSON.parse(res), aaa.data);
        await fetch(
          `https://data.yonyoucloud.com/fsb/seentao/direct?token=${aaa.data}&key=ReportRecord`,
          {
            method: 'GET',
            redirect: 'manual', // manual, *follow, error
          },
        ).then((resp: any) => {
          // let rest = resp.json();
          console.log(resp);
          setUrl(resp?.url);
          // window.open(resp?.url, '_self');
          // window.location = ;
        });
      });
    });

    // fetch(`/fsb/seentao/direct?token=${'6b140d1fffcd4b9191384b3e12e01345'}&key=CompareSummary`, {
    //   method: 'GET',
    // }).then((r: any) => {
    //   console.log(r);
    //   //@ts-ignore
    //   // window.location = '/';
    // });
    // const res = await getFsbToken({
    //   mobile: userName,
    //   entId: 'e321161c8ccb56f1f99ac83a66fb62ff8',
    //   nonce: '1234566',
    //   signature: 'b4bed6ec95568f2103ee4e4842eff6cc',
    // }).then((r) => {
    //   console.log(res);

    // });
    // console.log(res);
    // getFsbKey({
    //   token: '8bab047093cc45639bfc8af71e8fb547',
    //   key: 'CompareSummary',
    // }).then((r) => {
    //   console.log(r)
    // });
  };

  useMount(() => {
    getToken();
  });
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {Number.isNaN(Number(userName)) ? (
        <BindPhone />
      ) : (
        <iframe frameBorder="no" src={url} title="诊断记录页面" width={'100%'} height={'100%'} />
      )}
    </div>
  );
};
export default ReportRecord;
