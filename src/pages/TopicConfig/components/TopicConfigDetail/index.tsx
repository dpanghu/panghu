/**
 * 查看课题详情
 */
import { Modal } from 'antd';
import { TYPE_VALUE } from '../contants';
import styles from './index.less';

interface Iprops {
  onCancel: () => void;
  detail: any;
}
const TopicConfigDetail: React.FC<Iprops> = ({ detail, onCancel }) => {
  return (
    <Modal open width={624} title="课题查看" onCancel={onCancel} footer={false}>
      <div>
        <div className={styles.row}>
          <span className={styles.title}>课题名称</span>
          <span className={styles.span}>{detail.subjectName}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.title}>课题分类</span>
          <span className={styles.span}>{TYPE_VALUE[detail.subjectTypeName]}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.title}>发布时间</span>
          <span className={styles.span}>{detail.issueTime}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.title}>点击量</span>
          <span className={styles.span}>{detail.offlineClick || 0}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.title}>课题简介</span>
          <span className={styles.span}>{detail.intro}</span>
        </div>
      </div>
    </Modal>
  );
};

export default TopicConfigDetail;
