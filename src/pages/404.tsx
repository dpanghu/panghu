import { Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="访问失败"
    subTitle="获取用户相关信息失败，请尝试从新道云平台跳转"
  />
);

export default NoFoundPage;
