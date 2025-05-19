import React from 'react';
import styles from './index.less';
import { Select, Table } from 'antd';

const Container: React.FC = () => {
  const columns1 = [
    {
      key: 'lrbbxm',
      dataIndex: 'lrbbxm',
      title: '证监会行业门类',
      ellipsis: true,
      // width: 100,
    },
    { key: 'bqje', dataIndex: 'bqje', title: '证监会行业大类', ellipsis: true },
    { key: 'qntq', dataIndex: 'qntq', title: '证监会行业大类公司数量', ellipsis: true },
  ];
  const columns2 = [
    {
      key: 'lrbbxm',
      dataIndex: 'lrbbxm',
      title: '行业二级名称',
      ellipsis: true,
      // width: 100,
    },
    { key: 'bqje', dataIndex: 'bqje', title: '行业一级名称', ellipsis: true },
    { key: 'qntq', dataIndex: 'qntq', title: '行业三级名称', ellipsis: true },
    { key: 'bqxmzb', dataIndex: 'bqxmzb', title: '行业三级公司数量%', ellipsis: true },
  ];
  const columns3 = [
    {
      key: 'lrbbxm',
      dataIndex: 'lrbbxm',
      title: '省份或直辖市',
      ellipsis: true,
      // width: 100,
    },
    { key: 'bqje', dataIndex: 'bqje', title: '行业一公司数量级名称', ellipsis: true },
  ];
  const columns4 = [
    {
      key: 'lrbbxm',
      dataIndex: 'lrbbxm',
      title: '城市名称',
      ellipsis: true,
      // width: 100,
    },
    { key: 'bqje', dataIndex: 'bqje', title: '公司数量', ellipsis: true },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.title}>
          <span>
            <img></img>
          </span>
          上市公司属性情况
        </div>
        <div className={styles.content}>
          <Select></Select>
          <Select></Select>
          <Select></Select>
          <Select></Select>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.graph}>
          <div className={styles.graphTitle}>证监会行业数量</div>
          <div className={styles.graphContent}>
            <Table
              columns={columns1}
              size="small"
              rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            />
          </div>
        </div>
        <div className={styles.graph}>
          <div className={styles.graphTitle}>申万行业数量</div>
          <div className={styles.graphContent}>
            <Table
              columns={columns2}
              size="small"
              rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            />
          </div>
        </div>
        <div className={styles.graph}>
          <div className={styles.graphTitle}>省份或直辖市数量</div>
          <div className={styles.graphContent}>
            <Table
              columns={columns3}
              size="small"
              rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            />
          </div>
        </div>
        <div className={styles.graph}>
          <div className={styles.graphTitle}>城市数量</div>
          <div className={styles.graphContent}>
            <Table
              columns={columns4}
              size="small"
              rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
