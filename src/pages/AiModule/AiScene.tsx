import closes from '@/assets/images/closes.png';
import confings from '@/assets/images/configs.png';
import duihua from '@/assets/images/duihua.png';
import aiimg from '@/assets/images/rebotIcon.png';
import shouqi from '@/assets/images/shouqi.png';
import zhankai from '@/assets/images/zhankai.png';
import copy from '@/assets/images/copyIcon@2x.png'
import refresh from '@/assets/images/refreshIcon@2x.png'
import dislikeOutlined from '@/assets/images/DislikeOutlined@2x.png'
import bDisLikeOutlined from '@/assets/images/DislikeOutlined2@2x.png'
import likeOutlined from '@/assets/images/LikeOutlined@2x.png'
import bLikeOutlined from '@/assets/images/LikeOutlined2@2x.png'
import { getConvertParamId } from '@/services/aiJobHunt/index';
import {
  deleteHistory,
  getHistory,
  getHistoryDetail,
  getPluginDetail,
  setSatisfaction,
} from '@/services/aiModule';
import { getQueryParam } from '@/utils/utils';
import { Button, ComboBox, Input, Select } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useMount, useReactive, useUpdateEffect } from 'ahooks';
import { message } from 'antd';
import RcMarkdown from 'rc-markdown';
import classNames from 'classnames';
import { isArray } from 'lodash';
import React, { useMemo, useRef } from 'react';
import Typewriter, { type TypewriterClass } from 'typewriter-effect';
import { history } from 'umi';
import EventSourceStream from '../AiJobHunt/Home/DialogArea/EventSourceStream';
import styles from './AiScene.less';
// import SpeechInputComponent from '../Recognition/index';

interface TState {
  curTheme: any;
  dialogList: any;
  editId: string;
  editName: string;
  data: any;
  allow: any;
  aiData: any;
  isLoading: any;
  messageArr: any;
  patams: any;
  visible: any;
  excludeId: any;
  open: any;
  isMarkdown: any;
  isTyping: any;
  typewriterArrCache: any;
  messageId: any;
  satisfied: any;
}

