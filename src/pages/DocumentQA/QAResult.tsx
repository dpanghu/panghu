import avatarIcon from '@/assets/images/documentQA/aiIcon.png';
import userIcon from '@/assets/images/documentQA/userIcon.png';
import FilePreview from '@/components/FilePreview';
import { getMessageLast, updateAnswerId } from '@/services/documentQA';
import { Button } from 'SeenPc';
import { useReactive, useUpdateEffect } from 'ahooks';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useRef } from 'react';
import Typewriter, { type TypewriterClass } from 'typewriter-effect';
import EventSourceStream from '../AiJobHunt/Home/DialogArea/EventSourceStream';
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
}

const QAResult: React.FC<TProps> = ({ summaryData, paramsId }) => {
  const preAnswer = JSON.parse(summaryData?.preAnswer || '{}');
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
  });

  const onQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    state.questionValue = e.target.value;
  };

  // 获取对话上下文
  const getMessageHistory = async () => {
    try {
      const result: RecordItem[] = await getMessageLast({
        themeId: summaryData?.themeId,
        num: 10,
      });
      result.reverse().map((item) => {
        if (item.type === 0) {
          state.dialogList.push({
            type: 'question',
            content: item.content,
          });
        } else if (item.type === 1) {
          state.dialogList.push({
            type: 'answer',
            content: item.content,
          });
        }
      });
    } catch (error) {}
  };

  const handleSendDialog = () => {
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

  useUpdateEffect(() => {
    // if (!typeWriter.current) {
    //   return;
    // }
    const writeText = state.typewriterArr.shift()! || '';
    state.textWriteFinished = false;
    state.aiAnswerStr += writeText;
    typeWriter
      .current!.typeString(writeText)
      .start()
      .callFunction(() => {
        state.textWriteFinished = true;
      });
  }, [state.textWriteFinished, typeWriter.current]);

  useUpdateEffect(() => {
    if (
      !state.typewriterArr.length &&
      state.textWriteFinished &&
      state.streamFinished
    ) {
      console.log('输出完成');
      state.showTypewriter = false;

      // state.aiAnswerStr = '';
    }
  }, [state.typewriterArr, state.streamFinished, state.textWriteFinished]);

  useUpdateEffect(() => {
    if (!state.showTypewriter) {
      state.dialogList.push({
        type: 'answer',
        content: state.aiAnswerStr || '暂无结果',
      });
      state.aiAnswerStr = '';
      state.typewriterArr = [];
    }
  }, [state.showTypewriter]);

  useUpdateEffect(() => {
    if (state.conversationId) {
      updateThemeId();
    }
  }, [state.conversationId]);

  useEffect(() => {
    if (summaryData?.id) {
      getMessageHistory();
    }
    if (!state.themeId) {
      state.themeId = summaryData.themeId;
      state.conversationId = summaryData.conversationId;
    }
  }, [summaryData]);

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
        <div className={styles.questionContent}>
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
                <div className={styles.question}>{item.content}</div>
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
              <Typewriter
                onInit={(typewriter: TypewriterClass) => {
                  typeWriter.current = typewriter;
                  typewriter
                    .typeString('')
                    .start()
                    .callFunction(() => {});
                }}
                options={{
                  delay: 25,
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.baseQuestion}>
            <span
              onClick={() => {
                state.questionValue = preAnswer?.query1 || '';
                handleSendDialog();
              }}
            >
              {preAnswer?.query1 || ''}
            </span>
            <span
              onClick={() => {
                state.questionValue = preAnswer?.query1 || '';
                handleSendDialog();
              }}
            >
              {preAnswer?.query2 || ''}
            </span>
          </div>
          <div className={styles.ipt}>
            <TextArea
              showCount
              value={state.questionValue}
              maxLength={200}
              onChange={onQuestionChange}
              //   onPressEnter={handleSendDialog}
              placeholder="请输入问题，AI将根据文档内容，进行回答"
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
