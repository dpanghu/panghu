import goBack from '@/assets/images/goBack.png';
import {
  exportInterview,
  getInterviewQuestionList,
} from '@/services/aiJobHunt';
import { downloadFile } from '@/utils/utils';
import { Button, message } from 'SeenPc';
import { useCreation, useMount, useReactive } from 'ahooks';
import { Input, Modal } from 'antd';
import React from 'react';
import Typewriter from 'typewriter-effect';
import { history, useParams } from 'umi';
import EventSourceStream from '../Home/DialogArea/EventSourceStream';
import styles from './index.less';
import PageLoading from '@/components/PageLoading';

type TState = {
  data: any[];
  message: string;
  currentQuestionIndex: number;
  answers: any[];
  showBtn: boolean; // 是否显示参考答案按钮
  showReferenceAnswers: boolean; //是否显示参考答案以及AI点评按钮
  ReferenceAnswers: any[];
  showAIComments: boolean; //是否显示AI点评
  AIComments: any[];
  problemId: string;
  isLoading: boolean;
  isType: boolean;
  btnLoading: boolean;
};
const Interview: React.FC = ({ }) => {
  const params = useParams<{ id?: string }>();
  const queryData = useCreation(() => {
    return JSON.parse(window.sessionStorage.getItem('queryParams') || '{}');
  }, []);
  const state = useReactive<TState>({
    data: [],
    message: '',
    currentQuestionIndex: 0,
    answers: [],
    showBtn: false,
    showReferenceAnswers: false,
    ReferenceAnswers: [],
    showAIComments: false,
    AIComments: [],
    problemId: '',
    isLoading: false,
    isType: false,
    btnLoading: false,
  });
  const submitUserAnswer = () => {
    state.isLoading = true;
    let qsData = {
      ...queryData,
      chatType: 'dtc240630',
      paramId: state.problemId,
      pluginCode: 'aiComment',
      userMessage: state.message || '',
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
          state.isLoading = false;
          state.btnLoading = false;
        },
        onError: (error) => {
          console.log(error);
        },
        // 接收到数据
        receiveMessage: () => { },
      },
    ).run();
    state.answers = [
      ...state.answers,
      { stuAnswer: state.message, questionIndex: state.currentQuestionIndex },
    ];
    state.message = '';
    state.isType = true;
    state.currentQuestionIndex += 1;
    state.problemId = state.data[state.currentQuestionIndex]?.id;
    if (state.currentQuestionIndex === state.data.length) {
      state.showBtn = true;
    }
  };

  const handleAnswerSubmit = () => {
    if (state.showBtn || state.isLoading || state.isType) {
      return;
    }
    if (state.message.trim() === '') {
      message.warning('请输入问题的答案');
      return;
    }
    Modal.confirm({
      title: '确认提交',
      content: '一旦提交，将不能再次作答此问题',
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk() {
        submitUserAnswer();
      },
      onCancel() { },
    });
  };

  const handleShowReferenceAnswers = () => {
    if (state.isLoading) {
      state.btnLoading = true;
    } else {
      state.btnLoading = false;
      if (state.showReferenceAnswers) {
        state.showReferenceAnswers = false;
        state.showAIComments = false;
        state.ReferenceAnswers = [];
        state.AIComments = [];
      } else {
        getInterviewQuestionList({ paramId: params.id }).then((res) => {
          res.forEach((item: any) => {
            state.ReferenceAnswers = [...state.ReferenceAnswers, item.aiAnswer];
            state.AIComments = [...state.AIComments, item.aiComment];
          });
          state.showReferenceAnswers = true;
        });
      }
    }
  };

  const handleShowAIComments = () => {
    if (state.showAIComments) {
      state.showAIComments = false;
    } else {
      state.showAIComments = true;
    }
  };
  const downLoadInterview = () => {
    exportInterview({ paramId: params.id }).then((res: any) => {
      downloadFile(res);
    });
  };

  const getInterviewQuestion = () => {
    if (params.id) {
      getInterviewQuestionList({ paramId: params.id })
        .then((res) => {
          state.data = res;
        })
        .then(() => {
          const firstEmptyUserAnswerIndex = state.data.findIndex(
            (q) => !q.stuAnswer,
          );
          state.currentQuestionIndex =
            firstEmptyUserAnswerIndex === -1
              ? state.data.length
              : firstEmptyUserAnswerIndex;
          state.problemId = state.data[state.currentQuestionIndex]?.id;
          state.showBtn = state.currentQuestionIndex === state.data.length;
          state.answers = state.data
            .slice(0, state.currentQuestionIndex)
            .map((faq, index) => ({
              stuAnswer: faq.stuAnswer,
              questionIndex: index,
            }));
        });
    }
  };
  useMount(() => {
    getInterviewQuestion();
  });

  return (
    <div className={styles.interviewContainer}>
      {
        state.btnLoading && <PageLoading />
      }
      <div className={styles.top}>
        <div className={styles.topLeft}>
          <Button onClick={() => history.push('/aiJobHunt')}>
            <img src={goBack} />
            返回
          </Button>
          <span className={styles.verticalLine}></span>
          <span>我的面试</span>
        </div>
        <Button onClick={downLoadInterview}>下载</Button>
      </div>
      <div className={styles.content}>
        <div className={styles.interviewContent} id="interview_container">
          <div className={styles.aiBox}>
            <div className={styles.box}>
              <p className={styles.welBox}>
                欢迎参加本次面试，我是您的AI面试官，在接下来的时间里，我将通过一系列问题来了解您的专业技能、工作经验以及个人能力。
              </p>
              <p className={styles.headTip}>
                请您认真审题，并在思考后，清晰、详细的进行回答。
              </p>
            </div>
          </div>
          {state.data.map((faq, index) => {
            return (
              <div key={index}>
                {index <= state.currentQuestionIndex && (
                  <>
                    <div className={styles.aiBox}>
                      {index === state.currentQuestionIndex &&
                        state.isType === true ? (
                        <div className={styles.box}>
                          {state.isLoading ? (
                            <div className={styles.loadingCursor}>|</div>
                          ) : (
                            <Typewriter
                              options={{
                                delay: 50,
                              }}
                              onInit={(typewriter) => {
                                state.isType = true;
                                typewriter
                                  .typeString(faq.question)
                                  .start()
                                  .callFunction(() => {
                                    state.isType = false;
                                  });
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className={styles.box}>{faq.question}</div>
                      )}
                    </div>
                    <div className={styles.answerBox}>
                      {state.answers
                        .filter((answer) => answer.questionIndex === index)
                        .map((answer, answerIndex) => (
                          <div className={styles.box} key={answerIndex}>
                            {answer.stuAnswer}
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {state.showReferenceAnswers && (
            <div className={styles.aiAnswerBox}>
              <span>参考答案:</span>
              <div>
                {state.ReferenceAnswers.map((answer, index) => (
                  <div key={index}>
                    第{index + 1}题答案：{answer}
                  </div>
                ))}
              </div>
            </div>
          )}
          {state.showAIComments && (
            <div className={styles.aiCommentBox}>
              <span>AI点评:</span>
              <div>
                {state.AIComments.map((comment, index) => (
                  <div key={index}>
                    第{index + 1}题AI点评：{comment}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.footerBtn}>
            {state.showBtn && (
              <Button onClick={handleShowReferenceAnswers}>参考答案</Button>
            )}
            {state.showReferenceAnswers && (
              <Button onClick={handleShowAIComments}>AI点评</Button>
            )}
          </div>
          <div className={styles.inputArea}>
            <Input.TextArea
              autoSize={{ minRows: 1, maxRows: 3 }}
              showCount
              maxLength={2000}
              onKeyDown={(e) => {
                if (e.code === 'Enter' && e.shiftKey) {
                  handleAnswerSubmit();
                } else if (e.code === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAnswerSubmit();
                }
              }}
              value={state.showBtn ? '' : state.message}
              placeholder={'请输入问题的答案'}
              onChange={(e) => (state.message = e.target.value)}
            />
            <div className={styles.inputFooter}>
              <Button type="primary" onClick={handleAnswerSubmit}>
                发送
              </Button>
            </div>
          </div>
          <p className={styles.footerTip}>
            所有内容均由人工智能模型输出，其内容的准确性和完整性无法保证，不代表我们的态度和观点。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Interview;
