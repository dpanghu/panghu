import { getUploadDetail } from '@/services/dataVisualization';
import { useModel, useParams } from '@umijs/max';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { DetailResponseType } from '../type';
import styles from './index.less';

type Props = {};
type IState = {
  detailData: DetailResponseType | null;
};

const Detail: React.FC<Props> = ({}) => {
  const { id: fileId } = useParams();
  const state = useReactive<IState>({
    detailData: null,
  });
  const { fileList } = useModel('DataVisualization.model', (model) => ({
    fileList: model.fileList,
  }));

  useEffect(() => {
    if (fileId && fileList.length > 0) {
      const file = fileList.find(
        (file) => file.id === fileId || file.presetFileId === fileId,
      );
      if (file) {
        getUploadDetail<DetailResponseType>({
          id: file.id || '',
          presetFileId: file.presetFileId || '',
        }).then((rst) => {
          state.detailData = rst;
        });
      }
    }
  }, [fileId, fileList]);
  return (
    <>
      <div className={styles['container']}>
        <div className={styles['table-container']}>
          <div
            className={classNames(styles['table-header'], sf.sEllipsis)}
            title={state.detailData?.file?.fileName || ''}
          >
            {state.detailData?.file?.fileName || ''}
          </div>
          <div className={styles['table-body']}></div>
        </div>
        <div className={styles['message-container']}></div>
      </div>
    </>
  );
};

export default Detail;
