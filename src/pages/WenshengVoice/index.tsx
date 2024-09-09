import errorBg from '@/assets/images/wenshengVoice/errorIcon.png';
import playIcon from '@/assets/images/wenshengVoice/play.png';
import suspendPng from '@/assets/images/wenshengVoice/suspend.png';
import voice1Png from '@/assets/images/wenshengVoice/voice1.png';
import voice2Png from '@/assets/images/wenshengVoice/voice2.png';
import voice3Png from '@/assets/images/wenshengVoice/voice3.png';
import voice4Png from '@/assets/images/wenshengVoice/voice4.png';
import voiceBg from '@/assets/images/wenshengVoice/voiceBg.png';
import { randomExampleVolume, widgetDtcTTS } from '@/services/wenshengVoice';
import { Button, message } from 'SeenPc';
import { useReactive } from 'ahooks';
import { Progress, Radio, Slider, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
import styles from './index.less';

interface TState {
  voiceText: string;
  voiceType: string;
  speedValue: number;
  volumeValue: number;
  toneValue: number;
  voiceUrl: string;
  voicePlaying: boolean;
  durationAll: number;
  durationRest: number;
  playFinished: boolean;
  loading: boolean;
  isError: boolean;
}

const WenshengVoice: React.FC = () => {
  const state = useReactive<TState>({
    voiceText: '',
    voiceType: '1',
    speedValue: 5,
    toneValue: 5,
    volumeValue: 3,
    voiceUrl: '',
    voicePlaying: false,
    durationAll: 0,
    durationRest: 0,
    playFinished: false,
    loading: false,
    isError: false,
  });
  const playerRef = useRef<any>(null);
  const voiceMap = [
    { label: '沉稳男声', img: voice1Png, key: '1' },
    { label: '青年男声', img: voice2Png, key: '3' },
    { label: '通用女声', img: voice3Png, key: '0' },
    { label: '活泼童声', img: voice4Png, key: '4' },
  ];
  const timerRef = useRef<any>(null);

  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );

  const secondsToTimeShort = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return [
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  };

  const onChangeVoiceText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    state.voiceText = e.target.value;
  };

  const handleChangeVoiceType = (e: any, key: string) => {
    state.voiceType = key;
  };

  const handleChangeSpeed = (
    e: any,
    type: 'volumeValue' | 'toneValue' | 'speedValue',
  ) => {
    state[type] = e;
  };

  const getRandomExampleVolume = async () => {
    try {
      state.loading = true;
      state.isError = false;
      const result: RecordItem = await randomExampleVolume({
        pluginCode: 'tts',
      });
      const { params: volumeParams, result: volumeResult } = result;
      const { speed, pitch, volume, per, text } = JSON.parse(volumeParams);
      const {
        data: { url },
      } = JSON.parse(volumeResult);
      state.speedValue = speed;
      state.toneValue = pitch;
      state.voiceType = per;
      state.volumeValue = volume;
      state.voiceText = text;
      state.voiceUrl = url;
      state.durationRest = 0;
      state.playFinished = false;
      timerRef.current && clearInterval(timerRef.current);
    } catch (error) {
      state.isError = true;
    } finally {
      state.loading = false;
    }
  };

  const getAIVoice = async () => {
    if (!state.voiceText) {
      message.warning('文本不能为空');
      return;
    }
    try {
      state.loading = true;
      state.isError = false;
      const result: RecordItem = await widgetDtcTTS({
        text: state.voiceText,
        speed: state.speedValue,
        per: state.voiceType,
        pitch: state.toneValue,
        volume: state.volumeValue,
        //   ...extraParams,
      });
      state.voiceUrl = result.url;
      state.durationRest = 0;
    } catch (error) {
      state.isError = true;
    } finally {
      state.loading = false;
    }
  };

  const handlePlayVideo = () => {
    if (!playerRef.current) {
      return;
    }
    if (!state.voiceUrl) {
      return;
    }
    state.voicePlaying = !state.voicePlaying;
  };
  console.log(state.isError);

  const initPlayer = () => {
    state.durationAll = playerRef.current.getDuration();
  };

  const handlePlay = () => {
    // 判断是否已经播放完一遍
    if (state.playFinished) {
      state.durationRest = 0;
      state.playFinished = false;
    }
    timerRef.current = setInterval(() => {
      state.durationRest += 0.01;
    }, 10);
  };

  const handlePauseVideo = () => {
    timerRef.current && clearInterval(timerRef.current);
  };

  const handleEnded = () => {
    state.voicePlaying = false;
    state.durationRest = state.durationAll;
    timerRef.current && clearInterval(timerRef.current);
    state.playFinished = true;
  };

  return (
    <div className={styles.WenshengVoiceContainer}>
      <div className={styles.header}>AI文生语音</div>
      <div className={styles.main}>
        <div className={styles.leftContent}>
          <div className={styles.title}>
            <span className={styles.desc}>请输入一段想生成语音的文本</span>
            <span onClick={getRandomExampleVolume}>随机示例</span>
          </div>
          <div className={styles.voiceText}>
            <TextArea
              showCount
              maxLength={60}
              value={state.voiceText}
              onChange={onChangeVoiceText}
              placeholder="请输入"
              style={{ height: '116px', resize: 'none' }}
            />
          </div>
          <div className={styles.voicePanel}>
            <span className={styles.word}>人物音色</span>
            <div className={styles.voiceChoose}>
              {voiceMap.map((item) => (
                <div
                  className={styles.voiceItem}
                  key={item.key}
                  onClick={() =>
                    handleChangeVoiceType(
                      { target: { checked: true } },
                      item.key,
                    )
                  }
                >
                  <Radio
                    onChange={(e) => handleChangeVoiceType(e, item.key)}
                    className={styles.radioPer}
                    checked={state.voiceType === item.key}
                  />
                  <img src={item.img} alt="" />
                  <span className={styles.voiceName}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.speed}>
              <span className={styles.type}>语速</span>
              <div className={styles.process}>
                <span className={styles.desc}>慢</span>
                <Slider
                  min={1}
                  max={15}
                  value={state.speedValue}
                  onChange={(e) => {
                    handleChangeSpeed(e, 'speedValue');
                  }}
                  tooltip={{}}
                  style={{ flex: 1 }}
                  trackStyle={{
                    background: `linear-gradient(to right, rgb(90, 186, 255) 0%, rgb(93, 119, 249) 100%)`,
                  }}
                />
                <span className={styles.desc}>快</span>
              </div>
            </div>
            <div className={styles.speed}>
              <span className={styles.type}>音调</span>
              <div className={styles.process}>
                <span className={styles.desc}>轻</span>
                <Slider
                  min={1}
                  max={15}
                  value={state.toneValue}
                  onChange={(e) => {
                    handleChangeSpeed(e, 'toneValue');
                  }}
                  tooltip={{}}
                  style={{ flex: 1 }}
                  trackStyle={{
                    background: `linear-gradient(to right, rgb(90, 186, 255) 0%, rgb(93, 119, 249) 100%)`,
                  }}
                />
                <span className={styles.desc}>重</span>
              </div>
            </div>
            <div className={styles.speed}>
              <span className={styles.type}>音量</span>
              <div className={styles.process}>
                <span className={styles.desc}>低</span>
                <Slider
                  min={1}
                  max={9}
                  value={state.volumeValue}
                  onChange={(e) => {
                    handleChangeSpeed(e, 'volumeValue');
                  }}
                  tooltip={{}}
                  style={{ flex: 1 }}
                  trackStyle={{
                    background: `linear-gradient(to right, rgb(90, 186, 255) 0%, rgb(93, 119, 249) 100%)`,
                  }}
                />
                <span className={styles.desc}>高</span>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <Button type="primary" onClick={getAIVoice}>
              开始生成
            </Button>
          </div>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.title}>结果区</div>
          {state.loading ? (
            <Spin tip="正在生成..." />
          ) : state.isError ? (
            <div className={styles.errorContainer}>
              <img src={errorBg} alt="" />
              <span>生成失败</span>
            </div>
          ) : (
            <div className={styles.voiceMain}>
              <img
                src={voiceBg}
                alt=""
                className={styles.voiceBg}
                draggable={false}
              />
              <img
                src={!state.voicePlaying ? suspendPng : playIcon}
                alt=""
                className={styles.suspendPng}
                onClick={handlePlayVideo}
                draggable={false}
              />
              <ReactPlayer
                ref={playerRef}
                url={state.voiceUrl}
                config={{}}
                playing={state.voicePlaying}
                style={{ display: 'none' }}
                onPause={handlePauseVideo}
                onPlay={handlePlay}
                onReady={initPlayer}
                onEnded={handleEnded}
              />
              <Progress
                className={styles.progressBox}
                percent={(state.durationRest / state.durationAll) * 100}
                type="circle"
                showInfo={false}
                size={170}
                strokeWidth={3}
                strokeColor={{
                  '0%': '#92D1FE',
                  '50%': '#526FF2',
                  '100%': '#1234F5',
                }}
              />
              <div className={styles.countdown}>
                <div className={styles.deadline}>
                  {secondsToTimeShort(Math.round(state.durationRest))}
                </div>
                <span>/</span>
                <div className={styles.deadline}>
                  {secondsToTimeShort(Math.round(state.durationAll))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WenshengVoice;
