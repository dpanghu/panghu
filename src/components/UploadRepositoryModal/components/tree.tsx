import { Tree } from 'antd';

type Props = {
  fileData: any;
  isMultiple: boolean;
  onSelect: any;
  selectedKeys: any[];
};
const FileTree: React.FC<Props> = ({ fileData, isMultiple, onSelect, selectedKeys }) => {
  return (
    <Tree
      onSelect={onSelect}
      treeData={fileData}
      multiple={isMultiple}
      selectedKeys={selectedKeys}
    />
  );
};

export default FileTree;
