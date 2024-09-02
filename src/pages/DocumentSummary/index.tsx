import deleteIcon from '@/assets/images/close.png';
import iconCircleIcon from '@/assets/images/icon-exclamation-circle.png';
import PDFIcon from '@/assets/images/icon-file_PDF.png';
import WordIcon from '@/assets/images/icon-file_word.png';
import recentRecordPng from '@/assets/images/recent_record_blue.png';
import CustomUpload, { CustomUploadProps } from '@/components/CustomUpload';
import { getConvertParamId } from '@/services/aiJobHunt';
import {
  delSummaryItem,
  exportSummary,
  getAttachmentId,
  getSummaryItem,
  getSummaryList,
  uploadSummary,
} from '@/services/documentSummary';
import { getFileMajorType } from '@/utils/contants';
import { Button, Select, message } from 'SeenPc';
import { useReactive } from 'ahooks';
import { Checkbox, Modal, Popconfirm, Spin } from 'antd';
import { RcFile } from 'antd/es/upload';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import AnalysisSummary from './AnalysisSummary';
import FileUpload from './FileUpload';
import styles from './index.less';

interface TState {
  showSummary: boolean;
  summaryData: RecordItem;
  paramsId: string;
  delModalOpen: boolean;
  exportParams: RecordItem;
  summaryList: RecordItem[];
  delSummaryId: string;
  delSummaryLoading: boolean;
  uploadLoading: boolean;
  attachmentId: string;
  recentlyRecordModal: boolean;
}

