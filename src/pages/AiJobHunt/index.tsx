import PageLoading from '@/components/PageLoading';
import { useModel, useOutlet } from '@umijs/max';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import classnames from 'classnames';
import React from 'react';
import styles from './index.less';


const AiJobHuntLayout: React.FC = ({ }) => {
  const outlet = useOutlet();


  const { loading } = useModel('@@initialState');
  console.log(loading);
  return (
    <div className={classnames(styles.container, sf.sFullAbs, sf.sPd8)}>
      {loading ? <PageLoading /> : outlet}
    </div >
  );
};

export default AiJobHuntLayout;
