import { deleteUploadFile } from '@/services/dataVisualization';
import { history, useModel, useParams } from '@umijs/max';
import { Button, message } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { Empty, Modal, Popover } from 'antd';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FileType } from '../../constants';
import styles from './index.less';

const { confirm } = Modal;

type Props = {
  isDetail?: boolean;
};
const Header: React.FC<Props> = ({}) => {
  const { fileList, setFileList } = useModel(
    'DataVisualization.model',
    (model) => ({
      fileList: model.fileList,
      setFileList: model.setFileList,
    }),
  );

  const params = useParams();

  const deleteConfirm = (delId: string) => {
    confirm({
      title: '确认要删除本记录吗？',
      content: '删除后不可撤回，请确定是否删除？',
      cancelText: '再考虑下',
      okText: '确定',
      onOk() {
        deleteUploadFile({
          id: delId,
        }).then(() => {
          const deletedFile = fileList.find((file) => file.id === delId);
          const deletedFileList = fileList.filter((file) => file.id !== delId);
          setFileList(deletedFileList);
          message.success('删除成功');
          if (!params?.id) {
            return;
          }
          // 若删除的数据为当前所展示的，则进入下一条数据的详情，若历史记录已经清空，则返回到上传页面
          if (deletedFile!.id === delId) {
            if (deletedFileList.length > 0) {
              history.push(
                '/dataVisualization/detail/' + deletedFileList[0].id,
              );
            } else {
              history.push('/dataVisualization/upload');
            }
          }
        });
      },
    });
  };

  const popContent = useMemo(() => {
    return (
      <div className={styles['popover-content']}>
        <h2>我的文档库</h2>
        <div className={styles['popover-body']}>
          <div>
            {fileList.length === 0 ? (
              <Empty description="暂无数据" style={{ marginTop: 60 }} />
            ) : (
              <>
                {fileList.map((item) => (
                  <div key={item.id} className={styles['doc-item']}>
                    <div className={sf.sWFull}>
                      <span
                        title={item.fileName}
                        style={{ width: 150 }}
                        className={classNames(
                          sf.sFs14,
                          sf.sEllipsis,
                          sf.sColorGrey3,
                        )}
                      >
                        {item.fileName.split('.')[0]}
                      </span>
                      <div className={classNames(sf.sFlex, sf.sFlexJusBetween)}>
                        <span className={classNames(sf.sFs12, sf.sColorGrey9)}>
                          {parseFloat(parseFloat(item.fileSize).toFixed(2))}MB
                        </span>
                        <span
                          className={classNames(
                            sf.sFs12,
                            sf.sColorBaseColor,
                            sf.sPdR8,
                          )}
                          onClick={() => {
                            history.push(
                              '/dataVisualization/detail/' + item.id,
                            );
                          }}
                        >
                          立即查看
                        </span>
                      </div>
                    </div>
                    {item.fileType === FileType.CUSTOM && (
                      <span
                        className={styles['close']}
                        onClick={() => {
                          deleteConfirm(item.id);
                        }}
                      ></span>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }, [JSON.stringify(fileList)]);

  return (
    <div className={styles['container']}>
      <h1>AI数据可视化</h1>
      <Popover
        rootClassName="popover-cus-container"
        content={popContent}
        arrow={false}
        placement="bottomRight"
      >
        <span className={styles['doc-lib']}>我的文档库</span>
      </Popover>
      {params?.id && (
        <>
          <Button
            className={sf.sMrL24}
            onClick={() => {
              history.push('/dataVisualization/upload');
            }}
          >
            上传
          </Button>
          {fileList.find((file) => file.id === params?.id)?.fileType ===
            FileType.CUSTOM && (
            <Button
              className={sf.sMrL8}
              onClick={() => deleteConfirm(params?.id)}
            >
              删除
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default Header;