const renderPreview = (item: any) => {
  switch (item.elementType) {
    case 'input':
      return (
        <div className={styles.previewBox}>
          {item.error === true && (
            <div className={styles.errorBox}>未输入，请输入！</div>
          )}
          <div className={styles.previewTitle}>{item.displayName}</div>
          <Input
            maxLength={item.maxLength}
            showCount={true}
            type={Number(item.maxLength) < 30 ? 'default' : 'textarea'}
            style={{ width: '100%' }}
            placeholder={item.placeholder}
            value={item.value}
            onChange={(e: any) => {
              item.value = e;
              if (e !== '') {
                item.error = false;
              }
            }}
          ></Input>
        </div>
      );
    case 'select':
      return (
        <div className={styles.previewBox}>
          {item.error === true && (
            <div className={styles.errorBox}>未选择，请选择！</div>
          )}
          <div className={styles.previewTitle}>{item.displayName}</div>
          <Select
            style={{ width: '100%' }}
            value={item.value}
            placeholder={item.placeholder}
            option={item.options}
            onChange={(e: any) => {
              item.value = e;
              if (e !== '') {
                item.error = false;
              }
            }}
          ></Select>
        </div>
      );
    case 'treeSelect':
      return (
        <div className={styles.previewBox}>
          {item.error === true && (
            <div className={styles.errorBox}>未选择，请选择！</div>
          )}
          <div className={styles.previewTitle}>{item.displayName}</div>
          <ComboBox
            style={{ width: '100%' }}
            onChange={(e: any) => {
              item.value = e.target.value;
              if (e !== '') {
                item.error = false;
              }
            }}
            value={item.value}
            options={item.options}
          ></ComboBox>
        </div>
      );
    case 'radio':
      return (
        <div className={styles.previewBox}>
          {item.error === true && (
            <div className={styles.errorBox}>未选择，请选择！</div>
          )}
          <div className={styles.previewTitle}>{item.displayName}</div>
          <ComboBox
            style={{ width: '100%' }}
            onChange={(e: any) => {
              item.value = e.target.value;
              if (e !== '') {
                item.error = false;
              }
            }}
            value={item.value}
            options={item.options}
          ></ComboBox>
        </div>
      );
    case 'selectCheck':
      return (
        <div className={styles.previewBox}>
          {item.error === true && (
            <div className={styles.errorBox}>未选择，请选择！</div>
          )}
          <div className={styles.previewTitle}>{item.displayName}</div>
          <div className={styles.previewCheckBox}>
            {item.options &&
              item.options.map((items: any, index: any) => {
                return (
                  <div
                    onClick={() => {
                      if (item.value === void 0) {
                        item.value = [];
                        item.value.push(items.value);
                        item.error = false;
                      } else {
                        if (item.value?.includes(items.value)) {
                          console.log(JSON.stringify(item.value));
                          let delIndex: any = item.value.findIndex(
                            (el: any) => el === items.value,
                          );
                          console.log(delIndex);
                          item.value.splice(delIndex, 1);
                        } else {
                          item.value.push(items.value);
                          item.error = false;
                        }
                      }
                    }}
                    key={items.id}
                    style={{
                      border: item.value?.includes(items.value)
                        ? '1px solid rgb(86, 114, 255)'
                        : '1px solid rgba(0, 0, 0, 0.25)',
                      marginLeft: index % 4 === 0 ? 0 : 8,
                    }}
                    className={styles.previewCheck}
                  >
                    {items.label}
                  </div>
                );
              })}
          </div>
        </div>
      );
    case 'checkbox':
      return (
        <div className={styles.previewBox}>
          {item.error === true && (
            <div className={styles.errorBox}>未选择，请选择！</div>
          )}
          <div className={styles.previewTitle}>{item.displayName}</div>
          <div className={styles.previewCheckBox}>
            {item.options &&
              item.options.map((items: any, index: any) => {
                return (
                  <div
                    onClick={() => {
                      if (item.value === void 0) {
                        item.value = [];
                        item.value.push(items.value);
                      } else {
                        if (item.value?.includes(items.value)) {
                          console.log(JSON.stringify(item.value));
                          let delIndex: any = item.value.findIndex(
                            (el: any) => el === items.value,
                          );
                          console.log(delIndex);
                          item.value.splice(delIndex, 1);
                        } else {
                          item.value.push(items.value);
                        }
                      }
                    }}
                    key={items.id}
                    style={{
                      border: item.value?.includes(items.value)
                        ? '1px solid rgb(86, 114, 255)'
                        : '1px solid rgba(0, 0, 0, 0.25)',
                      marginLeft: index % 4 === 0 ? 0 : 8,
                    }}
                    className={styles.previewCheck}
                  >
                    {items.label}
                  </div>
                );
              })}
          </div>
        </div>
      );
  }
};

