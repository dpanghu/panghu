/**
 * 新建文件夹
 */
import { addFolder } from '@/services/resource';
import { Input, Modal, message } from 'antd';
import { useState } from 'react';
type IProps = {
  onCancel: any;
  teamId: string;
  parentId: string;
};
const AddFolder: React.FC<IProps> = ({ onCancel, teamId, parentId }) => {
  const [attachmentName, setAttachmentName] = useState<string>('');
  const handleAddFloder = () => {
    if (attachmentName === '') {
      message.error('请输入文件夹名称');
      return;
    }
    addFolder({ attachmentName, teamId, parentId }).then(() => {
      onCancel();
    });
  };
  const onChange = (e: any) => {
    setAttachmentName(e.target.value);
  };
  return (
    <Modal title="新建文件夹" open={true} onOk={handleAddFloder} onCancel={onCancel}>
      <Input
        style={{ width: 480, height: 40 }}
        onChange={onChange}
        placeholder="请输入文件夹名"
        maxLength={20}
      />
    </Modal>
  );
};
export default AddFolder;
