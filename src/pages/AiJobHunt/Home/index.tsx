import React, { useRef } from 'react';
import styles from './index.less';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import talkIcon from '@/assets/images/talk.png';
import { getChatThemeList, modifyThemeName } from '@/services/aiJobHunt';
import { message } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useClickAway, useMount, useReactive } from 'ahooks';
import { Input, InputRef } from 'antd';
import classnames from 'classnames';
import type { Theme } from '../type';
import DialogArea from './DialogArea';
import PersonSpace from './PersonSpace';

interface TState {
  curTheme: Theme | undefined;
  dialogList: Theme[];
  editId: string;
  editName: string;
}

const JobHunt: React.FC = () => {
  const childRef = useRef<any>({});
  const inputRef = useRef<InputRef>(null);
  const personSpaceRef = useRef<any>(null);
  const state = useReactive<TState>({
    curTheme: undefined,
    dialogList: [],
    editId: '',
    editName: '',
  });

  const createDialog = () => {
    if (!childRef.current?.isTypeFinished) {
      message.warning('生成中，请稍后操作');
      return;
    }
    childRef.current.createNewDialog();
    state.curTheme = undefined;
  };

  useMount(() => {
    getChatThemeList<Theme>().then((data) => {
      state.dialogList = data;
    });
  });

  const onCreateNewDialog = (dialogId: string) => {
    getChatThemeList<Theme>().then((data) => {
      state.dialogList = data;
      state.curTheme = data.find((d) => d.id === dialogId);
    });
  };

  const onPluginCreate = () => {
    personSpaceRef.current?.onSearch();
  };

  const editTheme = () => {
    if (!state.editName) {
      message.warning('名称不能为空');
      return;
    }
    const editDialog = state.dialogList.find((d) => d.id === state.editId);
    // 若未修改，则不进行修改
    if (editDialog?.name === state.editName) {
      state.editName = '';
      state.editId = '';
      return;
    }
    modifyThemeName({ themeId: state.editId, name: state.editName }).then(
      () => {
        message.success('修改成功');
        state.dialogList = state.dialogList.map((item) => {
          if (item.id === state.editId) {
            return { ...item, name: state.editName };
          } else {
            return item;
          }
        });
        state.editName = '';
        state.editId = '';
      },
    );
  };

  useClickAway(
    () => {
      editTheme();
    },
    () => document.querySelector("div[class^='dialog-list-item']:has(input)"),
  );

  return (
    <div className={classnames(sf.sFlex, sf.sFull)}>
      <div
        className={classnames(
          styles['history-and-space'],
          sf.sFlex,
          sf.sFlexDirC,
        )}
      >
        <div className={styles['header']}>
          <div></div>
        </div>
        <div className={styles['history']}>
          <div className={classnames(sf.sFs18, sf.sColorGrey6)}>会话记录</div>
          <div className={styles['create-btn']} onClick={createDialog}>
            <img src={talkIcon} />
            新建对话
          </div>

          <div className={styles['dialog-list']}>
            {state.dialogList.map((item) => (
              <div
                key={item.id}
                className={classnames(
                  styles['dialog-list-item'],
                  item.id === state.curTheme?.id && styles.active,
                )}
                onClick={() => {
                  state.curTheme = item;
                }}
              >
                {item.id === state.editId ? (
                  <Input
                    ref={inputRef}
                    maxLength={10}
                    value={state.editName}
                    onChange={(e) => (state.editName = e.target.value)}
                    className={styles['input-edit']}
                    onKeyDown={(e) => {
                      if (e.code === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        editTheme(item);
                      }
                    }}
                  />
                ) : (
                  <span
                    className={sf.sEllipsis}
                    style={{ width: 200, display: 'inline-block' }}
                  >
                    {item.name}
                  </span>
                )}
                <span
                  className={styles['search-btn']}
                  onClick={() => {
                    state.editId = item.id;
                    state.editName = item.name;
                    setTimeout(() => {
                      inputRef.current?.select();
                      inputRef.current?.focus();
                    });
                  }}
                ></span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles['hr']}></div>
        <div className={styles['space']}>
          <PersonSpace ref={personSpaceRef}></PersonSpace>
        </div>
      </div>

      <div className={sf.sFlex1}>
        <DialogArea
          ref={childRef}
          curTheme={state.curTheme}
          onReveiveFirstMessage={onCreateNewDialog}
          onPluginCreate={onPluginCreate}
        />
      </div>
    </div>
  );
};

export default JobHunt;
