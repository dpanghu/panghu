import EventSourceStream from '@/pages/AiJobHunt/Home/DialogArea/EventSourceStream';
import { HistoryItem } from '@/pages/AiJobHunt/type';
import { DetailResponseType } from '@/pages/DataVisualization/type';
import { saveResult } from '@/services/dataVisualization';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { pick, uniqueId } from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import Charts from './components/Charts';
import RcMarkdownExtend from './components/RcMarkdownExtend';
import CustomTable from './components/Table';
import TextAreaMsg from './components/TextAreaMsg';
import styles from './index.less';

type IState = {
  dialogHistory: HistoryItem[];
  isLoading: boolean;
  typewriterArrCache: string[];
};

type Props = { fileData: DetailResponseType | null };
const Conversation: React.FC<Props> = ({ fileData }) => {
  const queryParams = JSON.parse(
    // @ts-ignore
    window.sessionStorage.getItem('queryParams'),
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversation_id = useRef<string>('');
  const themeId = useRef<string>('');
  const resizeObserver = useRef<ResizeObserver>();
  const state = useReactive<IState>({
    dialogHistory: [],
    isLoading: false,
    typewriterArrCache: [],
  });

  useEffect(() => {
    if (fileData?.file) {
      const file = fileData.file;
      themeId.current = file.themeId || '';
      conversation_id.current = file.conversationId || '';
      if (fileData?.file.onAnalysis) {
        state.dialogHistory = [
          {
            id: uniqueId(),
            type: (file.onAnalysis || '').indexOf('chart-v1') > -1 ? 2 : 1,
            content: file.onAnalysis || '',
          },
        ];
      } else {
        state.dialogHistory = [];
      }
    }
  }, [JSON.stringify(fileData?.file)]);

  // 监控滚动
  const handleScroll = () => {
    resizeObserver.current = new ResizeObserver(() => {
      scrollRef.current?.scrollIntoView();
    });

    // 观察一个或多个元素
    if (scrollRef.current) {
      resizeObserver.current.observe(scrollRef.current);
    }
  };

  useEffect(() => {
    if (state.isLoading) {
      handleScroll();
    } else {
      resizeObserver.current?.disconnect();
    }
  }, [state.isLoading]);

  const submitMessage = (message: string, isAnalysis: boolean) => {
    let qsParams = {
      ...pick(queryParams, [
        'userId',
        'memberId',
        'schoolId',
        'userToken',
        'paramId',
        'classId',
        'userType',
      ]),
      userMessage: message,
      chatType: 'dtc240630',
      pluginCode: 'dataView',
      qsParams: {
        attachmentUrl: fileData?.file.fileUrl,
      },
      fileIds: [fileData?.file.id],
      themeId: themeId.current,
      conversationId: conversation_id.current,
    };
    state.dialogHistory.push({
      id: uniqueId(),
      type: 0,
      content: message,
    });
    const url = '/api/bus-xai/xai/plugin/create/stream';
    state.isLoading = true;
    new EventSourceStream(
      url,
      {
        method: 'POST',
        data: qsParams,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      {
        // 结束，包括接收完毕所有数据、报错、关闭链接
        onFinished: () => {
          state.isLoading = false;
          const rstStr = state.typewriterArrCache.join('');
          state.dialogHistory.push({
            id: uniqueId(),
            type: rstStr.indexOf('chart-v1') > -1 ? 2 : 1,
            content: rstStr,
          });
          saveResult({
            id: fileData?.file.id,
            conversationId: conversation_id.current,
            themeId: themeId.current,
            onAnalysis: rstStr,
          });
          state.typewriterArrCache = [];
        },
        // 接收到数据
        receiveMessage: (data) => {
          themeId.current = data!.themeId;
          conversation_id.current = data!.conversation_id;
          state.typewriterArrCache.push(data!.answer);
        },
      },
    ).run();
  };

  const dataScope = useMemo(() => {
    if (fileData?.file) {
      const columnLength = fileData?.columns.length;
      const dataLength = fileData?.data.length / columnLength;
      return `A1:${String.fromCharCode(64 + columnLength)}${dataLength}`;
    }
  }, [JSON.stringify(fileData?.file)]);

  return (
    <div className={styles['container']}>
      <div className={styles['information']}>
        <div className={styles['dialog-history']}>
          <div className={styles['dialog-initial-info']}>
            <div className={styles['conversion-item']}>
              <div className={styles['conversion-content']}>
                <h2>Hi同学！我是小新，你的数据分析和可视化助手</h2>
                <p>
                  请输入你的问题或选择相关字段，我将为你进行深入的数据分析和直观的可视化展示
                </p>
              </div>
            </div>
          </div>
          {state.dialogHistory.map((item) => {
            return (
              <div
                key={item.id}
                className={classNames({
                  [styles['message-from-ai']]: item.type !== 0,
                  [styles['message-from-user']]: item.type === 0,
                })}
              >
                {item.type === 2 ? (
                  <div className={styles['message-area']}>
                    {item.type === 2 && (
                      <div className={styles['data-scope']}>
                        数据范围: {dataScope}
                      </div>
                    )}
                    <RcMarkdownExtend
                      content={item.content}
                      compoents={{
                        code(props) {
                          return <Charts props={props} />;
                        },
                        table(props) {
                          return <CustomTable props={props} />;
                        },
                      }}
                    />
                  </div>
                ) : (
                  <pre className={styles['message-area']}>{item.content}</pre>
                )}
              </div>
            );
          })}
          {state.isLoading && (
            <div className={styles['message-from-ai']}>
              <div className={styles['message-area']} ref={scrollRef}>
                <RcMarkdownExtend content={state.typewriterArrCache.join('')} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles['text-area']}>
        <TextAreaMsg
          fileData={fileData}
          isLoading={state.isLoading}
          onSubmit={(msg, isAnalysis) => submitMessage(msg, isAnalysis)}
        />
      </div>
    </div>
  );
};

export default Conversation;
