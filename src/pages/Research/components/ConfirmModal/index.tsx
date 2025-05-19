/**
 * 删除模态框
 */
import { Button, Modal } from 'antd';
import style from './index.less';
import resultSvg from '@/assets/images/reSearch/result.svg';

type IProps = {
  handleCancel: () => void;
  title: string;
  handleOk: () => void;
  content: string;
  okText?: string;
};
const DelModal: React.FC<IProps> = ({ handleCancel, title, handleOk, content, okText }) => {
  return (
    <Modal
      open={true}
      title={null}
      footer={null}
      onCancel={handleCancel}
      width={480}
      style={{ textAlign: 'center' }}
      wrapClassName={style.modal}
    >
      <div className={style.title}>
        <img src={resultSvg} />
        {title}
      </div>
      <div className={style.text}>{content}</div>
      <div className={style.btns}>
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleOk}>
          {okText || '确定'}
        </Button>
      </div>
    </Modal>
  );
};

export default DelModal;
