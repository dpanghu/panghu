import confings from '@/assets/images/configs.png';
import aiimg from '@/assets/images/rebotIcon.png';
import { getPluginDetail } from '@/services/aiModule';
import { getQueryParam } from '@/utils/utils';
import { Button, ComboBox, Input, Select } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useCreation, useMount, useReactive, useUpdateEffect } from 'ahooks';
import { message } from 'antd';
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
  visible: any;
  isTyping: any;
  typewriterArrCache: any;
}

const renderPreview = (item: any) => {
  switch (item.elementType) {
    case 'input':
      return (
        <div className={styles.previewBox}>
          {
            item.error === true && <div className={styles.errorBox}>未输入，请输入！</div>
          }
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
              if(e !== '') {
                item.error = false;
              }
            }}
          ></Input>
        </div>
      );
    case 'select':
      return (
        <div className={styles.previewBox}>
          {
            item.error === true && <div className={styles.errorBox}>未选择，请选择！</div>
          }
          <div className={styles.previewTitle}>{item.displayName}</div>
          <Select
            style={{ width: '100%' }}
            value={item.value}
            placeholder={item.placeholder}
            option={item.options}
            onChange={(e: any) => {
              item.value = e;
              if(e !== '') {
                item.error = false;
              }
            }}
          ></Select>
        </div>
      );
    case 'treeSelect':
      return (
        <div className={styles.previewBox}>
          {
            item.error === true && <div className={styles.errorBox}>未选择，请选择！</div>
          }
          <div className={styles.previewTitle}>{item.displayName}</div>
          <ComboBox
            style={{ width: '100%' }}
            onChange={(e: any) => {
              item.value = e.target.value;
              if(e !== '') {
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
          {
            item.error === true && <div className={styles.errorBox}>未选择，请选择！</div>
          }
          <div className={styles.previewTitle}>{item.displayName}</div>
          <ComboBox
            style={{ width: '100%' }}
            onChange={(e: any) => {
              item.value = e.target.value;
              if(e !== '') {
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
          {
            item.error === true && <div className={styles.errorBox}>未选择，请选择！</div>
          }
          <div className={styles.previewTitle}>{item.displayName}</div>
          <div className={styles.previewCheckBox}>
            {item.options &&
              item.options.map((items: any) => {
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
          {
            item.error === true && <div className={styles.errorBox}>未选择，请选择！</div>
          }
          <div className={styles.previewTitle}>{item.displayName}</div>
          <div className={styles.previewCheckBox}>
            {item.options &&
              item.options.map((items: any) => {
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
  const queryData = useCreation(() => {
    return JSON.parse(window.sessionStorage.getItem('commonDatas') || '{}');
  }, []);
  const typeWriter = useRef<TypewriterClass | null>(null);
  const typewriterStrCache = useRef<string>('');
  const state = useReactive<TState>({
    curTheme: undefined,
    dialogList: [],
    typewriterArrCache: [],
    editId: '',
    isLoading: false,
    isTyping: false,
    allow: '',
    aiData: {},
    editName: '',
    visible: false,
    data: [],
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

  const send = () => {
    let error: any = false;
    if (isArray(state.allow)) {
      if (state.allow[0] === '1') {
        let sendData: any = {};
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
        state.data &&
          // eslint-disable-next-line array-callback-return
          state.data.map((item: any) => {
            if (item.value === void 0 || item.value === '') {
              item.error = true;
              error = true;
            }else {
              item.error = false;
            }
            sendData[item.name] = item.value;
          });
        if (error !== true) {
          state.visible = true;
          state.isLoading = true;
          typewriterStrCache.current = '';
          let qsData = {
            ...queryData,
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
              },
              onError: (error) => {
                console.log(error);
              },
              // 接收到数据
              receiveMessage: (data) => {
                if (data) {
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

  useMount(() => {
    let qsData: any = getQueryParam();
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
      } else if (res.plugin?.code === 'sentAnalysis') {
        history.push('/sentimentAnalysis');
      }
      else if (res.plugin?.code === 'ocr') {
        history.push('/OCR');
      }
      else if (res.plugin?.code === 'general') {
        history.push('/OR');
      }
      else if (res.plugin?.code === 'fruit') {
        history.push('/FVR');
      }
      else if (res.plugin?.code === 'carPlate') {
        history.push('/LPR');
      } else {
        state.data = JSON.parse(res.param?.params);
        state.aiData = res;
      }
    });
  });

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
                message.warning('该功能暂未开放');
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
                {isTypeFinished ? (
                  <div className={styles.warningBox} style={{ marginTop: 24 }}>
                    <img
                      src={aiimg}
                      style={{ width: 24, height: 24, marginRight: 16 }}
                    ></img>
                    <div className={styles.finallText}>
                      {typewriterStrCache.current}
                      {/* <pre className={styles.texts} style={{ whiteSpace: 'pre-wrap', margin: 0, color: '#272648', fontSize: 14, lineHeight: '24px',fontWeight: 400 }}>
                    {typewriterStrCache.current}
                  </pre> */}
                    </div>
                  </div>
                ) : (
                  <div className={styles.warningBox} style={{ marginTop: 24 }}>
                    <img
                      src={aiimg}
                      style={{ width: 24, height: 24, marginRight: 16 }}
                    ></img>
                    <div className={styles.warnings}>
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
                  </div>
                )}
              </span>
            </div>
          )}
          {/* <SpeechInputComponent></SpeechInputComponent> */}
        </div>
        {/* <div className={styles.right_list}>
          <div className={styles.right_head}></div>
        </div> */}
      </div>
    </div>
  );
};

export default JobHunt;
