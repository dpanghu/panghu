import { Input, message } from 'SeenPc';
import React, { useEffect, useState } from 'react';
import { LS_NAME } from '../constants';
import styles from './index.less';

type Props = {
  isFirst: boolean;
  content: string;
  extractLoading: boolean;
  extractMsg: (msg: string) => void;
  createRandomCase: () => void;
};
const TextContent: React.FC<Props> = ({
  createRandomCase,
  extractMsg,
  isFirst,
  content,
  extractLoading,
}) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    // 若没有抽取过,则使用ls存储的信息,否则使用接口返回信息
    if (isFirst && !content) {
      setValue(localStorage.getItem(LS_NAME) || '');
    } else {
      setValue(content);
    }
  }, [content, isFirst]);

  return (
    <div className={styles['container']}>
      <header>
        <h2>文本内容</h2>
        <span onClick={() => createRandomCase()}>随机示例</span>
      </header>
      <section>
        <Input
          type="textarea"
          className={styles['text-area']}
          value={value}
          onChange={(val) => {
            if (isFirst) {
              localStorage.setItem(LS_NAME, val);
            }
            setValue(val);
          }}
          maxLength={300}
        ></Input>
      </section>
      <footer>
        <span>{value.length}/300</span>
        <div
          onClick={() => {
            if (!value) {
              message.warning('文本内容不能为空');
              return;
            }
            if (extractLoading) return;
            extractMsg(value);
          }}
          style={{ cursor: extractLoading ? 'no-drop' : 'pointer' }}
        >
          抽取知识{extractLoading ? '中' : ''}
        </div>
      </footer>
    </div>
  );
};

export default TextContent;
