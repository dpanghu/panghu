/**
 * 成员管理
 */
import {
  delMember,
  getScMemberList,
  saveMember,
  saveRole,
  updateMemberStatus,
} from '@/services/scientificProject';
import { Button, Dropdown, Modal, Tooltip, message } from 'antd';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import AddMember from './AddMember';
import AssignRole from './AssignRole';
import styles from './index.less';

interface IProps {
  detailObj: any;
  updateStatus: () => void;
}
const MemberManage: React.FC<IProps> = ({ detailObj, updateStatus }) => {
  const [teacherArr, setTeacherArr] = useState([]);
  const [stuArr, setStuArr] = useState([]);
  const [thirdArr, setThirdArr] = useState([]);
  const [isShowAddMember, setIsShowAddMember] = useState(false);
  const [isShowAssignRole, setIsShowAssignRole] = useState(false);
  const [isShowDelModal, setIsShowDelModal] = useState(false);
  const [record, setRecord] = useState<any>({});
  const isTch = ['TEACHER', 'TEACHER_KY'].includes(Cookies.get('memberType') as string);
  const isKY = ['TEACHER_KY'].includes(Cookies.get('memberType') as string);
  const roleAudit = Cookies.get('memberType') !== 'SCHOOL_ADMINISTRATOR';
  const memberId = Cookies.get('schoolMemberId');

  const getScMemberListData = () => {
    getScMemberList({
      projectId: detailObj.id,
      memberId: roleAudit ? memberId : detailObj.memberId,
    }).then((res) => {
      setTeacherArr(res.filter((item: any) => item.memberType === 1 || item.memberType === 34));
      setStuArr(res.filter((item: any) => item.memberType === 2));
      setThirdArr(res.filter((item: any) => item.memberType === 3));
    });
  };
  useEffect(() => {
    getScMemberListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = (item: any, type: any) => {
    let obj: any = {};
    if (type === '') {
      obj.isLeader = true;
    }
    updateMemberStatus({
      id: item.id,
      projectId: detailObj.id,
      updateMemberId: item.memberId,
      memberType: type,
      ...obj,
    }).then(() => {
      getScMemberListData();
      // 移交管理员后重新查询课题组详情
      updateStatus();
    });
  };

  const handleAddMember = () => {
    setIsShowAddMember(true);
  };
  const onCancel = () => {
    setIsShowAddMember(false);
    setIsShowDelModal(false);
    setIsShowAssignRole(false);
    getScMemberListData();
  };
  const onOk = (arr: any) => {
    saveMember({
      data: JSON.stringify(arr),
      projectId: detailObj.id,
    }).then(() => {
      onCancel();
    });
  };
  const handleDelMember = (item: any) => {
    setIsShowDelModal(true);
    setRecord(item);
  };

  const handleOkDel = () => {
    delMember({ projectId: detailObj.id, id: record.id }).then(() => {
      message.success('删除成功');
      onCancel();
    });
  };

  const handleClickOk = (arr: any) => {
    saveRole({
      projectId: detailObj.id,
      scientificMemberId: record.id,
      data: JSON.stringify(arr),
    }).then(() => {
      onCancel();
    });
  };

  return (
    <div className={styles.container} id="MemberManageContainer">
      <div className={styles.btns}>
        {isTch && detailObj.isLeader && <Button onClick={handleAddMember}>添加成员</Button>}
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <span>教师成员</span>
        </div>
        <div className={styles.teacherMember}>
          {teacherArr.map((item: any) => {
            let role: any = [];
            item.roles?.map((key: any) => {
              role.push(key.roleName);
            });
            const roleStr = role.toString();

            return (
              <div className={styles.box} key={item.memberCode}>
                {item.isLeader && <span className={styles.admin}>管理员</span>}
                <div className={styles.memberName} title={item.memberName}>
                  {item.memberName.length > 10
                    ? item.memberName.slice(0, 10) + '...'
                    : item.memberName}
                </div>
                <div>
                  教工号：
                  {item.memberCode.length > 10 ? (
                    <Tooltip title={item.memberCode}>
                      {item.memberCode.slice(0, 10) + '...'}
                    </Tooltip>
                  ) : (
                    item.memberCode
                  )}
                </div>
                <div className={styles.schoolName}>学 院：{item.schoolName}</div>
                {detailObj.subSetType === 1 && (
                  <div title={roleStr}>
                    角 色：
                    {roleStr.length > 10 ? roleStr.slice(0, 10) + '...' : roleStr || '暂无角色'}
                  </div>
                )}
                {isTch && detailObj.isLeader && !item.isLeader && (
                  <Dropdown
                    placement="bottom"
                    arrow
                    overlayClassName={styles.drop}
                    menu={{
                      items:
                        detailObj.subSetType === 1
                          ? [
                              {
                                key: '1',
                                label: (
                                  <a
                                    onClick={() => {
                                      setIsShowAssignRole(true);
                                      setRecord(item);
                                    }}
                                  >
                                    分配角色
                                  </a>
                                ),
                              },
                              {
                                key: '2',
                                label: <a onClick={() => handleDelMember(item)}>删除成员</a>,
                              },
                              {
                                key: '3',
                                label: (
                                  <a onClick={() => handleUpdateStatus(item, '')}>移交管理员</a>
                                ),
                              },
                            ]
                          : detailObj.subSetType === 2 || detailObj.subSetType === 0
                          ? [
                              {
                                key: '1',
                                label: (
                                  <a onClick={() => handleUpdateStatus(item, '')}>移交管理员</a>
                                ),
                              },
                              {
                                key: '2',
                                label: <a onClick={() => handleDelMember(item)}>删除成员</a>,
                              },
                            ]
                          : [],
                    }}
                  >
                    <span className={styles.dot}>...</span>
                  </Dropdown>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {stuArr.length > 0 && (
        <div className={styles.content}>
          <div className={styles.title}>
            <span>学生成员</span>
          </div>
          <div className={styles.teacherMember}>
            {stuArr.map((item: any) => {
              let role: any = [];
              item.roles?.map((key: any) => {
                role.push(key.roleName);
              });
              const roleStr = role.toString();
              return (
                <div className={styles.box} key={item.memberCode}>
                  <div className={styles.memberName} title={item.memberName}>
                    {' '}
                    {item.memberName.length > 10
                      ? item.memberName.slice(0, 10) + '...'
                      : item.memberName}
                  </div>
                  <div>
                    学 号：
                    {item.memberCode.length > 10
                      ? item.memberCode.slice(0, 10) + '...'
                      : item.memberCode}
                  </div>
                  <div className={styles.schoolName}>学 院：{item.schoolName}</div>
                  {detailObj.subSetType === 1 && (
                    <div title={roleStr}>
                      角 色：
                      {roleStr.length > 10 ? roleStr.slice(0, 10) + '...' : roleStr || '暂无角色'}
                    </div>
                  )}

                  {detailObj.isLeader && isTch && (
                    <Dropdown
                      menu={{
                        items: isKY
                          ? [
                              {
                                key: '2',
                                label: <a onClick={() => handleDelMember(item)}>删除成员</a>,
                              },
                            ]
                          : [
                              {
                                key: '2',
                                label: <a onClick={() => handleDelMember(item)}>删除成员</a>,
                              },
                              {
                                key: '3',
                                label: (
                                  <a onClick={() => handleUpdateStatus(item, 3)}>分配第三方</a>
                                ),
                              },
                            ],
                      }}
                      placement="bottom"
                      arrow
                      overlayClassName={styles.drop}
                    >
                      <span className={styles.dot}>...</span>
                    </Dropdown>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {thirdArr.length > 0 && (
        <div className={styles.content}>
          <div className={styles.title}>
            <span>第三方成员</span>
          </div>
          <div className={styles.teacherMember}>
            {thirdArr.map((item: any) => {
              let role: any = [];
              item.roles?.map((key: any) => {
                role.push(key.roleName);
              });
              const roleStr = role.toString();
              return (
                <div className={styles.box} key={item.id}>
                  <div className={styles.memberName} title={item.memberName}>
                    {item.memberName.length > 10
                      ? item.memberName.slice(0, 10) + '...'
                      : item.memberName}
                  </div>
                  <div>
                    学 号：
                    {item.memberCode.length > 10
                      ? item.memberCode.slice(0, 10) + '...'
                      : item.memberCode}
                  </div>
                  <div className={styles.schoolName}>学 院：{item.schoolName}</div>
                  {detailObj.subSetType === 1 && (
                    <div title={roleStr}>
                      角 色：
                      {roleStr.length > 10 ? roleStr.slice(0, 10) + '...' : roleStr || '暂无角色'}
                    </div>
                  )}
                  {detailObj.isLeader && isTch && (
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: '1',
                            label: <a onClick={() => handleUpdateStatus(item, 2)}>分配学生</a>,
                          },
                        ],
                      }}
                      placement="bottom"
                      arrow
                      overlayClassName={styles.drop}
                    >
                      <span className={styles.dot}>...</span>
                    </Dropdown>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isShowAddMember && (
        <AddMember
          open={isShowAddMember}
          projectId={detailObj.id}
          detailObj={detailObj}
          onCancel={onCancel}
          onOk={onOk}
        />
      )}
      {isShowAssignRole && (
        <AssignRole
          onCancel={onCancel}
          projectId={detailObj.id}
          handleClickOk={handleClickOk}
          id={record.id}
        />
      )}
      {isShowDelModal && (
        <Modal
          open={true}
          width={480}
          onCancel={onCancel}
          onOk={handleOkDel}
          title="删除成员"
          wrapClassName={styles.confirmModal}
        >
          是否将该成员移出项目?
        </Modal>
      )}
    </div>
  );
};

export default MemberManage;
