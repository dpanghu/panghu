import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
import { Input, Tree } from 'antd';
import type { TreeDataNode } from 'antd';
interface TProps {
  sourceData: RecordItem;
}
const Container: React.FC<TProps> = ({}) => {
  const treeData: TreeDataNode[] = [
    {
      title: '财务增值能力',
      key: '0-0',
      children: [],
    },
    {
      title: '发展能力',
      key: '0-1',
      children: [],
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Input
          placeholder="指标类型/财务指标名称搜索"
          className={styles.inputMsg}
          suffix={<SearchOutlined />}
        />
      </div>
      <div className={styles.bottom}>
        <Tree checkable treeData={treeData} defaultExpandAll />
      </div>
    </div>
  );
};
export default Container;
