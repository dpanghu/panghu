import React, { useEffect } from 'react';
import { useMount, useReactive } from 'ahooks';
import { Button, Form, Input, Modal, Table, TreeSelect, message, Badge } from 'antd';
import {
  classificationList,
  deleteIndicator,
  indicatorPage,
  saveIndicator,
} from '@/services/metrc';
import { cloneDeep } from 'lodash-es';
import moment from 'moment';

import styles from './index.less';

type TState = {
  classifyData: RecordItem[]; // 分类
  dataSource: RecordItem[]; // table数据
  currentRecord: RecordItem; // table row
  open: boolean; // 弹窗开关
  indicatorName: string; // 指标名称
  pageNum: number; // 当前页数
  limit: number; // 每条页数
  total: number;
};

// 解析树
const handleMajorsList = (data: RecordItem[]) => {
  if (data.length !== 0) {
    return data.map((item) => {
      const result: RecordItem = {};
      result.value = item.id;
      result.label = item.classificationName;
      result.title = item.classificationName;
      result.id = item.id;
      result.key = item.id;
      result.length = item.childs ? item.childs?.length : 0;
      result.isLeaf = item.childs ? false : true;
      result.selectable = item.childs ? false : true;
      result.disabled = item.childs ? true : false;
      if (item?.childs) {
        result.children = handleMajorsList(item?.childs) || {};
      }
      return result;
    });
  }
  return data;
};

