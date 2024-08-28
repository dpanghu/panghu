import { getPluginList } from '@/services/aiJobHunt';
import { Form, message } from 'SeenPc';
import { useClickAway, useFocusWithin, useMount, useReactive } from 'ahooks';
import { Input } from 'antd';
import classNames from 'classnames';
import React, { useRef } from 'react';
import type { Plugin, SubmitMessage } from '../../../type';
import RenderFormItem from './RenderFormItem';
import styles from './index.less';

type Props = {
  onChangePlugin: (plugin: Plugin) => void;
  isTypeFinished: boolean;
  onSubmit: (msg: SubmitMessage) => void;
};

type TState = {
  pluginList: Plugin[];
  message: string;
  curPlugin: Plugin | null;
  placeholder: string;
};

const MessageSendArea: React.FC<Props> = ({
  isTypeFinished,
  onChangePlugin,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const state = useReactive<TState>({
    pluginList: [],
    message: '',
    curPlugin: null,
    placeholder: '在此输入您想了解的内容',
  });

  useMount(() => {
    getPluginList<Plugin>({ domainId: -1 }).then((res) => {
      state.pluginList = res;
    });
  });

  const changePlugin = (plugin: Plugin) => () => {
    state.message = '';
    onChangePlugin(plugin);
    state.curPlugin = plugin;
    state.placeholder = plugin.tips;
  };

  const submitMessasge = () => {
    if (!isTypeFinished) {
      message.warning('当前问题正在回答中，请稍后再发送新的消息。');
      return;
    }

    if (!state.message && state.curPlugin?.needInput) {
      message.warning('请输入内容');
      return;
    }
    if (state.curPlugin) {
      form
        .validateFields()
        .then((values) => {
          for (let i in values) {
            if (typeof values[i] && values[i]?.fileList) {
              values[i] = values[i].fileList[0].originFileObj.key;
            }
          }
          onSubmit({
            userMessage: state.message,
            pluginCode: state.curPlugin!.code,
            qsParams: values,
          });
          state.message = '';
        })
        .catch((err) => {
          message.warning(err.errorFields[0].errors[0]);
          return;
        });
    } else {
      onSubmit({ userMessage: state.message });
      state.message = '';
    }
  };

  const closePluginDetail = () => {
    form.resetFields();
    state.curPlugin = null;
    state.placeholder = '在此输入您想了解的内容';
  };

  const isFocusWithin = useFocusWithin(textRef);

  useClickAway(() => {
    closePluginDetail();
  }, containerRef);

  return (
    <div className={styles['plugin-list-container']} ref={containerRef}>
      <div
        className={classNames(styles['plugin-list-wrapper'], {
          [styles['plugin-open']]: state.curPlugin,
        })}
      >
        {state.pluginList.map((item) => (
          <div
            key={item.id}
            className={styles.pluginItem}
            onClick={changePlugin(item)}
          >
            <img src={`/bus_xai_web/images/${item.code}Plugin.png`} alt="" />
            <div>{item.name}</div>
          </div>
        ))}
      </div>
      <div
        className={classNames(styles['plugin-item-detail'], {
          [styles['plugin-open']]: state.curPlugin,
        })}
      >
        <span className={styles['detail-close']} onClick={closePluginDetail} />
        <Form form={form} layout="inline">
          <RenderFormItem plugin={state.curPlugin} formRef={form} />
        </Form>
      </div>
      <div
        ref={textRef}
        className={classNames(styles['input-area'], {
          [styles['plugin-open']]: state.curPlugin,
          [styles['area-focus']]: isFocusWithin || state.curPlugin,
        })}
      >
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 6 }}
          maxLength={2000}
          onKeyDown={(e) => {
            if (e.code === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submitMessasge();
            }
          }}
          value={state.message}
          placeholder={state.placeholder}
          onChange={(e) => {
            if (state?.curPlugin?.needInput) {
              state.message = e.target.value;
            }
          }}
        />
        <div className={styles['input-footer']}>
          <span
            className={classNames({
              [styles['over-length']]: state.message.length >= 2000,
            })}
          >
            {state.message.length}/2000
          </span>
          <div onClick={submitMessasge}>发送</div>
        </div>
      </div>
    </div>
  );
};

export default MessageSendArea;
