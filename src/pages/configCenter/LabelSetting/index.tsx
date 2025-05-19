import React, { useEffect } from 'react';
import { useMount, useReactive } from 'ahooks';
import { Button, Form, Input, Modal, Table, TreeSelect, message, Badge, Select } from 'antd';
import {
  classificationList,
  configurationAll,
  deleteManagement,
  managementPage,
  saveManagement,
} from '@/services/label';
import { cloneDeep } from 'lodash-es';
import moment from 'moment';
import { history } from 'umi';

import styles from './index.less';

type TState = {
  classifyData: RecordItem[]; // 分类
  dataSource: RecordItem[]; // table数据
  currentRecord: RecordItem; // table row
  classifyMap: RecordItem[];
  treeSelect: string | any;
  selectValue: string | any;
  open: boolean; // 弹窗开关
  indicatorName: string; // 标签名称
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

const LabelSetting: React.FC = () => {
  const state = useReactive<TState>({
    classifyData: [],
    dataSource: [],
    currentRecord: {},
    classifyMap: [],
    treeSelect: null,
    selectValue: null,
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
      classificationType: 0,
    }).then((res) => {
      const classifyTree = handleMajorsList(cloneDeep(res));
      // console.log(res, classifyTree);
      state.classifyData = cloneDeep(classifyTree);
    });
  };

  // 查询标签
  const getConfigurationAll = () => {
    configurationAll({}).then((res) => {
      const newRes = cloneDeep(res);
      const options = newRes.map((item: RecordItem) => ({
        label: item?.indicatorName,
        value: item?.id,
        key: item?.id,
      }));
      state.classifyMap = cloneDeep(options);
    });
  };

  // 查询标签配置
  const getIndicatorPage = () => {
    managementPage({
      pageNum: state.pageNum,
      limit: state.limit,
      labelName: state.indicatorName,
      classificationId: state.treeSelect,
      releaseState: state.selectValue,
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
    state.indicatorName = e.target.value && e.target.value.trim();
  };

  const handleBlurChange = (e: any) => {
    const reg = /^[\u4e00-\u9fa5_\-\——a-zA-Z0-9]+$/;
    if (e.target.value && !reg.test(e.target.value)) {
      message.error('只能输入数字、字母、汉字、下横线、下划线!');
      state.indicatorName = '';
    }
    const reg1 = /^[^\s]*$/;
    if (!reg1.test(e.target.value)) {
      message.error('请勿输入空格!');
      state.indicatorName = '';
      return;
    }
    getIndicatorPage();
  };

  // 按下回车搜索
  const handlePressEnter = () => {
    getIndicatorPage();
  };

  // 标签分类搜索
  const handleTreeSelect = (val: string) => {
    // console.log(val);
    state.treeSelect = val;
    getIndicatorPage();
  };

  // 标签状态搜索
  const handleSelect = (val: string) => {
    // console.log(val);
    state.selectValue = val;
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
      content: '确认删除该条标签吗？',
      onOk: async () => {
        await deleteManagement({
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
    await saveManagement({
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
    // console.log('par', values, saveManagement);
    state.currentRecord?.id
      ? await saveManagement({
          id: state.currentRecord?.id,
          ...values,
        }).then(() => {
          state.open = false;
          state.currentRecord = {};
          form.resetFields();
          getIndicatorPage();
          message.success('编辑成功');
        })
      : await saveManagement({
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
      title: '标签分类',
      dataIndex: 'classificationName',
    },
    {
      title: '标签',
      dataIndex: 'label',
    },
    {
      title: '标签值',
      dataIndex: 'labelValue',
    },
    {
      title: '创建者',
      dataIndex: 'creator',
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

  const handleReturn = () => {
    history.push('/configIndex');
  };

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
    getConfigurationAll();
  });

  return (
    <div className={styles?.main}>
      <div>
        {/* <h3>标签配置</h3> */}
        <div className={styles?.return} onClick={handleReturn}>
          <Button type="link" onClick={handleReturn} style={{ marginLeft: '-15px' }}>
            返回
          </Button>
        </div>
        <div className={styles?.button}>
          <div className={styles?.selectStyle}>
            <Input
              allowClear
              value={state.indicatorName}
              placeholder="请输入标签名称按回车查询"
              onChange={handleInputChange}
              onBlur={handleBlurChange}
              onPressEnter={handlePressEnter}
            />
            <div>
              <span>标签分类: </span>
              <TreeSelect
                showSearch
                allowClear
                // treeDefaultExpandAll
                // treeCheckable
                bordered
                placeholder="请选择"
                value={state.treeSelect}
                onChange={handleTreeSelect}
                treeData={state.classifyData}
                treeCheckable={false}
              />
            </div>
            <div>
              <span>标签状态: </span>
              <Select
                placeholder="请选择"
                allowClear
                options={[
                  { value: 1, label: '未发布', key: 1 },
                  { value: 2, label: '已发布', key: 2 },
                ]}
                value={state.selectValue}
                onChange={handleSelect}
              />
            </div>
          </div>
          <Button type="primary" onClick={handleOpen}>
            新建
          </Button>
        </div>
      </div>
      <div>
        <Table
          rowKey="id"
          columns={columns}
          scroll={{
            x: 'max-content',
          }}
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
        <Form
          form={form}
          onFinish={handleFinish}
          labelCol={{
            span: 4,
          }}
        >
          <Form.Item name="labelName" label="标签名称" rules={[{ required: true }]}>
            <Input placeholder="请输入标签名称" maxLength={30} allowClear />
          </Form.Item>
          <Form.Item
            name="labelCode"
            label="标签编码"
            rules={[
              { required: true },
              {
                pattern: new RegExp(/^[a-zA-Z0-9_-]+$/),
                message: '只能输入数字、英文字母和-_',
              },
            ]}
          >
            <Input placeholder="请输入标签编码" maxLength={30} allowClear />
          </Form.Item>
          <Form.Item name="classificationId" label="标签分类" rules={[{ required: true }]}>
            <TreeSelect
              placeholder="请选择标签分类"
              showSearch
              allowClear
              treeNodeFilterProp="title"
              treeData={state.classifyData}
              treeCheckable={false}
            />
          </Form.Item>
          <Form.Item name="associationIndicator" label="关联关系" rules={[{ required: true }]}>
            <Select
              placeholder="请选择关联关系"
              showSearch
              allowClear
              options={state.classifyMap}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            name="labelValue"
            label="标签值"
            rules={[
              { required: true },
              // {
              //   pattern: new RegExp(/^[\u4e00-\u9fa5,()（）a-zA-Z0-9]+$/),
              //   message: '只能输入中文、数字、英文字母和逗号和括号',
              // },
            ]}
          >
            <Input.TextArea
              placeholder="请输入标签值"
              allowClear
              rows={6}
              maxLength={10000}
              showCount
            />
          </Form.Item>
          <Form.Item name="labelExplain" label="标签说明">
            <Input.TextArea
              placeholder="请输入标签说明"
              allowClear
              rows={6}
              maxLength={5000}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default LabelSetting;
