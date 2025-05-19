import UploadFile from '@/components/UploadFile';
import { majorAttachmentImg, majorTreeList, UPLOAD_URL_PUBLIC } from '@/services/common';
import { useMount } from 'ahooks';
import { Button, message, Modal, Tree } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';

// 遍历数据
const loopData = (arr: RecordItem[]) => {
  return arr.map((item) => {
    item.key = item.id;
    item.id = item.id;
    // item.icon= <CarryOutOutlined />,
    item.parentId = item?.parentId;
    item.title = item.title;
    item.style = item.useState === 2 ? { color: '#8c8c8c' } : {};
    if (item.children) {
      loopData(item.children);
    }
    return item;
  });
};

const MajorSetting: React.FC = () => {
  const [treeData, setTreeData] = useState<RecordItem[] | any>([]);

  const getMajorTreeList = () => {
    majorTreeList({}).then((res) => {
      res && setTreeData(loopData(cloneDeep(res)));
    });
  };

  const uploadProps: RecordItem = {
    show: false,
    uploadUrl: UPLOAD_URL_PUBLIC,
    fileTypes: ['xls', 'xlsx'],
    multiple: false,
    // 上传成功之后调用自定义附件保存接口
    onUploadSuccess: async (url: string, name: any) => {
      console.log(url, name);
      Modal.confirm({
        title: '导入确认',
        content: '重新导入数据后，已经被选中的适用专业数据项将被覆盖，确定重新导入吗？',
        onOk: async () => {
          await majorAttachmentImg({
            fileUrl: url,
            majorClassify: 1,
          }).then(async () => {
            await getMajorTreeList();
            message.success('导入成功');
          });
        },
      });
    },
    onBeforeUpload: () => {
      return true;
    },
    onUploadFail: () => {},
  };

  const uploadParam: RecordItem = {
    show: false,
    uploadUrl: UPLOAD_URL_PUBLIC,
    fileTypes: ['xls', 'xlsx'],
    multiple: false,
    // 上传成功之后调用自定义附件保存接口
    onUploadSuccess: async (url: string, name: any) => {
      console.log(url, name);
      // upload(name, url);
      Modal.confirm({
        title: '导入确认',
        content: '重新导入数据后，已经被选中的适用专业数据项将被覆盖，确定重新导入吗？',
        onOk: async () => {
          await majorAttachmentImg({
            fileUrl: url,
            majorClassify: 2,
          }).then(async () => {
            await getMajorTreeList();
            message.success('导入成功');
          });
        },
      });
    },
    onBeforeUpload: () => {
      return true;
    },
    onUploadFail: () => {},
  };

  const handleReturn = () => {
    history.push('/configIndex');
    sessionStorage.removeItem('activeKey');
  };

  useMount(() => {
    getMajorTreeList();
  });

  return (
    <div className={styles?.main}>
      <div className={styles?.return}>
        <Button type="link" onClick={handleReturn}>
          返回
        </Button>
      </div>
      <div className={styles?.content}>
        <div>
          <UploadFile {...uploadProps}>
            <Button type="primary" style={{ marginBottom: '16px' }}>
              导入本科专业
            </Button>
          </UploadFile>
          <UploadFile {...uploadParam}>
            <Button type="primary" style={{ marginBottom: '16px', marginLeft: '20px' }}>
              导入高职专业
            </Button>
          </UploadFile>
        </div>
        <div className={styles?.tree}>
          <div style={{ width: '100%', textAlign: 'right', color: 'red' }}>
            *注意：灰色操作项为重新导入后被覆盖的数据
          </div>
          <div>{treeData.length > 0 && <Tree treeData={treeData} showLine={true} />}</div>
        </div>
      </div>
    </div>
  );
};
export default MajorSetting;
