import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Form, Input, Modal, Select, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import {
  getScientificTag,
  getScientificTagAll,
  saveScientificTag,
  updateScientificTag,
} from '@/services/research';

interface TProps {
  title: string;
  open: boolean;
  code?: string;
  onCancel: () => void;
  queryData: () => void;
}
const { Option } = Select;

const Container: React.FC<TProps> = ({ title, open, onCancel, queryData, code }) => {
  const [form] = useForm();
  const [attrDisabled, setAttrDisabled] = useState(true);
  const [codeDisabled, setCodeDisabled] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [firstLevelData, setFirstLevelData] = useState<RecordItem[]>([]);
  const [parentCode, setParentCode] = useState<string>('');

  const cancelModal = () => {
    onCancel();
    setAttrDisabled(true);
    form.resetFields();
  };

  const handleSaveDic = async () => {
    const formValue = await form.validateFields();
    if (title !== '编辑字典') {
      await saveScientificTag({
        name: formValue.name.trim(),
        groupType: formValue.groupType,
        parentCode: formValue.parentCode || null,
        tagDesc: formValue.tagDesc,
        code: parentCode + formValue.code,
      });
      message.success('新建成功');
    } else {
      await updateScientificTag({
        code,
        name: formValue.name,
        groupType: formValue.groupType,
        parentCode: formValue.parentCode || null,
        tagDesc: formValue.tagDesc,
      });
      message.success('编辑成功');
    }

    // form.resetFields();
    queryData();
    cancelModal();
  };

  const getTagDetail = async () => {
    const data = await getScientificTag({ code });
    setParentCode(data.parentCode);
    form.setFieldsValue({
      name: data.name,
      tagDesc: data.tagDesc,
      groupType: data.groupType,
      code: data.parentCode ? data.childCode : data.code,
      parentCode: data.parentCode,
      grade: data.parentCode ? 2 : 1,
    });
  };

  const queryAllTag = async () => {
    const result = await getScientificTagAll({
      tagLevel: 1,
    });
    setFirstLevelData(result);
  };

  useEffect(() => {
    if (open) {
      queryAllTag();
    }
    if (code && open) {
      getTagDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, open]);

  useEffect(() => {
    setFormDisabled(title === '查看字典');
    setCodeDisabled(title !== '新增字典');
  }, [title]);

  return (
    <Modal
      title={title}
      open={open}
      maskClosable={false}
      destroyOnClose={true}
      onCancel={() => {
        // form.resetFields();
        setParentCode('');
        cancelModal();
      }}
      onOk={() => {
        if (title !== '查看字典') {
          handleSaveDic();
        } else {
          cancelModal();
        }
      }}
      className={styles.dicModalContainer}
      getContainer={() => document.getElementById('dicContainer') as HTMLElement}
    >
      <Form
        name="dicForm"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 17 }}
        initialValues={{ grade: 1 }}
        onValuesChange={(changedValues) => {
          if (changedValues?.grade === 1) {
            setParentCode('');
            setAttrDisabled(true);
            form.setFieldValue('parentCode', '');
            form.setFieldValue('groupType', '');
          }
          if (changedValues?.grade === 2) {
            setAttrDisabled(false);
          }
          if (changedValues?.parentCode) {
            setParentCode(changedValues?.parentCode);
            const groupType = firstLevelData.find(
              (ele) => ele.code === changedValues?.parentCode,
            )?.groupType;
            form.setFieldValue('groupType', groupType);
          }
        }}
      >
        <Form.Item
          label="字典名称"
          name="name"
          rules={[
            { required: true, message: '请输入字典名称!' },
            { whitespace: true, message: '字典名称不能为空!' },
          ]}
          tooltip="字典名称最长12个字符"
        >
          <Input placeholder="请输入字典名称" disabled={formDisabled} maxLength={12} />
        </Form.Item>
        <Form.Item
          label="字典编码"
          name="code"
          tooltip="字典编码最长10个字符,二级字典编码前自动拼接归属分类编码"
          rules={[
            { required: true, message: '请输入字典编码!' },
            { whitespace: true, message: '字典编码不能为空!' },
          ]}
        >
          <Input
            addonBefore={title === '新增字典' ? null : parentCode}
            disabled={formDisabled ? formDisabled : codeDisabled}
            placeholder="请输入字典编码"
            maxLength={10}
          />
        </Form.Item>
        <Form.Item
          label="归属组"
          name="groupType"
          rules={[{ required: true, message: '请选择归属组!' }]}
          tooltip="二级分类归属组同父级"
        >
          <Select
            placeholder="请选择归属组"
            disabled={formDisabled ? formDisabled : !attrDisabled}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            <Option value={1}>技术标签</Option>
            <Option value={2}>业务标签</Option>
            <Option value={3}>行业标签</Option>
            <Option value={4}>课程标签</Option>
            <Option value={5}>画板标签</Option>
            <Option value={6}>专业特殊标签</Option>
            <Option value={7}>领域标签</Option>
            <Option value={8}>案例标签</Option>
            <Option value={9}>主题标签</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="分类层级"
          name="grade"
          rules={[{ required: true, message: '请选择分类层级!' }]}
        >
          <Select
            placeholder="请选择分类层级"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            disabled={formDisabled ? formDisabled : title === '编辑字典'}
          >
            <Option value={1}>一级分类</Option>
            <Option value={2}>二级分类</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="归属分类"
          name="parentCode"
          tooltip="二级分类需要选择归属分类"
          rules={[
            {
              validator: (rules, value, callback) => {
                if (form.getFieldValue('grade') === 2 && !value) {
                  callback(new Error('二级分类需要选择归属分类') as any);
                } else {
                  callback();
                }
              },
            },
          ]}
        >
          <Select
            placeholder="请选择归属分类"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            showSearch
            filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            disabled={formDisabled ? formDisabled : attrDisabled}
          >
            {firstLevelData.map((item) => (
              <Option value={item.code} key={item.code}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="字典说明" name="tagDesc">
          <Input.TextArea
            disabled={formDisabled}
            placeholder="请输入字典说明"
            rows={4}
            style={{ resize: 'none' }}
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Container;
