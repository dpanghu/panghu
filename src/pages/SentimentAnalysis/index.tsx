import {
  exampleRandom,
  paramPlatformId,
  pluginCreate,
} from '@/services/sentimentAnalysis';
import { getSessionStorage } from '@/utils/utils';
import { useMount } from 'ahooks';
import { Button, Slider } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react';
import styles from './index.less';

const SentimentAnalysis: React.FC = () => {
  const [platformId, setPlatformId] = useState('');
  const [sentimentValue, setSentimentValue] = useState(0);
  const [coefficientValue, setCoefficientValue] = useState(0);
  const [value, setValue] = useState(50);
  const [excludeId, setExcludeId] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [analyzeInfo, setAnalyzeInfo] = useState<RecordItem | any>({});
  const mid = Number(((100 - 0) / 2).toFixed(5));
  const preColorCls = value >= mid ? '' : 'icon-wrapper-active';
  // const nextColorCls = value >= mid ? 'icon-wrapper-active' : '';

  console.log('analyzeInfoanalyzeInfo', analyzeInfo);
  const getParamPlatformId = () => {
    paramPlatformId({
      platformCode: 'DBE3',
      businessType: 'post',
      teamId: getSessionStorage('student_team')?.id || 0,
      taskId: getSessionStorage('student_task')?.id || 0,
    }).then((res) => {
      // console.log(res);
      setPlatformId(res);
    });
  };

  const marks: any = {
    0: '正向',
    50: '中性',
    100: {
      // style: {
      //   color: '#f50',
      // },
      label: <strong>负向</strong>,
    },
  };

  const marks1: any = {
    0: '0',
    [coefficientValue]: {
      label: <strong>{coefficientValue}</strong>,
    },
    1: {
      label: <strong>1</strong>,
    },
  };

  const marks2: any = {
    [value]: {
      label: <strong>{value}%</strong>,
    },
  };

  // 随机示例
  const handleExample = async () => {
    await exampleRandom({
      pluginCode: 'sentAnalysis',
      excludeId: excludeId || '',
    }).then((res) => {
      // console.log(res);
      setInputValue(res?.params);
      const result = (res?.result && JSON.parse(res.result)) || {};
      setAnalyzeInfo(result);

      let sentiment = 0;
      switch (result?.sentiment) {
        case '2':
          sentiment = 0;
          break;
        case '1':
          sentiment = 50;
          break;
        case '0':
          sentiment = 100;
          break;
        default:
          sentiment = 50;
          break;
      }
      setSentimentValue(sentiment);
      setCoefficientValue(Number(result?.coefficient || 0));
      setValue(Number(result.positiveProb || 0) * 100);
      setExcludeId(res?.id);
    });
  };

  // 情感极性
  // const handleSentiment = (val: any) => {
  //   setSentimentValue(val);
  // };

  // 情感极性分类置信度
  // const handleCoefficientValue = (val: any) => {
  //   console.log(val);
  //   setCoefficientValue(val);
  // };

  const handleChange = (e: any) => {
    // console.log(e.target.value);
    setInputValue(e.target.value);
  };

  // 分析一下Analyze
  const handleAnalyze = async () => {
    await pluginCreate({
      pluginCode: 'sentAnalysis',
      // themeId: '',
      // conversation_id: '',
      userMessage: inputValue,
      paramId: platformId,
      teamId: getSessionStorage('student_team')?.id || 0,
    }).then((res) => {
      console.log(res);
      const result1 = (res && JSON.parse(res)) || {};
      setAnalyzeInfo(result1);

      let sentiment1 = 0;
      switch (result1?.sentiment) {
        case '2':
          sentiment1 = 0;
          break;
        case '1':
          sentiment1 = 50;
          break;
        case '0':
          sentiment1 = 100;
          break;
        default:
          sentiment1 = 50;
          break;
      }
      setSentimentValue(sentiment1);
      setCoefficientValue(Number(result1?.coefficient || 0));
      setValue(Number(result1.positiveProb || 0) * 100);
    });
  };

  useMount(() => {
    getParamPlatformId();
  });

  return (
    <div className={styles?.main}>
      <div className={styles?.title}>情感分析</div>
      <div className={styles?.content}>
        <div className={styles?.contentInfo}>
          <div className={styles?.contentInfoLeft}>
            <div className={styles?.contentInfoLeftTitle}>
              <div>请输入一段想分析的文字</div>
              <Button type="link" onClick={handleExample}>
                随机示例
              </Button>
            </div>
            <div className={styles?.contentInfoLeftText}>
              <TextArea
                value={inputValue}
                onChange={(e) => handleChange(e)}
                rows={10}
                maxLength={120}
                showCount
                style={{ resize: 'none' }}
              />
              <div className={styles?.footerBtn}>
                <Button type="primary" onClick={handleAnalyze}>
                  分析一下
                </Button>
              </div>
            </div>
          </div>
          <div className={styles?.contentInfoRight}>
            <div className={styles?.contentInfoRightTitle}>情感分析结果</div>
            {
              <div className={styles?.contentInfoRightCard}>
                <img
                  src={require('@/assets/images/sentiment.png')}
                  width={'50%'}
                  style={{ marginBottom: '22px' }}
                />
                <div className={styles?.card} style={{ marginBottom: '16px' }}>
                  <div>情感极性</div>
                  <div className={styles?.cardContent}>
                    <Slider
                      value={sentimentValue}
                      // onChange={handleSentiment}
                      marks={marks}
                      defaultValue={50}
                      className={styles?.splider}
                    />
                  </div>
                </div>
                <div className={styles?.card} style={{ marginBottom: '16px' }}>
                  <div>情感极性分类置信度</div>
                  <div className={styles?.cardContent}>
                    <Slider
                      min={0}
                      max={1}
                      value={coefficientValue}
                      // onChange={handleCoefficientValue}
                      marks={marks1}
                      // defaultValue={0.5}
                      className={styles?.splider2}
                    />
                  </div>
                </div>
                <div className={styles?.card}>
                  <div>正向/负向情感概率</div>
                  <div className={styles?.cardSlider}>
                    <img
                      src={require('@/assets/images/smail1.png')}
                      width={40}
                      className={preColorCls}
                      style={{ marginRight: '12px' }}
                    />
                    <div className={styles?.cardSliderContent}>
                      <Slider
                        marks={marks2}
                        defaultValue={50}
                        min={0}
                        max={100}
                        // onChange={setValue}
                        value={value}
                        // style={{ position: 'relative', width: '85%' }}
                      />
                    </div>
                    <img
                      src={require('@/assets/images/cry2.png')}
                      width={40}
                      className={preColorCls}
                      style={{ marginLeft: '16px' }}
                    />
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default SentimentAnalysis;
