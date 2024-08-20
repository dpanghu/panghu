import { generatePlugin, getChatRecord } from '@/services/aiJobHunt';
import { scrollToBottom, scrollToTop } from '@/utils/utils';
import { useCreation, useReactive, useUpdateEffect } from 'ahooks';
import classnames from 'classnames';
import { pick, uniqueId } from 'lodash';
import qs from 'qs';
import React, { useImperativeHandle, useMemo, useRef } from 'react';
import Typewriter, { type TypewriterClass } from 'typewriter-effect';
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
  isTyping: boolean;
  typewriterArrCache: string[];
};
const DialogNum = 10;
const DialogArea = React.forwardRef(
  ({ curTheme, onReveiveFirstMessage, onPluginCreate }: Props, ref) => {
    const curDialogId = useRef<string>('');
    const conversationId = useRef<string>('');
    const typeWriter = useRef<TypewriterClass | null>(null);
    const typewriterStrCache = useRef<string>('');
    const historyEleHref = useRef<HTMLDivElement>(null);
    const queryData = useCreation(() => {
      return JSON.parse(window.sessionStorage.getItem('queryParams') || '{}');
    }, []);
    const state = useReactive<TState>({
      dialogHistory: [],
      isLoading: false,
      isTyping: false,
      typewriterArrCache: [],
    });

    // 是否完成对话
    const isTypeFinished = useMemo(() => {
      return (
        state.typewriterArrCache.length === 0 &&
        !state.isTyping &&
        !state.isLoading
      );
    }, [state.typewriterArrCache, state.isLoading, state.isTyping]);

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
          typewriterStrCache.current = '';
          state.dialogHistory = res.reverse();
          curDialogId.current = curTheme.id;
          conversationId.current = curTheme.conversationId || '';
          scrollToTop(historyEleHref.current);
        });
      }
    }, [curTheme]);

    useUpdateEffect(() => {
      if (
        (state.typewriterArrCache.length > 0 || state.isLoading) &&
        !state.isTyping &&
        typeWriter.current
      ) {
        state.isTyping = true;
        const curStr: string = state.typewriterArrCache.shift()! || '';
        typewriterStrCache.current += curStr;
        typeWriter
          .current!.typeString(curStr)
          .start()
          .callFunction(() => {
            state.isTyping = false;
            scrollToBottom(historyEleHref.current);
          });
      }
      if (isTypeFinished) {
        state.dialogHistory.push({
          id: uniqueId(),
          type: 1,
          content: typewriterStrCache.current,
        });
        typewriterStrCache.current = '';
        setTimeout(() => {
          scrollToBottom(historyEleHref.current);
        }, 10);
      }
    }, [state.isTyping]);

    const createNewDialog = () => {
      state.dialogHistory = [];
      state.isLoading = false;
      state.typewriterArrCache = [];
      typewriterStrCache.current = '';
      curDialogId.current = '';
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          isTypeFinished,
          createNewDialog,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },
      [isTypeFinished],
    );

    const submitChat = async (msg: SubmitMessage) => {
      if (msg.pluginCode) {
        generatePlugin({
          ...msg,
          userType:'PLATFORM',
          themeId: curDialogId.current,
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
            onFinished: () => {
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
                <h2>您好，我是新道AI，您的专属AI伙伴</h2>
                <p>我可以为您的创作提供灵感。</p>
                <p>
                  与您互动问答，为您的个性化需求提供智能推荐。期待与您一起探索未来！
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
                  <pre className={styles['message-area']}>{item.content}</pre>
                </div>
              );
            })}
            {!isTypeFinished && (
              <div className={styles['message-from-ai']}>
                <Typewriter
                  onInit={(typewriter: TypewriterClass) => {
                    state.isTyping = true;
                    typeWriter.current = typewriter;
                    typewriter
                      .typeString('')
                      .start()
                      .callFunction(() => {
                        state.isTyping = false;
                      });
                  }}
                  options={{
                    delay: 25,
                  }}
                />
              </div>
            )}
          </div>
        )}
        <div className={styles['diaplog-submit-container']}>
          <MessageSendArea
            isTypeFinished={isTypeFinished}
            onSubmit={(msg) => {
              submitChat(msg);
            }}
            onChangePlugin={() => { }}
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
