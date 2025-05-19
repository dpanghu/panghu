/**
 * @author  zhangjn
 * @description  产品配置中心首页
 */
import { getConfig } from '@/services/common';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
const { memberType } = Cookies.get();

// 子菜单
export const menuItem = [
  '字典配置',
  // '研究方向设置',
  '案例设置',
  '数据集设置',
  // '算法集设置',
  // '科研项目设置',
  '课题配置',
  // '人才能力框架',
];

const menuTest: any = {
  UX_CAP: '能力模型',
  UX_EXP: '实验平台',
  UX_AE: '岗位职业库',
  UX_ARW: '考核方案',
  UX_DOC: '单据中心',
  UX_PAINTERS: '画板设置',
  UX_MAJ: '专业配置',
  UX_TARGET: '指标配置',
  UX_LABEL: '标签配置',
  UX_MIRRORING: '镜像管理',
  UX_DOCUMENTS: '凭证答案',
  UX_DIC: '字典配置',
  // 'UX_RESEARCH': '研究方向设置',
  UX_CASE: '案例设置',
  UX_DATAS: '数据集设置',
  // 'UX_ALG': '算法集设置',
  // 'UX_SCIE': '科研项目设置',
  UX_TOPIC: '课题配置',
};

const ConfigCenter: React.FC = () => {
  const [menuNew, setMenuNew] = useState<any>([]);
  useEffect(() => {
    if (memberType !== 'SCHOOL_ADMINISTRATOR' && memberType !== 'TEACHER') {
      getConfig({
        userGroupCode: 'OT_TEACHER_RIE_DEVELOP',
        requiresModule: '',
        moduleCode: 'UX_CONFIG',
      }).then((res: any) => {
        let menu_test: any = [];
        res &&
          res.map((el: any) => {
            menu_test.push(menuTest[el]);
          });
        setMenuNew(menu_test);
      });
    }
  }, [setMenuNew]);
  const handleClick = (name: string) => {
    switch (name) {
      case '案例设置':
        history.push('/case');
        break;
      case '数据集设置':
        history.push('/dataSetConfig');
        break;
      case '字典配置':
        history.push('/dictionary');
        break;
      case '课题配置':
        history.push('/classTopicConfig');
        break;
      default:
        history.push('/case');
        break;
    }
  };

  return (
    <div className={styles.config_container}>
      {/* <ConfigMenu /> */}
      {memberType !== 'SCHOOL_ADMINISTRATOR' && memberType !== 'TEACHER' ? (
        <div className={styles.body}>
          {menuNew.map((item: any) => {
            return (
              <div className={styles.box} key={item} onClick={() => handleClick(item)}>
                <div>{item}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.body}>
          {menuItem.map((item: any) => {
            return (
              <div className={styles.box} key={item} onClick={() => handleClick(item)}>
                <div>{item}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConfigCenter;