const JobHunt: React.FC = () => {
  // const queryData = useCreation(() => {
  //   return JSON.parse(window.sessionStorage.getItem('commonDatas') || '{}');
  // }, []);
  const typeWriter = useRef<TypewriterClass | null>(null);
  const typewriterStrCache = useRef<string>('');
  const state = useReactive<TState>({
    curTheme: undefined,
    dialogList: [],
    typewriterArrCache: [],
    editId: '',
    messageArr: [],
    excludeId: '',
    isLoading: false,
    isTyping: false,
    open: false,
    isMarkdown: false,
    allow: '',
    aiData: {},
    editName: '',
    visible: false,
    patams: '',
    data: [],
    messageId: '',
    satisfied: 0,
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
    if (
      (state.typewriterArrCache.length > 0 || state.isLoading) &&
      !state.isTyping &&
      typeWriter.current
    ) {
      console.log('state');
      state.isTyping = true;
      const curStr: string = state.typewriterArrCache.shift()! || '';
      typewriterStrCache.current += curStr;
      typeWriter
        .current!.typeString(curStr)
        .start()
        .callFunction(() => {
          state.isTyping = false;
        });
    }
  }, [state.isTyping]);

  const getHistoryList = (params: any, type: any) => {
    getHistory({
      paramId: params,
      limit: 999999999,
      pageNum: 1,
    }).then((res: any) => {
      // if (type === 1) {
      //   if (res.data.length !== 0) {
      //     res.data[res.data.length - 1].active = true;
      //   }
      // }
      state.messageArr = res.data || [];
      // getMessageDetail(res?.data[0]?.id, type)
    });
  };

  const send = () => {
    let error: any = false;
    state.isMarkdown = false;
    if (isArray(state.allow)) {
      if (state.allow[0] === '1') {
        console.log('sads', JSON.stringify(state.data));
        let sendData: any = {};
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
        state.data &&
          // eslint-disable-next-line array-callback-return
          state.data.map((item: any) => {
            console.log('22222', item.value);
            if (item.value === void 0 || item.value === '') {
              item.error = true;
              error = true;
            } else {
              item.error = false;
            }
            sendData[item.name] = item.value;
          });
        if (error !== true) {
          state.visible = true;
          state.isLoading = true;
          typewriterStrCache.current = '';
          let queryData: any = JSON.parse(
            window.sessionStorage.getItem('commonDatas') || '{}',
          );
          let qsData = {
            ...queryData,
            paramId: state.patams,
            pluginCode: state.aiData.plugin?.code,
            qsParams: sendData,
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
                state.isTyping = false;
                getHistoryList(state.patams, 1);
                state.isMarkdown = true;
              },
              onError: (error) => {
                console.log(error);
              },
              // 接收到数据
              receiveMessage: (data) => {
                if (data) {
                  console.log('2222222222', data.answer);
                  state.typewriterArrCache.push(data!.answer);
                }
              },
            },
          ).run();
        }
      } else {
        message.warning('请先勾选并同意《AI内容生成功能使用说明》');
        return;
      }
    } else {
      message.warning('请先勾选并同意《AI内容生成功能使用说明》');
      return;
    }
  };

  useUpdateEffect(() => {
    if (state.isLoading === false && state.typewriterArrCache.length === 0) {
      getMessageDetail(state.messageArr[0].id, 1)
    }

  }, [state.isTyping]);
  useMount(() => {
    getConvertParamId({}).then((res: any) => {
      getHistoryList(res);
      state.patams = res;
    });
    let qsData: any = getQueryParam();
    window.sessionStorage.setItem('commonDatas', JSON.stringify(qsData));
    // 如果是预置数据界面，不需要调用接口
    if (qsData.isPreset) {
      history.push('/presetData');
      return;
    }
    getPluginDetail({
      id: qsData.imageId,
      userId: '1',
      memberId: '1',
      schoolId: '1',
    }).then((res: any) => {
      if (
        res.plugin?.code === 'resume' ||
        res.plugin?.code === 'aiInterviewer'
      ) {
        history.push('/aiJobHunt');
      } else if (res.plugin?.code === 'word_sumary') {
        history.push('/documentSummary');
      } else if (res.plugin?.code === 'tts') {
        history.push('/wenshengVoice');
      } else if (res.plugin?.code === 'aiAQuestionGen') {
        history.push('/documentQA');
      } else if (res.plugin?.code === 'sentAnalysis') {
        history.push('/sentimentAnalysis');
      } else if (res.plugin?.code === 'ocr') {
        history.push('/OCR');
      } else if (res.plugin?.code === 'general') {
        history.push('/OR');
      } else if (res.plugin?.code === 'fruit') {
        history.push('/FVR');
      } else if (res.plugin?.code === 'carPlate') {
        history.push('/LPR');
      } else if (res.plugin?.code === 'intelligence') {
        history.push('/aiAtlas');
      } else if (res.plugin?.code === 'studyPlan') {
        history.push('/AiPlan');
      } else if (res.plugin?.code === 'dataView') {
        history.push('/dataVisualization');
      } else if (res.plugin?.modelTypeId === '12') {
        history.push({
          path: '',
        });
        history.push(`/AiSceneImg`);
      } else {
        state.data = JSON.parse(res.param?.params);
        state.aiData = res;
      }
    });
  });

  const copyText = () => {
    navigator.clipboard
      .writeText(state.typewriterArrCache?.join(''))
      .then(() => {
        message.success('复制成功!');
      })
      .catch((err) => {
        message.error('复制失败，请重新尝试！');
        console.error('Copy to clipboard failed', err);
      });
  }

  const setSatisfied = (satisfied: any) => {
    setSatisfaction({
      satisfied,
      messageId: state.messageId
    })
  }

  const likeAnswer = () => {
    if (state.satisfied === 1) {
      state.satisfied = -1
      setSatisfied(-1)
    } else {
      state.satisfied = 1
      setSatisfied(1)
    }
  }

  const disLikeAnswer = () => {
    if (state.satisfied === 0) {
      state.satisfied = -1
      setSatisfied(-1)
    } else {
      state.satisfied = 0
      setSatisfied(0)
    }
  }

  const getMessageDetail = (id: any, type?: any) => {
    let clone: any = state.messageArr;
    clone.forEach((element: any) => {
      element.active = false;
    });
    let choosedata: any = clone.find((element: any) => element.id == id);
    choosedata.active = true;
    state.messageArr = clone;
    getHistoryDetail({
      themeId: choosedata.id,
    }).then((res: any) => {
      if (type !== 1) {
        typewriterStrCache.current = res.answer;
      }
      state.visible = true;
      state.messageId = res.messageId
      state.satisfied = res.satisfied;
    });
  }

  return (
    <div className={styles.aicontainer}>
      <div className={styles.head}>{state.aiData.plugin?.name}</div>
      <div className={styles.content}>
        <div className={styles.left_content}>
          <div className={styles.config_head}>
            <img
              src={confings}
              style={{ width: 16, height: 16, marginRight: 4 }}
            ></img>
            <div>生成配置</div>
            <div
              className={styles.confing_text}
              onClick={() => {
                exampleRandom({
                  pluginCode: 'pictotext',
                  excludeId: state.excludeId,
                }).then((res: any) => {
                  console.log('111', state.typewriterArrCache);
                  console.log('222', state.isLoading);
                  console.log('333', state.isTyping);
                });
              }}
            >
              填入示例
            </div>
          </div>
          <div className={styles.left_top}>
            {state.data &&
              state.data.map((item: any) => {
                return renderPreview(item);
              })}
          </div>
          <div className={styles.left_bottom}>
            <Button
              type="primary"
              onClick={() => {
                send();
              }}
            >
              AI生成
            </Button>
            <div
              style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}
            >
              <ComboBox
                type="checkbox"
                options={[
                  {
                    label: '',
                    value: '1',
                  },
                ]}
                value={state.allow}
                onChange={(e: any) => {
                  state.allow = e;
                }}
              ></ComboBox>
              <div
                style={{ fontSize: 12, color: '#666666', lineHeight: '12px' }}
              >
                我已阅读并同意《AI内容生成功能使用说明》
              </div>
            </div>
          </div>
        </div>
        <div className={styles.mid_content}>
          <div
            style={{
              position: 'absolute',
              fontSize: 13,
              bottom: 18,
              color: 'rgb(134, 142, 179)',
              fontWeight: 400,
              display: 'flex',
              alignSelf: 'center',
            }}
          >
            所有内容均由人工智能模型输出，其内容的准确性和完整性无法保证，不代表我们的态度和观点。
          </div>
          <div
            style={{
              height: 'calc(100% - 5px)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <div className={styles.warningBox}>
              <img
                src={aiimg}
                style={{ width: 24, height: 24, marginRight: 16 }}
              ></img>
              <div className={styles.warning}>
                <div>{state.aiData.plugin?.tips}</div>
                <div className={styles.subwarning}>
                  {state.aiData.plugin?.note}
                </div>
              </div>
            </div>
            {state.visible && (
              <div>
                <span className={classNames(sf.sFs14, sf.sFwBold)}>
                  {state.isMarkdown === true ? (
                    <div
                      className={styles.warningBox}
                      style={{ marginTop: 24 }}
                    >
                      <img
                        src={aiimg}
                        style={{ width: 24, height: 24, marginRight: 16 }}
                      ></img>
                      <div className={styles.finallText}>
                        <RcMarkdown content={state.typewriterArrCache.join('')}></RcMarkdown>
                        <div className={styles.finallTextBottom}>
                          <div>
                            <span style={{ marginRight: 16 }}>您对本次的回答满意吗？</span>
                            <img src={state.satisfied === 1 ? bLikeOutlined : likeOutlined} style={{ marginRight: 24, cursor: 'pointer' }}
                              onClick={likeAnswer} />
                            <img src={state.satisfied === 0 ? bDisLikeOutlined : dislikeOutlined} style={{ cursor: 'pointer' }} onClick={disLikeAnswer} />
                          </div>
                          <div>
                            <span style={{ marginRight: 24 }}>{state.typewriterArrCache?.length || 0}个字符</span>
                            <span style={{ marginRight: 24, cursor: 'pointer' }} onClick={() => {
                              send();
                            }}><img src={refresh} style={{ marginRight: 3 }} />重新回答</span>
                            <img onClick={copyText} style={{ cursor: 'pointer' }} src={copy} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={styles.warningBox}
                      style={{ marginTop: 24 }}
                    >
                      <img
                        src={aiimg}
                        style={{ width: 24, height: 24, marginRight: 16 }}
                      ></img>
                      <div className={styles.warnings}>
                        <RcMarkdown content={state.typewriterArrCache.join('')}></RcMarkdown>
                        {/* <Typewriter
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
                        /> */}
                      </div>
                    </div>
                  )}
                </span>
              </div>
            )}
          </div>
          {/* <SpeechInputComponent></SpeechInputComponent> */}
        </div>
        {state.open === true ? (
          <div className={styles.right_list}>
            <img
              src={shouqi}
              onClick={() => {
                state.open = false;
              }}
              style={{
                position: 'absolute',
                width: 40,
                height: 40,
                top: 0,
                left: -20,
                cursor: 'pointer',
              }}
            ></img>
            <div className={styles.right_head}>对话记录</div>
            {state.messageArr &&
              state.messageArr.map((el: any) => {
                return (
                  <div
                    key={el.id}
                    onClick={() => {
                      getMessageDetail(el.id);
                    }}
                    style={{ background: el.active ? 'white' : 'none' }}
                    className={styles.messageBox}
                  >
                    <div>
                      <img
                        src={duihua}
                        style={{ width: 16, height: 14, marginRight: 6 }}
                      ></img>
                      {el.name}
                    </div>
                    <img
                      onClick={(e: any) => {
                        e.stopPropagation();
                        deleteHistory({
                          themeId: el.id,
                        }).then(() => {
                          message.success('操作成功');
                          state.visible = false;
                          getHistoryList(state.patams, 2);
                        });
                      }}
                      src={closes}
                      style={{ cursor: 'pointer', width: 14, height: 14 }}
                    ></img>
                    {/* {
                  el.active ? <img onClick={()=> {
                    deleteHistory({
                      themeId: el.id,
                    }).then(()=> {
                      message.success('操作成功');
                      getHistoryList(state.patams,2);
                    })
                  }} src={closes} style={{ cursor: 'pointer', width: 14, height: 14 }}></img> :  <div></div>
                } */}
                  </div>
                );
              })}
          </div>
        ) : (
          <img
            src={zhankai}
            onClick={() => {
              state.open = true;
            }}
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              top: 0,
              right: 5,
              cursor: 'pointer',
            }}
          ></img>
        )}
      </div>
    </div>
  );
};

export default JobHunt;
