/* eslint-disable default-case */
/**
 * @author wangbing
 * @description 文件上传组件
 * @description 适用于 aliyunoss amzn minio
 * @description pbu-oss-upload@2.0.4
 */

import { UPLOAD_URL_PUBLIC, uploads } from '@/services/common';
import { Upload, message } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

class UploadFile extends React.Component<RecordItem | string | any> {
  state = {
    uploadParams: null, // post params
    fileList: this.props.fileList,
    action: this.props.uploadUrl,
    ossType: '', // 对于minio 通过fetch上传
  };
  static defaultProps: {
    fileTypes: any;
    message: any;
    uploadUrl: string;
    onBeforeUpload: () => boolean;
    onUploadSuccess: () => void;
    // moduleName: FILE_COURSE,
    show: boolean;
    fileList: never[];
  };
  UNSAFE_componentWillReceiveProps(nextProps: { fileList: any }) {
    if (nextProps.fileList !== this.props.fileList) {
      this.setState({
        fileList: nextProps.fileList,
      });
    }
  }
  handleChange = (info: { event?: any; fileList: any; file: any }) => {
    const { onUploadSuccess, onUploading, onProcess, onUploadFail, onRemoveSuccess } = this.props;
    const { file } = info;
    if (this.props.limitNum) {
      info.fileList = info.fileList.slice(-this.props.limitNum);
    }
    switch (file.status) {
      case 'uploading':
        onUploading && onUploading(file);
        onProcess && info.event && onProcess(info.event.percent, file);
        break;
      case 'done':
        onUploadSuccess(file.key, file.name, file.type, file, info.fileList);
        break;
      case 'error':
        onUploadFail ? onUploadFail(file) : message.error('上传失败！！', 1);
        break;
      case 'removed':
        onRemoveSuccess ? onRemoveSuccess(file.uid) : message.success('移除成功！！', 1);
        break;
    }
    if (info.file.status) {
      this.setState({
        fileList: info.fileList,
      });
    } else {
      let tmpList = info.fileList;
      tmpList.pop();
      this.setState({
        fileList: tmpList,
      });
    }
  };
  // 上传附件之前先调用获取参数接口
  beforeUpload = (file: { type: any; name: string; key?: any }) => {
    let fileType = file.name.split('.');
    const fileDate = fileType.slice(-1);
    if (!this.props.onBeforeUpload(file)) {
      return Promise.reject();
    }
    if (this.props.fileTypes.length && this.props.fileTypes.indexOf(fileDate[0]) < 0) {
      message.error(this.props.message, 3);
      this.props.onUploadFail && this.props.onUploadFail();
      return false;
    }
    return uploads({
      fileName: file.name,
      moduleName: '',
    })
      .then((data: any) => {
        file.key = data.file_url;
        this.setState({
          uploadParams: data.tokenParams,
          action: `${data.endpoint}`,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 覆盖upload默认上传(目前仅处理minio)
  customRequest = (options: {
    file: any;
    onError: (arg0: Response, arg1: any) => void;
    onSuccess: (arg0: Response, arg1: any) => void;
  }) => {
    fetch(this.state.action, {
      method: 'PUT',
      body: options.file,
    }).then((res) => {
      if (res.status !== 200) {
        options.onError(res, options.file);
      } else {
        options.onSuccess(res, options.file);
      }
    });
  };

  render() {
    return (
      <Upload
        {...this.props} // 未注册props 向下传入到antd upload内
        name="file"
        action={this.state.action}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
        data={this.state.uploadParams as any}
        showUploadList={this.props.show}
        defaultFileList={this.state.fileList}
        fileList={this.state.fileList}
        customRequest={(this.state.ossType === 'minio' && this.customRequest) as any}
      />
    );
  }
}

(UploadFile as any).propTypes = {
  // 附件类型， 数组 为空时，代码支持上传所有类型附件
  fileType: PropTypes.any,
  // 文件上传地址
  uploadUrl: PropTypes.string,
  /**
   * 文件上传前校验 该函数必须有返回值  true或者false!!!!!!!!!!!!!
   * @param {Object} file 文件信息
   * @param {array} fileList 文件列表
   * @return {boolean}
   */
  onBeforeUpload: PropTypes.func,
  /**
   * 上传进度
   * @param {string} process 进度
   * @param {Object} file 文件信息
   */
  onProcess: PropTypes.func,
  /**
   * 上传中
   * @param {Object} info 文件当前状态信息
   */
  onUploading: PropTypes.func,
  /**
   * 上传文件成功时的回调，
   * @param {string} fileUrls 文件地址
   * @param {string} fileName 文件名
   * @param {string} fileType 文件类型
   * @param {Object} file 文件信息
   * @param {array} fileList 文件列表
   */
  onUploadSuccess: PropTypes.func,
  /**
   * 上传文件失败时的回调，
   * @param {Object} file 文件信息
   */
  onUploadFail: PropTypes.func,
  /**
   * 删除文件成功时的回调，
   * @param {string} uid 文件唯一id
   */
  onRemoveSuccess: PropTypes.func,
  // 功能模块名称
  moduleName: PropTypes.string,
  // 是否展示文件列表
  show: PropTypes.bool,
  // 限制文件上传个数
  limitNum: PropTypes.number,
  // 文件列表
  fileList: PropTypes.array,
};

UploadFile.defaultProps = {
  fileTypes: [],
  uploadUrl: UPLOAD_URL_PUBLIC,
  message: '文件格式不支持!',
  onBeforeUpload: () => {
    return true;
  },
  onUploadSuccess: () => {},
  // moduleName: FILE_COURSE,
  show: false,
  fileList: [],
};

export default UploadFile;
