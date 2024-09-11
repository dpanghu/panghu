import logoImg from '@/assets/images/logo.jpg';
import { Button, Table } from 'SeenPc';
import { Layout } from 'antd';
import React from 'react';
import styles from './index.less';
const { Header, Sider, Content } = Layout;
// import qs from 'qs';

interface TProps {
  children?: React.ReactNode;
}

interface TState {
  currentMenu: string;
}

const PresetData: React.FC<TProps> = ({}) => {
  const { projectName, attachmentScope, taskName } = JSON.parse(
    (window.sessionStorage.getItem('preset_data') as any) || '{}',
  );

  const menu = [
    {
      key: '1',
      value: '预置数据',
    },
  ];

  const columns = [
    {
      title: '文件名',
      dataIndex: 'attachmentName',
    },
    {
      title: '文件大小',
      dataIndex: 'attachmentSize',
    },
    {
      title: '操作',
      dataIndex: 'action',
    },
  ];

  const data: RecordItem[] = [];

  return (
    <Layout className={styles.presetDataContainer}>
      <Sider className={styles.sider}>
        <div className={styles.logo}>
          <img src={logoImg} alt="" />
          <span>预置数据</span>
        </div>
        <div className={styles.presetTitle}>
          <span>{attachmentScope === 1 ? projectName : taskName}</span>
        </div>
        <div className={styles.menuContainer}>
          <div className={styles.title}>应用名称</div>
          <div className={styles.menu}>
            {menu.map((item) => (
              <div className={styles.active} key={item.key}>
                {item.value}
              </div>
            ))}
          </div>
        </div>
      </Sider>
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <span className={styles.projectName}>{projectName}</span>
        </Header>
        <Content className={styles.main}>
          <div className={styles.actionBtn}>
            <Button type="primary" style={{}}>
              上传
            </Button>
          </div>
          <Table rowKey="id" columns={columns} dataSource={data} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PresetData;
