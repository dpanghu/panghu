/**
 * 详情
 */
import { delScientificProject, saveScientificProject } from '@/services/research';
import { getScProjectDetail, getScTeam, initProject } from '@/services/scientificProject';
import { getSessionStorage } from '@/utils/utils';
import { useUnmount } from 'ahooks';
import { Button, Modal, Tooltip, message } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history } from 'umi';
// import Header from '../../../components/Header';
import pathPng from '@/assets/images/reSearch/path.png';
import Breadcrumbs from '@/pages/Research/components/Breadcrumbs';
import { projectCover } from '../AddScientificProject';
import MemberManage from '../MemberManage';
import OpenProject from '../OpenProject';
import ProIntroduce from '../ProIntroduce';
import ScResult from '../ScResult';
import ScTeam from '../ScTeam';
import styles from './index.less';

const ScientificProjectDetail = () => {
  const [titleKey, setTitleKey] = useState('introduce');
  const [scientificProjectData, setScientificProjectData] = useState<RecordItem>(
    getSessionStorage('scientificProject'),
  );
  const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
  const [detailObj, setDetailObj] = useState<any>({});
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [timerId, setTimerId] = useState();
  const [teamInfo, setTeamInfo] = useState<any>({});
  const [memberArr, setMemberArr] = useState<any>([]);
  const [teacherArr, setTeacherArr] = useState([]);
  const [partnersArr, setPartnersArr] = useState([]);
  const [caseName, setCaseName] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const roleAudit = Cookies.get('memberType') !== 'SCHOOL_ADMINISTRATOR';
  const memberId = Cookies.get('schoolMemberId');

  const [confirm, setConfirm] = useState<{
    title: string;
    open: boolean;
    content: string;
    okText?: string;
    onOk: () => void;
  }>({
    title: '',
    open: false,
    content: '',
    okText: '确定',
    onOk: () => {},
  });

  const getScTeamData = (id: string) => {
    getScTeam({
      projectId: id,
      memberId: roleAudit ? memberId : scientificProjectData.memberId,
    }).then((res) => {
      setTeamInfo(res || {});
      if (res?.members) {
        setMemberArr(JSON.parse(res?.members).filter((item: any) => item.projectIdentity === 2));
        setTeacherArr(JSON.parse(res?.members).filter((item: any) => item.projectIdentity === 1));
        setPartnersArr(JSON.parse(res?.members).filter((item: any) => item.projectIdentity === 3));
      }
    });
  };

  const getScProjectDetailData = () => {
    getScProjectDetail({
      id: scientificProjectData.id,
      isSquare: false,
      subSetType: scientificProjectData.subSetType,
      memberId: roleAudit ? memberId : scientificProjectData.memberId,
    }).then((res) => {
      setDetailObj(res);
      setScientificProjectData(res);
      setIsLeader(res.isLeader);
      getScTeamData(res.id);

      let dataset = '';
      if (res.subSetType === 2) {
        res.subSet?.map((key: any) => {
          dataset += key.name;
        });
        const dName = dataset.length > 10 ? dataset.slice(0, 10) + '...' : dataset;
        setDatasetName(dName);
      } else {
        const cName =
          res.subSet?.[0]?.casesName.length > 10
            ? res.subSet?.[0]?.casesName.slice(0, 10) + '...'
            : res.subSet?.[0]?.casesName;

        setCaseName(cName);
      }
    });
  };

  const apply = () => {
    detailObj.id &&
      initProject({
        id: detailObj.id,
        memberId: roleAudit ? memberId : scientificProjectData.memberId,
      }).then(() => {
        getScProjectDetailData();
      });
  };

  useEffect(() => {
    let id: any = '';
    if (detailObj.initStatus === 1) {
      id = setTimeout(() => {
        apply();
      }, 5000);
    }
    setTimerId(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailObj]);

  useEffect(() => {
    titleKey !== 'introduce' && clearTimeout(timerId);
  }, [titleKey, timerId]);

  useUnmount(() => {
    clearTimeout(timerId);
  });

  const TAG: any = {
    introduce: <ProIntroduce detailObj={detailObj} handleApply={apply} />,
    memberManage: <MemberManage detailObj={detailObj} updateStatus={getScProjectDetailData} />,
    scResult: <ScResult detailObj={detailObj} />,
    scTeam: (
      <ScTeam
        detailObj={detailObj}
        teamInfo={teamInfo}
        memberArr={memberArr}
        teacherArr={teacherArr}
        partnersArr={partnersArr}
      />
    ),
  };

  const handleClickTitle = (key: string) => {
    setTitleKey(key);
  };

  const onCancelOpenProjectModal = (current: number) => {
    if (current) {
      getScProjectDetailData();
    }
    setOpenProjectModal(false);
  };

  const handlePublic = async () => {
    if (scientificProjectData.publicStatus) {
      setConfirm({
        title: '数据清除',
        open: true,
        content: '是否确认取消公开，取消后本课题组将不在科研广场中展示',
        onOk: async () => {
          await saveScientificProject({
            id: scientificProjectData?.id,
            publicStatus: 0,
          });
          message.success('课题组取消公开');
          getScProjectDetailData();
          setConfirm({
            ...confirm,
            open: false,
          });
        },
      });
    } else {
      setOpenProjectModal(true);
      return;
    }
  };

  const closingItem = async () => {
    setConfirm({
      title: '结项',
      open: true,
      content: '结项后除本人外，其他人不可再访问课题组环境，请确认是否结项？',
      onOk: async () => {
        await saveScientificProject({
          id: scientificProjectData?.id,
          closeStatus: 1,
        });
        message.success('已结项');
        getScProjectDetailData();
        setConfirm({
          ...confirm,
          open: false,
        });
      },
    });
  };

  const clearItem = async () => {
    setConfirm({
      title: '数据清除',
      open: true,
      okText: '继续操作',
      content: '数据清除会清除本课题组在课题组环境中产生的所有操作与数据且不可恢复！',
      onOk: () => {
        setConfirm({
          title: '数据清除',
          open: true,
          content: '确认是否清除本课题组的数据？',
          onOk: async () => {
            await saveScientificProject({
              id: scientificProjectData?.id,
              clearStatus: 1,
            });
            message.success('数据清除成功');
            getScProjectDetailData();
            setConfirm({
              ...confirm,
              open: false,
            });
          },
        });
      },
    });
  };

  const deleteItem = () => {
    // 如果已经清除完数据(或者 未初始化 或者 初始化失败) 并且 为非公开状态 可以删除  否则不允许删除
    if (
      (scientificProjectData.clearStatus ||
        scientificProjectData.initStatus === 0 ||
        scientificProjectData.initStatus === 3 ||
        // 当无可用租户 或 未申请到租户时  也允许删除
        scientificProjectData.initStatus === -3 ||
        scientificProjectData.initStatus === -2) &&
      !scientificProjectData.publicStatus
    ) {
      setConfirm({
        title: '删除',
        open: true,
        okText: '继续操作',
        content: '删除后基于该课题组进行的操作及产生的数据将同步删除且不可恢复！',
        onOk: () => {
          setConfirm({
            title: '删除',
            open: true,
            content: '确认是否删除该课题组？',
            onOk: async () => {
              await delScientificProject({
                id: scientificProjectData?.id,
              });
              message.success('课题组删除成功');
              setConfirm({
                ...confirm,
                open: false,
              });
              history.push('/scientificProject');
            },
          });
        },
      });
    } else {
      if (scientificProjectData.publicStatus) {
        message.warn('课题组处于公开状态不能删除');
      } else {
        message.warn('课题组数据未清除不能删除');
      }
    }
  };

  useEffect(() => {
    getScProjectDetailData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scientificProjectData.id, scientificProjectData.subSetType, titleKey]);

  return (
    <div className={styles.container} id="scientificProjectDetailContainer">
      {/* <Header
        oneTitle="课题组列表"
        seTitle="查看课题组详情"
        oneRoutePath="/scientificProject"
        background="#f8f8f8"
      /> */}
      <Breadcrumbs
        oneTitle="课题组列表"
        seTitle="查看课题组详情"
        oneRoutePath="/scientificProject"
        background="#f8f8f8"
      />
      {isLeader && roleAudit && (
        <div className={styles.btns}>
          <Button onClick={deleteItem}>删除</Button>
          <Button
            onClick={() => {
              if (scientificProjectData.publicStatus) {
                message.warning('请取消课题组公开后进行编辑');
                return;
              }
              // if (scientificProjectData.initStatus === 1) {
              //   message.warning('课题组正在初始化中，无法编辑');
              //   return;
              // }
              // if (scientificProjectData.initStatus === 2) {
              //   message.warning('课题组初始化完成，无法编辑');
              //   return;
              // }
              // 判断项目是否初始化  初始化中 和 初始化完成 均不允许编辑  未初始化 和 初始化失败 可以进行编辑
              history.push('/addScientificProject');
            }}
          >
            编辑
          </Button>
          <Button
            onClick={clearItem}
            // 如果已经清除过数据  或者 未完成初始化状态 则不允许点击数据清除
            disabled={scientificProjectData.clearStatus || scientificProjectData.initStatus !== 2}
          >
            数据清除
          </Button>
          <Button onClick={closingItem} disabled={scientificProjectData.closeStatus}>
            结项
          </Button>
          <Button
            onClick={() => {
              handlePublic();
            }}
          >
            {scientificProjectData.publicStatus ? '取消公开' : '公开'}
          </Button>
        </div>
      )}
      <div className={styles.content}>
        <div
          className={styles.top}
          style={{ background: `url(${projectCover[detailObj?.projectCover]?.banner}) no-repeat` }}
        >
          <div className={styles.first}>
            <span className={styles.name} title={detailObj.name}>
              {detailObj.name?.length > 30 ? detailObj.name.slice(0, 30) + '...' : detailObj.name}
            </span>
            <span className={styles.status}>
              {detailObj.closeStatus === 0 ? '进行中' : '已结项'}
            </span>
          </div>
          <div className={styles.text} title={detailObj.note}>
            {detailObj.note?.length > 100 ? detailObj.note.slice(0, 100) + '...' : detailObj.note}{' '}
          </div>
          <div className={styles.plat}>
            <span>使用平台：{detailObj.projectEnv}</span>
            <span>
              课题组{detailObj.subSetType === 1 ? '案例' : '数据集'}：
              {detailObj.subSetType === 1 ? (
                <Tooltip title={detailObj.subSet?.[0]?.caseName} overlayClassName={styles.tooltip}>
                  <span>{caseName}</span>
                </Tooltip>
              ) : (
                <Tooltip
                  title={detailObj.subSet?.map((key: any) => (
                    <div key={key.id}>{key.name}</div>
                  ))}
                  overlayClassName={styles.tooltip}
                >
                  <span>{datasetName}</span>
                </Tooltip>
              )}
            </span>
            <span>创建时间：{moment(Number(detailObj.createTime)).format('YYYY-MM-DD')}</span>
            <span>
              管理员：
              <Tooltip
                placement="bottomLeft"
                title={getSessionStorage('scientificProject').leaderName}
                overlayClassName={styles.tooltip}
              >
                {getSessionStorage('scientificProject').leaderName > 10
                  ? getSessionStorage('scientificProject').leaderName?.slice(0, 10)
                  : getSessionStorage('scientificProject').leaderName}
              </Tooltip>
            </span>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.header}>
            <span
              style={{ color: titleKey === 'introduce' ? '#000' : '#666' }}
              onClick={() => handleClickTitle('introduce')}
            >
              课题组介绍
              {titleKey === 'introduce' && <img src={pathPng} />}
            </span>
            <span
              style={{ color: titleKey === 'memberManage' ? '#000' : '#666' }}
              onClick={() => handleClickTitle('memberManage')}
            >
              成员管理
              {titleKey === 'memberManage' && (
                // <img src={require('@/assets/images/reSearch/path.png')} />
                <img src={pathPng} />
              )}
            </span>
            {detailObj.scientificAchievement && detailObj.publicStatus === 1 && (
              <span
                style={{ color: titleKey === 'scResult' ? '#000' : '#666' }}
                onClick={() => handleClickTitle('scResult')}
              >
                科研成果
                {titleKey === 'scResult' && (
                  // <img src={require('@/assets/images/reSearch/path.png')} />
                  <img src={pathPng} />
                )}
              </span>
            )}
            {teamInfo.members && (
              <span
                style={{ color: titleKey === 'scTeam' ? '#000' : '#666' }}
                onClick={() => handleClickTitle('scTeam')}
              >
                科研团队
                {titleKey === 'scTeam' && (
                  // <img src={require('@/assets/images/reSearch/path.png')} />
                  <img src={pathPng} />
                )}
              </span>
            )}
          </div>
          <div>{TAG[titleKey]}</div>
        </div>
      </div>
      {openProjectModal && (
        <OpenProject
          open={openProjectModal}
          scientificProjectData={scientificProjectData}
          onCancel={onCancelOpenProjectModal}
          queryData={getScProjectDetailData}
        />
      )}
      <Modal
        title={confirm.title}
        open={confirm.open}
        onOk={confirm.onOk}
        maskClosable={false}
        width={500}
        getContainer={() =>
          document.getElementById('scientificProjectDetailContainer') as HTMLElement
        }
        onCancel={() => {
          setConfirm({
            ...confirm,
            open: false,
          });
        }}
        okText={confirm.okText || '确定'}
        cancelText="取消"
      >
        <div className={styles.messageModalContainer}>{confirm.content}</div>
      </Modal>
    </div>
  );
};

export default ScientificProjectDetail;
