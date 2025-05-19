import { canvasSave } from '@/services/canvaTools';
import { Form, Input, message, Modal, Radio, Select } from 'antd';
import React from 'react';

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const AddCanva: React.FC<Props> = (props: Props) => {
  const { open, setOpen } = props;
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    // console.log('values', values);
    canvasSave({
      ...values,
    }).then((res) => {
      // console.log(res);
      message.success('保存成功');
    });
  };

  return (
    <Modal
      title="新建画布"
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
      onOk={handleOk}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form}>
        <Form.Item
          name="name"
          label="画布名称"
          rules={[{ required: true }, { max: 20, message: '最长20个字' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="tags" label="画布标签" rules={[{ required: true }]}>
          <Select placeholder="请选择" />
        </Form.Item>
        <Form.Item name="isOpen" label="是否公开画布" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddCanva;
