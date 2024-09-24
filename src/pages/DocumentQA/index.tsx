import fileIcon from '@/assets/images/fileIcon.png';
import iconCircleIcon from '@/assets/images/icon-exclamation-circle.png';
import PDFIcon from '@/assets/images/icon-file_PDF.png';
import WordIcon from '@/assets/images/icon-file_word.png';
import CustomUpload, { CustomUploadProps } from '@/components/CustomUpload';
import { getConvertParamId } from '@/services/aiJobHunt';
import {
  analysisAnswer,
  delAnswer,
  getWordAnswerItem,
  getWordAnswerList,
  uploadWordAnswer,
} from '@/services/documentQA';
import { getAttachmentId } from '@/services/documentSummary';
import { getFileMajorType } from '@/utils/contants';
import { Button, message } from 'SeenPc';
import { useMount, useReactive } from 'ahooks';
import { Modal, Popconfirm, Spin } from 'antd';
import { RcFile } from 'antd/es/upload';
import classNames from 'classnames';
import React, { useRef } from 'react';
import FileUpload from './FileUpload';
import QAResult from './QAResult';
import styles from './index.less';
interface TState {
  paramsId: string;
  recentlyRecordModal: boolean;
  summaryList: RecordItem[];
  showSummary: boolean;
  showActionBtns: boolean;
  summaryData: RecordItem;
  uploadLoading: boolean;
  delModalOpen: boolean;
  delSummaryId: string;
  attachmentId: string;
}

const DocumentQA: React.FC = () => {
  const state = useReactive<TState>({
    paramsId: '',
    recentlyRecordModal: false,
    summaryList: [],
    showSummary: false,
    showActionBtns: false,
    summaryData: {},
    uploadLoading: false,
    delModalOpen: false,
    delSummaryId: '',
    attachmentId: '',
  });
  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );
  const timerOutRef = useRef<any>(null);
  const ossViewUrlRef = useRef<any>('0');
  const intervalRef = useRef<any>(0);
  const getParamId = async () => {
    try {
      const result = await getConvertParamId();
      state.paramsId = result;
    } catch (error) {}
  };

  const changeContent = (dataSource: RecordItem) => {
    state.showSummary = false;
    state.showActionBtns = true;
    // state.summaryData = dataSource;

    // querySummaryList();
    // 轮询 get接口 判断附件预览转换是否完成 ossViewUrl为0时 可能是未转换成功，也可能是文档不支持预览 所以设置1min最大轮询时长
    try {
      if (dataSource.ossViewUrl && dataSource.ossViewUrl !== '0') {
        state.uploadLoading = false;
        state.showSummary = true;
        state.showActionBtns = true;
        state.summaryData = dataSource;
        return;
      } else {
        state.uploadLoading = true;
      }
      intervalRef.current = setInterval(async () => {
        timerOutRef.current += 15;
        const result1: RecordItem = await getWordAnswerItem({
          id: dataSource.id,
        });
        ossViewUrlRef.current = result1.ossViewUrl;
        if (result1.ossViewUrl && result1.ossViewUrl !== '0') {
          state.summaryData = result1;
          clearInterval(intervalRef.current);
          state.uploadLoading = false;
          state.showSummary = true;
          state.showActionBtns = true;
        }
      }, 1000 * 5);
      if (ossViewUrlRef.current !== '0' || timerOutRef.current >= 60) {
        clearInterval(intervalRef.current);
        state.uploadLoading = false;
        state.showSummary = false;
        state.showActionBtns = false;
      }
    } catch (error) {}
  };
  const querySummaryList = async (mount?: boolean) => {
    try {
      const result: RecordItem[] = await getWordAnswerList();
      state.summaryList = result;
      // state.showSummary = !!result.length;
      if (!result.length) {
        state.showSummary = false;
        state.showActionBtns = false;
      }
      if (mount) {
        return;
      }
      const result1: RecordItem = await getWordAnswerItem({ id: result[0].id });
      state.summaryData = result1;
      if (state.summaryData.ossViewUrl !== '0') {
        state.uploadLoading = false;
      }
    } catch (error) {}
  };
  const resetAnalysis = async (params: RecordItem) => {
    state.summaryList = state.summaryList.map((item) => {
      if (item.id === params.id) {
        return {
          ...item,
          status: 1,
        };
      }
      return item;
    });
    try {
      state.showSummary = false;
      state.uploadLoading = true;
      state.showActionBtns = true;
      const result: any = await analysisAnswer({
        wordAnswerId: params.id,
        isPreset: params.isPreset,
        paramId: state.paramsId,
      });
      const result1: RecordItem[] = await getWordAnswerList();
      state.summaryList = result1;
      changeContent(result);

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

  const uploadData = async () => {
    try {
      state.showActionBtns = true;
      state.showSummary = false;
      state.uploadLoading = true;
      const result: RecordItem = await uploadWordAnswer({
        paramId: state.paramsId,
        attachmentId: state.attachmentId,
        ...extraParams,
      });
      // state.summaryData = result;
      // querySummaryList();
      changeContent(result);
      state.showActionBtns = true;
      state.showSummary = true;
    } catch (e) {
      // message.error('解析失败');
      state.showActionBtns = false;
      state.showSummary = false;
    } finally {
      state.uploadLoading = false;
    }
  };

  const handleVisibleChange = (value: boolean, type: string) => {
    if (type === 'record') {
      state.recentlyRecordModal = value;
    }
    if (value) {
      querySummaryList(true);
    }
  };

  const handleChangeSummary = async (id: string) => {
    try {
      state.showSummary = true;
      state.showActionBtns = true;
      const result: RecordItem[] = await getWordAnswerItem({ id });
      state.summaryData = result;
      state.recentlyRecordModal = false;
    } catch (error) {}
  };

  const deleteSummaryItem = async () => {
    try {
      await delAnswer({ ...extraParams, id: state.delSummaryId });
      message.success('删除成功');
      state.delModalOpen = false;
      querySummaryList();
    } catch (error) {}
  };

  useMount(() => {
    getParamId();
  });

  const DraggerProps: CustomUploadProps = {
    dragger: false,
    accept: '.pdf,.PDF',
    allowFileType: ['pdf', 'PDF'],
    allowFileSize: 1,
    // action: 'https://tapi.seentao.com/bus-xai/dbe3.private.params.upload.get',
    // data: extraParams,
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

  return (
    <div className={styles.DocumentQAContainer} id="DocumentSummaryContainer">
      <div className={styles.header}>
        <div className={styles.title}>AI文档问答</div>
        <div className={styles.action}>
          <div className={styles.recordLast}>
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
                                  ? '上传中'
                                  : item.status === 2
                                  ? '上传成功'
                                  : item.status === 0
                                  ? '待上传'
                                  : '上传失败'}
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
                            {item.status === 0 && (
                              <div
                                className={styles.readBtn}
                                onClick={() => {
                                  resetAnalysis(item);
                                }}
                              >
                                立即上传
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
              </>
            )}
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.content}>
          {state.showSummary ? (
            <QAResult
              key={state.summaryData?.id}
              summaryData={state.summaryData}
              paramsId={state.paramsId}
            />
          ) : state.showActionBtns ? (
            <Spin
              tip="文档上传中，请稍等！"
              spinning={state.uploadLoading}
              size="large"
            />
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

export default DocumentQA;
