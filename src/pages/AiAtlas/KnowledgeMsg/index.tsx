import { EditOutlined } from '@ant-design/icons';
import { GraphData } from '@antv/g6';
import { uuid } from '@antv/x6/lib/util/string/uuid';
import { Button, Form, Input, Modal, Table, message } from 'SeenPc';
import { useDeepCompareEffect, useReactive } from 'ahooks';
import { Tooltip } from 'antd';
import React, { useRef } from 'react';
import Empty from '../components/Empty';
import Loading from '../components/Loading';
import { TableDataType } from '../type';
import { columns, formItems } from './constants';
import styles from './index.less';

type Props = {
  extractLoading: boolean;
  knowledgeInfo: string;
  graphLoading: boolean;
  graphData: GraphData;
  generateGraph: (data: TableDataType[]) => void;
  createGraph: () => void;
};

type IState = {
  dataSource: (TableDataType & { key: string })[];
  editModalVisible: number;
};

const KnowledgeMsg: React.FC<Props> = ({
  extractLoading,
  knowledgeInfo,
  generateGraph,
  graphLoading,
}) => {
  const state = useReactive<IState>({
    dataSource: [],
    editModalVisible: -1,
  });
  const tableRef = useRef<HTMLDivElement | null>();
  const [formRef] = Form.useForm();

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

  const defaultColumns = [
    ...columns,
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: '70px',
      render: (_, record, index) => {
        return (
          <div className={styles['operate-row']}>
            <Tooltip title="编辑该行">
              <EditOutlined
                onClick={() => {
                  state.editModalVisible = index;
                  formRef.setFieldsValue({
                    entity1: record.entity1,
                    entity2: record.entity2,
                    rel: record.rel,
                  });
                }}
                style={{ fontSize: 14, color: '#979797', cursor: 'pointer' }}
              />
            </Tooltip>
            {state.dataSource.length < 100 && (
              <Tooltip title="在下面添加一行">
                <div
                  className={styles['operate-add']}
                  onClick={() => {
                    const newSource = [...state.dataSource];
                    newSource.splice(index + 1, 0, {
                      key: uuid(),
                      entity1: '实体1',
                      entity2: '实体2',
                      rel: '关联',
                    });
                    state.dataSource = newSource;
                  }}
                ></div>
              </Tooltip>
            )}
            <Tooltip title="删除该行">
              <div
                className={styles['operate-del']}
                onClick={() => {
                  state.dataSource = state.dataSource.filter(
                    (_, ind) => ind !== index,
                  );
                }}
              ></div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const checkEmpty = () => {
    return state.dataSource.every(
      (row) => row.entity1 !== '' && row.rel !== '' && row.entity2 !== '',
    );
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
            <div className={styles['table-container']} ref={tableRef}>
              <Table
                rowKey={(item) => item.key}
                columns={defaultColumns}
                dataSource={state.dataSource}
                bordered
                pagination={false}
              ></Table>
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
              // @ts-ignore
              if (tableRef.current?.querySelectorAll('input')?.length > 0) {
                message.error('知识信息中有信息未确认');
                return;
              }
              if (checkEmpty()) {
                generateGraph(state.dataSource);
              } else {
                message.warning('知识信息中内容不能为空，请填写内容');
              }
            }}
          >
            生成图谱{graphLoading ? '中' : ''}
          </Button>
        </div>
      </footer>
      <Modal
        open={state.editModalVisible !== -1}
        onCancel={() => (state.editModalVisible = -1)}
        title="编辑行数据"
        onOk={() => {
          formRef.validateFields().then((values) => {
            const newData = [...state.dataSource];
            const item = newData[state.editModalVisible];
            newData.splice(state.editModalVisible, 1, {
              ...item,
              ...values,
            });
            state.dataSource = newData;
            state.editModalVisible = -1;
          });
        }}
      >
        <Form form={formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
          {formItems.map((item) => {
            return (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={[
                  {
                    required: true,
                    message: '请填写' + item.label,
                  },
                  {
                    max: 20,
                    message: item.label + '字符数不得超过20',
                  },
                ]}
              >
                <Input
                  style={{ resize: 'unset', height: 80 }}
                  type="textarea"
                />
              </Form.Item>
            );
          })}
        </Form>
      </Modal>
    </div>
  );
};

export default KnowledgeMsg;
