/*
 *@description:  新增画板弹窗
 *@author: aizhf
 *@date: 2023-04-03 15:24:09
 */

import UploadRepositoryModal from '@/components/UploadRepositoryModal';
import { excel, image, pdf, ppt, txt, word } from '@/globalConfig';
import ProjectTags from '@/pages/Project/BaseMessage_Step1/components/ProjectTages';
import { getPaintboardDetail } from '@/services/board';
import { findTagList } from '@/services/project';
import { CloseOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Radio, Tag, Upload } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { queryAllDict } from '@/services/course';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

type IState = {
  supportScreen: boolean | number; // 是否支持甄别
  prefabricateData: boolean | number; //是否支持预置数据
  tagList: RecordItem[]; //选中的标签
  isShowUpload: boolean;
  attachmentId: string;
  fileList: RecordItem[];
  answerfileList: RecordItem[];
  uploadName: string; //上传变量
  answerAnalysis: boolean | number;
  openWay: any;
};

class AddDrawBoardsModal extends React.Component<any | IState> {
  formRef = React.createRef<FormInstance>();
  state = {
    supportScreen: 0, // 是否支持甄别
    prefabricateData: 0, //是否支持预置数据
    tagList: [],
    isShowUpload: false,
    attachmentId: '',
    fileList: [],
    answerfileList: [],
    uploadName: '',
    answerAnalysis: false,
    openWay: [],
  };

  componentDidMount() {
    this.props.id && this.getDetail();
    queryAllDict({}).then((res: any) => {
      console.log(JSON.parse(res['dbe3.dict.pub.biz.openWay']));
      let arr: any = [];
      Object.keys(JSON.parse(res['dbe3.dict.pub.biz.openWay'])) &&
        Object.keys(JSON.parse(res['dbe3.dict.pub.biz.openWay'])).map((item: any) => {
          arr.push({ label: JSON.parse(res['dbe3.dict.pub.biz.openWay'])[item], value: item });
        });
      this.setState({ openWay: arr });
    });
  }

  // 获取标签
  findTagList = async (label: any) => {
    const res = await findTagList({
      tagType: 'paintboard',
    });
    let tagList = res.filter((item: any) => label.split(',').includes(item.id));
    this.setState({
      tagList,
    });
  };

  //获取数据字典数据
  getDetail = async () => {
    const res = await getPaintboardDetail({
      id: this.props.id,
    });

    this.findTagList(res.data.paintboardLabel);
    let fileList = res.data.attachmentId ? this.formatFileData(res.data) : [];
    let answerfileList = res.data.answerAnalysisAttachmentId ? this.formatAnswer(res.data) : [];
    this.setState({
      fileList,
      answerfileList,
      supportScreen: res.data.supportScreen,
      prefabricateData: res.data.prefabricateData,
      answerAnalysis: res.data.answerAnalysis,
    });
    res.data = { ...res.data, openWay: String(res.data?.openWay) };
    this.formRef.current!.setFieldsValue(res.data);
  };

  // 保存
  saveInfo = (values: any) => {
    values.isAdd = this.props.id ? 0 : 1;
    this.props.onSave(values);
  };

  // 控制上传弹窗显示
  onHandleCancel = () => {
    this.setState({
      uploadName: '',
      isShowUpload: false,
    });
  };

  //打开上传弹窗
  onShowModal = (name: any) => {
    this.setState({
      uploadName: name,
      isShowUpload: true,
    });
  };

  // 上传wan
  onHandleOk = (params: any) => {
    if (this.state.uploadName === 'attachmentId') {
      let fileList = this.formatFileData(params[0]);
      this.setState({
        attachmentId: params[0].id,
        isShowUpload: false,
        fileList,
      });
      this.formRef.current!.setFieldsValue({ attachmentId: params[0].id });
    } else {
      let answerfileList = this.formatAnswer(params[0]);
      this.setState({
        answerAnalysisAttachmentId: params[0].id,
        isShowUpload: false,
        answerfileList,
      });
      this.formRef.current!.setFieldsValue({ answerAnalysisAttachmentId: params[0].id });
    }
  };

  // 修改甄别状态
  changeState = (e: any, name: any) => {
    this.setState({
      [name]: e.target.value,
    });
  };

