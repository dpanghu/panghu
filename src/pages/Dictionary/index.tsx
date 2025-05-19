import React, { useEffect, useState } from 'react';
import styles from './index.less';
import type { PaginationProps } from 'antd';
import { Button, Input, Modal, Pagination, Table, message } from 'antd';
import {
  ArrowLeftOutlined,
  CloseOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import DicModal from './components/DicModal';
import { delScientificTag, getScientificTagPage } from '@/services/research';
import { history } from 'umi';
interface TProps {}

interface DataSourceType {
  key: string;
  name: string;
  groupType: number;
  tagDesc: string;
  code: string;
  level: string;
  parentName: string;
  [field: string]: any;
}

const Container: React.FC<TProps> = () => {
  const [dicName, setDicName] = useState<string>('');
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [dicModalConfig, setDicModalConfig] = useState({
    open: false,
    title: '新增字典',
    code: '',
  });
  const [total, setTotal] = useState<number>(0);
  const [queryParams, setQueryParams] = useState({
    tagName: '',
    pageNum: 1,
    limit: 10,
  });

  const queryDicTableData = async () => {
    const result = await getScientificTagPage(queryParams);
    setDataSource(result?.tagList || []);
    setTotal(result.total);
  };

  const handleDeleteDic = (record: DataSourceType) => {
    Modal.info({
      getContainer: () => document.getElementById('dicContainerMain') as HTMLElement,
      title: '删除字典',
      okText: '确定',
      closeIcon: <CloseOutlined />,
      closable: true,
      content: (
        <div>
          <p>是否删除该字典内容？删除后信息不可恢复</p>
        </div>
      ),
      async onOk() {
        await delScientificTag({
          code: record.code,
        });
        message.success('删除成功');
        if (dataSource.length === 1 && queryParams.pageNum !== 1) {
          setQueryParams({
            ...queryParams,
            pageNum: queryParams.pageNum - 1,
          });
        } else {
          queryDicTableData();
        }
      },
    });
  };

  const columns: ColumnsType<DataSourceType> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render(value, record, index) {
        const i = queryParams.limit * (queryParams.pageNum - 1);
        return i + index + 1;
      },
      width: 85,
      align: 'center',
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '字典编码',
      dataIndex: 'code',
      key: 'code',
      // ellipsis: true,
    },
    {
      title: '归属组',
      dataIndex: 'groupType',
      key: 'groupType',
      // ellipsis: true,
      render(value) {
        const groupTypeEnum = [
          { value: 1, label: '技术标签' },
          { value: 2, label: '业务标签' },
          { value: 3, label: '行业标签' },
          { value: 4, label: '课程标签' },
          { value: 5, label: '画板标签' },
          { value: 6, label: '专业特殊标签' },
          { value: 7, label: '领域标签' },
          { value: 8, label: '案例标签' },
          { value: 9, label: '主题标签' },
        ];
        return <span>{groupTypeEnum.find((item) => item.value === value)?.label}</span>;
      },
    },
    {
      title: '分类层级',
      dataIndex: 'level',
      key: 'level',
      // ellipsis: true,
    },
    {
      title: '归属分类',
      dataIndex: 'parentName',
      key: 'parentName',
      ellipsis: true,
    },
    {
      title: '字典说明',
      dataIndex: 'tagDesc',
      key: 'tagDesc',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 135,
      render(value, record) {
        return (
          <div className={styles.action}>
            <span
              onClick={() => {
                setDicModalConfig({
                  title: '查看字典',
                  open: true,
                  code: record.code,
                });
              }}
            >
              查看
            </span>
            <span
              onClick={() => {
                setDicModalConfig({
                  title: '编辑字典',
                  open: true,
                  code: record.code,
                });
              }}
            >
              编辑
            </span>
            <span
              onClick={() => {
                handleDeleteDic(record);
              }}
            >
              删除
            </span>
          </div>
        );
      },
    },
  ];

  const handleCancelModal = () => {
    setDicModalConfig({
      ...dicModalConfig,
      open: false,
    });
  };

  const handleSearch = () => {
    setQueryParams({
      ...queryParams,
      tagName: dicName.trim(),
      pageNum: 1,
    });
  };

  const onPageNumChange: PaginationProps['onChange'] = (page: number, pageSize: number) => {
    setQueryParams({
      ...queryParams,
      pageNum: page,
      limit: pageSize,
    });
  };

  const onShowSizeChange = (current: number, size: number) => {
    setQueryParams({
      ...queryParams,
      pageNum: current,
      limit: size,
    });
  };

  useEffect(() => {
    queryDicTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  return (
    <div className={styles.container} id="dicContainer">
      <div className={styles.header}>
        <div className={styles.title}>
          <span
            className={styles.goBack}
            onClick={() => {
              history.push('/configIndex');
            }}
          >
            <ArrowLeftOutlined />
            返回
          </span>
          字典配置
        </div>
        <div className={styles.search}>
          <Input
            suffix={<SearchOutlined onClick={handleSearch} />}
            style={{ width: 275 }}
            placeholder="输入字典名称查询"
            maxLength={20}
            onChange={(e) => {
              setDicName(e.target.value);
            }}
            value={dicName}
            onPressEnter={handleSearch}
          />
          <Button
            type="primary"
            icon={<PlusSquareOutlined />}
            onClick={() => {
              setDicModalConfig({
                open: true,
                title: '新增字典',
                code: '',
              });
            }}
          >
            新建字典
          </Button>
        </div>
      </div>
      <div className={styles.main} id="dicContainerMain">
        <Table
          rowKey={'id'}
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={false}
          scroll={{ y: `calc(100vh - 300px)` }}
        />
      </div>
      <div className={styles.pagination}>
        <Pagination
          onChange={onPageNumChange}
          onShowSizeChange={onShowSizeChange}
          total={total}
          current={queryParams.pageNum}
          pageSize={queryParams.limit}
          showSizeChanger
          showQuickJumper
          showTotal={(t) => `总共 ${t} 条字典`}
        />
      </div>
      <DicModal
        {...dicModalConfig}
        onCancel={handleCancelModal}
        queryData={() => {
          setDicName('');
          setQueryParams({
            tagName: '',
            pageNum: 1,
            limit: 10,
          });
        }}
      />
    </div>
  );
};

export default Container;