const MetricSetting: React.FC = () => {
  const state = useReactive<TState>({
    classifyData: [],
    dataSource: [],
    currentRecord: {},
    open: false,
    indicatorName: '',
    pageNum: 1,
    limit: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  //查询分类
  const getClassificationList = () => {
    classificationList({
      classificationType: 1,
    }).then((res) => {
      const classifyTree = handleMajorsList(cloneDeep(res));
      // console.log(res, classifyTree);
      state.classifyData = cloneDeep(classifyTree);
    });
  };

  // 查询指标配置
  const getIndicatorPage = () => {
    indicatorPage({
      pageNum: state.pageNum,
      limit: state.limit,
      indicatorName: state.indicatorName,
    }).then((res) => {
      state.dataSource = cloneDeep(res?.data);
      state.total = Number(res.total);
    });
  };

  // 分页
  const handlePageChange = (cur: number, page: number) => {
    // console.log(cur, page);
    state.pageNum = cur;
    state.limit = page;
    getIndicatorPage();
  };

  // 查询onchange
  const handleInputChange = (e: any) => {
    // const reg1 = /^[\u4e00-\u9fa5_\-\——a-zA-Z0-9]+$/;
    // if (e.target.value && !reg1.test(e.target.value)) {
    //   message.error('只能输入数字、字母、汉字、下横线、下划线!');
    //   state.indicatorName = '';
    // }
    state.indicatorName = e.target.value;
  };

  const handleBlurChange = (e: any) => {
    const reg = /^[\u4e00-\u9fa5_\-\——a-zA-Z0-9]+$/;
    if (e.target.value && !reg.test(e.target.value)) {
      message.error('只能输入数字、字母、汉字、下横线、下划线!');
      state.indicatorName = '';
    }
    getIndicatorPage();
  };
  // 按下回车搜索
  const handlePressEnter = () => {
    getIndicatorPage();
  };

  // 编辑
  const handleEdit = (row: RecordItem) => {
    // console.log('11', row);
    state.open = true;
    state.currentRecord = row;
  };

  // 删除
  const handleDelete = (row: RecordItem) => {
    Modal.confirm({
      title: '删除确认',
      content: '确认删除该条指标吗？',
      onOk: async () => {
        await deleteIndicator({
          id: row.id,
        }).then(() => {
          getIndicatorPage();
          message.success('删除成功');
        });
      },
      onCancel: () => {},
    });
  };

  // 发布
  const handlePublish = async (row: RecordItem) => {
    await saveIndicator({
      ...row,
      id: row.id,
      releaseState: Number(row?.releaseState) === 1 ? 2 : 1,
    }).then(() => {
      getIndicatorPage();
      Number(row?.releaseState) === 1
        ? message.success('发布成功')
        : message.success('取消发布成功');
    });
  };

  const handleOpen = () => {
    state.currentRecord = {};
    state.open = true;
  };

  const handleCancel = () => {
    state.open = false;
    state.currentRecord = {};
    form.resetFields();
  };

  // 新建/编辑
  const handleFinish = async () => {
    const values = await form.validateFields();
    // console.log('par', values, saveIndicator);
    state.currentRecord?.id
      ? await saveIndicator({
          id: state.currentRecord?.id,
          ...values,
        }).then(() => {
          state.open = false;
          state.currentRecord = {};
          form.resetFields();
          getIndicatorPage();
          message.success('编辑成功');
        })
      : await saveIndicator({
          ...values,
        }).then(() => {
          state.open = false;
          form.resetFields();
          getIndicatorPage();
          message.success('新建成功');
        });
  };

  const columns = [
    {
      title: '序号',
      render: (text: string, row: RecordItem, index: number) => <div>{index + 1}</div>,
      fixed: 'left',
    },
    {
      title: '指标分类',
      dataIndex: 'classificationName',
    },
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
    },
    {
      title: '创建者',
      dataIndex: 'userName',
    },
    {
      title: '创建时间',
      dataIndex: 'modifyTime',
      render: (text: string) => <div>{moment(Number(text)).format('YYYY-MM-DD HH:mm:ss')}</div>,
    },
    {
      title: '状态',
      dataIndex: 'releaseState',
      render: (text: string) => (
        <div>
          <Badge
            color={Number(text) === 2 ? 'lime' : 'blue'}
            text={Number(text) === 1 ? '未发布' : '已发布'}
          />
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: '-',
      with: 180,
      fixed: 'right',
      render: (_: string, record: RecordItem) => {
        return (
          <div>
            <Button type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type="link" onClick={() => handleDelete(record)}>
              删除
            </Button>
            <Button type="link" onClick={() => handlePublish(record)}>
              {Number(record?.releaseState) === 1 ? '发布' : '取消发布'}
            </Button>
          </div>
        );
      },
    },
  ] as any;

  useEffect(() => {
    if (state.currentRecord?.id) {
      form.setFieldsValue({
        ...state.currentRecord,
      });
    }
  }, [form, state.currentRecord]);

  useMount(() => {
    getIndicatorPage();
    getClassificationList();
  });

  return (
    <div className={styles?.main}>
      <div>
        <h3>指标配置</h3>
        <div className={styles?.button}>
          <Input
            allowClear
            // width={300}
            value={state.indicatorName}
            placeholder="请输入指标名称按回车查询"
            onChange={handleInputChange}
            onBlur={handleBlurChange}
            onPressEnter={handlePressEnter}
          />
          <Button type="primary" onClick={handleOpen}>
            新建
          </Button>
        </div>
      </div>
      <div>
        <Table
          rowKey="id"
          scroll={{
            x: 'max-content',
          }}
          columns={columns}
          dataSource={state.dataSource}
          pagination={{
            total: state.total,
            current: state.pageNum,
            pageSize: state.limit,
            onChange: handlePageChange,
            showTitle: false,
          }}
        />
      </div>
      <Modal
        title={state.currentRecord?.id ? '编辑' : '新建'}
        open={state.open}
        onCancel={handleCancel}
        onOk={handleFinish}
      >
        <Form form={form} onFinish={handleFinish}>
          <Form.Item name="classificationId" label="指标分类" rules={[{ required: true }]}>
            <TreeSelect
              placeholder="请选择指标分类"
              showSearch
              allowClear
              treeNodeFilterProp="title"
              treeData={state.classifyData}
              treeCheckable={false}
            />
          </Form.Item>
          <Form.Item name="indicatorName" label="指标名称" rules={[{ required: true }]}>
            <Input placeholder="请输入指标名称" maxLength={50} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default MetricSetting;
