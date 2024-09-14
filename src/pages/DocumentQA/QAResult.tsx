import avatarIcon from '@/assets/images/documentQA/aiIcon.png';
import userIcon from '@/assets/images/documentQA/userIcon.png';
import FilePreview from '@/components/FilePreview';
import { Button } from 'SeenPc';
import { useReactive, useUpdateEffect } from 'ahooks';
import TextArea from 'antd/es/input/TextArea';
import React, { useRef } from 'react';
import { type TypewriterClass } from 'typewriter-effect';
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
}

const QAResult: React.FC<TProps> = ({ summaryData, paramsId }) => {
  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );
  const typeWriter = useRef<TypewriterClass | null>(null);
  const typewriterStrCache = useRef<string>('');
  const state = useReactive<TState>({
    dialogList: [],
    questionValue: '',
    streamFinished: false,
    conversationId: '',
    themeId: '',
    textWriteFinished: true,
    typewriterArr: [],
    showTypewriter: false,
  });

  const onQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    state.questionValue = e.target.value;
  };

  const handleSendDialog = () => {
    let qsData = {
      ...extraParams,
      paramId: paramsId,
      pluginCode: 'aiAnswer',
      qsParams: {
        attachmentUrl: summaryData.ossViewUrl,
      },
      userMessage: state.questionValue.trim(),
    };
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
        onError: (error) => {},
        // 接收到数据
        receiveMessage: (data) => {
          if (data) {
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

  useUpdateEffect(() => {
    const writeText = state.typewriterArr.shift()! || '';
    state.textWriteFinished = false;
    typeWriter
      .current!.typeString(writeText)
      .start()
      .callFunction(() => {
        state.textWriteFinished = true;
      });
  }, [state.textWriteFinished]);

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
          <div className={styles.userQuestion}>
            <div className={styles.question}>
              请输入你的问题，我将依据你的问题，在丰富的文档资源
              请输入你的问题，我将依据你的问题，在丰富的文档资源
              请输入你的问题，我将依据你的问题，在丰富的文档资源
            </div>
            <img src={userIcon} alt="" className={styles.userIcon} />
          </div>
          {/* <div className={styles.AIAnswer}>
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
          </div> */}
        </div>
        <div className={styles.footer}>
          <div className={styles.baseQuestion}>
            <span>什么是元数据管理?</span>
            <span>血缘分析、影响分析、关联分析的区别?</span>
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
