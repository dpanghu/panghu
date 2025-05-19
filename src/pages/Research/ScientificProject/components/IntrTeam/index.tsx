import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Form, Input, Select, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import UploadRepositoryModal from '@/components/UploadRepositoryModal';
import { Image } from 'antd';
import { getResourceById, getSessionStorage } from '@/utils/utils';
import { nanoid } from 'nanoid';
import { getScientificProjectTeam } from '@/services/research';
interface TProps {
  getData: (params: RecordItem, form: any) => void;
}

const Container: React.FC<TProps> = ({ getData }) => {
  const scientificProjectData = getSessionStorage('scientificProject');
  const [form] = useForm();
  const [openFileModal, setOpenFileModal] = useState<boolean>(false);
  const [openMemberPhoneModal, setOpenMemberPhoneModal] = useState<boolean>(false);
  const [teamPhotoList, setTeamPhotoList] = useState<string[]>([]);
  const [clickPhoneId, setClickPhoneId] = useState<string>('');
  const [memberList, setMemberList] = useState<RecordItem[]>([
    {
      createId: nanoid(),
      projectIdentity: 2,
      memberName: '',
      memberPhoto: '',
      memberProfiles: '',
    },
  ]);
  const [teamDetail, setTeamDetail] = useState<RecordItem>({});

  const queryData = async () => {
    const result = await getScientificProjectTeam({
      projectId: scientificProjectData?.id,
    });
    if (!result) {
      return;
    }
    setTeamDetail(result);
    setTeamPhotoList(result?.teamPhoto?.split(','));
    setMemberList(
      JSON.parse(result.members).map((item: RecordItem) => ({
        ...item,
        createId: item.id,
      })),
    );
    form.setFieldsValue({
      teamName: result.teamName,
      teamProfiles: result.teamProfiles,
    });
  };

  const cancelModal = () => {
    setOpenFileModal(false);
    setOpenMemberPhoneModal(false);
  };

  const confirmMemberModal = (resourceList: RecordItem[]) => {
    if (!resourceList.length) {
      message.warning('请选择图片');
      return;
    }
    setMemberList((list: RecordItem[]) =>
      list.map((item) => {
        if (item.createId === clickPhoneId) {
          return {
            ...item,
            memberPhoto: resourceList[0].id,
          };
        } else {
          return item;
        }
      }),
    );
    setOpenMemberPhoneModal(false);
  };

  const confirmModal = (resourceList: RecordItem[]) => {
    if (teamPhotoList.length + resourceList.length > 3) {
      message.warning('团队合照最多选择三张');
      return;
    }
    if (!resourceList.length) {
      message.warning('请选择图片');
      return;
    }
    if (resourceList.length > 3) {
      message.warning('最多上传三张团队合照');
      return;
    }
    const ids = resourceList.map((item) => item.id);
    setTeamPhotoList([...teamPhotoList, ...ids]);
    setOpenFileModal(false);

    getData(
      {
        ...form.getFieldsValue(),
        teamPhoto: ids.join(','),
        memberList,
        teamId: teamDetail?.id,
      },
      form,
    );
  };

  const handleChangeProjectIdentity = (value: number, id: string) => {
    setMemberList((list: RecordItem[]) =>
      list.map((item) => {
        if (item.createId === id) {
          return {
            ...item,
            projectIdentity: value,
          };
        } else {
          return item;
        }
      }),
    );
  };

  const handleChangeMemberName = (value: string, id: string) => {
    setMemberList((list: RecordItem[]) =>
      list.map((item) => {
        if (item.createId === id) {
          return {
            ...item,
            memberName: value.trim(),
          };
        } else {
          return item;
        }
      }),
    );
  };

  const handleChangeMemberProfiles = (value: string, id: string) => {
    setMemberList((list: RecordItem[]) =>
      list.map((item) => {
        if (item.createId === id) {
          return {
            ...item,
            memberProfiles: value,
          };
        } else {
          return item;
        }
      }),
    );
  };

  const handleAddMember = () => {
    setMemberList([
      ...memberList,
      {
        createId: nanoid(),
        projectIdentity: 2,
        memberName: '',
        memberPhoto: '',
        memberProfiles: '',
      },
    ]);
  };

  const deleteMember = (id: string) => {
    const memberArr = memberList.filter((item) => item.createId !== id);
    setMemberList(memberArr);
  };

  useEffect(() => {
    getData(
      {
        ...form.getFieldsValue(),
        teamPhoto: teamPhotoList.join(','),
        memberList,
        teamId: teamDetail?.id,
      },
      form,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberList]);

  useEffect(() => {
    queryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>团队信息</div>
      <Form
        name="teamInfoForm"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        initialValues={{}}
        onValuesChange={(changedValues: any, values: any) => {
          getData(
            {
              ...values,
              teamPhoto: teamPhotoList.join(','),
              memberList,
              teamId: teamDetail?.id,
            },
            form,
          );
        }}
      >
        <Form.Item
          label="团队名称"
          name="teamName"
          rules={[
            { required: true, message: '请输入团队名称!' },
            { whitespace: true, message: '团队名称不能为空!' },
          ]}
        >
          <Input
            placeholder="请输入团队名称,最长为20字符"
            maxLength={20}
            style={{ lineHeight: '32px' }}
          />
        </Form.Item>
        <Form.Item
          label="团队介绍"
          name="teamProfiles"
          rules={[
            { required: true, message: '请输入团队介绍!' },
            { whitespace: true, message: '团队介绍不能为空!' },
          ]}
        >
          <Input.TextArea
            placeholder="请输入团队介绍,最长为200字符"
            maxLength={200}
            showCount
            rows={4}
            style={{ resize: 'none' }}
          />
        </Form.Item>
        <Form.Item label="团队合照" name="teamPhoto" tooltip="团队合照最多上传三张">
          <div className={styles.photoContainer}>
            <div
              className={styles.uploadCover}
              onClick={() => {
                setOpenFileModal(true);
              }}
            >
              <PlusOutlined style={{ fontSize: 18 }} />
              <span style={{ display: 'inline-block', marginTop: 16 }}>上传团队合照</span>
            </div>
            {teamPhotoList.map((item) => (
              <div className={styles.imgContainer} key={item}>
                <CloseCircleOutlined
                  className={styles.imgClose}
                  onClick={() => {
                    setTeamPhotoList(teamPhotoList.filter((ele) => ele !== item));
                    getData(
                      {
                        ...form.getFieldsValue(),
                        teamPhoto: teamPhotoList.filter((ele) => ele !== item).join(','),
                        memberList,
                        teamId: teamDetail?.id,
                      },
                      form,
                    );
                  }}
                />
                <Image
                  width={192}
                  src={getResourceById(item)}
                  height={160}
                  style={{ borderRadius: 8 }}
                />
              </div>
            ))}
          </div>
        </Form.Item>
      </Form>
      <div className={styles.title}>成员信息</div>
      <div className={styles.memberContainer}>
        {memberList.map((item, index) => (
          <div key={item.createId}>
            <div className={styles.memberDetail}>
              {!!index && (
                <CloseCircleOutlined
                  className={styles.deleteMember}
                  onClick={() => {
                    deleteMember(item.createId);
                  }}
                />
              )}
              <div
                className={styles.photo}
                onClick={() => {
                  setClickPhoneId(item.createId);
                  setOpenMemberPhoneModal(true);
                }}
              >
                {item.memberPhoto ? (
                  <Image
                    src={getResourceById(item.memberPhoto)}
                    style={{ borderRadius: 8 }}
                    width={120}
                    height={160}
                    preview={false}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <PlusOutlined style={{ fontSize: 18 }} />
                    <span style={{ display: 'inline-block', marginTop: 6 }}>上传个人照片</span>
                  </div>
                )}
              </div>
              <div className={styles.detail}>
                <div className={styles.header}>
                  <Select
                    style={{ width: 185 }}
                    value={item.projectIdentity}
                    onChange={(value: number) => {
                      handleChangeProjectIdentity(value, item.createId);
                    }}
                  >
                    <Select.Option key={1} value={1}>
                      项目负责人
                    </Select.Option>
                    <Select.Option key={2} value={2}>
                      项目成员
                    </Select.Option>
                    <Select.Option key={3} value={3}>
                      合作伙伴
                    </Select.Option>
                  </Select>
                  <Input
                    style={{ width: 178 }}
                    maxLength={10}
                    placeholder="请输入姓名，不超过10字"
                    value={item.memberName}
                    onChange={(e) => {
                      handleChangeMemberName(e.target.value, item.createId);
                    }}
                  />
                </div>
                <div className={styles.footer}>
                  <Input.TextArea
                    placeholder="请输入该成员的简单介绍，不超过100字"
                    maxLength={60}
                    showCount
                    rows={4}
                    style={{ resize: 'none' }}
                    value={item.memberProfiles}
                    onChange={(e) => {
                      handleChangeMemberProfiles(e.target.value, item.createId);
                    }}
                  />
                </div>
              </div>
            </div>
            {index === memberList.length - 1 && (
              <div className={styles.btnNew} onClick={handleAddMember}>
                <PlusOutlined />
                添加成员信息
              </div>
            )}
          </div>
        ))}
      </div>
      {openFileModal && (
        <UploadRepositoryModal
          handleCancel={cancelModal}
          objectKey={'scientificProject'}
          isMultiple={true}
          fileTypes={['png', 'jpg', 'gif', 'jpeg']}
          handleOk={confirmModal}
          uploadType={'image'}
          imgLimitSize={10 * 1024 * 1024}
        />
      )}
      {openMemberPhoneModal && (
        <UploadRepositoryModal
          handleCancel={cancelModal}
          objectKey={'scientificProject'}
          isMultiple={false}
          fileTypes={['png', 'jpg', 'gif', 'jpeg']}
          handleOk={confirmMemberModal}
          uploadType={'image'}
          imgLimitSize={10 * 1024 * 1024}
        />
      )}
    </div>
  );
};

export default Container;
