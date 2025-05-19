/**
 * 导入数据集
 * fuxueyan
 */
import Upload from '@/components/UploadFile';
import { importTopicConfig } from '@/services/topicConfig';
import { Button, Modal, message } from 'antd';
import { useState } from 'react';
import style from './index.less';
import impSvg from '@/assets/images/reSearch/icon_import.svg';

interface IProps {
  onCancel: () => void;
}
const ImportTopicConfig: React.FC<IProps> = ({ onCancel }) => {
  const [fileName, setFileName] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [errorExportUrl, setErrorExportUrl] = useState('');

  const onBeforeUpload = (file: any) => {
    if (file.size > 10 * 10 * 1024) {
      message.error('上传文件的大小不超过10MB');
      return false;
    }
    return true;
  };

  const onUploadSuccess = (url: string, name: string) => {
    setFileName(name);
    setImportUrl(url);
  };

  const handleDownload = () => {
    window.location.href = `${process.env.PUBLIC_PATH}/课题导入模板.xlsx`;
  };

  const handleImport = () => {
    importTopicConfig({ importUrl }).then((res) => {
      if (res.data) {
        setErrorExportUrl(res.data);
        message.error(res.msg);
      } else {
        message.success('导入成功');
        onCancel();
      }
      setFileName('');
    });
  };

  return (
    <Modal
      open
      title="课题导入"
      onCancel={() => {
        onCancel();
        setFileName('');
      }}
      onOk={handleImport}
      okText="开始导入"
      width={624}
      wrapClassName={style.modal}
    >
      <div className={style.container}>
        <div className={style.dot}>
          <div className={style.whiteDot} />
        </div>
        <p>1.下载《课题导入模板》</p>
        <span className={style.fileName} onClick={handleDownload}>
          课题导入模板 <img src={impSvg} />
        </span>
      </div>
      <div className={style.container}>
        <div className={style.dot}>
          <div className={style.whiteDot} />
        </div>
        {!errorExportUrl ? (
          <div>
            <p>2.填写课题导入模板，将对应的字段信息输入或粘贴进本表</p>
            <span className={style.span}>为保证课题信息被有效导入，请按照填写规范填写表单</span>
          </div>
        ) : (
          <div>
            <p>2.{errorExportUrl.substring(errorExportUrl.lastIndexOf('/') + 1)}</p>
            <Button
              ghost
              style={{ color: '#FF2739', border: '1px solid #FF2739' }}
              onClick={() => (window.location.href = errorExportUrl)}
            >
              下载
            </Button>
          </div>
        )}
      </div>
      <div className={style.container}>
        <div className={style.dot}>
          <div className={style.whiteDot} />
        </div>
        <p>3.信息输入完毕，请上传您整理好的模版</p>
        <span className={style.span}>支持xls、xlsx格式，大小限制不超过10MB，最多不超过1个文件</span>
        <Upload
          onBeforeUpload={onBeforeUpload}
          onUploadSuccess={onUploadSuccess}
          fileTypes={['xls', 'xlsx']}
          message="支持xls、xlsx格式"
        >
          <Button className={style.btn}>点击上传</Button>
          <span className={style.name}>{fileName}</span>
        </Upload>
      </div>
    </Modal>
  );
};

export default ImportTopicConfig;