  // 添加标签
  addTags = () => {
    const tagType = 'paintboard';
    this.props.dispatch({
      type: 'Step1/findTagList',
      payload: {
        tagType,
        tagChoose: this.state.tagList,
      },
    });
    this.props.dispatch({
      type: 'Step1/update',
      payload: {
        open: true,
        tagType,
      },
    });
  };

  // 缩略图
  formatFileData = (values: any) => [
    {
      uid: values.attachmentId,
      name: values.attachmentName || values.fileName,
      status: 'done',
      url: values.downloadUrl,
      attachmentId: values.attachmentId,
    },
  ];

  // 答案解析
  formatAnswer = (values: any) => [
    {
      uid: values.answerAnalysisAttachmentId,
      name: values.attachmentName || values.answerAnalysisFileName,
      status: 'done',
      url: values.answerAnalysisDownloadUrl,
      answerAnalysisAttachmentId: values.answerAnalysisAttachmentId,
    },
  ];

  // 标签
  submitTag = (tagsArr: RecordItem[]) => {
    this.props.dispatch({
      type: 'Step1/update',
      payload: {
        open: false,
        tagType: 'paintboard',
      },
    });
    this.setState({
      tagList: tagsArr,
    });
    const tagsIdList = tagsArr.map((item) => item.id);
    this.formRef.current!.setFieldsValue({ paintboardLabel: tagsIdList.join(',') });
  };

  // 删除标签
  deleteTag = (id: any) => {
    const { tagList } = this.state;
    let index = tagList.findIndex((item: any) => item.id === id);
    tagList.splice(index, 1);
    this.setState({
      tagList,
    });
    const tagsIdList = tagList.map((item: any) => item.id);
    this.formRef.current!.setFieldsValue({ paintboardLabel: tagsIdList.join(',') });
  };

