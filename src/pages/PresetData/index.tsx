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
import { Layout, Modal, Table } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useEffect } from 'react';
import styles from './index.less';
const { Header, Sider, Content } = Layout;
// import qs from 'qs';
import ReactJson from 'react-json-view';
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
  resultOpen: boolean;
  resultData: RecordItem;
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
    resultOpen: false,
    resultData: {},
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
                state.resultOpen = true;
                state.resultData = record;
              }}
            >
              解析结果
            </a>
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

  const syntaxHighlight = (json: any) => {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match: any) {
        // let cls = 'color:#D19A66';
        // if (/^"/.test(match)) {
        //   if (/:$/.test(match)) {
        //     cls = 'color:#F92A0F';
        //   } else {
        //     cls = 'color:#44C91B';
        //   }
        // } else if (/true|false/.test(match)) {
        //   cls = 'color:#1B73C9';
        // } else if (/null/.test(match)) {
        //   cls = 'color:#C586C0';
        // }
        return { match };
      },
    );
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
    accept: [
      ...state.fileConf.ext,
      ...state.fileConf.ext.map((item) => item.toUpperCase()),
    ]
      .map((item) => '.' + item)
      .join(','),
    allowFileType: [
      ...state.fileConf.ext,
      ...state.fileConf.ext.map((item) => item.toUpperCase()),
    ],
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
  console.log(state.resultData);
  console.log(JSON.parse(state.resultData?.note || '{}'));

  return (
    <Layout className={styles.presetDataContainer} id="presetDataContainer">
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
      <Modal
        title="预置数据解析结果"
        centered
        width={650}
        footer={null}
        open={state.resultOpen}
        onCancel={() => {
          state.resultOpen = false;
        }}
        getContainer={() =>
          document.getElementById('presetDataContainer') as HTMLElement
        }
      >
        <ReactJson
          displayDataTypes={false}
          displayObjectSize={false}
          src={JSON.parse(state.resultData?.note || '{}')}
        />
        {/* <pre>{syntaxHighlight(JSON.parse(state.resultData?.note || '{}'))}</pre> */}
        {/* {JSON.stringify(JSON.parse(state.resultData?.note || '{}'))} */}
      </Modal>
    </Layout>
  );
};

export default PresetData;
