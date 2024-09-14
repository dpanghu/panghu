import CustomUpload, { CustomUploadProps } from '@/components/CustomUpload';
import { uploadWordAnswer } from '@/services/documentQA';
import { getAttachmentId } from '@/services/documentSummary';
import { getFileMajorType } from '@/utils/contants';
import { useReactive } from 'ahooks';
import { Spin } from 'antd';
import { RcFile } from 'antd/es/upload';
import React from 'react';
import styles from './FileUpload.less';

interface TProps {
  paramsId: string;
  onChange: (dataSource: RecordItem) => void;
}

const FileUpload: React.FC<TProps> = ({ paramsId, onChange }) => {
  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );
  const state = useReactive({
    attachmentId: '',
    loading: false,
  });

  const uploadData = async () => {
    try {
      state.loading = true;
      const result: RecordItem = await uploadWordAnswer({
        paramId: paramsId,
        attachmentId: state.attachmentId,
        ...extraParams,
      });
      console.log(result);
      onChange(result);
    } finally {
      state.loading = false;
    }
  };

  const DraggerProps: CustomUploadProps = {
    dragger: true,
    accept: '.pdf,.PDF',
    allowFileType: ['pdf', 'PDF'],
    allowFileSize: 1,
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
      uploadData();
    },
  };

  return (
    <div className={styles.FileUploadContainer}>
      {state.loading ? (
        <Spin
          tip="文档解析中，请稍等！"
          spinning={state.loading}
          size="large"
        />
      ) : (
        <CustomUpload {...DraggerProps}>
          <div className={styles.uploadContainer}>
            <span>点击或将文件拖拽到此处上传</span>
            <span>文档格式:支持 PDF格式</span>
            <span>文档大小:文件最大支持1M</span>
          </div>
        </CustomUpload>
      )}
    </div>
  );
};

export default FileUpload;
