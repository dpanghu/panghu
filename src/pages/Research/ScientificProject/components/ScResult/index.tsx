/**
 * 科研成果
 */
import styles from './index.less';

interface IProps {
  detailObj: any;
}
const ScResult: React.FC<IProps> = ({ detailObj }) => {
  return (
    <div className={styles.container}>
      <div
        dangerouslySetInnerHTML={{ __html: detailObj.scientificAchievement }}
        className={styles.content}
      />
    </div>
  );
};

export default ScResult;
