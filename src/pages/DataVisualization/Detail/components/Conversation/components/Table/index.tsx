import { Table } from 'SeenPc';
import { useDeepCompareEffect } from 'ahooks';
import { cloneDeep } from 'lodash';
import React, { useMemo } from 'react';
import styles from './index.less';

type Props = {};
const CustomTable: React.FC<Props> = ({ props }) => {
  console.log(props);

  const formatData = useMemo(() => {
    const theadNode = cloneDeep(props.node.children[0].children[0]);
    const tbodyNode = cloneDeep(props.node.children[1]);
    const columnsName: string[] = [];
    const columns = Array.from(theadNode.children).map((th: any) => {
      const name = th.children[0].value;
      columnsName.push(name);
      return {
        title: name,
        dataIndex: name,
        key: name,
      };
    });
    columns.unshift({
      title: '序号',
      dataIndex: '序号',
      key: '序号',
      width: '80px',
      render: (_, record, index) => index + 1,
    });
    const data = Array.from(tbodyNode.children).map((tr: any, index) => {
      return {
        key: index,
        [columnsName[0]]: tr?.children?.[0]?.children?.[0]?.value || '',
        [columnsName[1]]: tr?.children?.[1]?.children?.[0]?.value || '',
        [columnsName[2]]: tr?.children?.[2]?.children?.[0]?.value || '',
      };
    });
    return {
      columns,
      data,
    };
  }, [JSON.stringify(props.node)]);

  useDeepCompareEffect(() => {}, [props]);

  return (
    <div className={styles['container']}>
      <Table
        columns={formatData.columns}
        dataSource={formatData.data}
        pagination={false}
        scroll={{ y: 240 }}
        tableLayout="fixed"
      ></Table>
    </div>
  );
};

export default CustomTable;
