import { isChildInsideParent } from '@/pages/DataVisualization/Detail/utils';
import { DetailResponseType } from '@/pages/DataVisualization/type';
import { RightOutlined } from '@ant-design/icons';
import { message } from 'SeenPc';
import { useClickAway, useReactive } from 'ahooks';
import { Input, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import styles from './index.less';

type Props = {
  fileData: DetailResponseType | null;
  onSubmit: (msg: string, isAnalysis: boolean) => void;
  isLoading: boolean;
};
type IState = {
  message: string;
  showMore: boolean;
  selectedColumns: string[];
  moreVisible: boolean;
};

const TextAreaMsg: React.FC<Props> = ({ fileData, onSubmit, isLoading }) => {
  const observeRef = useRef<ResizeObserver>();
  const moreDivRef = useRef<HTMLDivElement>();
  const state = useReactive<IState>({
    message: '',
    showMore: false,
    selectedColumns: [],
    moreVisible: false,
  });

  const setResizeObserver = () => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      const parent = entry.target;
      const children = parent.children;
      if (parent) {
        for (let i = 0; i < children.length; i++) {
          if (isChildInsideParent(children[i], parent)) {
            children[i].style.visibility = 'visible';
          } else {
            children[i].style.visibility = 'hidden';
          }
        }
        if (
          Array.from(children).some(
            (item) => item.style.visibility === 'hidden',
          )
        ) {
          state.showMore = true;
        } else {
          state.showMore = false;
        }
      }
    });
    // @ts-ignore
    resizeObserver.observe(document.getElementById('clumnsList'));
    observeRef.current = resizeObserver;
  };

  useEffect(() => {
    if (state.moreVisible) {
      observeRef.current?.disconnect();
      observeRef.current = undefined;
    } else {
      setResizeObserver();
    }
  }, [state.moreVisible]);

  useEffect(() => {
    state.selectedColumns = [];
    state.showMore = false;
    state.moreVisible = false;
    state.message = '';
    observeRef.current?.disconnect();
    observeRef.current = undefined;
    setResizeObserver();
  }, [JSON.stringify(fileData)]);

  useClickAway((e) => {
    if (
      (e?.target as HTMLDivElement).className?.indexOf('more-column') !== -1
    ) {
      return;
    }
    if (!document.getElementById('clumnsList') && state.moreVisible) {
      state.moreVisible = false;
    }
  }, moreDivRef);
  const toggleColumnItems = (id: string) => {
    // 最多选择三个
    if (
      !state.selectedColumns.includes(id as never) &&
      state.selectedColumns.length < 3
    ) {
      state.selectedColumns.push(id as never);
    } else {
      state.selectedColumns = state.selectedColumns.filter(
        (value) => value !== id,
      );
    }
  };

  const submit = () => {
    if (!isLoading) {
      onSubmit(
        state.selectedColumns.length > 0
          ? `请根据该表对${state.selectedColumns.join(
              '、',
            )}进行数据分析与可视化图形展示，对数据进行分类统计`
          : state.message,
        state.selectedColumns.length > 0,
      );
      state.message = '';
      state.selectedColumns = [];
    } else {
      message.warning('当前问题正在回答中，请稍后再发送新的消息。');
    }
  };

  return (
    <div>
      {!state.moreVisible ? (
        <div className={styles['columns-area']}>
          <div className={styles['columns-list']} id="clumnsList">
            {(fileData?.columns.filter((c) => !!c) || []).map((item) => {
              return (
                <Tooltip key={item} title={item}>
                  <div
                    key={item}
                    className={classNames(styles['column-item'], {
                      [styles['active']]: (
                        state.selectedColumns || []
                      ).includes(item as never),
                    })}
                    onClick={() => {
                      toggleColumnItems(item);
                    }}
                  >
                    {item}
                  </div>
                </Tooltip>
              );
            })}
          </div>
          {state.showMore && (
            <div
              className={styles['more-column']}
              onClick={() => {
                state.moreVisible = true;
              }}
            >
              更多
              <RightOutlined style={{ fontSize: 10, marginLeft: 5 }} />
            </div>
          )}
        </div>
      ) : (
        <div className={styles['columns-area-more']} ref={moreDivRef}>
          <div className={classNames(styles['columns-list-more'])}>
            {(fileData?.columns.filter((c) => !!c) || []).map((item) => {
              return (
                <Tooltip key={item} title={item}>
                  <div
                    key={item}
                    className={classNames(styles['column-item'], {
                      [styles['active']]: (
                        state.selectedColumns || []
                      ).includes(item as never),
                    })}
                    onClick={() => {
                      toggleColumnItems(item);
                    }}
                  >
                    {item}
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}
      <div
        className={classNames(styles['input-area'])}
        style={{
          borderTopLeftRadius: state.moreVisible ? 0 : 8,
          borderTopRightRadius: state.moreVisible ? 0 : 8,
        }}
      >
        {state.selectedColumns.length === 0 ? (
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 6 }}
            maxLength={200}
            onKeyDown={(e) => {
              if (e.code === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            onChange={(val) => {
              state.message = val.target.value;
            }}
            value={state.message}
            placeholder={'输入问题或选择字段进行分析'}
          />
        ) : (
          <div className={styles['column-generate-msg']}>
            请根据该表对
            {
              <div className={styles['input-choose-column-container']}>
                {state.selectedColumns.map((item) => (
                  <div
                    key={item}
                    className={styles['input-choosen-column-item']}
                  >
                    {item}
                  </div>
                ))}
              </div>
            }
            进行数据分析与可视化图形展示，对数据进行分类统计
          </div>
        )}

        <div className={styles['input-footer']}>
          <span
            className={classNames({
              [styles['over-length']]:
                (state.selectedColumns.length > 0
                  ? 30 +
                    state.selectedColumns.reduce((rst, cur) => {
                      return rst + cur.length;
                    }, 0)
                  : state.message.length) > 200,
            })}
          >
            {state.selectedColumns.length > 0
              ? 30 +
                state.selectedColumns.reduce((rst, cur) => {
                  return rst + cur.length;
                }, 0)
              : state.message.length}
            /200
          </span>
          <div
            onClick={() => {
              if (!isLoading) {
                if (
                  (state.selectedColumns.length > 0
                    ? 30 +
                      state.selectedColumns.reduce((rst, cur) => {
                        return rst + cur.length;
                      }, 0)
                    : state.message.length) > 200
                ) {
                  message.warning('您输入的字数已超出200字。');
                  return;
                }
                submit();
              }
            }}
          >
            发送
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextAreaMsg;