const DocumentSummary: React.FC = () => {
  const state = useReactive<TState>({
    showSummary: false,
    paramsId: '',
    summaryData: {
      attachmentName: '冲刺教育学_removed.pdf',
      attachmentSuffixname: 'pdf',
      classId: '1722944161997548',
      createTime: '1724912108475',
      creator: '63105158182600735',
      id: '926297393857572864',
      materialId: '926286018888359936',
      memberId: '63105158210387988',
      mindMap:
        '{"name":"教育时政热点预测","children":[{"name":"习近平总书记关于教育的重要论述","children":[{"name":"教育家精神","children":[]},{"name":"铸牢中华民族共同体意识","children":[]},{"name":"少年儿童的培养","children":[]},{"name":"党的教育方针","children":[]},{"name":"科技自立自强","children":[]},{"name":"教育家的榜样作用","children":[]},{"name":"教育的工作目标","children":[]},{"name":"教育的根本任务","children":[]},{"name":"思想政治工作","children":[]},{"name":"教师的地位和责任","children":[]},{"name":"尊师重教的社会风尚","children":[]},{"name":"课堂学习与乡村实践结合","children":[]},{"name":"提升办学水平","children":[]},{"name":"培养“四个自信”的孩子","children":[]},{"name":"传道授业解惑的本领","children":[]},{"name":"立德树人的初心和使命","children":[]},{"name":"高质量发展","children":[]},{"name":"中国特色教师教育体系","children":[]},{"name":"思想政治理论课","children":[]},{"name":"教育强国的意义","children":[]}]},{"name":"二十大报告","children":[{"name":"教育、科技、人才的支撑作用","children":[]},{"name":"办好人民满意的教育","children":[]},{"name":"育人的根本在于立德","children":[]},{"name":"以人民为中心发展教育","children":[]},{"name":"加强师德师风建设","children":[]},{"name":"坚持创新的核心地位","children":[]},{"name":"建设人才队伍","children":[]}]}]}',
      modifier: '63105158182600735',
      modifyTime: '1724912170941',
      projectVersionId: '918043291856957440',
      schoolId: '100678506119168',
      status: 2,
      summary:
        '# 教育时政热点预测\n- **习近平总书记关于教育的重要论述**：    - 强调教育家精神的重要性。    - 提出学校思政课要重点讲好相关故事，将中华民族共同体意识植入孩子心灵。    - 鼓励少年儿童树立远大志向，全面发展。    - 要求全面贯彻党的教育方针，落实立德树人根本任务，推进大中小学思想政治教育一体化建设。    - 希望学校师生为实现高水平科技自立自强和建设教育强国等作出贡献。    - 倡导弘扬教育家精神，牢记初心使命。    - 明确教育的工作目标和根本任务。    - 指出思想政治工作的重要性和教师的责任。    - 强调尊师重教的社会风尚。    - 鼓励课堂学习与乡村实践结合。    - 要求提升办学水平，推动铸牢中华民族共同体意识。    - 提出培养拥有“四个自信”的孩子。    - 强调增长传道授业解惑本领。    - 希望教师不忘立德树人初心，积极探索教育教学方法。    - 强调教育质量的重要性，建设高质量教育体系。    - 提出健全教师教育体系，弘扬尊师重教风尚。    - 指出思想政治理论课的关键在于重视、适应和做好。    - 强调教育强国的战略先导、支撑和基础工程作用。- **二十大报告**：    - 强调教育、科技、人才的基础性、战略性支撑作用。    - 提出深入实施科教兴国战略、人才强国战略、创新驱动发展战略。    - 指出办好人民满意的教育，育人的根本在于立德。    - 要求全面贯彻党的教育方针，落实立德树人根本任务，培养德智体美劳全面发展的社会主义建设者和接班人。    - 强调以人民为中心发展教育，加快建设高质量教育体系，促进教育公平。    - 提出加强师德师风建设，培养高素质教师队伍，推进教育数字化，建设学习型社会、学习型大国。    - 强调坚持创新在我国现代化建设全局中的核心地位。    - 提出建设规模宏大、结构合理、素质优良的人才队伍。',
      taskId: '917976699664695296',
    },
    exportParams: {
      introduction: '.docx',
      mindMap: '.jpg',
      introductionChecked: false,
      mindMapChecked: false,
      popupOpen: false,
    },
    summaryList: [],
    uploadLoading: false,
    delModalOpen: false,
    delSummaryId: '',
    delSummaryLoading: false,
    attachmentId: '',
    recentlyRecordModal: false,
  });

  const querySummaryList = async () => {
    try {
      const result: RecordItem[] = await getSummaryList();
      console.log(result);
      state.summaryList = result;
      state.showSummary = !!result.length;
      state.summaryData = result[0];
    } catch (error) {}
  };

  const changeContent = (dataSource: RecordItem) => {
    state.showSummary = true;
    state.summaryData = dataSource;
    querySummaryList();
  };

  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );

  const getParamId = async () => {
    try {
      const result = await getConvertParamId(extraParams);
      state.paramsId = result;
    } catch (error) {}
  };

  const onChangeCheckbox = (e: any, type: string) => {
    state.exportParams[
      type === '1' ? 'introductionChecked' : 'mindMapChecked'
    ] = e.target.checked;
  };

  const resetPopupContent = () => {
    state.exportParams = {
      introduction: '.docx',
      mindMap: '.jpg',
      introductionChecked: false,
      mindMapChecked: false,
      popupOpen: false,
    };
  };

  const exportPopupContent = async () => {
    if (
      !state.exportParams.introductionChecked &&
      !state.exportParams.mindMapChecked
    ) {
      message.warning('请先选择导读或脑图后再点击确定按钮');
      return;
    }
    try {
      if (state.exportParams.introductionChecked) {
        const result = await exportSummary({
          exportType: 1,
          exportFileType: state.exportParams.introduction,
          id: state.summaryData.id,
          ...extraParams,
        });
        window.open(result as string, '_self');
      }
      message.success('导出成功');
      state.exportParams.popupOpen = false;
    } catch (error) {}
  };

  const deleteSummaryItem = async () => {
    try {
      await delSummaryItem({ ...extraParams, id: state.delSummaryId });
      message.success('删除成功');
      state.delModalOpen = false;
      querySummaryList();
    } catch (error) {}
  };

  const handleChangeSummary = async (id: string) => {
    try {
      const result: RecordItem[] = await getSummaryItem({ id });
      state.summaryData = result;
      state.recentlyRecordModal = false;
    } catch (error) {}
  };

  const handleVisibleChange = (value: boolean, type: string) => {
    if (type === 'record') {
      state.recentlyRecordModal = value;
    } else if (type === 'export') {
      state.exportParams.popupOpen = value;
    }
  };

  const uploadData = async () => {
    try {
      state.uploadLoading = true;
      const result: RecordItem = await uploadSummary({
        paramId: state.paramsId,
        attachmentId: state.attachmentId,
        ...extraParams,
      });
      state.summaryData = result;
      querySummaryList();
    } finally {
      state.uploadLoading = false;
    }
  };

  const DraggerProps: CustomUploadProps = {
    dragger: false,
    accept: '.doc,.docx,.pdf,.DOC,.DOCX,.PDF',
    allowFileType: ['doc', 'docx', 'pdf', 'DOC', 'DOCX', 'PDF'],
    allowFileSize: 2,
    seenOss: {
      url: '/api/bus-xai/dbe3.private.params.upload.get',
      extraParams,
    },
    customUploadSuccess: async (file: RcFile) => {
      // 附件上传成功后 去获取attachmentId
      const attachmentType = (file.name as any)
        .split('.')
        .pop()
        .toLocaleLowerCase();
      const params = {
        attachmentUrl: (file as any).key,
        attachmentName: file.name,
        attachmentCategory: getFileMajorType(attachmentType),
        attachmentSize: file.size,
        isConvert: 1,
        suffixName: attachmentType,
      };
      const attachmentId = await getAttachmentId(params);
      state.attachmentId = attachmentId;
      uploadData();
    },
  };

  useEffect(() => {
    getParamId();
    querySummaryList();
  }, []);

  return (
    <Spin
      tip="文档解析中，请稍等！"
      spinning={state.uploadLoading}
      size="large"
    >
      <div
        className={styles.DocumentSummaryContainer}
        id="DocumentSummaryContainer"
      >
        <div className={styles.header}>
          <div className={styles.title}>AI文档总结</div>
          <div className={styles.action}>
            <div className={styles.recordLast}>
              <img src={recentRecordPng} alt="" />
              <Popconfirm
                onOpenChange={(e) => {
                  handleVisibleChange(e, 'record');
                }}
                placement="bottom"
                icon={null}
                getPopupContainer={() =>
                  document.getElementById('actionBtnContainer') as HTMLElement
                }
                trigger={'click'}
                zIndex={99999}
                open={state.recentlyRecordModal}
                title={
                  <div className={styles.PopupContent} style={{ height: 388 }}>
                    <div className={styles.header}>最近记录</div>
                    <div className={styles.recordMain}>
                      {state.summaryList?.map((item) => (
                        <div
                          className={classNames(
                            styles.panel,
                            item.id === state.summaryData.id &&
                              styles.activePanelMain,
                          )}
                          key={item.id}
                        >
                          <img
                            src={
                              ['pdf', 'PDF'].includes(item.attachmentSuffixname)
                                ? PDFIcon
                                : WordIcon
                            }
                            alt=""
                            className={styles.fileTypeIcon}
                          />
                          <div className={styles.fileItem}>
                            <div className={styles.fileName}>
                              {item.attachmentName}
                            </div>
                            <div className={styles.fileDetail}>
                              <div className={styles.size}>
                                <div>1.65MB</div>
                                <div>
                                  {item.status === 1
                                    ? '解析中'
                                    : item.status === 2
                                    ? '解析成功'
                                    : '解析失败'}
                                </div>
                              </div>
                              {item.status === 2 && (
                                <div
                                  className={styles.readBtn}
                                  onClick={() => {
                                    handleChangeSummary(item.id);
                                  }}
                                >
                                  立即查看
                                </div>
                              )}
                            </div>
                            <img
                              onClick={() => {
                                state.delModalOpen = true;
                                state.delSummaryId = item.id;
                              }}
                              src={deleteIcon}
                              alt=""
                              className={styles.deleteIcon}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                }
              >
                <span>最近记录</span>
              </Popconfirm>
            </div>

            <div className={styles.btns} id="actionBtnContainer">
              {state.showSummary && (
                <>
                  <CustomUpload {...DraggerProps}>
                    <Button>上传</Button>
                  </CustomUpload>
                  <Button
                    onClick={() => {
                      state.delSummaryId = state.summaryData?.id;
                      state.delModalOpen = true;
                    }}
                  >
                    删除
                  </Button>
                  <Popconfirm
                    placement="bottomRight"
                    open={state.exportParams.popupOpen}
                    icon={null}
                    onCancel={resetPopupContent}
                    getPopupContainer={() =>
                      document.getElementById(
                        'actionBtnContainer',
                      ) as HTMLElement
                    }
                    trigger={'click'}
                    zIndex={99999}
                    onOpenChange={(e) => {
                      handleVisibleChange(e, 'export');
                    }}
                    title={
                      <div
                        className={styles.PopupContent}
                        style={{ height: 290 }}
                      >
                        <div className={styles.header}>导出</div>
                        <div className={styles.content}>
                          <div className={styles.row}>
                            <Checkbox
                              checked={state.exportParams.introductionChecked}
                              onChange={(e) => {
                                onChangeCheckbox(e, '1');
                              }}
                            >
                              <span className={styles.title}>导读</span>
                            </Checkbox>
                            <div className={styles.select}>
                              <span>文档格式</span>
                              <Select
                                style={{ width: 'calc(100% - 80px)' }}
                                onChange={(value) => {
                                  state.exportParams.introduction = value;
                                }}
                                value={state.exportParams.introduction}
                                option={[
                                  { label: '.docx', value: '.docx' },
                                  { label: '.pdf', value: '.pdf' },
                                ]}
                              />
                            </div>
                          </div>
                          <div className={styles.row}>
                            <Checkbox
                              checked={state.exportParams.mindMapChecked}
                              onChange={(e) => {
                                onChangeCheckbox(e, '2');
                              }}
                            >
                              <span className={styles.title}>脑图</span>
                            </Checkbox>
                            <div className={styles.select}>
                              <span>文档格式</span>
                              <Select
                                style={{ width: 'calc(100% - 80px)' }}
                                onChange={(value) => {
                                  state.exportParams.mindMap = value;
                                }}
                                value={state.exportParams.mindMap}
                                option={[
                                  { label: '.jpg', value: '.jpg' },
                                  { label: '.png', value: '.png' },
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={styles.footer}>
                          <Button onClick={resetPopupContent}>取消</Button>
                          <Button type="primary" onClick={exportPopupContent}>
                            确认
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <Button
                      onClick={() => {
                        state.exportParams.popupOpen = true;
                      }}
                    >
                      导出
                    </Button>
                  </Popconfirm>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.content}>
            {state.showSummary ? (
              <AnalysisSummary summaryData={state.summaryData} />
            ) : (
              <FileUpload onChange={changeContent} paramsId={state.paramsId} />
            )}
          </div>
        </div>
        <Modal
          title={null}
          footer={null}
          open={state.delModalOpen}
          getContainer={() =>
            document.getElementById('DocumentSummaryContainer') as HTMLElement
          }
          maskClosable={false}
          centered
          onCancel={() => {
            state.delModalOpen = false;
          }}
        >
          <div className={styles.delModalContent}>
            <div className={styles.title}>
              <img src={iconCircleIcon} alt="" />
              <span>确定要删除本记录吗?</span>
            </div>
            <span>删除后不可撤回，请确定是否删除？</span>
            <Button type="primary" onClick={deleteSummaryItem}>
              确定
            </Button>
          </div>
        </Modal>
      </div>
    </Spin>
  );
};

export default DocumentSummary;
