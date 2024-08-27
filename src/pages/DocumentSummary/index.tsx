import recentRecordPng from '@/assets/images/recent_record.png';
import CustomUpload, { CustomUploadProps } from '@/components/CustomUpload';
import { getAttachmentId } from '@/services/documentSummary';
import { getFileMajorType } from '@/utils/contants';
import { useReactive } from 'ahooks';
import { RcFile } from 'antd/lib/upload';
import React from 'react';
import styles from './index.less';
const DocumentSummary: React.FC = () => {
  const state = useReactive({
    attachmentId: '',
  });

  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );
  const DraggerProps: CustomUploadProps = {
    dragger: true,
    accept: '.doc,.docx,.pdf,.DOC,.DOCX,.PDF',
    allowFileType: ['doc', 'docx', 'pdf', 'DOC', 'DOCX', 'PDF'],
    allowFileSize: 2,
    // action: 'https://tapi.seentao.com/bus-xai/dbe3.private.params.upload.get',
    // data: extraParams,
    seenOss: {
      url: 'https://tapi.seentao.com/bus-xai/dbe3.private.params.upload.get',
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
    },
  };

  return (
    <div className={styles.DocumentSummaryContainer}>
      <div className={styles.header}>
        <div className={styles.title}>AI文档总结</div>
        <div className={styles.action}>
          <div className={styles.recordLast}>
            <img src={recentRecordPng} alt="" />
            <span>最近记录</span>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.content}>
          <CustomUpload {...DraggerProps}>
            <div className={styles.uploadContainer}>
              <span>点击或将文件拖拽到此处上传</span>
              <span>文档格式:支持 PDF/Word格式</span>
              <span>文档大小:文件最大支持10M</span>
            </div>
          </CustomUpload>
          {/* <Dragger {...DraggerProps}>
            
          </Dragger> */}
        </div>
      </div>
    </div>
  );
};

export default DocumentSummary;