  render() {
    const {
      supportScreen,
      prefabricateData,
      tagList,
      isShowUpload,
      fileList,
      answerfileList,
      answerAnalysis,
      uploadName,
    } = this.state;

    return (
      <Modal
        open={true}
        width={800}
        title={this.props.id ? '编辑画板' : '新增画板'}
        style={{ textAlign: 'center' }}
        footer={null}
        onCancel={this.props.onCancal}
        wrapClassName={styles.wrap}
      >
        <ProjectTags onOK={this.submitTag} />
        {isShowUpload && (
          <UploadRepositoryModal
            handleCancel={this.onHandleCancel} // 关闭弹窗的方法
            isMultiple={false} // 是否支持多选
            fileTypes={
              uploadName === 'attachmentId' ? image : [...word, ...excel, ...ppt, ...pdf, ...txt]
            } // 上传文件的类型
            handleOk={this.onHandleOk} // 点击确定的方法
            uploadType={uploadName === 'attachmentId' ? 'image' : 'file'} // 上传的类型 file:上传文件  video:上传视频  '' 视频和文件都可以
            fileLimitSize={1024 * 1024 * 2} // 上传文件的大小
            imgLimitSize={1024 * 1024 * 2}
            objectKey=""
          />
        )}
        <Form {...formItemLayout} ref={this.formRef} onFinish={this.saveInfo}>
          <Form.Item
            label="画板名称"
            name="paintboardConfigName"
            rules={[
              { required: true, message: '请填写画板名称！' },
              { min: 1, max: 50, message: '画板名称最多不超过50个字符' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="画板id"
            name="id"
            rules={[
              { required: true, message: '请填写画板id！' },
              { pattern: /^[0-9]+$/g, message: '只支持数字类型' },
            ]}
          >
            <Input disabled={this.props.id} />
          </Form.Item>
          <Form.Item
            label="画板地址"
            name="paintboardConfigUrl"
            rules={[
              { required: true, message: '请填写画板地址！' },
              { min: 1, max: 100, message: '画板地址最多不超过100个字符' },
            ]}
          >
            <Input />
            {/* {projectUrl} */}
          </Form.Item>
          <Form.Item
            label="画板说明"
            name="paintboardConfigDesc"
            rules={[{ min: 1, max: 100, message: '画板说明最多不超过100个字符' }]}
          >
            <TextArea style={{ resize: 'none' }} />
          </Form.Item>
          <Form.Item
            label="缩略图"
            name="attachmentId"
            style={{ textAlign: 'left' }}
            rules={[{ required: true, message: '请选择缩略图！' }]}
          >
            <div>
              <Button type="primary" onClick={() => this.onShowModal('attachmentId')}>
                <UploadOutlined />
                上传缩略图
              </Button>
              <Upload listType="picture" fileList={fileList}></Upload>
            </div>
          </Form.Item>
          <Form.Item
            label="团队属性"
            name="teamProperty"
            style={{ textAlign: 'left' }}
            rules={[{ required: true, message: '请选择团队属性！' }]}
          >
            <RadioGroup>
              <Radio value={0}>个人画板</Radio>
              <Radio value={1}>团队画板</Radio>
            </RadioGroup>
          </Form.Item>
          <Form.Item
            label="画板标签"
            name="paintboardLabel"
            rules={[{ required: true, message: '请添加画板标签！' }]}
          >
            <div className={styles.tags}>
              <Tag style={{ cursor: 'pointer' }} onClick={this.addTags}>
                <PlusOutlined /> 添加
              </Tag>
              {tagList.map((item: any) => (
                <span className={styles.tagItem} key={item.id}>
                  <span>{item.tagName}</span>
                  <CloseOutlined className={styles.close} onClick={() => this.deleteTag(item.id)} />
                </span>
              ))}
            </div>
          </Form.Item>
          <Form.Item
            label="支持甄别"
            style={{ textAlign: 'left' }}
            name="supportScreen"
            rules={[{ required: true, message: '请添加画板标签！' }]}
          >
            <RadioGroup onChange={(e) => this.changeState(e, 'supportScreen')}>
              <Radio value={1} key={1}>
                是
              </Radio>
              <Radio value={0} key={0}>
                否
              </Radio>
            </RadioGroup>
          </Form.Item>
          {!!supportScreen && (
            <Form.Item
              label="甄别地址"
              style={{ textAlign: 'left' }}
              name="screenUrl"
              rules={[
                { required: true, message: '请填写甄别地址！' },
                { min: 1, max: 200, message: '画板名称最多不超过200个字符' },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            label="答案解析"
            style={{ textAlign: 'left' }}
            name="answerAnalysis"
            rules={[{ required: true, message: '请选择是否支持答案解析！' }]}
          >
            <RadioGroup onChange={(e) => this.changeState(e, 'answerAnalysis')}>
              <Radio value={1} key={1}>
                是
              </Radio>
              <Radio value={0} key={0}>
                否
              </Radio>
            </RadioGroup>
          </Form.Item>
          {!!answerAnalysis && (
            <Form.Item
              label="上传答案"
              style={{ textAlign: 'left' }}
              name="answerAnalysisAttachmentId"
              rules={[{ required: true, message: '请上传答案！' }]}
            >
              <div>
                <Button
                  type="primary"
                  onClick={() => this.onShowModal('answerAnalysisAttachmentId')}
                >
                  <UploadOutlined />
                  上传答案
                </Button>
                <Upload listType="text" fileList={answerfileList}></Upload>
              </div>
            </Form.Item>
          )}

          <Form.Item
            label="预置数据"
            style={{ textAlign: 'left' }}
            name="prefabricateData"
            rules={[{ required: true, message: '请选择是否包含预置数据' }]}
          >
            <RadioGroup onChange={(e) => this.changeState(e, 'prefabricateData')}>
              <Radio value={1} key={1}>
                是
              </Radio>
              <Radio value={0} key={0}>
                否
              </Radio>
            </RadioGroup>
          </Form.Item>
          {!!prefabricateData && (
            <Form.Item
              label="预置数据地址"
              style={{ textAlign: 'left' }}
              name="prefabricateDataUrl"
              rules={[
                { required: true, message: '请填写预置数据地址！' },
                { min: 1, max: 2000, message: '画板名称最多不超过2000个字符' },
              ]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label="打开方式"
            name="openWay"
            rules={[{ required: true, message: '请选择打开方式' }]}
            initialValue={2}
          >
            <Radio.Group>
              {this.state.openWay &&
                this.state.openWay.map((e: any) => {
                  return (
                    <Radio value={e.value} key={e.id}>
                      {e.label}
                    </Radio>
                  );
                })}
            </Radio.Group>
          </Form.Item>

          <Button type="primary" htmlType="submit" className={styles.addModalBtn}>
            {this.props.id ? '编辑' : '新增'}
          </Button>
          <Button className={styles.cancelModalBtn} onClick={this.props.onCancal}>
            取消
          </Button>
        </Form>
      </Modal>
    );
  }
}

export default connect(({ Step1 }: any) => ({ Step1 }))(AddDrawBoardsModal);
