import { GraphData } from '@antv/g6';
import { uuid } from '@antv/x6/lib/util/string/uuid';
import { Button, Input, Table } from 'SeenPc';
import { useDeepCompareEffect, useReactive } from 'ahooks';
import { InputRef } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Empty from '../components/Empty';
import Loading from '../components/Loading';
import { TableDataType } from '../type';
import styles from './index.less';

const EditableCell: React.FC<React.PropsWithChildren> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const state = useReactive({
    editing: false,
    value: '',
  });
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      state.value = record[dataIndex];
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const save = async () => {
    try {
      toggleEdit();
      handleSave({ ...record, [dataIndex]: state.value });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Input
        ref={inputRef}
        value={state.value}
        onChange={(val) => (state.value = val)}
        onPressEnter={save}
        onBlur={save}
        style={{ width: '100%`' }}
      />
    ) : (
      <div
        className={styles['editable-cell-value-wrap']}
        onClick={toggleEdit}
        // @ts
        title={children}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type Props = {
  extractLoading: boolean;
  knowledgeInfo: string;
  graphLoading: boolean;
  graphData: GraphData;
  generateGraph: (data: TableDataType[]) => void;
  createGraph: () => void;
};

const defaultColumns = [
  {
    width: '60px',
    title: '序号',
    dataIndex: 'index',
    align: 'center',
    key: 'index',
    render: (_, record, index) => index + 1,
  },
  {
    title: '实体',
    dataIndex: 'entity1',
    key: 'entity1',
    editable: true,
    width: 106,
    ellipsis: true,
  },
  {
    title: '关系',
    dataIndex: 'rel',
    key: 'rel',
    editable: true,
    width: 106,
    ellipsis: true,
  },
  {
    title: '实体',
    dataIndex: 'entity2',
    key: 'entity2',
    editable: true,
    width: 106,
    ellipsis: true,
  },
];

type IState = {
  dataSource: (TableDataType & { key: string })[];
};

const KnowledgeMsg: React.FC<Props> = ({
  extractLoading,
  knowledgeInfo,
  generateGraph,
  graphLoading,
}) => {
  const state = useReactive<IState>({
    dataSource: [],
  });

  const operateRef = useRef<HTMLDivElement | null>();
  const hoveredIndex = useRef<number>(-1);
  useDeepCompareEffect(() => {
    if (knowledgeInfo) {
      state.dataSource = JSON.parse(knowledgeInfo).map(
        (item: TableDataType) => ({
          ...item,
          key: uuid(),
        }),
      );
    }
  }, [knowledgeInfo]);

  const handleSave = (row: TableDataType & { key: string }) => {
    const newData = [...state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    state.dataSource = newData;
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  return (
    <div className={styles['container']}>
      <div className={styles['body']}>
        <header>
          <h2>知识信息</h2>
        </header>
        <section>
          {extractLoading ? (
            <Loading loadingMessage="知识抽取中" />
          ) : knowledgeInfo ? (
            <div className={styles['table-container']}>
              <Table
                components={components}
                rowKey={(item) => item.key}
                columns={columns}
                dataSource={state.dataSource}
                bordered
                pagination={false}
                onRow={(record, index) => {
                  return {
                    onMouseEnter: (event) => {
                      console.log(event);
                      const ele = operateRef.current;
                      ele.dataIndex = index;
                      ele.style.display = 'block';
                      ele.style.top = 44 + 40 * index + 'px';
                      hoveredIndex.current = index;
                    }, // 鼠标移入行
                    onMouseLeave: (event) => {
                      const ele = operateRef.current;
                      if (event.relatedTarget !== operateRef.current) {
                        ele.style.display = 'none';
                        hoveredIndex.current = -1;
                      }
                    },
                  };
                }}
              ></Table>
              <div
                ref={operateRef}
                className={styles['operate-row']}
                onMouseLeave={() => {
                  const ele = operateRef.current;
                  ele.style.display = 'none';
                  hoveredIndex.current = -1;
                }}
              >
                {state.dataSource.length < 100 && (
                  <div
                    className={styles['operate-add']}
                    onClick={() => {
                      const newSource = [...state.dataSource];
                      newSource.splice(hoveredIndex.current + 1, 0, {
                        key: uuid(),
                        entity1: '实体1',
                        entity2: '实体2',
                        rel: '关联',
                      });
                      state.dataSource = newSource;
                    }}
                  ></div>
                )}

                <div
                  className={styles['operate-del']}
                  onClick={() => {
                    state.dataSource = state.dataSource.filter(
                      (_, index) => index !== hoveredIndex.current,
                    );
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <Empty emptyMessage="待抽取知识信息" />
          )}
        </section>
      </div>

      <footer>
        <div className={styles['area-text-footer']}>
          <Button
            disabled={graphLoading}
            type="primary"
            onClick={() => {
              generateGraph(state.dataSource);
            }}
          >
            生成图谱{graphLoading ? '中' : ''}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default KnowledgeMsg;
