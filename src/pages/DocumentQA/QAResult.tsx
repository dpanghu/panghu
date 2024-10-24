import activeCopyIcon from '@/assets/images/documentQA/activeCopy.png';
import activeDownIcon from '@/assets/images/documentQA/activeDown.png';
import activeUpIcon from '@/assets/images/documentQA/activeUp.png';
import avatarIcon from '@/assets/images/documentQA/aiIcon.png';
import baseCopyIcon from '@/assets/images/documentQA/baseCopy.png';
import baseDownIcon from '@/assets/images/documentQA/baseDown.png';
import baseUpIcon from '@/assets/images/documentQA/baseUp.png';
import userIcon from '@/assets/images/documentQA/userIcon.png';
import FilePreview from '@/components/FilePreview';
import {
  getMessageLast,
  updateAnswerId,
  updateSatisfied,
} from '@/services/documentQA';
import { scrollToBottom } from '@/utils/utils';
import { Button, message } from 'SeenPc';
import { useReactive, useUpdateEffect } from 'ahooks';
import TextArea from 'antd/es/input/TextArea';
import { marked } from 'marked';
import React, { useEffect, useRef } from 'react';
import { type TypewriterClass } from 'typewriter-effect';
import EventSourceStream from '../AiJobHunt/Home/DialogArea/EventSourceStream';
import Markdown from '../DocumentSummary/Mind';
import styles from './QAResult.less';

interface TProps {
  summaryData: RecordItem;
  paramsId: string;
}

interface TState {
  dialogList: RecordItem[];
  questionValue: string;
  streamFinished: boolean;
  conversationId: string;
  themeId: string;
  typewriterArr: string[];
  textWriteFinished: boolean;
  showTypewriter: boolean;
  aiAnswerStr: string;
  receiveText: boolean;
  copyActive: Record<string, boolean>;
  downActive: boolean;
}

