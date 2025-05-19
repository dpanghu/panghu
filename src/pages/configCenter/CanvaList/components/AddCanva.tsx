// import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Select } from 'antd';
import Cookies from 'js-cookie';
import qs from 'qs';
import React, { useEffect } from 'react';
import { base64 } from 'seent-tools';

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  getList: any;
  pageNum: any;
  limit: any;
  currentRecord: RecordItem;
  setCurrentRecord: any;
  items: any;
  getLevelGet: any;
}

const { userId, userName, userToken, schoolMemberId, schoolId, memberType, memberId } =
  Cookies.get();

const AddCanva: React.FC<Props> = (props: Props) => {
  const {
    open,
    setOpen,
    getList,
    pageNum,
    limit,
    currentRecord,
    setCurrentRecord,
    items,
    // getLevelGet,
  } = props;
  const [form] = Form.useForm();

  console.log('itemsitemsitems', items);

  const handleOk = async () => {
    const values = await form.validateFields();
    console.log('values', {
      userId,
      userName,
      userToken,
      schoolMemberId,
      schoolId,
      memberType,
      memberId,
      ...values,
      label: values?.paintboardLabel && values?.paintboardLabel.join(','),
      paintboardLabel: values?.paintboardLabel && values?.paintboardLabel.join(','),
    });
    window.open(
      `${window.location.origin}/bus_canvas_web/tools/canvaPanble?qs=${base64.encode(
        qs.stringify({
          userId,
          userName,
          userToken,
          schoolMemberId,
          schoolId,
          memberType,
          ...values,
          platformCode: 'DBE3',
          label: values?.paintboardLabel.join(','),
          paintboardLabel: values?.paintboardLabel.join(','),
        }),
      )}`,
      '_blank',
    );
  };

  // useMount(() => {
  //   getLevelGet();
  // });

  useEffect(() => {
    console.log('paintboardLabel', currentRecord?.paintboardLabel);
    form.setFieldsValue({
      ...currentRecord,
      // label:
      //   (currentRecord?.label && currentRecord.label.split(',')) || undefined,
      paintboardLabel:
        (currentRecord?.paintboardLabel && currentRecord.paintboardLabel.split(',')) || undefined,
    });
  }, [form, currentRecord]);

  return (
    <Modal
      title={currentRecord?.id ? '查看画布' : '新建画布'}
      open={open}
      onCancel={() => {
        setOpen(false);
        setCurrentRecord({});
        form.resetFields();
      }}
      onOk={handleOk}
      okText="确定"
      cancelText="取消"
      footer={currentRecord?.id && false}
    >
      <Form form={form}>
        <Form.Item
          name="paintboardConfigName"
          label="画布名称"
          rules={[{ required: true }, { max: 20, message: '最长20个字' }]}
        >
          <Input placeholder="请输入" maxLength={20} />
        </Form.Item>
        <Form.Item name="paintboardLabel" label="画布标签" required rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="请选择"
            mode="multiple"
            options={
              (items &&
                items.length > 0 &&
                items.map((item: RecordItem) => ({
                  label: item?.name,
                  value: item?.id,
                }))) ||
              []
            }
            filterOption={(input, option) =>
              ((option?.label ?? '') as any).toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        {/* <Form.Item name="isOpen" label="是否公开画布">
          <Radio.Group defaultValue={true} disabled>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </Radio.Group>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};
export default AddCanva;
