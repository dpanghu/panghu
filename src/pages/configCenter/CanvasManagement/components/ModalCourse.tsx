import { canvasPage } from '@/services/canvaTools';
import { useMount } from 'ahooks';
import { Input, Modal, Table } from 'antd';
import { cloneDeep } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import styles from './modalCourse.less';

interface Props {
  open: boolean;
  selectCourse: RecordItem[];
  setOpen: (val: boolean) => void;
  setSelectCourse: (val: RecordItem[]) => void;
}
const ModalCourse: React.FC<Props> = (props: Props) => {
  const { open, selectCourse, setOpen, setSelectCourse } = props;
  const [searchValue, setSearchValue] = useState('');
  const [dataSource, setDataSource] = useState<RecordItem[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<RecordItem[] | any>([]);
  const [pageNum, setPageNum] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const getCouseList = (cur: number, page: number, word?: string) => {
    canvasPage({
      pageNum: cur,
      limit: 9999,
      searchWord: word || '',
    }).then((res) => {
      // console.log(res);
      setDataSource(cloneDeep(res?.data));
      setTotal(Number(res?.total || 0));
    });
  };

  const handlePageChange = (cur: number, page: number) => {
    setPageNum(cur);
    setLimit(page);
    getCouseList(cur, page, searchValue);
  };

  const onSelectChange = (selectedRowKeys: any) => {
    // console.log(selectedRows);
    setSelectedKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: onSelectChange,
  };

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handlePressEnter = () => {
    getCouseList(pageNum, limit, searchValue);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedKeys([]);
    setSelectCourse(cloneDeep(selectCourse));
  };

  const handleOk = () => {
    setSelectCourse(cloneDeep(selectedKeys));
    setOpen(false);
  };

  const columns: RecordItem[] = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      title: '课程编码',
      dataIndex: 'courseCode',
    },
    {
      title: '课程版本号',
      dataIndex: 'releaseVersion',
    },
  ];

  // console.log('270572', selectCourse);
  useEffect(() => {
    if (selectCourse && selectCourse.length > 0) {
      console.log(111);
      setSelectedKeys(selectCourse);
    } else {
      setSelectedKeys([]);
    }
  }, [selectCourse]);

  useMount(() => {
    getCouseList(1, 10);
  });

  return (
    <div>
      <Modal title="选择课程" open={open} onOk={handleOk} onCancel={handleCancel} width={800}>
        <div className={styles?.course}>
          <span>课程名称：</span>
          <Input
            value={searchValue}
            placeholder="请输入课程名称"
            onChange={handleSearch}
            onPressEnter={handlePressEnter}
            width={200}
          />
        </div>
        <Table
          rowKey="courseCode"
          columns={columns}
          rowSelection={rowSelection}
          dataSource={dataSource}
          pagination={{
            current: pageNum,
            pageSize: limit,
            total: total,
            onChange: handlePageChange,
          }}
        />
      </Modal>
    </div>
  );
};
export default ModalCourse;
