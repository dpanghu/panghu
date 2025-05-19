/**
 * 导入数据集
 * fuxueyan
 */
import Upload from '@/components/UploadFile';
import { getFileMajorType } from '@/components/UploadRepositoryModal/components/contants';
import { importDataSet } from '@/services/dataSet';
import { saveUploadFile } from '@/services/resource';
import { Button, Modal, message } from 'antd';
import { useState } from 'react';
import style from './index.less';
import icon_importSvg from '@/assets/images/reSearch/icon_import.svg';
interface IProps {
  open: boolean;
  onCancel: () => void;
}
const ImportDataSet: React.FC<IProps> = ({ open, onCancel }) => {
  const [fileName, setFileName] = useState('');
  const [attachmentId, setAttachmentId] = useState('');

  const onBeforeUpload = (file: any) => {
    if (file.size > 10 * 10 * 1024) {
      message.error('上传文件的大小不超过10MB');
      return false;
    }
    return true;
  };

  const onUploadSuccess = (url: string, name: string, type: string, file: any) => {
    setFileName(name);
    const attachmentType = file.name.split('.').pop().toLocaleLowerCase();
    const params = {
      attachmentUrl: url,
      attachmentName: name,
      attachmentType: attachmentType,
      attachmentCategory: getFileMajorType(attachmentType),
      attachmentSize: file.size,
      isConvert: 1,
      suffixName: attachmentType,
    };
    saveUploadFile(params).then((res) => {
      setAttachmentId(res);
    });
  };

  const handleDownload = () => {
    window.location.href = `${process.env.PUBLIC_PATH}/数据集导入模板.xlsx`;
  };

  const handleImport = () => {
    importDataSet({ attachmentId }).then((res) => {
      if (res.data) {
        window.location.href = res.data;
        message.error('导入失败，详情请查看下载文件');
      } else {
        message.success('导入成功');
      }
      onCancel();
      setFileName('');
    });
  };

  return (
    <Modal
      open={open}
      title="数据集导入"
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
        <p>1.下载《数据集批量导入模板》</p>
        <span className={style.fileName} onClick={handleDownload}>
          数据集批量导入模板 <img src={icon_importSvg} />
        </span>
      </div>
      <div className={style.container}>
        <div className={style.dot}>
          <div className={style.whiteDot} />
        </div>
        <p>2.填写数据集导入模板，将对应的字段信息输入或粘贴进本表</p>
        <span className={style.span}>为保证数据集信息被有效导入，请按照填写规范填写表单</span>
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

export default ImportDataSet;
