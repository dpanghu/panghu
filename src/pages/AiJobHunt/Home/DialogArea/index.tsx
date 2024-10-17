import { generatePlugin, getChatRecord } from '@/services/aiJobHunt';
import { scrollToBottom, scrollToTop } from '@/utils/utils';
import { useCreation, useReactive, useUpdateEffect } from 'ahooks';
import classnames from 'classnames';
import { pick, uniqueId } from 'lodash';
import qs from 'qs';
import RcMarkdown from 'rc-markdown';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import type { HistoryItem, SubmitMessage, Theme } from '../../type';
import EventSourceStream from './EventSourceStream';
import MessageSendArea from './MessageSendArea';
import styles from './index.less';

type Props = {
  curTheme?: Theme;
  onReveiveFirstMessage: (dialogId: string) => void;
  onPluginCreate: () => void;
};
type TState = {
  dialogHistory: HistoryItem[];
  isLoading: boolean;
  typewriterArrCache: string[];
};
const DialogNum = 10;
const DialogArea = React.forwardRef(
  ({ curTheme, onReveiveFirstMessage, onPluginCreate }: Props, ref) => {
    const curDialogId = useRef<string>('');
    const conversationId = useRef<string>('');
    const resizeObserver = useRef<ResizeObserver>();
    const scrollRef = useRef<HTMLDivElement>(null);
    const historyEleHref = useRef<HTMLDivElement>(null);
    const queryData = useCreation(() => {
      return JSON.parse(window.sessionStorage.getItem('queryParams') || '{}');
    }, []);
    const state = useReactive<TState>({
      dialogHistory: [],
      isLoading: false,
      typewriterArrCache: [],
    });

    useUpdateEffect(() => {
      if (!curTheme) {
        return;
      }
      // 点击其他的对话历史，获取对应的历史信息
      if (curTheme.id !== curDialogId.current) {
        // 获取对话详情
        getChatRecord<HistoryItem>({
          num: DialogNum,
          themeId: curTheme.id,
        }).then((res) => {
          state.isLoading = false;
          state.typewriterArrCache = [];
          state.dialogHistory = res.reverse();
          curDialogId.current = curTheme.id;
          conversationId.current = curTheme.conversationId || '';
          scrollToTop(historyEleHref.current);
        });
      }
    }, [curTheme]);

    const createNewDialog = () => {
      state.dialogHistory = [];
      state.isLoading = false;
      state.typewriterArrCache = [];
      curDialogId.current = '';
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          isTypeFinished: !state.isLoading,
          createNewDialog,
        };
      },
      [state.isLoading],
    );

    const handleScroll = () => {
      resizeObserver.current = new ResizeObserver(() => {
        scrollRef.current?.scrollIntoView(false);
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

    const submitChat = async (msg: SubmitMessage) => {
      if (msg.pluginCode) {
        generatePlugin({
          ...msg,
          conversationId: conversationId.current,
        }).then(() => {
          if (onPluginCreate) {
            onPluginCreate();
          }
        });
      } else {
        let qsStr = qs.stringify({
          ...pick(queryData, [
            'userId',
            'memberId',
            'schoolId',
            'userToken',
            'paramId',
            'classId',
            'userType',
          ]),
          userMessage: msg.userMessage,
          chatType: 'dtc240630',
        });
        if (curDialogId.current) {
          qsStr += `&themeId=${curDialogId.current}&conversation_id=${conversationId.current}`;
        }
        state.dialogHistory.push({
          id: uniqueId(),
          type: 0,
          content: msg.userMessage,
        });
        scrollToBottom(historyEleHref.current);
        const url = '/api/bus-xai/xai/api/chat/stream?' + qsStr;
        state.isLoading = true;
        new EventSourceStream(
          url,
          {},
          {
            // 结束，包括接收完毕所有数据、报错、关闭链接
            onFinished: (code) => {
              if (!code) {
                state.dialogHistory.push({
                  id: uniqueId(),
                  type: 1,
                  content: state.typewriterArrCache.join(''),
                });
                state.typewriterArrCache = [];
                setTimeout(() => {
                  scrollToBottom(historyEleHref.current);
                }, 10);
              }
              state.isLoading = false;
            },
            // 第一次接收到数据
            onReveiveFirstMessage: (data) => {
              if (!curDialogId.current) {
                onReveiveFirstMessage(data!.themeId);
              }
            },
            // 接收到数据
            receiveMessage: (data) => {
              curDialogId.current = data!.themeId;
              conversationId.current = data!.conversation_id;
              state.typewriterArrCache.push(data!.answer);
            },
          },
        ).run();
      }
    };

    return (
      <div className={styles['dialog-area-container']}>
        {state.dialogHistory.length === 0 ? (
          <div className={styles['dialog-initial-info']}>
            <div className={styles['conversion-item']}>
              <div className={styles['conversion-content']}>
                <h2>您好，我是您的AI求职小助手</h2>
                <p>
                  通过先进的AI技术，我可以为您生成专业的简历，优化简历内容，并提供AI模拟面试服务，助您脱颖而出，迈向职业新高峰！
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles['dialog-history']} ref={historyEleHref}>
            {state.dialogHistory.map((item) => {
              return (
                <div
                  key={item.id}
                  className={classnames({
                    [styles['message-from-ai']]: item.type === 1,
                    [styles['message-from-user']]: item.type === 0,
                  })}
                >
                  {item.type === 1 ? (
                    <div className={styles['message-area']}>
                      <RcMarkdown theme="dark" content={item.content} />
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
                  <RcMarkdown
                    theme="dark"
                    typeWriter={true}
                    content={state.typewriterArrCache.join('')}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <div className={styles['diaplog-submit-container']}>
          <MessageSendArea
            isTypeFinished={!state.isLoading}
            onSubmit={(msg) => {
              submitChat(msg);
            }}
            onChangePlugin={() => {}}
          />
        </div>
        <div className={styles['warning-message']}>
          所有内容均由人工智能模型输出，其内容的准确性和完整性无法保证，不代表我们的态度和观点。
        </div>
      </div>
    );
  },
);

export default DialogArea;
