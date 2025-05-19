import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Button, Cascader, Form, Input, Radio, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { CloseCircleOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { TAG } from '../../config';
import { getResourceById, getSessionStorage, updateSessionStorage } from '@/utils/utils';
import {
  getAttachmentId,
  getProductCaseList,
  getProductCasePost,
  getScientificTagAll,
  saveNewCase,
  updateScientificCase,
} from '@/services/research';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { uploads } from '@/services/common';
import platformIcon from '@/assets/images/reSearch/platform.png';
import type { ColumnsType } from 'antd/lib/table';
import { history } from 'umi';
import CoverModal, { getCoverByIndex } from '@/pages/Research/components/CoverModal';
import { getFileMajorType } from '@/utils/file_type_contents';
import CaseModal from './CaseModal';
import Header from '../Header';
import AddTag from '../AddTag';

interface TProps {}

// const { Option } = Select;
const { SHOW_CHILD } = Cascader;

const Container: React.FC<TProps> = () => {
  const controls: any[] = [
    'undo',
    'redo',
    'separator',
    'headings',
    'font-size',
    'line-height',
    'letter-spacing',
    'separator',
    'text-color',
    'bold',
    'italic',
    'underline',
    'strike-through',
    'separator',
    'text-align',
    'separator',
    'separator',
    'link',
    'separator',
    {
      key: 'media',
      text: '本地上传',
    },
    'separator',
  ];
  const caseData = getSessionStorage('case');
  const [form] = useForm();
  const [openFileModal, setOpenFileModal] = useState(false);
  const [isShowAddTag, setIsShowAddTag] = useState(false);
  const [tagTypeEnum, setTagTypeEnum] = useState('');
  const [subject, setSubject] = useState<any>([]);
  const [casesCover, setCasesCover] = useState('');
  const [tagObj, setTagObj] = useState<any>({});
  const [industryAnalysis, setIndustryAnalysis] = useState<any>('');
  const [companyIntroduction, setCompanyIntroduction] = useState<any>('');
  const [caseStudy, setCaseStudy] = useState<any>('');
  const [thinkingConclusion, setThinkingConclusion] = useState<any>('');
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [postList, setPostList] = useState<RecordItem>([]);
  const [productCase, setProductCase] = useState<RecordItem[]>([]);
  const [selectedKey, setSelectedRowKey] = useState<string[]>([]);

  const getColumns = (data: RecordItem) => {
    const columns: ColumnsType<RecordItem> = [
      {
        title: '序号',
        dataIndex: 'index',
        render(value, record, index) {
          const i = data.limit * (data.pageNum - 1);
          return i + index + 1;
        },
        width: 65,
        align: 'center',
      },
      {
        title: '案例ID',
        dataIndex: 'id',
        ellipsis: true,
      },
      {
        title: '案例名称',
        dataIndex: 'caseName',
        ellipsis: true,
      },
      {
        title: '使用平台',
        dataIndex: 'platform',
        align: 'center',
        ellipsis: true,
        render() {
          return 'BIP';
        },
      },
    ];
    return columns;
  };

  const openUploadFileModal = () => {
    setOpenFileModal(true);
  };

  const cancelModal = () => {
    setOpenFileModal(false);
  };

  const getScientificTagAllData = () => {
    getScientificTagAll({ tagTypeEnum: 'industry' }).then((res) => {
      const arr = res
        .filter((item: any) => !item.parentCode)
        .map((item: any) => ({
          label: item.name,
          value: item.code,
          id: item.id,
          //   disabled: true,
          children: [],
        }));
      arr.map((item: any) => {
        res.map((iitem: any) => {
          if (item.value === iitem.parentCode) {
            item.children.push({
              label: iitem.name,
              value: iitem.code,
            });
          }
        });
        return item;
      });
      setSubject(arr);
    });
  };

  const confirmModal = async (coverId: string) => {
    if (!coverId) {
      message.warning('请选择图片');
      return;
    }
    await setCasesCover(coverId);
    setOpenFileModal(false);
  };

  const handleAddTag = (type: string) => {
    setIsShowAddTag(true);
    setTagTypeEnum(type);
  };

  const handleDeleteTag = (index: number, type: string) => {
    tagObj[type].splice(index, 1);
    setTagObj({ ...tagObj });
  };

  const handleClickOk = (arr: any) => {
    if (arr.length > 5) {
      message.warning('最多选择5个标签');
      return;
    }

    tagObj[tagTypeEnum] = arr;
    setTagObj({ ...tagObj });
    setIsShowAddTag(false);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const params = {
      casesName: values.casesName.trim(),
      casesCode: values.casesCode,
      casesDesc: values.casesDesc,
      isPropose: values.isPropose,
      pertainIndustry: JSON.stringify(values.pertainIndustry),
      pertainDomain: JSON.stringify(tagObj.domain),
      involvingTechnology: JSON.stringify(tagObj.technology),
      casesCover: casesCover,
      platformCasesId: selectedKey[0] || '',
      platformCasesName: productCase[0]?.caseName,
      platformCtype: productCase[0]?.ctype,
      industryAnalysis: industryAnalysis.toHTML(),
      companyIntroduction: companyIntroduction.toHTML(),
      caseStudy: caseStudy.toHTML(),
      thinkingConclusion: thinkingConclusion.toHTML(),
      casesState: 0,
      casePostData: JSON.stringify(
        postList.map((item: RecordItem) => ({
          platformCasesId: item.caseId,
          postCode: item.postCode,
          postName: item.postName,
          postDesc: item.postDesc || '',
          id: item.id,
        })),
      ),
    };
    if (!caseData?.casesCode) {
      await saveNewCase(params);
      message.success('案例提交成功，请查看案例详情并进行发布');
    } else {
      await updateScientificCase(params);
      message.success('案例编辑成功，请查看案例详情并进行发布');
    }
    updateSessionStorage('case', { ...caseData, ...params });
    history.push('/viewCase');
  };
  const handleChangeRichText = (e: any, type: string) => {
    switch (type) {
      case 'industryAnalysis':
        setIndustryAnalysis(e);
        break;
      case 'companyIntroduction':
        setCompanyIntroduction(e);
        break;
      case 'caseStudy':
        setCaseStudy(e);
        break;
      case 'thinkingConclusion':
        setThinkingConclusion(e);
        break;
      default:
        break;
    }
  };

  const onCancelCaseModal = () => {
    setCaseModalOpen(false);
  };

  const onChooseCase = async (selectedRowKey: string[], selectedRow: RecordItem[]) => {
    setCaseModalOpen(false);
    setProductCase(selectedRow);
    setSelectedRowKey(selectedRowKey);

    const result = await getProductCasePost({
      caseId: selectedRowKey[0],
      pageNum: 1,
      limit: 99999,
    });
    setPostList(result.data);
  };

  const handleCancelPost = async () => {
    setPostList([]);
    setProductCase([]);
    setSelectedRowKey([]);
  };

  const handleChangePost = (value: string, id: string) => {
    setPostList((postArr: RecordItem[]) =>
      postArr.map((item) => {
        if (item.id !== id) {
          return item;
        } else {
          return {
            ...item,
            postDesc: value,
          };
        }
      }),
    );
  };

  const uploadEditor = async (param: RecordItem) => {
    let file = param.file;
    const data = await uploads({
      bucketNameType: 'pub',
      ossResCategory: 'builder',
      objectKey:
        `/${
          JSON.parse(window.sessionStorage.getItem('projectData') || '{}').projectVersionId
        }/task/${file.name}` || '',
    });
    const formData = new FormData();
    Object.keys(data.tokenParams).forEach((key) => {
      formData.append(key, data.tokenParams[key]);
    });
    formData.append('file', file);
    fetch(data.endpoint, {
      method: 'POST',
      body: formData,
    })
      .then(async () => {
        const attachmentType = (file.name as any).split('.').pop().toLocaleLowerCase();
        const params = {
          attachmentUrl: data.file_url,
          attachmentName: file.name,
          attachmentCategory: getFileMajorType(attachmentType),
          attachmentSize: file.size,
          isConvert: 1,
          suffixName: attachmentType,
        };
        const id = await getAttachmentId(params);
        param.success({
          url: getResourceById(id) as string,
          meta: {
            id: '',
            title: '',
            alt: '',
            loop: false,
            autoPlay: false,
            controls: false,
            poster: '',
          },
        });
      })
      .catch(() => {
        param.error({
          msg: 'unable to upload.',
        });
      });
  };

  useEffect(() => {
    getScientificTagAllData();
  }, []);

  useEffect(() => {
    // 如果是编辑 数据回显
    if (caseData?.casesCode) {
      document.title = '编辑案例';
      setThinkingConclusion(caseData.thinkingConclusion);
      setIndustryAnalysis(caseData.industryAnalysis);
      setCompanyIntroduction(caseData.companyIntroduction);
      setCaseStudy(caseData.caseStudy);
      form.setFieldsValue({
        casesName: caseData.casesName,
        casesCode: caseData.casesCode,
        casesDesc: caseData.casesDesc,
        isPropose: caseData.isPropose,
        pertainIndustry: JSON.parse(caseData.pertainIndustry || '[]'),
      });
      setTagObj({
        domain: JSON.parse(caseData.pertainDomain || '[]'),
        technology: JSON.parse(caseData.involvingTechnology || '[]'),
      });
      setCasesCover(caseData.casesCover || '');
      setPostList(
        JSON.parse(caseData?.casePostData || '[]').map((item: RecordItem) => ({
          caseId: item.platformCasesId,
          postCode: item.postCode,
          postName: item.postName,
          postDesc: item.postDesc || '',
          id: item.id,
        })),
      );
      setProductCase([
        {
          caseName: caseData.platformCasesName,
          id: caseData.platformCasesId,
          ctype: caseData.platformCtype,
        },
      ]);
      setSelectedRowKey([caseData.platformCasesId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseData?.casesCode, document.title]);

  return (
    <div className={styles.container} id="addCaseContainer">
      <Header
        seTitle="案例设置"
        thTitle={caseData.id ? '编辑案例' : '新建案例'}
        routePath={'/case'}
      />
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span>{caseData.id ? '编辑案例' : '新建案例'}</span>
          </div>
          <div className={styles.caseForm}>
            <Form
              name="caseForm"
              form={form}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 8 }}
              initialValues={{ platform: 'BIP3', isPropose: 0 }}
              onValuesChange={(changedValues: any) => {
                const { pertainIndustry } = changedValues;
                if (pertainIndustry && pertainIndustry.length >= 5) {
                  const selectedOptions = pertainIndustry.slice(0, 5);
                  form.setFieldsValue({ pertainIndustry: selectedOptions });
                }
              }}
            >
              <Form.Item
                label={<div className={styles.formTitle}>基本信息</div>}
                colon={false}
              ></Form.Item>
              <Form.Item
                label="案例名称"
                name="casesName"
                rules={[
                  { required: true, message: '请输入案例名称!' },
                  { whitespace: true, message: '案例名称不能为空!' },
                ]}
              >
                <Input placeholder="请输入案例名称,最长为30字符" maxLength={30} />
              </Form.Item>
              <Form.Item
                label="案例编码"
                name="casesCode"
                rules={[{ required: true, message: '请输入案例编码!' }]}
              >
                <Input
                  placeholder="请输入案例名称,最长为30字符"
                  maxLength={30}
                  disabled={!!caseData?.casesCode}
                />
              </Form.Item>
              <Form.Item
                label="案例简介"
                name="casesDesc"
                rules={[
                  { required: true, message: '请输入案例简介!' },
                  { whitespace: true, message: '案例简介不能为空!' },
                ]}
              >
                <Input.TextArea
                  placeholder="请输入案例简介"
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
                label="是否推荐"
                name="isPropose"
                rules={[{ required: true, message: '请选择是否推荐!' }]}
              >
                <Radio.Group>
                  <Radio value={0}>不推荐</Radio>
                  <Radio value={1}>推荐</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="行业分类"
                name="pertainIndustry"
                id="pertainIndustryCascaderContainer"
              >
                <Cascader
                  showCheckedStrategy={SHOW_CHILD}
                  placeholder="请选择行业分类,最多支持5项"
                  options={subject}
                  // disabled={selectedOptions.length >= 5}
                  multiple
                  maxTagCount="responsive"
                  displayRender={(label) => label.join('/')}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                />
              </Form.Item>
              {TAG.map((tag: any) => (
                <Form.Item label={tag.name} key={tag.key}>
                  <div className={styles.industry}>
                    <div className={styles.tags}>
                      {tagObj[tag.key]?.map((item: any, index: number) => (
                        <span className={styles.tagBox} key={item.code}>
                          {item.name}
                          <CloseOutlined
                            className={styles.icon}
                            onClick={() => handleDeleteTag(index, tag.key)}
                          />
                        </span>
                      ))}
                    </div>
                    <div className={styles.addTag} onClick={() => handleAddTag(tag.key)}>
                      <PlusOutlined style={{ marginRight: 5 }} />
                      <span>添加标签</span>
                    </div>
                  </div>
                </Form.Item>
              ))}
              <Form.Item
                label="案例封面"
                name="casesCover"
                rules={[
                  {
                    required: true,
                    validator(rule, value, callback) {
                      if (casesCover) {
                        callback();
                      } else {
                        callback('请选择案例封面');
                      }
                    },
                  },
                ]}
              >
                <div className={styles.logoUpload}>
                  <div className={styles.uploadButton} onClick={openUploadFileModal}>
                    {casesCover ? (
                      <img
                        src={getCoverByIndex(casesCover)}
                        alt="课程封面"
                        title="课程封面"
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <>
                        <span>
                          <PlusOutlined />
                        </span>
                        <span>选择封面</span>
                      </>
                    )}
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                label={<div className={styles.formTitle}>案例配置</div>}
                colon={false}
              ></Form.Item>
              <Form.Item
                label="使用平台"
                name="platform"
                rules={[{ required: true, message: '请选择使用平台!' }]}
              >
                <div className={styles.platform}>
                  <img src={platformIcon} alt="" />
                </div>
              </Form.Item>
              <Form.Item
                label="关联案例"
                name="platformCasesId"
                rules={[
                  {
                    required: true,
                    validator(rule, value, callback) {
                      if (selectedKey[0]) {
                        callback();
                      } else {
                        callback('请选择关联案例');
                      }
                    },
                  },
                ]}
              >
                {selectedKey.length ? (
                  <div className={styles.productCase}>
                    <CloseCircleOutlined className={styles.closeIcon} onClick={handleCancelPost} />
                    <div className={styles.detail}>
                      <div className={styles.t1}>
                        <div className={styles.info}>
                          <span>案例ID: </span>
                          <span>{productCase[0]?.id}</span>
                        </div>
                        <div className={styles.info}>
                          <span>使用平台: </span>
                          <span>BIP</span>
                        </div>
                      </div>
                      <div className={styles.t2}>
                        <div className={styles.info}>
                          <span>案例名称: </span>
                          <span>{productCase[0]?.caseName}</span>
                        </div>
                        <div className={styles.info}>
                          <span>案例角色: </span>
                          <span
                            title={
                              postList.length
                                ? postList.map((item: RecordItem) => item.postName)
                                : '暂无角色'
                            }
                          >
                            {postList.length
                              ? postList.map((item: RecordItem, index: number) =>
                                  index === postList.length - 1
                                    ? item.postName
                                    : `${item.postName}、`,
                                )
                              : '暂无角色'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {postList.length ? (
                      <div className={styles.postBox}>
                        {postList.map((item: RecordItem) => (
                          <div key={item.id} className={styles.post}>
                            <div className={styles.postName}>{item.postName}</div>
                            <div className={styles.postIpt}>
                              <Input
                                style={{ width: '100%', height: 40 }}
                                value={item.postDesc || undefined}
                                maxLength={20}
                                placeholder="请输入角色描述，最多20个字符"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleChangePost(value, item.id);
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Button
                    className="ant-btn-ghost"
                    onClick={() => {
                      setCaseModalOpen(true);
                    }}
                  >
                    选择案例
                  </Button>
                )}
              </Form.Item>
              <Form.Item
                label={<div className={styles.formTitle}>案例介绍</div>}
                colon={false}
              ></Form.Item>
              <Form.Item label="行业背景" name="industryAnalysis">
                <div className={styles.richText}>
                  <BraftEditor
                    value={BraftEditor.createEditorState(industryAnalysis)}
                    onChange={(e: any) => {
                      handleChangeRichText(e, 'industryAnalysis');
                    }}
                    style={{ border: '1px solid #d9d9d9' }}
                    controls={[...controls]}
                    placeholder={
                      '请输入市场环境、行业发展、政策变动等，内容真实客观、能有效辅助分析。'
                    }
                    media={{
                      uploadFn: uploadEditor,
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item label="公司介绍" name="companyIntroduction">
                <div className={styles.richText}>
                  <BraftEditor
                    value={BraftEditor.createEditorState(companyIntroduction)}
                    onChange={(e: any) => {
                      handleChangeRichText(e, 'companyIntroduction');
                    }}
                    style={{ border: '1px solid #d9d9d9' }}
                    controls={[...controls]}
                    placeholder={
                      '请输入公司历史沿革、财务状况、主要人物、事件相关背景等，内容真实客观，能有效辅助课堂讨论分析。'
                    }
                    media={{
                      uploadFn: uploadEditor,
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item label="案例分析" name="caseStudy">
                <div className={styles.richText}>
                  <BraftEditor
                    value={BraftEditor.createEditorState(caseStudy)}
                    onChange={(e: any) => {
                      handleChangeRichText(e, 'caseStudy');
                    }}
                    style={{ border: '1px solid #d9d9d9' }}
                    controls={[...controls]}
                    placeholder={
                      '请输入案例分析，陈述客观平实、决策点突出，所述内容及相关数据具备完整性和一致性。大中型案例宜分节。'
                    }
                    media={{
                      uploadFn: uploadEditor,
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item label="案例结语" name="thinkingConclusion">
                <div className={styles.richText}>
                  <BraftEditor
                    value={BraftEditor.createEditorState(thinkingConclusion)}
                    onChange={(e: any) => {
                      handleChangeRichText(e, 'thinkingConclusion');
                    }}
                    style={{ border: '1px solid #d9d9d9' }}
                    controls={[...controls]}
                    placeholder={'请输入启发思考内容或案例的结论。'}
                    media={{
                      uploadFn: uploadEditor,
                    }}
                  />
                </div>
              </Form.Item>
            </Form>
          </div>
          <div className={styles.footer}>
            <Button
              onClick={() => {
                if (caseData?.casesCode) {
                  history.push('/viewCase');
                } else {
                  updateSessionStorage('case', {});
                  history.push('/case');
                }
              }}
            >
              取消
            </Button>
            <Button type="primary" onClick={handleSubmit} htmlType="submit">
              提交
            </Button>
          </div>
        </div>
      </div>
      {openFileModal && (
        <CoverModal
          open={openFileModal}
          onCancel={cancelModal}
          onOk={confirmModal}
          coverId={casesCover ? casesCover : caseData.casesCover}
        />
      )}
      {isShowAddTag && (
        <AddTag
          handleCancel={() => setIsShowAddTag(false)}
          tagTypeEnum={tagTypeEnum}
          handleClickOk={handleClickOk}
          tagObj={tagObj}
        />
      )}
      {caseModalOpen && (
        <CaseModal
          open={caseModalOpen}
          onCancel={onCancelCaseModal}
          onOk={onChooseCase}
          getColumns={getColumns}
          queryData={getProductCaseList}
          searchWord={'searchWord'}
          title={'案例'}
        />
      )}
    </div>
  );
};

export default Container;
