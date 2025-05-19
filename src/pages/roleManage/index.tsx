/**
 * @author  zhangjn
 * @description 沟通
 */
import React from 'react';
import styles from './index.less';
import { useMount, useReactive } from 'ahooks';
import { Button, Select, Table, Input, Tooltip, Pagination, Drawer, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, DisconnectOutlined } from '@ant-design/icons';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import { roleList, delRole, addRole, editRole } from '@/services/public';
import 'dayjs/locale/zh-cn';
import role from '../login/role';

dayjs.locale('zh-cn');
/* Class */
type IState = {
  open: any; // 资源库弹窗
};
type Iprops = Record<any, string>;
const SignIn: React.FC<any> = () => {
  const state = useReactive<any>({
    selectedRowKeys: [],
    data: [
    ],
    open: false,
    value: {
      roleKey: '',
      roleName: '',
    },
    page: {
      limit: 10,
      pageNum: 1,
    },
    total: 2,
  });
  const column: any = [
    {
        title: '编号',
        render: (item: any, items: any,index: any) => {
          return <div>{index + 1}</div>
        }
      },
    {
      title: '角色编码',
      dataIndex: 'roleKey',
      key: 'roleKey',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '操作',
      align: 'center',
      width: 150,
      render: (item: any) => {
        return <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <Tooltip title='编辑'>
            <div onClick={()=> {
              state.open = true;
              state.value = item;
            }} style={{ fontSize: 14, color: '#5a73ff', cursor: 'pointer' }} >编辑</div>
          </Tooltip>
          <Tooltip title='删除'>
            <div onClick={() => {
              Modal.confirm({
                title: '删除角色',
                content: '请确认是否要删除角色,一经删除不可恢复！',
                onOk: async () => {
                  await delRole({ ids: item.id });
                  message.success('删除成功！');
                  getList();
                },
              })
            }} style={{ marginLeft: 17, fontSize: 14, color: '#5a73ff', cursor: 'pointer' }} >删除</div>
          </Tooltip>
        </div>
      }
    },
  ];

  useMount(() => {
    getList();
  });


  const getList = () => {
    roleList({
      ...state.page
    }).then((res: any) => {
      state.total = Number(res.total);
      state.data = res.data;
    })
  }

  const rowSelection: any = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      state.selectedRowKeys = selectedRowKeys;
    },
    selectedRowKeys: state.selectedRowKeys,
  };

  return (
    <div className={styles.sign_container}>
      <Drawer height={200} title="角色管理" closeIcon={false} placement='top' onClose={() => { state.open = false }} open={state.open}>
        <div style={{ display: 'flex', flexDirection: "column", width: '100%', position: 'relative', height: '100%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ width: '32%', display: "flex", alignItems: 'center' }}>
              <div style={{ minWidth: 100, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color:'red',marginRight: 5,marginTop: 1 }}>*</span>角色编码：</div>
              <Input onChange={(e: any)=> {
                state.value.roleKey = e.target.value;
              }} value={state.value.roleKey} placeholder='请输入角色编码' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
            </div>
            <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20 }}>
              <div style={{ minWidth: 100, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color:'red',marginRight: 5,marginTop: 1 }}>*</span>角色名称：</div>
              <Input onChange={(e: any)=> {
                state.value.roleName = e.target.value;
              }} value={state.value.roleName} placeholder='请输入角色名称' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
            </div>
          </div>
          <div style={{ width: '100%', position: 'absolute', bottom: 0, height: 50, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='default' onClick={() => {
              state.open = false;
            }}>取消</Button>
            <Button onClick={()=> {
              if(state.value.id !== void 0) {
                editRole({
                  ...state.value,
                  roleSort: 1,
                  status: 1,
                  menuIds: '',
               }).then(()=> {
                  message.success('保存成功');
                  state.open = false;
                  getList();
               })
              }else {
                addRole({
                  ...state.value,
                  roleSort: 1,
                  status: 1,
                  menuIds: ''
                }).then(()=> {
                  message.success('保存成功');
                   state.open = false;
                   getList();
                })
              }
            }} type='primary' style={{ background: '#5a73ff', marginLeft: 24 }}>保存</Button>
          </div>
        </div>
      </Drawer>

      <div className={styles.head_title}>
        角色管理
      </div>
      <div className={styles.searchBox}>
        <div className={styles.searchBoxs} style={{ marginLeft: 0 }}>
          <div className={styles.search_title}>角色编码：</div>
          <Input placeholder='请输入角色编码' style={{ width: 200, borderRadius: 4, marginLeft: 12 }}></Input>
        </div>
        <div className={styles.searchBoxs}>
          <div className={styles.search_title}>角色名称：</div>
          <Input placeholder='请输入角色名称' style={{ width: 200, borderRadius: 4, marginLeft: 12 }}></Input>
        </div>
        <div style={{ cursor: 'pointer', color: '#5a73ff', marginLeft: 24, display: 'flex', alignItems: 'center', paddingTop: 22 }}>重置</div>
      </div>
      <div className={styles.btn_box}>
        <Button type='primary' onClick={() => {
          state.open = true;
          state.value = {
            roleKey: '',
            roleName: '',
          }
         }}>新增角色</Button>
      </div>
      <Table size={'small'} dataSource={state.data} pagination={false} columns={column} className={styles.table}>

      </Table>
      <div className={styles.pagination}>
        <Pagination showTotal={(total: any) => `共 ${total} 条数据`} showSizeChanger size='small' total={state.total} pageSize={state.page.limit} current={state.page.pageNum}></Pagination>
      </div>
    </div>
  );
}

export default SignIn;
