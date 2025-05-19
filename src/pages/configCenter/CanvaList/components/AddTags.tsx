import { levelSave } from '@/services/canvaTools';
import { Form, Input, message, Modal } from 'antd';
import React, { useEffect } from 'react';

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  getList: any;
  pageNum: any;
  limit: any;
  currentRecord: RecordItem;
  setCurrentRecord: any;
}

const AddTags: React.FC<Props> = (props: Props) => {
  const { open, setOpen, getList, pageNum, limit, currentRecord, setCurrentRecord } = props;
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    // console.log('values', values);
    currentRecord?.id
      ? levelSave({
          id: currentRecord?.id,
          caseCode: '0',
          ...values,
        }).then(() => {
          message.success('保存成功');
          getList(pageNum, limit);
          setOpen(false);
          form.resetFields();
        })
      : levelSave({
          caseCode: '0',
          ...values,
        }).then(() => {
          message.success('保存成功');
          getList(pageNum, limit);
          setOpen(false);
          form.resetFields();
        });
  };

  useEffect(() => {
    form.setFieldsValue({ ...currentRecord });
  }, [form, currentRecord]);

  return (
    <Modal
      title={currentRecord?.id ? '编辑画布' : '新建画布'}
      open={open}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setCurrentRecord({});
      }}
      onOk={handleOk}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form}>
        <Form.Item
          name="name"
          label="标签名称"
          rules={[{ required: true }, { max: 20, message: '最长20个字' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="code" label="标签编码" required>
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddTags;
