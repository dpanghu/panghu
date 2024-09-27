import {
  getMyResultProgress,
  modifyThemeName,
  regeneratePlugin,
} from '@/services/aiJobHunt';
import { MoreOutlined } from '@ant-design/icons';
import { message } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useClickAway, useReactive, useRequest, useUnmount } from 'ahooks';
import { Input, InputRef, Popover, Tooltip } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { history } from 'umi';
import type { PluginRecord } from '../../../type';
import styles from './index.less';

type Props = {
  fileId: string;
  fileName: string;
  type: string;
  onDelItem: (themeId: string) => void;
  onRegenerate: () => void;
};

type TState = {
  status: (typeof FILE_STATUS)[keyof typeof FILE_STATUS];
  result: string;
  editName: string;
  progress: number;
  name: string;
  isEditing: boolean;
  popupVisible: boolean;
  isFailure: boolean;
};

const FILE_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  FAILURE: 2,
} as const;

const FILE_STATUS_NAME = ['生成中', '已生成', '生成失败'];

const FileItem: React.FC<Props> = ({
  fileId,
  fileName,
  type,
  onDelItem,
  onRegenerate,
}) => {
  const state = useReactive<TState>({
    status: FILE_STATUS.SUCCESS,
    result: '',
    editName: '',
    progress: 0,
    name: fileName,
    isEditing: false,
    popupVisible: false,
    isFailure: false,
  });
  const inputRef = useRef<InputRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const paramId = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  ).paramId;

  const {
    data = { status: FILE_STATUS.SUCCESS, createTime: '' },
    run,
    cancel,
  } = useRequest<PluginRecord, { themeId: string }[]>(getMyResultProgress, {
    pollingInterval: 1000,
    manual: true,
    onError: () => {
      state.status = FILE_STATUS.FAILURE;
      cancel();
    },
    onFinally: (_, result) => {
      if (result!.status === FILE_STATUS.SUCCESS) {
        state.status = FILE_STATUS.SUCCESS;
        cancel();
      } else if (result!.status === FILE_STATUS.PENDING) {
        state.status = FILE_STATUS.PENDING;
        state.progress =
          state.progress >= 90
            ? state.progress
            : state.progress + Math.floor(10 * Math.random());
      } else if (result!.status === FILE_STATUS.FAILURE) {
        state.status = FILE_STATUS.FAILURE;
        cancel();
      }
    },
  });

  useEffect(() => {
    if (fileId) {
      run({ themeId: fileId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  const editFile = () => {
    if (!state.editName) {
      message.warning('名称不能为空');
      return;
    }
    // 若未修改，则不进行修改
    if (state.name === state.editName) {
      state.editName = '';
      state.isEditing = false;
      return;
    }
    modifyThemeName({ themeId: fileId, name: state.editName }).then(() => {
      message.success('修改成功');
      state.isEditing = false;
      state.name = state.editName;
    });
  };

  useClickAway(() => {
    if (
      containerRef.current?.querySelector('input') &&
      state.popupVisible === false
    ) {
      const input = containerRef.current?.querySelector('input');
      if (input) {
        editFile();
      }
    }
  }, containerRef);

  useUnmount(() => {
    cancel();
  });

  const regenerate = () => {
    regeneratePlugin({ themeId: fileId }).then(() => {
      onRegenerate();
    });
  };

  return (
    <>
      <div className={styles['file-item-container']} ref={containerRef}>
        {state.isEditing ? (
          <Input
            className={styles['input-edit']}
            ref={inputRef}
            maxLength={10}
            value={state.editName}
            onChange={(e) => (state.editName = e.target.value)}
            onKeyDown={(e) => {
              if (e.code === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                editFile();
              }
            }}
          />
        ) : data.status === FILE_STATUS.FAILURE ? (
          <Tooltip title={data.failReason}>{state.name}</Tooltip>
        ) : (
          <div
            className={classNames(sf.sFs14, sf.sColorGrey3, sf.sMrB4)}
            onClick={() => {
              if (state.status === FILE_STATUS.SUCCESS) {
                if (type === 'resume') {
                  history.push('/AiJobHunt/resume/' + fileId);
                } else {
                  history.push(
                    '/AiJobHunt/interview/' + paramId + '/' + fileId,
                  );
                }
              }
            }}
          >
            {state.name}
          </div>
        )}
        {state.status === FILE_STATUS.FAILURE && (
          <div className={classNames(sf.sFs12, sf.sColorMainColor)}>
            生成失败
          </div>
        )}
        {state.status === FILE_STATUS.SUCCESS && (
          <div className={classNames(sf.sFs12, sf.sColorGrey9)}>
            {data.createTime
              ? moment(parseInt(data.createTime)).format('YYYY-MM-DD')
              : ''}
            <span className={sf.sMrL18}>{FILE_STATUS_NAME[data.status]}</span>
          </div>
        )}
        {state.status === FILE_STATUS.PENDING && (
          <div className={classNames(sf.sFs12, sf.sColorBaseColor)}>
            生成中 {state.progress}%
          </div>
        )}
      </div>
      <div className={styles['opt-wrapper']}>
        <Popover
          overlayClassName={styles['popup-container']}
          content={
            <>
              <div
                className={styles['edit-btn']}
                onClick={() => {
                  state.isEditing = true;
                  state.editName = state.name;
                  setTimeout(() => {
                    inputRef.current?.select();
                    inputRef.current?.focus();
                    state.popupVisible = false;
                  });
                }}
              >
                重命名
              </div>
              {state.status === FILE_STATUS.FAILURE && (
                <div
                  className={styles['del-btn']}
                  onClick={() => {
                    onDelItem(fileId);
                  }}
                >
                  删除
                </div>
              )}
            </>
          }
          trigger="click"
          open={state.popupVisible}
          onOpenChange={(val) => (state.popupVisible = val)}
        >
          <MoreOutlined size={14} className={styles['operate-btn']} />
        </Popover>
        {state.status === FILE_STATUS.FAILURE && (
          <div className={styles['regenerate']} onClick={regenerate}>
            重新生成
          </div>
        )}
      </div>
    </>
  );
};

export default FileItem;
