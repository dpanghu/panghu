/**
 * 数据预览
 */
import Preview from '@/components/PreviewManage';
import { useEffect, useState } from 'react';
import style from './index.less';

type IProps = {
  fileArr: any;
};
const DataPreview: React.FC<IProps> = ({ fileArr }) => {
  const [url, setUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [activeKey, setActiveKey] = useState('');

  const handleClickFile = (item: any) => {
    const type = item.attachmentName.split('.').pop();
    setUrl(item.htmlViewUrl);
    setFileType(type);
    setActiveKey(item.id);
  };

  useEffect(() => {
    const type = fileArr[0]?.attachmentName.split('.').pop() || '';
    setUrl(fileArr[0]?.htmlViewUrl);
    setFileType(type);
    setActiveKey(fileArr[0]?.id);
  }, [fileArr]);

  return (
    <div className={style.container}>
      <div className={style.tag}>
        {fileArr.map((item: any) => (
          <span
            key={item.id}
            onClick={() => handleClickFile(item)}
            className={activeKey === item.id ? style.activeSpan : ''}
          >
            {item.attachmentName}
          </span>
        ))}
      </div>
      <Preview url={url} fileType={fileType} height="calc(100vh - 284px)" />
    </div>
  );
};

export default DataPreview;
