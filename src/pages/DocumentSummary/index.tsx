import fileIcon from '@/assets/images/fileIcon.png';
import iconCircleIcon from '@/assets/images/icon-exclamation-circle.png';
import PDFIcon from '@/assets/images/icon-file_PDF.png';
import WordIcon from '@/assets/images/icon-file_word.png';
import CustomUpload, { CustomUploadProps } from '@/components/CustomUpload';
import { TreeGraph } from '@/components/TreeGraph/TreeGraph';
import { getConvertParamId } from '@/services/aiJobHunt';
import {
  delSummaryItem,
  exportSummary,
  getAttachmentId,
  getSummaryItem,
  getSummaryList,
  resetWordAnalysis,
  uploadSummary,
} from '@/services/documentSummary';
import { getFileMajorType } from '@/utils/contants';
import { onDownloadFile } from '@/utils/utils';
import { Button, Select, message } from 'SeenPc';
import { useReactive } from 'ahooks';
import { Checkbox, Modal, Popconfirm, Spin } from 'antd';
import { RcFile } from 'antd/es/upload';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import AnalysisSummary from './AnalysisSummary';
import FileUpload from './FileUpload';
import styles from './index.less';

interface TState {
  showSummary: boolean;
  showActionBtns: boolean;
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
  activeTabKey: string;
  graph: TreeGraph | null;
}

