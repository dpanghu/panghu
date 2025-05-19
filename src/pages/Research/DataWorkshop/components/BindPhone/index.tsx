import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import { bindPhoneNumber, hasBeenUsedCheck, mobileSend } from '@/services/useCenter';
import Cookies from 'js-cookie';

const { userId, userToken, schoolMemberId, userName, memberCode } = Cookies.get();

const BindPhone: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [count, setCount] = useState(0);
  const [form] = Form.useForm();
  console.log(phoneNumber);

  // 验证手机号是否注册
  const postHasBeenUsedCheck = async () => {
    const values = await form.validateFields();
    console.log(111, values);

    await hasBeenUsedCheck({
      userId,
      userToken,
      schoolMemberId,
      userName,
      memberCode,
    }).then((res: any) => {
      console.log('res', res, phoneNumber);
      setCount(count + 1);
      // 获取验证码
      mobileSend({
        phoneNumber,
        usedBy: 'RETRIEVE_PASSWORD',
      }).then((t: any) => {
        console.log(t);
        setCaptchaId(t?.data || '');
      });
    });
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    // setCount(count + 1);
    if (!captcha) {
      message.error('请输入验证码');
      return;
    }
    if (count > 10) {
      message.error('验证码已过期');
      return;
    }
    await bindPhoneNumber({
      userType: 'PLATFORM',
      userName,
      userId,
      userToken,
      phoneNumber: values?.phoneNumber,
      captchaId,
      captcha,
    }).then(() => {
      message.success('绑定成功');
    });
  };

  return (
    <div className={styles?.content}>
      <div className={styles?.title}>绑定手机</div>
      <div className={styles?.titleName}>当前服务需绑定手机号，请在下方进行绑定</div>
      <div>
        <Form form={form}>
          <Form.Item
            className={styles?.input}
            name="phoneNumber"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input
              value={phoneNumber}
              placeholder="请输入手机号"
              onChange={(e: any) => {
                // console.log(e);
                setPhoneNumber(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            className={styles?.inputGroup}
            // name="captcha"
            // rules={[{ required: true, message: '请输入验证码' }]}
          >
            {/* <Input placeholder="请输入验证码" /> */}
            <Input.Group compact>
              <Input
                value={captcha}
                placeholder="请输入验证码"
                onChange={(e: any) => {
                  setCaptcha(e.target.value);
                }}
              />
              <div
                style={{ width: '1px', height: '20px', background: '#5A73FF', opacity: 0.17 }}
              ></div>
              <Button type="primary" onClick={postHasBeenUsedCheck}>
                {captchaId ? '重新获取' : '获取验证码'}
              </Button>
            </Input.Group>
            <div style={{ marginTop: '10px', color: '#313131', marginLeft: '2px' }}>
              {count > 0 && '验证码已经发送至您的手机'}
            </div>
          </Form.Item>
        </Form>
      </div>
      <div className={styles?.btn}>
        <Button type="primary" onClick={handleSubmit}>
          立即绑定
        </Button>
      </div>
    </div>
  );
};
export default BindPhone;
