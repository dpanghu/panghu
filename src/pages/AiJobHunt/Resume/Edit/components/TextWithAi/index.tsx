import refreshPng from '@/assets/images/resume/refresh.png';
import EventSourceStream from '@/pages/AiJobHunt/Home/DialogArea/EventSourceStream';
import type { PluginsCode } from '@/pages/AiJobHunt/constants';
import type { ResumeResponse } from '@/pages/AiJobHunt/type';
import { Button, Input, message } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useCreation, useReactive, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { pick } from 'lodash';
import type { ChangeEventHandler } from 'react';
import React, { memo, useMemo, useRef } from 'react';
import Typewriter, { type TypewriterClass } from 'typewriter-effect';
import styles from './index.less';

type Props = {
  resumeData: ResumeResponse | null;
  pluginCode: keyof typeof PluginsCode;
  placeholder: string;
  id?: string; // 从formitem获得
  value?: string; // 从formitem获得
  onChange?: ChangeEventHandler<HTMLTextAreaElement>; // 从formitem获得
};

type UseCount = {
  resume_project: number | undefined;
  resume_school: number | undefined;
  resume_self: number | undefined;
  resume_work: number | undefined;
  resume_intern: number | undefined;
  resume: number | undefined;
};

type TState = {
  isLoading: boolean;
  isTyping: boolean;
  typewriterArrCache: string[];
  message: string;
  visible: boolean;
  useCount: UseCount;
};

const TextWithAi: React.FC<Props> = ({
  resumeData,
  pluginCode,
  placeholder,
  id,
  value,
  onChange,
}) => {
  const queryData = useCreation(() => {
    return JSON.parse(window.sessionStorage.getItem('queryParams') || '{}');
  }, []);
  const typeWriter = useRef<TypewriterClass | null>(null);
  const typewriterStrCache = useRef<string>('');

  const state = useReactive<TState>({
    isLoading: false,
    isTyping: false,
    typewriterArrCache: [],
    message: 'string',
    visible: false,
    useCount: pick(resumeData || {}, [
      'resume_intern',
      'resume_project',
      'resume_school',
      'resume_self',
      'resume_work',
    ]) as UseCount,
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
    if (state.useCount[pluginCode]! >= 3) {
      message.error('自动渲染次数已用完');
      return;
    }
    state.visible = true;
    state.isLoading = true;
    typewriterStrCache.current = '';
    state.useCount[pluginCode]! += 1;
    let qsData = {
      ...queryData,
      chatType: 'dtc240630',
      themeId: resumeData?.xaiResume.themeId,
      paramId: resumeData?.xaiResume.id,
      pluginCode,
      userMessage: value || '',
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
  };

  const close = () => {
    state.visible = false;
    state.typewriterArrCache = [];
    typewriterStrCache.current = '';
  };

  return (
    <div id={id} className={styles['container']}>
      <Input
        type="textarea"
        value={value || ''}
        style={{ width: '100%' }}
        onChange={onChange}
        className={styles['content-text-area']}
        showCount={{
          formatter: ({ value, count }) => (
            <span
              className={classNames(styles['content-text-area-count'], {
                [sf.sColorMainColor]: value.length >= 2000,
              })}
              style={value.length >= 2000 ? { color: '#ff2739' } : {}}
            >
              {count}/2000
            </span>
          ),
        }}
        placeholder={placeholder}
      />
      {isTypeFinished && (
        <div className={styles['ai-btn']} onClick={send}></div>
      )}
      {state.visible && (
        <div className={styles['ai-content']}>
          <div
            className={classNames(
              styles['inner-content'],
              sf.sFlex,
              sf.sFlexDirC,
            )}
          >
            <div
              style={{
                height: 32,
              }}
              className={classNames(
                sf.sFlex,
                sf.sFlexJusBetween,
                sf.sFlexAliCenter,
                sf.sMrB8,
              )}
            >
              <span className={classNames(sf.sFs14, sf.sFwBold)}>
                {isTypeFinished ? '内容润色完成' : '内容润色中'}
              </span>
              <span
                className={classNames(sf.sColorGrey6, sf.sFs13)}
                style={{ marginLeft: 'auto' }}
              >
                剩余
                <span className={sf.sColorBaseColor}>
                  {3 - (state.useCount[pluginCode as keyof UseCount] || 0)}
                </span>
                次
              </span>
              {isTypeFinished && (
                <span
                  className={styles['close']}
                  onClick={() => close()}
                ></span>
              )}
            </div>
            <div className={classNames(sf.sFlex, sf.sFlex1, sf.sPositionRel)}>
              {isTypeFinished ? (
                <div
                  className={classNames(
                    sf.sPositionAbs,
                    sf.sHFull,
                    sf.sOvfYAuto,
                    sf.sWFull,
                  )}
                >
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                    {typewriterStrCache.current}
                  </pre>
                </div>
              ) : (
                <div
                  className={classNames(
                    sf.sPositionAbs,
                    sf.sHFull,
                    sf.sOvfYAuto,
                    sf.sWFull,
                  )}
                >
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
            {isTypeFinished && typewriterStrCache.current && (
              <div
                style={{ height: 40 }}
                className={classNames(
                  sf.sFlex,
                  sf.sFlexJusEnd,
                  sf.sMrR24,
                  sf.sFlexAliCenter,
                )}
              >
                {state.useCount[pluginCode as keyof UseCount]! < 3 && (
                  <Button
                    type="link"
                    icon={
                      <img src={refreshPng} style={{ width: 16, height: 16 }} />
                    }
                    className={classNames(
                      sf.sColorBaseColor,
                      sf.sFlex,
                      sf.sFlexAliCenter,
                    )}
                    onClick={send}
                  >
                    重新润色
                  </Button>
                )}

                <div
                  className={styles['use-ai-content-btn']}
                  onClick={() => {
                    onChange(typewriterStrCache.current);
                    state.visible = false;
                  }}
                >
                  使用此内容
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(TextWithAi);
