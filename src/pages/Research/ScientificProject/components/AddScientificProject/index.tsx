import platformIcon from '@/assets/images/reSearch/platform.png';
import banner1 from '@/assets/images/reSearch/projectCover/1.png';
import banner2 from '@/assets/images/reSearch/projectCover/2.png';
import banner3 from '@/assets/images/reSearch/projectCover/3.png';
import banner4 from '@/assets/images/reSearch/projectCover/4.png';
import cover1 from '@/assets/images/reSearch/projectCover/t1.png';
import cover2 from '@/assets/images/reSearch/projectCover/t2.png';
import cover3 from '@/assets/images/reSearch/projectCover/t3.png';
import cover4 from '@/assets/images/reSearch/projectCover/t4.png';
import { saveScientificProject } from '@/services/research';
import { getSessionStorage, updateSessionStorage } from '@/utils/utils';
import { Button, Form, Input, Radio, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';
import CaseCard from '../CaseCard';
import DataSetCard from '../DataSetCard';
import SubSetModal from '../SubSetModal';
import styles from './index.less';
import closeIcon from '@/assets/images/reSearch/closeIcon.png';
import Breadcrumbs from '@/pages/Research/components/Breadcrumbs';

export const projectCover = [
  {
    cover: cover1,
    banner: banner1,
  },
  {
    cover: cover2,
    banner: banner2,
  },
  {
    cover: cover3,
    banner: banner3,
  },
  {
    cover: cover4,
    banner: banner4,
  },
];

const Container: React.FC = () => {
  const scientificProjectData = getSessionStorage('scientificProject');
  const caseData = getSessionStorage('case');
  const dataSetData = getSessionStorage('dataSet');

  const [form] = useForm();
  const [subSetOpen, setSubOpen] = useState(false);
  const [subSetType, setSubSetType] = useState<number>(0);
  const [subSetInfo, setSubSetInfo] = useState<RecordItem[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isfrom = queryParams.get('isfrom');

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const params: RecordItem = {
      name: values.name.trim(),
      note: values.note,
      isPropers: values.isPropers,
      subSetType: values.subSetType,
      projectEnv: 'BIP3',
    };
    if (subSetInfo?.length && subSetType === 1) {
      params.subSetInfo = JSON.stringify(
        subSetInfo.map((item) => ({
          subSetId: item.id,
          subSetName: item.casesName,
          subSetDesc: item.casesDesc,
          isPropers: item.isPropose,
          platformCasesId: item.platformCasesId,
          platformCasesName: item.platformCasesName,
          extInfo: {
            casesCover: item.casesCover,
            tagList: [
              ...JSON.parse(item.pertainDomain || '[]').flat(),
              ...JSON.parse(item.involvingTechnology || '[]').flat(),
            ],
          },
        })),
      );
    }
    if (subSetInfo.length && subSetType === 2) {
      params.subSetInfo = JSON.stringify(
        subSetInfo.map((item) => ({
          subSetId: item.id,
          subSetName: item.name,
          subSetDesc: item.datasetDesc,
          isPropers: item.isPropers,
          extInfo: {
            referenceDatasets: item.referenceDatasets,
            tagList: [
              ...JSON.parse(item.domainLabel || '[]').flat(),
              ...JSON.parse(item.industryLabel || '[]').flat(),
            ],
          },
        })),
      );
    }
    if (scientificProjectData?.id) {
      params.id = scientificProjectData?.id;
    }
    // 新增时传入默认封面
    if (!scientificProjectData?.id) {
      params.projectCover = Math.floor(Math.random() * 4);
    }
    await saveScientificProject({
      ...params,
    });
    if (scientificProjectData?.id) {
      message.success('课题组编辑成功');
    } else {
      message.success('课题组新增成功');
    }
    history.push('/scientificProject');
  };

  const handleChooseSubSet = (record: RecordItem[]) => {
    setSubSetInfo(record);
    setSubOpen(false);
  };

  useEffect(() => {
    // 如果是编辑 数据回显
    if (scientificProjectData?.id) {
      document.title = '编辑课题组';
      form.setFieldsValue({
        name: scientificProjectData.name,
        note: scientificProjectData.note,
        isPropers: scientificProjectData.isPropers,
        subSetType: scientificProjectData.subSetType,
      });
      setSubSetType(scientificProjectData.subSetType);
      if (scientificProjectData.subSetType === 1) {
        setSubSetInfo(
          scientificProjectData.subSet?.map((item: RecordItem) => ({
            id: item.subSetId,
            isPropose: item.isPropers,
            casesDesc: item.subSetDesc,
            casesName: item.subSetName,
            casesCover: JSON.parse(item.extInfo || '{}')?.casesCover,
            platformCasesName: item?.platformCasesName,
            tagList: JSON.parse(item.extInfo || '{}')?.tagList,
          })),
        );
      } else if (scientificProjectData.subSetType === 2) {
        setSubSetInfo(
          scientificProjectData.subSet?.map((item: RecordItem) => ({
            id: item.subSetId,
            modifyTime: item.modifyTime,
            isPropers: item.isPropers,
            referenceDatasets: JSON.parse(item.extInfo || '{}')?.referenceDatasets,
            datasetDesc: item.subSetDesc,
            name: item.subSetName,
            tagList: JSON.parse(item.extInfo || '{}')?.tagList,
          })),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scientificProjectData?.id, document.title]);

  useEffect(() => {
    if (caseData.id) {
      form.setFieldValue('subSetType', 1);
      setSubSetType(1);
      setSubSetInfo([caseData]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseData.id]);

  useEffect(() => {
    if (dataSetData.id) {
      form.setFieldValue('subSetType', 2);
      setSubSetType(2);
      setSubSetInfo([dataSetData]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSetData.id]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Breadcrumbs
          oneTitle="课题组列表"
          seTitle={scientificProjectData.id ? '编辑课题组' : '新建课题组'}
          oneRoutePath="/scientificProject"
        />
      </div>
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span>{scientificProjectData.id ? '编辑课题组' : '新建课题组'}</span>
          </div>
          <div className={styles.projectForm}>
            <Form
              name="projectForm"
              form={form}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 8 }}
              initialValues={{ isPropers: 0, subSetType: 0, projectEnv: 'BIP3' }}
              onValuesChange={(changedValues: any) => {
                if (changedValues.subSetType || changedValues.subSetType === 0) {
                  setSubSetType(changedValues.subSetType);
                  setSubSetInfo([]);
                }
              }}
            >
              <Form.Item
                label="课题组名称"
                name="name"
                rules={[
                  { required: true, message: '请输入课题组名称!' },
                  { whitespace: true, message: '课题组名称不能为空!' },
                ]}
              >
                <Input placeholder="请输入课题组名称,最长为30字符" maxLength={30} />
              </Form.Item>
              <Form.Item
                label="课题组简介"
                name="note"
                rules={[
                  { required: true, message: '请输入课题组简介!' },
                  { whitespace: true, message: '课题组简介不能为空!' },
                ]}
              >
                <Input.TextArea
                  placeholder="请输入课题组简介"
                  maxLength={100}
                  showCount
                  rows={4}
                  style={{
                    resize: 'none',
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-line',
                    wordWrap: 'break-word',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="课题组环境"
                name="projectEnv"
                rules={[{ required: true, message: '请选择课题组环境!' }]}
              >
                <div className={styles.platform}>
                  <img src={platformIcon} alt="" />
                </div>
              </Form.Item>
              <Form.Item
                label="课题组资源"
                name="subSetType"
                rules={[{ required: true, message: '请选择课题组资源!' }]}
              >
                {isfrom === 'case' || isfrom === 'dataSet' || scientificProjectData.id ? (
                  <Radio.Group disabled>
                    <Radio value={0}>无</Radio>
                    {/* <Radio value={1}>案例</Radio> */}
                    <Radio value={2}>数据集</Radio>
                  </Radio.Group>
                ) : (
                  <Radio.Group>
                    <Radio value={0}>无</Radio>
                    {/* <Radio value={1}>案例</Radio> */}
                    <Radio value={2}>数据集</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              {!!subSetType && (
                <Form.Item
                  label={subSetType === 1 ? '选择案例' : '选择数据集'}
                  name="projectEnv"
                  rules={[
                    {
                      required: true,
                      validator(rule, value, callback) {
                        if (subSetInfo?.length) {
                          callback();
                        } else {
                          callback('请选择课题组环境!');
                        }
                      },
                    },
                  ]}
                >
                  {subSetInfo?.length ? (
                    subSetType === 1 ? (
                      <div>
                        {isfrom === 'case' ||
                        isfrom === 'dataSet' ||
                        scientificProjectData.id ? null : (
                          <Button
                            onClick={() => {
                              setSubOpen(true);
                            }}
                            type="ghost"
                          >
                            {subSetType === 1 ? '选择案例' : '选择数据集'}
                          </Button>
                        )}

                        <div style={{ marginTop: 10 }}>
                          {subSetInfo.map((item) => (
                            <div key={item.id} className={styles.panel}>
                              {isfrom === 'case' ||
                              isfrom === 'dataSet' ||
                              scientificProjectData.id ? null : (
                                // <CloseCircleOutlined
                                //   className={styles.close}
                                //   style={{ left: '285px' }}
                                //   onClick={() => {
                                //     setSubSetInfo([]);
                                //   }}
                                // />
                                <img
                                  src={closeIcon}
                                  className={styles.close}
                                  style={{ left: '285px' }}
                                  onClick={() => {
                                    setSubSetInfo([]);
                                  }}
                                />
                              )}
                              <CaseCard
                                caseData={item}
                                isPreview={true}
                                isEdit={Boolean(scientificProjectData.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        {isfrom === 'case' ||
                        isfrom === 'dataSet' ||
                        scientificProjectData.id ? null : (
                          <Button
                            onClick={() => {
                              setSubOpen(true);
                            }}
                            type="ghost"
                          >
                            {subSetType === 1 ? '选择案例' : '选择数据集'}
                          </Button>
                        )}
                        <div className={styles.select}>
                          {subSetInfo.map((item) => (
                            <div key={item.id} className={styles.panel}>
                              {isfrom === 'case' ||
                              isfrom === 'dataSet' ||
                              scientificProjectData.id ? null : (
                                <img
                                  src={closeIcon}
                                  className={styles.close}
                                  style={{ left: '390px', width: 20 }}
                                  onClick={() => {
                                    setSubSetInfo(subSetInfo.filter((i) => i.id !== item.id));
                                  }}
                                />
                                // <CloseCircleOutlined
                                //   className={styles.close}
                                //   style={{ left: '390px' }}
                                //   onClick={() => {
                                //     setSubSetInfo(subSetInfo.filter((i) => i.id !== item.id));
                                //   }}
                                // />
                              )}
                              <DataSetCard
                                isPreview={true}
                                dataSetData={item}
                                isEdit={Boolean(scientificProjectData.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ) : (
                    <Button
                      onClick={() => {
                        setSubOpen(true);
                      }}
                      type="ghost"
                    >
                      {subSetType === 1 ? '选择案例' : '选择数据集'}
                    </Button>
                  )}
                </Form.Item>
              )}
            </Form>
          </div>
          <div className={styles.footer}>
            <Button
              onClick={() => {
                history.push('/scientificProject');
                updateSessionStorage('scientificProject', {});
              }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              提交
            </Button>
          </div>
        </div>
      </div>
      {subSetOpen && (
        <SubSetModal
          subSetType={subSetType}
          open={subSetOpen}
          baseRecord={subSetInfo}
          onCancel={() => {
            setSubOpen(false);
          }}
          onOk={handleChooseSubSet}
        />
      )}
    </div>
  );
};

export default Container;
