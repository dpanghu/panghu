import { SearchOutlined } from '@ant-design/icons';
import type { PaginationProps } from 'antd';
import { Input, message, Modal, Pagination, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

interface TProps {
  open: boolean;
  searchWord: string;
  title: string;
  queryData: (data: RecordItem) => Promise<any>;
  onCancel: () => void;
  onOk: (caseId: string[], caseDetail: RecordItem[]) => void;
  getColumns: (data: RecordItem) => ColumnsType<RecordItem>;
}

const Container: React.FC<TProps> = ({
  open,
  onCancel,
  onOk,
  getColumns,
  queryData,
  searchWord,
  title,
}) => {
  const [dataSource, setDataSource] = useState<RecordItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [caseName, setCaseName] = useState('');
  const [selectedRowKey, setSelectedRowKey] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<RecordItem[]>([]);
  const [queryParams, setQueryParams] = useState({
    [searchWord]: '',
    pageNum: 1,
    limit: 10,
  });

  const handleSearch = () => {
    let regex = /^\s+|\s+$/g;
    if (regex.test(caseName)) {
      message.error('头尾不能输入空格！');
      return;
    }
    setQueryParams({
      ...queryParams,
      [searchWord]: caseName,
      pageNum: 1,
    });
  };

  const queryProductCase = async () => {
    setSelectedRowKey([]);
    const result = await queryData({
      productCode: 'BIP',
      ...queryParams,
    });

    setTotal(result.total);
    setDataSource(result.data);
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
    if (open) {
      queryProductCase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, open]);

  return (
    <div className={styles.container} id="productCaseModal">
      <Modal
        maskClosable={false}
        open={open}
        onOk={() => {
          if (!selectedRowKey.length) {
            message.warning(`请先选择${title}`);
            return;
          }
          onOk(selectedRowKey, selectedRow);
        }}
        width={750}
        getContainer={() => document.getElementById('productCaseModal') as HTMLElement}
        onCancel={() => {
          onCancel();
          setQueryParams({ ...queryParams, [searchWord]: '' });
          setCaseName('');
        }}
        title={
          <div className={styles.header}>
            <div className={styles.title}>引用{title}</div>
            <div className={styles.action}>
              <Input
                suffix={<SearchOutlined onClick={handleSearch} />}
                style={{ width: 225 }}
                placeholder={`输入${title}名称查询`}
                maxLength={20}
                onChange={(e) => {
                  setCaseName(e.target.value);
                }}
                value={caseName}
                onPressEnter={handleSearch}
              />
            </div>
          </div>
        }
      >
        <div className={styles.caseModal}>
          <Table
            rowKey={'id'}
            bordered
            size="small"
            rowSelection={{
              selectedRowKeys: selectedRowKey,
              onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
                setSelectedRowKey(selectedRowKeys);
                setSelectedRow(selectedRows);
              },
              type: 'radio',
            }}
            columns={getColumns(queryParams)}
            pagination={false}
            dataSource={dataSource}
          />
          <div className={styles.pagination}>
            <Pagination
              onChange={onPageNumChange}
              onShowSizeChange={onShowSizeChange}
              total={total}
              current={queryParams.pageNum}
              pageSize={queryParams.limit}
              showSizeChanger
              showQuickJumper
              size="small"
              showTotal={(t) => `总共 ${t} 条${title}`}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Container;
