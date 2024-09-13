import loadingPng from '@/assets/images/aiAtlas/loading.png';
import { uploadExcel } from '@/services/dataVisualization';
import { history, useModel } from '@umijs/max';
import { Upload, message } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useReactive } from 'ahooks';
import React from 'react';
import { DetailResponseType } from '../type';
import styles from './index.less';

const { Dragger } = Upload;

type Props = {};
const UploadCmp: React.FC<Props> = ({}) => {
  const state = useReactive({
    isParsing: false,
  });

  const { fileList, setFileList } = useModel(
    'DataVisualization.model',
    (model) => ({
      fileList: model.fileList,
      setFileList: model.setFileList,
    }),
  );

  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );
  const beforeUpload = (file) => {
    // 大小不能超过1Mb
    if (file.size > 1024 * 1024 * 1) {
      message.error('上传文件大小不能超过1MB!');
      return false;
    }
    // 校验文件名不能超过50个字符
    if (file.name.length > 50) {
      message.error('上传文件名称不能超过50个字符!');
      return false;
    }
    return true;
  };

  const onChange = ({ file }) => {
    state.isParsing = true;
    const { status } = file;
    if (status === 'done') {
      uploadExcel<DetailResponseType>({
        fileUrl: file.key,
        fileName: file.name,
        fileSize: file.size / 1024 / 1024,
      })
        .then((res) => {
          if (res) {
            setFileList([res.file, ...fileList]);
            history.push(`/dataVisualization/detail/${res.file.id}`);
          }
          state.isParsing = false;
        })
        .catch(() => {
          state.isParsing = false;
        });
    } else if (status === 'error') {
      state.isParsing = false;
      message.error('上传失败');
    }
  };

  return (
    <>
      <div className={styles['content']}>
        <div className={styles['body']}>
          <Dragger
            accept=".xlsx,.xls"
            beforeUpload={beforeUpload}
            style={{ opacity: state.isParsing ? 0 : 1 }}
            showUploadList={false}
            // @ts-ignore
            seenOss={{
              url: '/api/bus-xai/dbe3.private.params.upload.get',
              extraParams,
            }}
            onChange={onChange}
          >
            <div className={styles['upload']}>
              <div className={sf.sMrL8}>
                点击或将文件拖拽到此处上传
                <br /> 文档格式:Excel
                <br /> 文档大小:最大支持1M
              </div>
            </div>
          </Dragger>
          {state.isParsing && (
            <div className={styles['loading']}>
              <img src={loadingPng} alt="" />
              <span>文档上传中，请稍等！</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadCmp;
