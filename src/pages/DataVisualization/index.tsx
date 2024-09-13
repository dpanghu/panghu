import { getConvertParamId } from '@/services/aiJobHunt';
import { getUploadList } from '@/services/dataVisualization';
import { history, useModel, useOutlet } from '@umijs/max';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import React from 'react';
import Header from './components/Header';
import { FileType } from './constants';
import { UploadDataType } from './type';

type Props = {};

const DataVisualization: React.FC<Props> = ({}) => {
  const outlet = useOutlet();
  const { setFileList } = useModel('DataVisualization.model', (model) => ({
    setFileList: model.setFileList,
  }));

  useMount(() => {
    const queryParams = JSON.parse(
      // @ts-ignore
      window.sessionStorage.getItem('queryParams'),
    );
    getConvertParamId(queryParams).then((id) => {
      window.sessionStorage.setItem(
        'queryParams',
        JSON.stringify({ ...queryParams, paramId: id }),
      );
      getUploadList<UploadDataType>().then((rst) => {
        if (rst) {
          setFileList(rst);
          const firstCustomerUpload = rst.find(
            (item) => item.fileType === FileType.CUSTOM,
          );
          if (firstCustomerUpload) {
            history.push('/dataVisualization/detail/' + firstCustomerUpload.id);
          } else {
            history.push('/dataVisualization/upload');
          }
        }
      });
    });
  });

  return (
    <div className={classNames(sf.sFullAbs, sf.sFlex, sf.sFlexDirC)}>
      <Header></Header>
      {outlet}
    </div>
  );
};

export default DataVisualization;
