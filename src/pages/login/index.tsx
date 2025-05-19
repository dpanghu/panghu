import { Button, Form, Input, message } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import user from '../../assets/images/user.svg';
import password from '../../assets/images/password.svg';
import Captcha from 'react-captcha-code-custom';
import QRCode from 'qrcode.react';
import { setItemInStorage, getLocalUserData, getItemInStorage } from '@/utils/utils';
import rectPng from '@/assets/images/zhiyanLogo.png';
import passwordUntil from './password.js';
import { getIps, getRoleList, login } from '@/services/public';
import { getAppearance } from '@/services/appearance';
import { useMount } from 'ahooks';
import defaultPic from '@/assets/images/staticBgn.png';
import bacs from '@/assets/imgs/bg.png';
import bac2 from '@/assets/imgs/bac2.png';
import earch from '@/assets/imgs/earch.png';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
// const loginPositionMap = {
//   1: '8%',

// }
const Login: React.FC<any> = ({ }) => {
  const [code, setCode] = useState<any>('');
  const [inputCode, setInputCode] = useState<any>('');
  const [loginPosition, setLoginPosition] = useState<number>(1);
  const [loginBack, setLoginBack] = useState<any>('');
  const [loginTitle, setLoginTitle] = useState('');
  const [mainLogo, setMainLogo] = useState('');

  const isMobilePhone = function (value: any) {
    const regMobilePhone = /^1[0-9]{10}$/;
    const regTWMobilePhone = /^(886)[0-9]{9}$/; //兼容台湾手机号
    return regMobilePhone.test(value) || regTWMobilePhone.test(value);
  };
  const captchaRef = useRef<any>();
  const handleChange = useCallback(
    (captcha: any) => {
      console.log('captcha:', captcha);
      setCode(captcha);
    },
    [setCode],
  );

  console.log('lout02', loginBack);
  const handleLogin = (value: any) => {

    if (code !== inputCode) {
      message.error('验证码错误');
      (captchaRef as any).current.refresh();
      return;
    }
    // message.success('登陆成功');
    // setTimeout(() => {
    //   history.push('/qrcodeManage');
    // }, 300);
    login({
      loginName: value.userName,
      pwd: value.password,
    }).then((res: any) => {
      console.log('res', res);
      message.success('登陆成功');
      window.sessionStorage.setItem('accessToken', res.data?.accessToken);
      window.sessionStorage.setItem('userInfo', JSON.stringify(res.data?.user));
      setTimeout(() => {
        history.push('/userManage');
      }, 300);
    });

    // randomStr({
    //   ...value,
    // }).then((res_random: any) => {
    //   let passwords: any = passwordUntil.AESEncrypt(value.password, res_random.data.randomStr);
    //   login({
    //     pushToken: '',
    //     sourceID: '',
    //     scene: 'login',
    //     ...value,
    //     password: passwords,
    //     redirectUrl: '',
    //     showCaptcha: false,
    //     csessionid: '',
    //     sig: '',
    //     nc_token: '',
    //   }).then((res: any) => {
    //     // console.log('ressssss', res);
    //     let userObj: any = {
    //       userId: res.userId,
    //       userName: res.userName,
    //       userToken: res.userToken,
    //       userType: res.userType,
    //     };
    //     setItemInStorage('userInfo', JSON.stringify(userObj));
    //     message.success('登录成功');
    //     setTimeout(() => {
    //       getRoleList({
    //         userId: res.userId,
    //         userName: res.userName,
    //         userToken: res.userToken,
    //         userType: res.userType,
    //         memberId: '',
    //         productType: 'DBE',
    //         orgType: '',
    //         orgId: '',
    //         schoolId: '',
    //       }).then((res1: any) => {
    //         console.log('void', memberInfo);
    //         if (
    //           memberInfo.memberType !== 0 &&
    //           res1.authSchools
    //             ?.map((item: RecordItem) => item.schoolMemberId)
    //             .includes('schoolMemberId')
    //         ) {
    //           if (memberInfo.memberType === 'TEACHER' || memberInfo.memberType === 'TEACHER_KY') {
    //             history.push('/researchIndex');
    //           } else if (
    //             memberInfo.memberType === 'SCHOOL_ADMINISTRATOR' ||
    //             memberInfo.memberType === 'SCHOOL_ADMINISTRATOR_SZJM'
    //           ) {
    //             history.push('/adminIndex');
    //           } else if (memberInfo.memberType === 'TEACHER_JYKF') {
    //             window.localStorage.setItem('loginOrigin', 'runner');
    //             window.location.href = `${window.location.origin}/builder_web/projectList`;
    //           } else {
    //             history.push('/studentIndex');
    //           }
    //         } else {
    //           if (res1.authSchools.length == 1) {
    //             if (getItemInStorage('environment') == 'DTC') {
    //               res1.authSchools[0].orgId = res1.authSchools[0].schoolId;
    //               res1.authSchools[0].memberId = res1.authSchools[0].schoolMemberId;
    //               setItemInStorage('memberInfo', JSON.stringify(res1.authSchools[0]));
    //               if (res1.authSchools[0].memberType === 'SCHOOL_ADMINISTRATOR_SZJM') {
    //                 history.push('/adminIndex');
    //               } else if (res1.authSchools[0].memberType === 'TEACHER_JYKF') {
    //                 window.localStorage.setItem('loginOrigin', 'runner');
    //                 window.location.href = `${window.location.origin}/builder_web/projectList`;
    //               } else if (res1.authSchools[0].memberType === 'TEACHER_KY') {
    //                 // 如果角色是  教师科研角色 => 跳转至 科研工作台首页
    //                 history.push('/researchIndex');
    //               } else {
    //                 history.push('/role');
    //               }
    //             } else {
    //               res1.authSchools[0].orgId = res1.authSchools[0].schoolId;
    //               res1.authSchools[0].memberId = res1.authSchools[0].schoolMemberId;
    //               setItemInStorage('memberInfo', JSON.stringify(res1.authSchools[0]));
    //               if (res1.authSchools[0].memberType === 'TEACHER') {
    //                 history.push('/researchIndex');
    //               } else if (
    //                 res1.authSchools[0].memberType === 'SCHOOL_ADMINISTRATOR' ||
    //                 res1.authSchools[0].memberType === 'SCHOOL_ADMINISTRATOR_SZJM'
    //               ) {
    //                 history.push('/adminIndex');
    //               } else if (res1.authSchools[0].memberType === 'TEACHER_JYKF') {
    //                 window.localStorage.setItem('loginOrigin', 'runner');
    //                 window.location.href = `${window.location.origin}/builder_web/projectList`;
    //               } else if (res1.authSchools[0].memberType === 'TEACHER_KY') {
    //                 // 如果角色是  教师科研角色 => 跳转至 科研工作台首页
    //                 history.push('/researchIndex');
    //               } else {
    //                 history.push('/studentIndex');
    //               }
    //             }
    //           } else {
    //             history.push('/role');
    //           }
    //         }
    //       });
    //     }, 500);
    //   });
    // });
  };

  useMount(() => {
  });

  return (
    <div
      className={styles.login}
      style={
        loginPosition === 1
          ? {
            justifyContent: 'left',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundImage: loginBack !== '1' ? `url(${loginBack})` : `url(${defaultPic})`,
          }
          : loginPosition === 2
            ? {
              justifyContent: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundImage: loginBack !== '1' ? `url(${loginBack})` : `url(${defaultPic})`,
            }
            : {
              justifyContent: 'right',
              backgroundSize: 'cover',
              backgroundImage: loginBack !== '1' ? `url(${loginBack})` : `url(${defaultPic})`,
            }
      }
    >
      <img src={bacs} style={{ position: 'absolute', width: '100%', height: "100%", zIndex: -1 }}></img>
      <img src={bac2} style={{ position: 'absolute', left: 0, width: 900 }}></img>
      <div className={styles.header} style={{ flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: "center" }}>
          {/* <div style={{ height: 60, borderRadius: 5, width: 60, background: 'white', display: "flex", alignItems: 'center', justifyContent: 'center', color: 'black', fontSize: 12 }}>
            <img src={earch} style={{ width: 50 }}></img>
          </div> */}
          <div style={{ color: 'white', fontSize: 26, marginLeft: 12 }}>机柜间环境检测分级平台</div>
        </div>
        {/* <div style={{ marginTop: 14,width:'100%',color:'white',fontSize: 16 }}>中石化(大连)石油化工研究院有限公司</div> */}
      </div>
      <div
        className={styles.loginForm}
      >
        <div className={styles.login_title}>用户登陆</div>
        <Form
          onFinish={handleLogin}
          layout="vertical"
          size="large"
          requiredMark={false}
          style={{ marginTop: '40px' }}
        >
          <Form.Item
            name="userName"
            rules={[
              { required: true, message: '请输入手机号/邮箱' },
              { max: 50, message: '长度最大为50' },
              {
                pattern: /^[^\s]*$/,
                message: '禁止输入空格',
              },
            ]}
          >
            {/* <img src={user}></img> */}
            <Input
              className={styles.input}
              prefix={
                <img style={{ width: 24, height: 24, margin: '8px 0px 8px 0px' }} src={user} />
              }
              placeholder="请输入账号"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入登录密码' },
              {
                pattern: /^[^\s]*$/,
                message: '禁止输入空格',
              },
            ]}
          >
            <Input.Password
              className={styles.input}
              prefix={
                <img style={{ width: 24, height: 24, margin: '8px 0px 8px 0px' }} src={password} />
              }
              placeholder="请输入登录密码"
            />
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              placeholder="请输入验证码"
              className={styles.input}
              style={{ width: 252, marginRight: 15 }}
              value={inputCode}
              onChange={(e: any) => {
                setInputCode(e.target.value);
              }}
            ></Input>
            <Captcha bgColor={'#FFFFFF'} ref={captchaRef} charNum={4} onChange={handleChange} />
          </div>
          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <input
              type="checkbox"
              name="rempassword"
              value="记住密码"
              style={{ verticalAlign: 'middle', marginRight: '5px', color: '#ccc' }}
            />
            <span className={styles.rempassword}>记住密码</span>
          </div>

          <div className={styles.loginButton}>
            <Button style={{ background: 'rgb(19,97,242)', width: '100%' }} type="primary" block htmlType="submit">
              <span style={{ color: '#FFF', fontSize: 14 }}>登录</span>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