const QAResult: React.FC<TProps> = ({ summaryData, paramsId }) => {
  const preAnswer = JSON.parse(summaryData?.preAnswer || '{}');
  const historyEleHref = useRef<HTMLDivElement>(null);
  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );
  const typeWriter = useRef<TypewriterClass | null>(null);
  const state = useReactive<TState>({
    dialogList: [],
    questionValue: '',
    streamFinished: false,
    conversationId: '',
    themeId: '',
    textWriteFinished: true,
    typewriterArr: [],
    showTypewriter: false,
    aiAnswerStr: '',
    receiveText: false,
    copyActive: {},
    downActive: false,
  });

  const onQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    state.questionValue = e.target.value;
  };

  // 获取对话上下文
  const getMessageHistory = async () => {
    try {
      if (!state.themeId) {
        return;
      }
      const result: RecordItem[] = await getMessageLast({
        themeId: state.themeId,
        num: 10,
      });
      state.dialogList = [];
      result.reverse().map((item) => {
        if (item.type === 0) {
          state.dialogList.push({
            type: 'question',
            content: item.content,
            satisfied: item.satisfied,
            id: item.id,
          });
        } else if (item.type === 1) {
          state.dialogList.push({
            type: 'answer',
            content: item.content,
            satisfied: item.satisfied,
            id: item.id,
          });
        }
        setTimeout(() => {
          scrollToBottom(historyEleHref.current);
        }, 50);
      });
    } catch (error) {}
  };

  const handleSatisfied = async (params: RecordItem, type: 'down' | 'up') => {
    await updateSatisfied({
      messageId: params.id,
      satisfied: type === 'down' ? 0 : 1,
    });
    if (state.themeId) {
      getMessageHistory();
    }
  };

  const handleSendDialog = () => {
    // 判断是否输出完成 输出完 才允许继续问答
    if (state.showTypewriter) {
      message.warning('请等待上一次回答结束后再次提问');
      return;
    }

    if (!state.questionValue.trim()) {
      message.warning('请先输入问题');
      return;
    }
    state.dialogList.push({
      type: 'question',
      content: state.questionValue.trim(),
    });
    let qsData = {
      ...extraParams,
      paramId: paramsId,
      pluginCode: 'aiAnswer',
      qsParams: {
        attachmentUrl: summaryData.ossViewUrl,
      },
      themeId: state.themeId,
      conversation_id: state.conversationId,
      userMessage: state.questionValue.trim(),
    };
    setTimeout(() => {
      scrollToBottom(historyEleHref.current);
    }, 200);
    state.showTypewriter = true;
    state.streamFinished = false;
    state.receiveText = false;
    state.questionValue = '';
    new EventSourceStream(
      '/api/bus-xai/xai/plugin/create/stream',
      {
        method: 'POST',
        data: qsData,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
      },
      {
        // 结束，包括接收完毕所有数据、报错、关闭链接
        onFinished: () => {
          // setTimeout(() => {
          //   state.showTypewriter = false;
          // }, 3000);
          state.streamFinished = true;
        },
        onError: (error) => {
          state.showTypewriter = false;
        },
        // 接收到数据
        receiveMessage: (data) => {
          if (data) {
            state.receiveText = true;
            state.streamFinished = false;
            state.textWriteFinished = false;
            if (!state.conversationId) {
              state.conversationId = data.conversation_id;
              state.themeId = data.themeId;
            }
            if (data!.answer || data!.answer === '') {
              state.aiAnswerStr += data!.answer;
              setTimeout(() => {
                scrollToBottom(historyEleHref.current);
              }, 100);
            }
            if (data!.isEnd) {
              state.streamFinished = true;
              state.showTypewriter = false;
              setTimeout(() => {
                scrollToBottom(historyEleHref.current);
              }, 100);
            }
            state.typewriterArr.push(data!.answer);
          }
        },
      },
    ).run();
  };

  const updateThemeId = async () => {
    await updateAnswerId({
      themeId: state.themeId,
      conversationId: state.conversationId,
      id: summaryData?.id,
    });
  };

  const handleCopyContent = (params: RecordItem) => {
    state.copyActive[params.id] = true;
    if (navigator.clipboard && window.isSecureContext) {
      return window.navigator?.clipboard
        ?.writeText(params?.content)
        .then(() => {
          message.success(`文本已复制`);
        })
        .catch(() => {
          message.error('复制失败，请手动右键复制');
        });
      // return navigator.clipboard.writeText(textToCopy);
    } else {
      // 创建text area
      let textArea = document.createElement('textarea');
      textArea.value = params?.content;
      // 使text area不在viewport，同时设置不可见
      textArea.style.position = 'absolute';
      textArea.style.opacity = '0';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        message.success(`文本已复制`);
        // 执行复制命令并移除文本框
        document.execCommand('copy') ? res(null) : rej();
        textArea.remove();
      });
    }
  };

  useUpdateEffect(() => {
    if (
      !state.typewriterArr.length &&
      state.textWriteFinished &&
      state.streamFinished
    ) {
      console.log('输出完成');
      state.showTypewriter = false;
    }
  }, [state.typewriterArr, state.streamFinished, state.textWriteFinished]);

  useUpdateEffect(() => {
    if (!state.showTypewriter) {
      state.dialogList.push({
        type: 'answer',
        content: state.aiAnswerStr || '暂无结果',
      });
      setTimeout(() => {
        scrollToBottom(historyEleHref.current);
      }, 200);
      if (state.themeId) {
        getMessageHistory();
      }
      state.aiAnswerStr = '';
      state.typewriterArr = [];
    }
  }, [state.showTypewriter, state.themeId]);

  useUpdateEffect(() => {
    if (state.conversationId) {
      updateThemeId();
    }
  }, [state.conversationId]);

  useEffect(() => {
    if (summaryData?.id && summaryData?.themeId) {
      getMessageHistory();
    }
    if (!state.themeId) {
      state.themeId = summaryData.themeId;
      state.conversationId = summaryData.conversationId;
    }
  }, [summaryData]);

  useEffect(() => {
    // 示例Markdown字符串
    const markdownString = `
# 标题
 
这是一个段落。
 
- 列表项一
- 列表项二
 
**粗体文本**
 
[链接](https://example.com);`;
    // 将Markdown转换为HTML
    const htmlString = marked.parse(markdownString);
    console.log(htmlString);
  }, []);

  return (
    <div className={styles.QAResultContainer}>
      <div className={styles.fileContent}>
        <FilePreview
          learnUrl={summaryData.ossViewUrl}
          materialId={summaryData.materialId}
          fileName={summaryData.attachmentName}
        />
      </div>
      <div className={styles.AIcontent}>
        <div className={styles.questionContent} ref={historyEleHref}>
          <div className={styles.AIAnswer}>
            <img
              draggable={false}
              src={avatarIcon}
              alt=""
              className={styles.avatar}
            />
            <div className={styles.baseWord}>
              <span className={styles.sub}>
                同学你好，我是AI文档助手小新，快来向我提问吧！
              </span>
              <span className={styles.title}>
                请输入你的问题，我将依据你的问题，在丰富的文档资源中搜寻，并为你呈现相关的答案。
              </span>
            </div>
          </div>
          {state.dialogList.map((item) =>
            item.type === 'answer' ? (
              <div className={styles.AIAnswer}>
                <img
                  draggable={false}
                  src={avatarIcon}
                  alt=""
                  className={styles.avatar}
                />
                <div className={styles.question}>
                  <Markdown content={item.content} />
                  <div className={styles.actionBtns}>
                    <img
                      onClick={() => {
                        handleSatisfied(item, 'up');
                      }}
                      src={item.satisfied === 1 ? activeUpIcon : baseUpIcon}
                      alt=""
                    />
                    <img
                      onClick={() => {
                        handleSatisfied(item, 'down');
                      }}
                      src={item.satisfied === 0 ? activeDownIcon : baseDownIcon}
                      alt=""
                    />
                    <img
                      onClick={() => {
                        handleCopyContent(item);
                      }}
                      src={
                        state.copyActive?.[item.id]
                          ? activeCopyIcon
                          : baseCopyIcon
                      }
                      alt=""
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.userQuestion}>
                <div className={styles.question}>{item.content}</div>
                <img src={userIcon} alt="" className={styles.userIcon} />
              </div>
            ),
          )}
          {state.showTypewriter && (
            <div className={styles.AIAnswer}>
              <img
                draggable={false}
                src={avatarIcon}
                alt=""
                className={styles.avatar}
              />
              <div className={styles.question}>
                <Markdown content={state.aiAnswerStr} />
              </div>
              {/* <Typewriter
                onInit={(typewriter: TypewriterClass) => {
                  typeWriter.current = typewriter;
                  typewriter
                    .typeString('')
                    .start()
                    .callFunction(() => {
                      scrollToBottom(historyEleHref.current);
                    });
                }}
                options={{
                  delay: 25,
                }}
              /> */}
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.baseQuestion}>
            {preAnswer?.query1 && (
              <span
                title={preAnswer?.query1 || ''}
                onClick={() => {
                  state.questionValue = preAnswer?.query1 || '';
                  handleSendDialog();
                }}
              >
                {preAnswer?.query1 || ''}
              </span>
            )}
            {preAnswer?.query2 && (
              <span
                title={preAnswer?.query2 || ''}
                onClick={() => {
                  state.questionValue = preAnswer?.query2 || '';
                  handleSendDialog();
                }}
              >
                {preAnswer?.query2 || ''}
              </span>
            )}
          </div>
          <div className={styles.ipt}>
            <TextArea
              showCount
              value={state.questionValue}
              maxLength={200}
              onChange={onQuestionChange}
              onPressEnter={(e) => {
                e.preventDefault();
                handleSendDialog();
              }}
              placeholder="请输入问题，AI将根据文档内容，进行回答。"
              style={{ height: 100, resize: 'none' }}
            />
            <Button
              type="primary"
              className={styles.sendBtn}
              onClick={handleSendDialog}
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAResult;
