/**
 * 添加成员
 */

import { getMemberList } from '@/services/scientificProject';
import { Input, Modal, Pagination, Table } from 'antd';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import styles from './index.less';
import closeIcon from '@/assets/images/icon-close.png';
import searchSvg from '@/assets/images/reSearch/search.svg';

interface IProps {
  open: boolean;
  projectId: string;
  onCancel: () => void;
  onOk: (selectedRow: any) => void;
  detailObj: any;
}
const AddMember: React.FC<IProps> = ({ open, projectId, onCancel, onOk, detailObj }) => {
  const [params, setParams] = useState({
    pageNum: 1,
    limit: 10,
    memberName: '',
  });
  const [inputValue, setInputValue] = useState('');
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRow, setSelectedRow] = useState<RecordItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const memberId = Cookies.get('schoolMemberId');
  const roleAudit = Cookies.get('memberType') !== 'SCHOOL_ADMINISTRATOR';

  const getMemberListData = () => {
    getMemberList({
      projectId,
      ...params,
      memberId: roleAudit ? memberId : detailObj.memberId,
    }).then((res) => {
      setTotal(res.total);
      setDataSource(res.data);
    });
  };
  useEffect(() => {
    getMemberListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, params]);

  const getMember = (memberCode: number) => {
    switch (memberCode) {
      case 1:
        return '教师';
      case 34:
        return '教师-科研成员';
      case 35:
        return '教师-科研开发';
      default:
        return '学生';
    }
  };

  const columns: any = [
    {
      title: '序号',
      dataIndex: 'code',
      width: 100,
      render(value: any, record: any, index: number) {
        const i = params.limit * (params.pageNum - 1);
        return i + index + 1;
      },
    },
    {
      title: '姓名',
      dataIndex: 'memberName',
      width: 150,
    },
    {
      title: '教工号/学号',
      dataIndex: 'memberId',
      width: 200,
    },
    {
      title: '学院',
      dataIndex: 'collegeName',
      width: 200,
    },
    {
      title: '专业',
      dataIndex: 'majorName',
    },
    {
      title: '角色',
      dataIndex: 'memberType',
      render: (text: number) => <div>{getMember(text)}</div>,
    },
  ];

  const onChangePage = (page: number, pageSize: number) => {
    setParams({ ...params, pageNum: page, limit: pageSize });
    setSelectedRowKeys([]);
  };

  return (
    <Modal
      open={open}
      title="添加成员"
      width={1033}
      getContainer={() => document.getElementById('MemberManageContainer')!}
      wrapClassName={styles.modal}
      onCancel={onCancel}
      closeIcon={<img style={{ width: 16, height: 16 }} src={closeIcon} />}
      onOk={() => onOk(selectedRow)}
    >
      <Input
        placeholder="搜索"
        suffix={
          <img
            src={searchSvg}
            onClick={() => {
              setParams({ ...params, memberName: inputValue });
            }}
          />
        }
        className={styles.input}
        onChange={(e) => setInputValue(e.target.value)}
        onPressEnter={() => {
          setParams({ ...params, memberName: inputValue });
        }}
      />
      <Table
        rowKey="memberId"
        columns={columns}
        dataSource={dataSource}
        size="small"
        className={styles.table}
        pagination={false}
        scroll={{ y: 400 }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKey: any[], selectedRows: any[]) => {
            const arr = selectedRows.map((item) => {
              return {
                memberId: item.memberId,
                memberType: item.memberType,
              };
            });
            setSelectedRow([...arr]);
            setSelectedRowKeys(selectedRowKey);
          },
        }}
      />
      <Pagination
        total={total}
        current={params.pageNum}
        pageSize={params.limit}
        onChange={onChangePage}
        className={styles.page}
        showSizeChanger
        showQuickJumper
        showTotal={(t) => `总共 ${t} 个成员`}
      />
    </Modal>
  );
};

export default AddMember;
