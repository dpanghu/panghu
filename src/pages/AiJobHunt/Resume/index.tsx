import goBack from '@/assets/images/goBack.png';
import { exportResume, getResumeByThemeId } from '@/services/aiJobHunt';
import { downloadFile } from '@/utils/utils';
import { useModel } from '@umijs/max';
import { Button } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useFullscreen, useMount, useReactive } from 'ahooks';
import { Divider } from 'antd';
import classNames from 'classnames';
import React, { useRef } from 'react';
import { history, useParams } from 'umi';
import type { IResumeContent, ResumeResponse } from '../type';
import EditResume from './Edit';
import ResumePreview from './Preview';
import styles from './index.less';

type IState = {
  resumeData: ResumeResponse | null;
  resumeInfo: IResumeContent | null;
  isEdit: boolean;
};
const Resume: React.FC = ({}) => {
  const fullScreen = useRef(null);
  const [, { enterFullscreen }] = useFullscreen(fullScreen);
  const params = useParams<{ id?: string }>();
  const childRef = useRef<any>({});
  const state = useReactive<IState>({
    resumeData: null,
    resumeInfo: null,
    isEdit: false,
  });

  const { setEmploymentIntentionJson } = useModel(
    'AiJobHunt.resume',
    (model) => ({
      setEmploymentIntentionJson: model.setEmploymentIntentionJson,
    }),
  );

  // ui用的为合在一起的时间格式，需要进行转换
  const formatSpecialParamsDate = (data: IResumeContent) => {
    return [
      'internshipExperienceList',
      'projectExperienceList',
      'workExperienceList',
      'selfDefList',
      'campusExperienceList',
    ].reduce<Record<string, any>>((rst, cur) => {
      rst[cur] = data[cur].map((item) => ({
        ...item,
        rangeDate: [item.periodStart, item.periodEnd],
      }));
      return rst;
    }, {});
  };

  const getInitial = () => {
    getResumeByThemeId<ResumeResponse>({ themeId: params.id }).then((res) => {
      const resumeContent = JSON.parse(
        res.xaiResume.content as string,
      ) as IResumeContent;
      state.resumeData = {
        ...res,
        xaiResume: {
          ...res.xaiResume,
          content: {
            ...resumeContent,
            ...formatSpecialParamsDate(resumeContent),
            educationalBackgroundList:
              resumeContent?.educationalBackgroundList?.map((item) => {
                return {
                  ...item,
                  rangeDate: [item.graduationStartTime, item.graduationEndTime],
                };
              }),
          },
        },
      };
      state.resumeInfo = resumeContent;
      // 获取求职意向json，存在model中
      fetch(res.postUrl!)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          setEmploymentIntentionJson(json);
        });
    });
  };

  useMount(() => {
    if (params.id) {
      getInitial();
    }
  });

  const onReload = () => {
    state.isEdit = false;
    getInitial();
  };

  const preview = () => {
    enterFullscreen();
  };

  const download = () => {
    exportResume<string>({ id: state.resumeData?.xaiResume.id }).then((url) => {
      downloadFile(url);
    });
  };

  return (
    <div className={classNames(sf.sFlex, sf.sFlexDirC, sf.sHFull)}>
      <div className={styles.header}>
        <Button onClick={() => history.push('/AiJobHunt')}>
          <img src={goBack} />
          返回
          <Divider type="vertical" />
        </Button>

        <span className={classNames(sf.sFs14, sf.sColorGrey3)}>
          {state.resumeData?.xaiResume?.name}
        </span>
        <div className={styles['header-button-group']}>
          {state.isEdit ? (
            <>
              <Button onClick={() => childRef.current.onSave()}>保存</Button>
              <Button onClick={() => (state.isEdit = false)}>取消</Button>
            </>
          ) : (
            <Button onClick={() => (state.isEdit = true)}>编辑</Button>
          )}
          {!state.isEdit && (
            <>
              <Button onClick={preview}>预览</Button>
              <Button onClick={download}>下载</Button>
            </>
          )}
        </div>
      </div>
      <div className={styles.content} ref={fullScreen}>
        {state.isEdit ? (
          <EditResume
            reload={onReload}
            resumeData={state.resumeData}
            ref={childRef}
          />
        ) : (
          <ResumePreview resumeInfo={state.resumeInfo} />
        )}
      </div>
    </div>
  );
};

export default Resume;
