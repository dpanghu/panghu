/**
 * 添加话题modal
 */
import { addTopicConfig, updateTopicConfig } from '@/services/topicConfig';
import { DatePicker, Form, Input, Modal, Select, message } from 'antd';
import moment from 'moment';
import { TYPE } from '../contants';
import styles from './index.less';

interface IProps {
  onCancel: () => void;
  detail: any;
}
const AddTopicConfig: React.FC<IProps> = ({ onCancel, detail }) => {
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = await form.validateFields();
    values.issueTime = moment(values.issueTime).format('YYYY');
    values.id = detail.id;
    if (detail.id) {
      updateTopicConfig(values).then(() => {
        message.success('编辑成功');
      });
    } else {
      addTopicConfig(values).then(() => {
        message.success('添加成功');
      });
    }

    onCancel();
  };

  return (
    <Modal
      title={detail.id ? '编辑课题' : '添加课题'}
      width={624}
      onCancel={onCancel}
      open
      onOk={onFinish}
      wrapClassName={styles.modal}
    >
      <Form
        colon={false}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          label="课题名称"
          name="subjectName"
          rules={[
            { required: true, message: '请填写课题名称!' },
            { max: 40, message: '课题名称最大长度为40个字符!' },
            { pattern: /^\S.*\S$|(^\S{0,1}\S$)/, message: '头尾不能输入空格！' },
          ]}
          initialValue={detail.subjectName}
        >
          <Input
            placeholder="请输入课题名称，最多可输入30个字"
            className={styles.input}
            maxLength={30}
          />
        </Form.Item>
        <Form.Item
          label="课题分类"
          name="subjectEnum"
          rules={[{ required: true, message: '请选择课题分类' }]}
          initialValue={detail.subjectTypeName}
        >
          <Select placeholder="请选择课题分类">
            {TYPE.map((item) => (
              <Select.Option value={item.key} key={item.key}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="发布时间"
          name="issueTime"
          rules={[{ required: true, message: '请选择发布时间' }]}
          initialValue={moment(detail.issueTime)}
        >
          <DatePicker picker="year" className={styles.time} />
        </Form.Item>
        <Form.Item label="课题简介" name="intro" initialValue={detail.intro}>
          <Input.TextArea
            maxLength={200}
            showCount
            placeholder="请输入课题简介"
            style={{
              resize: 'none',
              wordBreak: 'break-all',
              whiteSpace: 'pre-line',
              wordWrap: 'break-word',
              border: 0,
              background: 'rgba(0, 0, 0, 0.04)',
              borderRadius: 4,
            }}
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTopicConfig;