const DocumentSummary: React.FC = () => {
  const state = useReactive<TState>({
    showSummary: false,
    paramsId: '',
    summaryData: {},
    exportParams: {
      introduction: '.docx',
      mindMap: '.png',
      introductionChecked: true,
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
    activeTabKey: '1',
    graph: null,
    showActionBtns: false,
  });
  const timerOutRef = useRef<any>(null);
  const ossViewUrlRef = useRef<any>('0');
  const intervalRef = useRef<any>(0);

  const querySummaryList = async (mount?: boolean) => {
    try {
      const result: RecordItem[] = await getSummaryList();
      state.summaryList = result;
      // state.showSummary = !!result.length;
      if (!result.length) {
        state.showSummary = false;
        state.showActionBtns = false;
      }
      if (mount) {
        return;
      }
      const result1: RecordItem = await getSummaryItem({ id: result[0].id });
      state.summaryData = result1;
      if (state.summaryData.ossViewUrl !== '0') {
        state.uploadLoading = false;
      }
    } catch (error) {}
  };

  const changeContent = async (dataSource: RecordItem, mount?: boolean) => {
    state.showSummary = false;
    state.showActionBtns = true;
    state.uploadLoading = true;
    // querySummaryList(mount);
    // 轮询 get接口 判断附件预览转换是否完成 ossViewUrl为0时 可能是未转换成功，也可能是文档不支持预览 所以设置1min最大轮询时长
    try {
      // if (state.summaryData.ossViewUrl !== '0') {
      //   return;
      // } else {
      //   state.uploadLoading = true;
      // }
      intervalRef.current = setInterval(async () => {
        timerOutRef.current += 15;
        const result1: RecordItem = await getSummaryItem({
          id: dataSource.id,
        });
        if (result1.status === 2) {
          state.summaryData = result1;
          clearInterval(intervalRef.current);
          const result2: RecordItem[] = await getSummaryList();
          state.summaryList = result2;
          state.uploadLoading = false;
          state.showSummary = true;
          state.showActionBtns = true;
        }
        if (result1.status === 3) {
          clearInterval(intervalRef.current);
          const result2: RecordItem[] = await getSummaryList();
          state.summaryList = result2;
          state.uploadLoading = false;
          state.showSummary = false;
          state.showActionBtns = false;
          message.error('文档解析失败，请重新上传或到我的文档库中重新解析', 5);
        }
        // ossViewUrlRef.current = result1.ossViewUrl;
        // if (ossViewUrlRef.current !== '0') {
        //   state.summaryData = result1;
        //   clearInterval(intervalRef.current);
        //   state.uploadLoading = false;
        // }
      }, 1000 * 15);
      if (ossViewUrlRef.current !== '0' || timerOutRef.current >= 15 * 4 * 10) {
        clearInterval(intervalRef.current);
        const result2: RecordItem[] = await getSummaryList();
        state.summaryList = result2;
        state.uploadLoading = false;
        state.summaryData = {};
        state.showSummary = false;
        state.showActionBtns = true;
        message.error('文档解析超时，请重新上传或到 我的文档库 中重新解析', 5);
      }
    } catch (error) {}
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
      ...state.exportParams,
      introduction: '.docx',
      mindMap: '.png',
      // introductionChecked: false,
      // mindMapChecked: false,
      popupOpen: false,
    };
  };

  // 获取当前是在看导读还是脑图
  const getActiveTabKey = (activeKey: string) => {
    state.activeTabKey = activeKey;
  };

  const getMindGraph = (graph: any) => {
    state.graph = graph;
  };

  const getAttachmentNameFromUrl = (url: string) => {
    // 使用正则表达式匹配URL中最后一个斜杠之后的部分
    const matches = /([^\/]+)\.pdf$/.exec(url);
    // 如果匹配成功，返回匹配的附件名
    if (matches && matches.length > 1) {
      return matches[1] + '.pdf';
    }
    // 如果没有匹配到，返回空字符串
    return '';
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
        if (state.exportParams.introduction === '.docx') {
          window.open(result as string, '_self');
        } else {
          onDownloadFile(
            result as string,
            getAttachmentNameFromUrl(result as string),
          );
        }
      }
      if (state.exportParams.mindMapChecked) {
        let attachmentName = state.summaryData?.attachmentName?.replace(
          /\.[^/.]+$/,
          '',
        );
        attachmentName = attachmentName + '-思维导图';
        state.graph?.setLeafLevelCollapse(true);
        state.graph?.tree.fitView();
        if (!state.graph) {
          return;
        }
        let oldRatio = 0;
        oldRatio = window.devicePixelRatio;
        window.devicePixelRatio = 10; //自己设定值
        state.graph?.tree?.downloadFullImage(attachmentName, 'image/png', {
          padding: [50, 50, 50, 50],
          backgroundColor: '#e5f0ff',
        });
        setTimeout(() => {
          window.devicePixelRatio = oldRatio;
        }, 200);
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
      state.showSummary = true;
      state.showActionBtns = true;
      const result: RecordItem[] = await getSummaryItem({ id });
      state.summaryData = result;
      state.recentlyRecordModal = false;
      intervalRef.current && clearInterval(intervalRef.current);
    } catch (error) {}
  };

  const handleVisibleChange = (value: boolean, type: string) => {
    if (type === 'record') {
      state.recentlyRecordModal = value;
    } else if (type === 'export') {
      state.exportParams.popupOpen = value;
    }
    if (value) {
      querySummaryList(true);
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
      // state.summaryData = result;
      // querySummaryList();
      changeContent(result);
      // state.showActionBtns = true;
      // state.showSummary = true;
    } catch (e) {
      // message.error('解析失败');
      state.showActionBtns = false;
      state.showSummary = false;
    } finally {
      // state.uploadLoading = false;
    }
  };

  const resetAnalysis = async (params: RecordItem) => {
    try {
      state.showSummary = false;
      state.uploadLoading = true;
      state.showActionBtns = true;
      const result: any = await resetWordAnalysis({
        wordSummaryId: params.id,
        isPreset: params.isPreset,
        paramId: state.paramsId,
      });
      changeContent(result, true);
      const result1: RecordItem[] = await getSummaryList();
      state.summaryList = result1;
      // state.showSummary = true;
    } catch (error) {
      state.showSummary = false;
      state.showActionBtns = false;
      state.uploadLoading = false;
      // message.error('解析失败');
    } finally {
      // state.uploadLoading = false;
    }
  };

  const DraggerProps: CustomUploadProps = {
    dragger: false,
    accept: '.pdf,.PDF',
    allowFileType: ['pdf', 'PDF'],
    allowFileSize: 1,
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
      state.showSummary = false;
      state.showActionBtns = true;
      uploadData();
    },
  };

  useEffect(() => {
    getParamId();
    querySummaryList(true);
  }, []);

  useEffect(() => {
    state.exportParams[
      state.activeTabKey === '1' ? 'introductionChecked' : 'mindMapChecked'
    ] = true;
    state.exportParams[
      state.activeTabKey === '2' ? 'introductionChecked' : 'mindMapChecked'
    ] = false;
  }, [state.activeTabKey]);

  return (
    <div
      className={styles.DocumentSummaryContainer}
      id="DocumentSummaryContainer"
    >
      <div className={styles.header}>
        <div className={styles.title}>AI文档总结</div>
        <div className={styles.action}>
          <div
            className={styles.recordLast}
            style={
              !state.showActionBtns || !state.showSummary
                ? { marginRight: 80 }
                : {}
            }
          >
            {/* <img src={recentRecordPng} alt="" /> */}
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
                  <div className={styles.header}>我的文档库</div>
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
                          <div
                            className={styles.fileName}
                            title={item.attachmentName}
                          >
                            {item.attachmentName}
                          </div>
                          <div className={styles.fileDetail}>
                            <div className={styles.size}>
                              <div>
                                {!item.attachmentSize
                                  ? '-'
                                  : `${Math.round(
                                      item.attachmentSize / 1024,
                                    )}KB`}
                              </div>
                              <div>
                                {item.status === 1
                                  ? '解析中，请等待！'
                                  : item.status === 2
                                  ? '解析成功'
                                  : item.status === 0
                                  ? '待解析'
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
                            {item.status === 3 && (
                              <div
                                className={styles.readBtn}
                                onClick={() => {
                                  resetAnalysis(item);
                                }}
                              >
                                重新解析
                              </div>
                            )}
                            {item.status === 0 && (
                              <div
                                className={styles.readBtn}
                                onClick={() => {
                                  resetAnalysis(item);
                                }}
                              >
                                立即解析
                              </div>
                            )}
                          </div>
                          {/* {!item.isPreset && (
                            <img
                              onClick={() => {
                                state.delModalOpen = true;
                                state.delSummaryId = item.id;
                              }}
                              src={deleteIcon}
                              alt=""
                              className={styles.deleteIcon}
                            />
                          )} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }
            >
              <span className={styles.fileTitle}>
                <img src={fileIcon} alt="" />
                我的文档库
              </span>
            </Popconfirm>
          </div>

          <div className={styles.btns} id="actionBtnContainer">
            {state.showActionBtns && state.showSummary && (
              <>
                <CustomUpload {...DraggerProps}>
                  <Button disabled={!state.showSummary}>上传</Button>
                </CustomUpload>
                {/* <Button
                  disabled={!state.showSummary}
                  onClick={() => {
                    state.delSummaryId = state.summaryData?.id;
                    state.delModalOpen = true;
                  }}
                >
                  删除
                </Button> */}
                <Popconfirm
                  placement="bottomRight"
                  open={state.exportParams.popupOpen}
                  icon={null}
                  onCancel={resetPopupContent}
                  getPopupContainer={() =>
                    document.getElementById('actionBtnContainer') as HTMLElement
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
                            disabled
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
                            disabled
                            checked={state.exportParams.mindMapChecked}
                            onChange={(e) => {
                              onChangeCheckbox(e, '2');
                            }}
                          >
                            <span className={styles.title}>思维导图</span>
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
                                // { label: '.jpg', value: '.jpg' },
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
                    disabled={!state.showSummary}
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
            <AnalysisSummary
              key={state.summaryData.id}
              summaryData={state.summaryData}
              getActiveTabKey={getActiveTabKey}
              getMindGraph={getMindGraph}
              baseActiveKey={state.activeTabKey}
            />
          ) : state.showActionBtns ? (
            <Spin
              tip="文档解析中，请稍等..."
              spinning={state.uploadLoading}
              size="large"
            >
              <></>
            </Spin>
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
  );
};

export default DocumentSummary;
