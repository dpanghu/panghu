import PageLoading from '@/components/PageLoading';
import { getConvertParamId } from '@/services/aiJobHunt';
import { useOutlet } from '@umijs/max';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useMount } from 'ahooks';
import classnames from 'classnames';
import React, { useState } from 'react';
import styles from './index.less';

const AiJobHuntLayout: React.FC = ({}) => {
  const outlet = useOutlet();
  const [loading, setLoading] = useState<boolean>(true);

  useMount(() => {
    const queryParams = JSON.parse(
      window.sessionStorage.getItem('queryParams'),
    );
    getConvertParamId(queryParams)
      .then((id) => {
        window.sessionStorage.setItem(
          'queryParams',
          JSON.stringify({ ...queryParams, paramId: id }),
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  });

  return (
    <div className={classnames(styles.container, sf.sFullAbs)}>
      {loading ? <PageLoading /> : outlet}
    </div>
  );
};

export default AiJobHuntLayout;
