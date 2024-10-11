import { deleteMyResult, getMyResult } from '@/services/aiJobHunt';
import { Input, message } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useMount, useReactive } from 'ahooks';
import classNames from 'classnames';
import React, { useImperativeHandle } from 'react';
import type { FileType } from '../../type';
import FileItem from './FileItem';
import styles from './index.less';

type TState = {
  keywords: string;
  fileList: FileType[];
};

const PersonSpace = React.forwardRef(({}, ref) => {
  const state = useReactive<TState>({
    keywords: '',
    fileList: [],
  });

  const onSearch = () => {
    getMyResult<FileType>({ name: state.keywords }).then((result) => {
      if (result.length === 0 && state.keywords) {
        message.warning('当前未搜索到与该关键字匹配的文档，建议您更换关键词');
        state.fileList = result;
        return;
      }
      state.fileList = result;
    });
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        onSearch,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  );

  useMount(() => {
    onSearch();
  });

  const onDelIte1m = (themeId: string) => {
    deleteMyResult({ themeId }).then(() => {
      message.success('删除成功');
      onSearch();
    });
  };

  return (
    <div className={classNames(sf.sHFull, sf.sFlex, sf.sFlexDirC)}>
      <div className={styles['search-container']}>
        <h2 className={classNames(sf.sColorGrey6, sf.sFs18, sf.sMgB16)}>
          个人空间
        </h2>
        <Input
          placeholder="输入搜索文档的关键词"
          allowClear
          grey
          maxLength={10}
          value={state.keywords}
          onChange={(e) => (state.keywords = e)}
          suffix={<span className={styles['search-icon']} onClick={onSearch} />}
          style={{ width: '100%', padding: '4px 8px' }}
          className={styles['input-wrapper']}
          onKeyDown={(e) => {
            if (e.code === 'Enter' && e.shiftKey) {
              onSearch();
            } else if (e.code === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSearch();
            }
          }}
        />
      </div>
      <div className={styles.list}>
        {state.fileList.map((item) => (
          <div
            key={item.id}
            className={classNames(
              styles.item,
              item.pluginCode === 'resume' && styles.resumeIcon,
            )}
          >
            <FileItem
              fileId={item.id}
              fileName={item.name}
              type={item.pluginCode}
              onDelItem={onDelIte1m}
              onRegenerate={onSearch}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default PersonSpace;
