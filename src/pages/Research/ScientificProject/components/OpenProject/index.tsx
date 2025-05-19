import React, { useRef, useState } from 'react';
import styles from './index.less';
import { Modal, Steps, message } from 'antd';
import IntrAchievement from '../IntrAchievement';
import IntrTeam from '../IntrTeam';
import { saveScientificProject, saveScientificProjectTeam } from '@/services/research';
import closeIcon from '@/assets/images/icon-close.png';

interface TProps {
  onCancel: (current: number) => void;
  queryData: () => void;
  scientificProjectData: RecordItem;
  open: boolean;
}

const Container: React.FC<TProps> = ({ open, onCancel, queryData, scientificProjectData }) => {
  const [current, setCurrent] = useState(0);
  const [scientificAchievement, setScientificAchievement] = useState<any>(
    scientificProjectData?.scientificAchievement,
  );
  const [teamData, setTeamData] = useState<RecordItem>({});
  const teamFormRef = useRef<any>(null);

  const getFormData = (params: RecordItem, form: any) => {
    teamFormRef.current = form;
    setTeamData(params);
  };

  const getRichData = (value: string) => {
    setScientificAchievement(value);
  };

  const handleSubmit = async () => {
    if (current === 0) {
      if (
        !scientificAchievement ||
        (typeof scientificAchievement === 'string' && scientificAchievement === '<p></p>') ||
        (typeof scientificAchievement !== 'string' && scientificAchievement?.toHTML() === '<p></p>')
      ) {
        message.warning('科研成果介绍不能为空');
        return;
      }
      await saveScientificProject({
        id: scientificProjectData?.id,
        publicStatus: 0,
        scientificAchievement:
          typeof scientificAchievement === 'string'
            ? scientificAchievement
            : scientificAchievement.toHTML(),
      });
      setCurrent(1);
    } else {
      await teamFormRef.current?.validateFields();
      const flag = teamData.memberList.some((item: RecordItem) => item.memberName);
      if (!flag) {
        message.warning('成员名称不能为空');
        return;
      }
      // 判断是否有合作伙伴但没有选择头像的数据
      const emptyMemberPhotoFlag = teamData?.memberList?.some(
        (item: RecordItem) => item.projectIdentity === 3 && !item.memberPhoto,
      );
      if (emptyMemberPhotoFlag) {
        message.warning('请将合作伙伴头像上传后再保存');
        return;
      }
      const params = {
        teamName: teamData.teamName,
        teamPhoto: teamData.teamPhoto,
        teamProfiles: teamData.teamProfiles,
        projectId: scientificProjectData?.id,
        members: JSON.stringify(
          teamData.memberList.map((item: RecordItem) => ({
            ...item,
            // memberName: item.memberName,
            // memberPhoto: item.memberPhoto,
            // memberProfiles: item.memberProfiles,
            // projectIdentity: item.projectIdentity,
            // id: item.id,
          })),
        ),
        id: teamData?.teamId,
      };
      await saveScientificProjectTeam(params);
      message.success('公开成功,课题组将在科研广场中展示');
      queryData();
      onCancel(current);
    }
  };

  return (
    <Modal
      onOk={handleSubmit}
      okText={current === 0 ? '下一步' : '确认'}
      maskClosable={false}
      onCancel={() => {
        onCancel(current);
      }}
      open={open}
      title={null}
      className={styles.openProjectModal}
      getContainer={() =>
        document.getElementById('scientificProjectDetailContainer') as HTMLElement
      }
      width={800}
      closeIcon={<img style={{ width: 16, height: 16 }} src={closeIcon} />}
      centered
    >
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <span>公开课题组</span>
          <span>公开课题组需要填写相关介绍</span>
        </div>
        <div className={styles.mainBox}>
          <div className={styles.main}>
            <div className={styles.steps}>
              <Steps
                current={current}
                onChange={() => {
                  if (current === 1) {
                    setCurrent(0);
                  }
                }}
                items={[
                  {
                    title: '填写科研成果介绍',
                  },
                  {
                    title: '填写科研团队介绍',
                  },
                ]}
              />
            </div>
            <div className={styles.intr}>
              {current === 0 ? (
                <IntrAchievement getData={getRichData} defaultData={scientificAchievement} />
              ) : (
                <IntrTeam getData={getFormData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Container;
