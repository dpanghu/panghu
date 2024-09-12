import logoImg from '@/assets/images/logo.jpg';
import CustomUpload, { CustomUploadProps } from '@/components/CustomUpload';
import { getAttachmentId } from '@/services/documentSummary';
import {
  delPresetPageData,
  getFileConf,
  getPresetPageData,
  savePresetPageData,
} from '@/services/presetData';
import { getFileMajorType } from '@/utils/contants';
import { getQueryParam, getResourceById } from '@/utils/utils';
import { Button, message } from 'SeenPc';
import { useReactive } from 'ahooks';
import { Layout, Table } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useEffect } from 'react';
import styles from './index.less';
const { Header, Sider, Content } = Layout;
// import qs from 'qs';

interface TProps {
  children?: React.ReactNode;
}

interface TState {
  fileConf: {
    ext: string[];
    maxSize: number;
  };
  attachmentId: string;
  fileList: RecordItem[];
}

const PresetData: React.FC<TProps> = ({}) => {
  const { projectName, attachmentScope, taskName } = JSON.parse(
    (window.sessionStorage.getItem('preset_data') as any) || '{}',
  );
  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );
  let qsData: any = getQueryParam();
  const state = useReactive<TState>({
    fileConf: {
      ext: [],
      maxSize: 1,
    },
    attachmentId: '',
    fileList: [],
  });

  const menu = [
    {
      key: '1',
      value: '预置数据',
    },
  ];
  const queryFileList = async () => {
    const result: any = await getPresetPageData({
      pluginCode: qsData.code,
      limit: 9999,
      pageNum: 1,
    });
    state.fileList = result?.data;
  };
  const handleDeleteFile = async (id: string) => {
    await delPresetPageData({ id });
    message.success('删除成功');
    queryFileList();
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'resName',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_: any, record: RecordItem) => {
        return (
          <div style={{ display: 'flex', columnGap: 12 }}>
            <a
              onClick={() => {
                window.open(getResourceById(record.resId), '_self');
              }}
            >
              下载
            </a>
            <a onClick={() => handleDeleteFile(record.id)}>删除</a>
          </div>
        );
      },
    },
  ];

  const queryFileConf = async () => {
    const result: any = await getFileConf({
      pluginCode: qsData.code,
      limit: 9999,
    });
    state.fileConf = result;
  };

  const saveFile = async () => {
    await savePresetPageData({
      pluginCode: qsData.code,
      limit: 9999,
      resId: state.attachmentId,
    });
    message.success(`上传成功`);
    queryFileList();
  };

  const DraggerProps: CustomUploadProps = {
    dragger: false,
    accept: state.fileConf.ext.map((item) => '.' + item).join(','),
    allowFileType: state.fileConf.ext,
    allowFileSize: state.fileConf.maxSize,
    // action: 'https://tapi.seentao.com/bus-xai/dbe3.private.params.upload.get',
    // data: extraParams,
    seenOss: {
      url: '/api/bus-xai/dbe3.private.params.upload.get',
      extraParams,
    },
    customUploadSuccess: async (file: RcFile) => {
      // 附件上传成功后 去获取attachmentId
      const attachmentType = (file.name as any)
        .split('.')
        .pop()
        .toLocaleLowerCase();
      const params = {
        attachmentUrl: (file as any).key,
        attachmentName: file.name,
        attachmentCategory: getFileMajorType(attachmentType),
        attachmentSize: file.size,
        isConvert: 1,
        suffixName: attachmentType,
      };
      const attachmentId = await getAttachmentId(params);
      state.attachmentId = attachmentId;
      saveFile();
    },
  };

  useEffect(() => {
    queryFileList();
    queryFileConf();
  }, []);

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
            <CustomUpload {...DraggerProps}>
              <Button type="primary" style={{}}>
                上传
              </Button>
            </CustomUpload>
          </div>
          <Table
            pagination={false}
            rowKey="id"
            columns={columns}
            dataSource={state.fileList}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PresetData;
