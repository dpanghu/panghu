/*
 *@description: 项目发布
 *@author: aizhf
 *@date: 2023-04-19 13:50:50
 */

import UploadRepositoryModal from '@/components/UploadRepositoryModal';
import { excel, pdf, ppt, word } from '@/globalConfig';
import { releaseCourse } from '@/services/course';
import { releaseProject } from '@/services/project';
import { UploadOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Button, Checkbox, Form, Input, Modal, Upload, message } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const typeOptions = [
  { label: '新版本', value: 1 },
  { label: '错误修复', value: 2 },
  { label: '细节优化', value: 3 },
];
type IProps = {
  itemData: RecordItem;
  onCancel: any;
  // objectKey: any;
};
const Release: React.FC<IProps> = ({ itemData, onCancel }) => {
  const [form] = Form.useForm();
  const [isShowUpload, setShowUpload] = useState<boolean>(false);
  const [releaseVersion, setVersion] = useState<any[]>(itemData.releaseVersion.split('.'));
  const [fileLists, setFileList] = useState<any[]>([]);
  // const [objectKey, setObjectKey] = useState<any[]>('')
  const objectKey = itemData.projectId !== undefined ? itemData.projectId : itemData.courseId;

  // 确定
  const onOk = async () => {
    let ids = fileLists.map((item: RecordItem) => item.id);
    await form.validateFields();
    let values = await form.getFieldsValue();
    console.log(values);
    const params = {
      ...values,
      releaseType: values.releaseType.join(','),
      releaseFileId: ids.join(','),
    };
    console.log(params);
    console.log(itemData);
    let res: any;
    if (itemData.modelType === 'course') {
      res = await releaseCourse({
        ...params,
        courseVersionId: itemData.id,
      });
      console.log(res);
    } else {
      res = await releaseProject({
        ...params,
        projectVersionId: itemData.id || itemData.projectVersionId,
      });
      console.log(res);
    }

    if (res?.errorInfos?.length) {
      let p = res.errorInfos.map((item: any, index: number) => (
        <>
          {`${index + 1}、${item.msg}`} <br />
        </>
      ));
      message.error(p);
    } else {
      message.success('发布成功！');

      // 如果是管理员合并课程 点击发布 关闭弹窗即可
      const pathnameArr = window.location.pathname.split('/');
      if (pathnameArr[pathnameArr.length - 1] === 'courseConfig') {
        onCancel();
        return;
      }

      let pathname = itemData.modelType === 'course' ? '/classList' : '/projectList';
      history.push({
        pathname,
      });
    }
    onCancel();
  };

  // 控制上传弹窗显示
  const onHandleCancelUpload = () => {
    setShowUpload(false);
  };

  // 数据格式
  const formatData = (arr: any) => {
    let newMap = arr.map((item: RecordItem) => ({
      uid: item.id,
      name: item.attachmentName,
      status: 'done',
      url: item.downloadUrl,
      attachmentId: item.id,
    }));
    return newMap;
  };

  // 上传附件
  const onHandleOk = (params: any) => {
    let arr: RecordItem[] = [...fileLists, ...params];
    setFileList(arr);
    onHandleCancelUpload();
  };

  // 删除附件
  const removeFile = (e: any) => {
    let arr = fileLists.filter((item: RecordItem) => e.uid != item.id);
    setFileList(arr);
  };

  useMount(() => {
    if (itemData.releaseState === 1) {
      form.setFieldsValue({ releaseType: [1] });
    }
    console.log(objectKey);
  });

  // 类型
  const onChangeType = (e: any) => {
    const num: number = Number(releaseVersion[Number(e.target.value) - 1]);
    releaseVersion[Number(e.target.value) - 1] = e.target.checked ? num + 1 : num - 1;
    setVersion([...releaseVersion]);
  };
  return (
    <Modal
      open={true}
      title={itemData.modelType === 'course' ? '发布课程' : '发布项目'}
      onOk={onOk}
      onCancel={onCancel}
    >
      {isShowUpload && (
        <UploadRepositoryModal
          handleCancel={onHandleCancelUpload} // 关闭弹窗的方法
          isMultiple={true} // 是否支持多选
          fileTypes={[...word, ...excel, ...ppt, ...pdf]} // 上传文件的类型
          handleOk={onHandleOk} // 点击确定的方法
          uploadType={'file'} // 上传的类型 file:上传文件  video:上传视频  '' 视频和文件都可以
          fileLimitSize={1024 * 1024 * 10} // 上传文件的大小
          objectKey={objectKey}
        />
      )}
      <Form
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        {...formItemLayout}
        form={form}
      >
        <Form.Item label="项目名称" name="projectName" initialValue={itemData.projectName}>
          <div>{itemData.projectName}</div>
        </Form.Item>
        <Form.Item
          label="发布类型"
          name="releaseType"
          rules={[{ required: true, message: '请选择发布类型!' }]}
        >
          <Checkbox.Group disabled={itemData.releaseState === 1}>
            {typeOptions.map((item: RecordItem) => (
              <Checkbox
                key={item.value}
                // checked={item.checked}
                checked={false}
                value={item.value}
                onChange={(e: any) => onChangeType(e)}
                // disabled={itemData.releaseState !== 1 && item.value === 1}
              >
                {item.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item name="projectVersionId" label="项目版本">
          <div>
            <Input style={{ width: 60 }} disabled value={releaseVersion[0]} /> -{' '}
            <Input style={{ width: 60 }} disabled value={releaseVersion[1]} /> -{' '}
            <Input style={{ width: 60 }} disabled value={releaseVersion[2]} />
          </div>
        </Form.Item>
        <Form.Item
          name="note"
          label="版本说明"
          rules={[
            { max: 200, message: '最多200个字符' },
            { min: 10, message: '最少10个字符' },
          ]}
        >
          <Input.TextArea
            placeholder="在此输入此次版本更新的内容及其他需求细节"
            style={{ height: 120, resize: 'none' }}
          />
        </Form.Item>
        <Form.Item name="releaseFileId" label="上传文档">
          <div>
            <Button
              className="btnGost"
              onClick={() => {
                setShowUpload(true);
              }}
            >
              <UploadOutlined />
              上传文档
            </Button>
            <span style={{ color: '#999', marginLeft: 10, fontSize: 12 }}>
              支持word、pdf、ppt、excel，最大不超过10M
            </span>
            <Upload fileList={formatData(fileLists)} onRemove={removeFile}></Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Release;
