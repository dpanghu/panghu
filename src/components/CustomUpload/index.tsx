import { Upload, UploadProps, message } from 'SeenPc';
import { RcFile } from 'antd/es/upload';
import React, { ReactNode } from 'react';

export interface CustomUploadProps extends Partial<UploadProps> {
  /**
   * @description 唤起选择文件弹窗时 过滤出支持的附件类型
   */
  accept?: string;
  /**
   * @description 允许上传的附件类型
   */
  allowFileType?: string[];
  /**
   * @description 允许上传的附件大小 M为单位
   */
  allowFileSize?: number;
  /**
   * @description 是否支持多选 默认为否
   */
  multiple?: boolean;
  /**
   * @description 是否支持拖拽上传，默认为否
   */
  dragger?: boolean;
  /**
   * @description 是否支持回显上传附件 默认为否  todo
   */
  showUploadList?: boolean | any;
  /**
   * @description 上传前回调
   */
  customBeforeUpload?: (file: RcFile) => any;
  /**
   * @description 上传成功后回调
   */
  customUploadSuccess?: (file: RcFile) => void;
  /**
   * @description 上传失败后回调
   */
  customUploadFail?: () => void;
  children?: ReactNode;
  [key: string]: any;
}

const CustomUpload: React.FC<CustomUploadProps> = ({
  multiple = false,
  showUploadList = false,
  dragger = false,
  name = 'file',
  ...restProps
}) => {
  const {
    customBeforeUpload,
    customUploadFail,
    allowFileType,
    allowFileSize,
    customUploadSuccess,
  } = restProps;
  const { Dragger } = Upload;

  const onBeforeUpload = (file: {
    type: any;
    name: string;
    key?: any;
    size: number;
  }) => {
    customBeforeUpload && customBeforeUpload(file as RcFile);
    // 校验附件类型
    let fileType = file.name.split('.');
    const fileDate = fileType.slice(-1);
    if (allowFileType?.length && allowFileType?.indexOf(fileDate[0]) < 0) {
      message.error('附件类型不支持，请重新上传');
      return false;
    }

    // 校验附件大小
    if (allowFileSize && file.size / 1024 / 1024 > allowFileSize) {
      message.error(`文件大小不能超过${allowFileSize}M`);
      return false;
    }

    // 校验文件名长度 不超过50个字
    console.log(file.name.replace(/\.[^/.]+$/, ''));

    if (file.name.replace(/\.[^/.]+$/, '')?.length > 50) {
      message.error(`文件名称不能超过50个字符`);
      return false;
    }

    return true;
  };

  const onFileChange = (info: { event?: any; fileList: any; file: any }) => {
    const { status } = info.file;
    if (status === 'done') {
      customUploadSuccess && customUploadSuccess(info.file);
    } else if (status === 'error') {
      customUploadFail && customUploadFail();
    }
  };

  return dragger ? (
    <Dragger
      multiple={multiple}
      showUploadList={showUploadList}
      name={name}
      {...restProps}
      beforeUpload={onBeforeUpload}
      onChange={onFileChange}
    />
  ) : (
    <Upload
      multiple={multiple}
      showUploadList={showUploadList}
      name={name}
      {...restProps}
      beforeUpload={onBeforeUpload}
      onChange={onFileChange}
    />
  );
};

export default CustomUpload;
