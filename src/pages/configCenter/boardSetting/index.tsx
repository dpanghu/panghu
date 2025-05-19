/*
 *@description:  画板设置
 *@author: aizhf
 *@date: 2023-04-03 10:24:01
 */
// import React, { useCallback, useEffect, useState } from 'react';
import { deletePaintboard, getPaintboardList, savePaintboard } from '@/services/board';
import { useMount, useReactive } from 'ahooks';
import { Button, Input, message, Modal, Table } from 'antd';
import React from 'react';
import SettingModal from '../boardSettingModal/index';
import styles from './index.less';

type IState = {
  pageNum: number; //每页条数
  limit: number;
  returnCount: number; //  总条数
  currentPage: number; //当前页
  dataSource: RecordItem[]; // 数据
  paintboardConfigName: string; //搜索词
  isShowModal: boolean; // 新增modal
  boardId: string;
};

const { Search } = Input;

const Board: React.FC = () => {
  const state = useReactive<IState>({
    pageNum: 1,
    limit: 10,
    returnCount: 0,
    currentPage: 1,
    dataSource: [],
    paintboardConfigName: '',
    isShowModal: false,
    boardId: '',
  });

  //新增和编辑
  const onShowModal = (id: string) => {
    state.isShowModal = !state.isShowModal;
    state.boardId = id;
  };

  //  获取列表
  const getList = async (
    pageNum = state.pageNum,
    limit = state.limit,
    paintboardConfigName = state.paintboardConfigName,
  ) => {
    const res = await getPaintboardList({
      pageNum,
      limit,
      paintboardConfigName,
    });
    state.dataSource = res.data;
    state.pageNum = res.pages;
    state.returnCount = res.total;
  };

  // 删除
  const deleteBoard = (id: string) => {
    Modal.confirm({
      title: '删除画板配置',
      content: '请确认是否要删除此画板配置！',
      onOk: async () => {
        await deletePaintboard({ id });
        message.success('删除成功！');
        getList();
      },
    });
  };

  const columns: any = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '画板名称',
      dataIndex: 'paintboardConfigName',
      key: 'paintboardConfigName',
    },
    {
      title: '当前地址',
      dataIndex: 'paintboardConfigUrl',
      key: 'paintboardConfigUrl',
    },
    {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render: (_: any, record: RecordItem) => (
        <>
          <a style={{ marginRight: 10 }} onClick={() => onShowModal(record.id)}>
            修改
          </a>
          <a onClick={() => deleteBoard(record.id)}>删除</a>
        </>
      ),
    },
  ];

  // 保存单条信息
  const savePaintboardInfo = async (values: any) => {
    await savePaintboard(values);
    getList();
    onShowModal('');
  };

  useMount(() => {
    getList();
  });

  // 搜索
  const onSearch = (e: any) => {
    state.paintboardConfigName = e;
    getList(state.pageNum, state.limit, e);
  };

  //  分野
  const onChangePage = (currentPage: any, pageSize: any) => {
    console.log('111', currentPage, pageSize);
    state.limit = pageSize;
    getList(currentPage, pageSize);
  };

  const { dataSource, returnCount, pageNum, limit, isShowModal, boardId } = state;
  return (
    <>
      {isShowModal && (
        <SettingModal id={boardId} onSave={savePaintboardInfo} onCancal={onShowModal} />
      )}
      <div className={styles.handle}>
        <Search placeholder="请输入名称" onSearch={onSearch} enterButton style={{ width: 300 }} />
        <Button type="primary" onClick={() => onShowModal('')}>
          新增
        </Button>
      </div>
      <Table
        className={styles.table}
        columns={columns}
        dataSource={dataSource}
        size={'small'}
        rowKey="memberId"
        pagination={{
          total: returnCount, //数据总数
          current: pageNum, //当前页
          pageSize: limit, //每页条数
          onChange: onChangePage,
          hideOnSinglePage: true,
          showTitle: false,
        }}
      />
    </>
  );
};
export default Board;
