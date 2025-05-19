import { sliceString } from '@/utils/utils';
import { FolderOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Breadcrumb } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styles from '../index.less';

type Props = {
  filePath: any;
  onTriggerPath: any;
  onTriggerTeam: any;
};
const BreadcrumbManage: React.FC<Props> = ({ filePath, onTriggerPath, onTriggerTeam }) => {
  const ref = React.useRef(null);
  const size = useSize(ref);
  const [items, setItems] = useState<any[]>([]);
  let showBreadcrumbCount = 3;
  if (size?.width) {
    showBreadcrumbCount = Math.floor(size.width / 150); //130为每条记录最大长度
  }

  const restBreadcrumbList = React.useMemo(() => {
    if (filePath.length > showBreadcrumbCount) {
      return filePath.slice(0, filePath.length - showBreadcrumbCount);
    }
    return [];
  }, [filePath, showBreadcrumbCount]);

  const renderMenu = useCallback(
    (list: any[]) => {
      const arr = list.map((item) => ({
        label: (
          <a style={{ color: 'rgba(0,0,0,0.45)' }} onClick={() => onTriggerPath(item)}>
            {item.attachmentName}
          </a>
        ),
        key: item.repositoryAttachmentId,
        icon: <FolderOutlined style={{ color: 'rgba(0,0,0,0.45)', marginRight: 4 }} />,
      }));
      setItems([...arr]);
    },
    [onTriggerPath],
  );

  useEffect(() => {
    renderMenu(restBreadcrumbList);
  }, [restBreadcrumbList, renderMenu]);

  return (
    <div className={styles.breadcrumb}>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <a onClick={onTriggerTeam}>我的文档</a>
        </Breadcrumb.Item>
        {restBreadcrumbList.length > 0 && (
          <Breadcrumb.Item key="0" menu={{ items }}>
            <a>...</a>
          </Breadcrumb.Item>
        )}
        {filePath.slice(0 - showBreadcrumbCount).map((item: any) => {
          return (
            <Breadcrumb.Item key={item.repositoryAttachmentId}>
              <a
                className={styles.breadcrumb_groupName}
                title={item.attachmentName}
                onClick={() => onTriggerPath(item)}
              >
                {sliceString(item.attachmentName, 6)}
              </a>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </div>
  );
};
export default BreadcrumbManage;
