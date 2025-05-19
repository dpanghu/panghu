/**
 * @author  zhangjn
 * @description 沟通
 */
import React from 'react';
import styles from './index.less';
import { useMount, useReactive } from 'ahooks';
import { Button, Select, Table, Input, Tooltip, Pagination, Drawer, Radio, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, DisconnectOutlined } from '@ant-design/icons';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import { userList, delUser, roleList, addUser, editUser } from '@/services/public';
import 'dayjs/locale/zh-cn';

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
      name: '',
      loginName: '',
      phonenumber: '',
      email: '',
      role: '',
      status: 0,
    },
    page: {
      limit: 10,
      pageNum: 1,
    },
    roleData: [],
    total: 0,
  });
  const column: any = [
    {
      title: '用户名',
      dataIndex: 'loginName',
      key: 'loginName',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phonenumber',
      key: 'phonenumber',
    },
    {
      title: '角色',
      dataIndex: 'roleNames',
      key: 'roleNames',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '用户状态',
      render: (item: any) => {
        return <div style={{ color: 'green' }}>{item.status == 0 ? '启用' : '停用'}</div>
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 150,
      render: (item: any) => {
        return <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <Tooltip title='编辑'>
            <div onClick={() => {
              state.open = true;
              state.value = {
                ...item,
                status: Number(item.status)
              };
            }} style={{ fontSize: 14, color: '#5a73ff', cursor: 'pointer' }} >编辑</div>
          </Tooltip>
          <Tooltip title='删除'>
            <div onClick={() => {
              Modal.confirm({
                title: '删除用户',
                content: '请确认是否要删除用户,一经删除不可恢复！',
                onOk: async () => {
                  await delUser({ userIds: item.id });
                  message.success('删除成功！');
                  getList();
                },
              })
            }} style={{ marginLeft: 17, fontSize: 14, color: '#5a73ff', cursor: 'pointer' }} >删除</div>
          </Tooltip>
          <Tooltip title='停用'>
            <div onClick={() => {
              message.warning('暂未开放');
            }} style={{ marginLeft: 17, fontSize: 14, color: '#5a73ff', cursor: 'pointer' }} >停用</div>
          </Tooltip>
        </div>
      }
    },
  ];

  useMount(() => {
    getList();
    roleList({
      pageNum: 1,
      limit: 9999
    }).then((res: any) => {
      state.roleData = res.data;
    })
  });

  const getList = () => {
    userList({
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
      <Drawer height={300} title="用户管理" closeIcon={false} placement='top' onClose={() => { state.open = false }} open={state.open}>
        <div style={{ display: 'flex', flexDirection: "column", width: '100%', position: 'relative', height: '100%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ width: '32%', display: "flex", alignItems: 'center' }}>
              <div style={{ minWidth: 80, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>用户名：</div>
              <Input onChange={(e: any) => {
                state.value.loginName = e.target.value;
              }} value={state.value.loginName} placeholder='请输入用户名称' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
            </div>
            <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20 }}>
              <div style={{ minWidth: 80, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>姓名：</div>
              <Input onChange={(e: any) => {
                state.value.name = e.target.value;
              }} value={state.value.name} placeholder='请输入姓名' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
            </div>
            <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20 }}>
              <div style={{ minWidth: 80, display: 'flex', justifyContent: 'flex-end' }}>手机号：</div>
              <Input onChange={(e: any) => {
                state.value.phonenumber = e.target.value;
              }} value={state.value.phonenumber} placeholder='请输入手机号' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
            </div>
            <div style={{ width: '32%', display: "flex", alignItems: 'center', marginTop: 30 }}>
              <div style={{ minWidth: 80, display: 'flex', justifyContent: 'flex-end' }}>邮箱：</div>
              <Input onChange={(e: any) => {
                state.value.email = e.target.value;
              }} value={state.value.email} placeholder='请输入邮箱' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
            </div>
            <div style={{ width: '32%', display: "flex", alignItems: 'center', marginTop: 30, marginLeft: 20 }}>
              <div style={{ minWidth: 80, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>角色：</div>
              <Select onChange={(e: any) => {
                state.value.roleId = e;
              }} value={state.value.roleId} placeholder='请选择用户角色' style={{ borderRadius: 4, marginLeft: 12, width: '100%', height: 38 }}>
                {
                  state.roleData && state.roleData.map((item: any) => {
                    return <Select.Option value={item.id}>{item.roleName}</Select.Option>
                  })
                }
                {/* <Select.Option value={1}>管理员</Select.Option>
                <Select.Option value={1}>超级管理员</Select.Option> */}
              </Select>
            </div>
            <div style={{ width: '32%', display: "flex", alignItems: 'center', marginTop: 30, marginLeft: 20 }}>
              <div style={{ minWidth: 80, display: 'flex', justifyContent: 'flex-end' }}>状态：</div>
              <Radio.Group style={{ marginLeft: 12 }} onChange={(e: any) => {
                state.value.status = e.target.value;
              }} value={state.value.status}>
                <Radio value={0}>启用</Radio>
                <Radio value={1}>停用</Radio>
              </Radio.Group>
            </div>
          </div>
          <div style={{ width: '100%', position: 'absolute', bottom: 0, height: 50, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='default' onClick={() => {
              state.open = false;
            }}>取消</Button>
            <Button onClick={() => {
              console.log('value', state.value);
              if(state.value.id !== void 0) {
                editUser({
                  ...state.value,
                  roleNames: '',
               }).then(()=> {
                  message.success('保存成功');
                  state.open = false;
                  getList();
               })
              }else {
                addUser({
                  ...state.value
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
        用户管理
      </div>
      <div className={styles.searchBox}>
        <div className={styles.searchBoxs} style={{ marginLeft: 0 }}>
          <div className={styles.search_title}>用户名称：</div>
          <Input placeholder='请输入用户名称' style={{ width: 200, borderRadius: 4, marginLeft: 12 }}></Input>
        </div>
        <div className={styles.searchBoxs}>
          <div className={styles.search_title}>角色：</div>
          <Select placeholder='请选择用户角色' style={{ width: 200, borderRadius: 4, marginLeft: 12 }}>
            {
              state.roleData && state.roleData.map((item: any) => {
                return <Select.Option value={item.id}>{item.roleName}</Select.Option>
              })
            }
          </Select>
        </div>
        <div className={styles.searchBoxs}>
          <div className={styles.search_title}>用户状态：</div>
          <Select placeholder='请选择用户状态' style={{ width: 200, borderRadius: 4, marginLeft: 12 }}>
            <Select.Option value={1}>停用</Select.Option>
            <Select.Option value={1}>启用</Select.Option>
          </Select>
        </div>
        <div style={{ cursor: 'pointer', color: '#5a73ff', marginLeft: 24, display: 'flex', alignItems: 'center', paddingTop: 22 }}>重置</div>
      </div>
      <div className={styles.btn_box}>
        <Button type='default' className={styles.btns}>重置密码</Button>
        <Button type='primary' onClick={() => {
          state.open = true;
          state.value = {
            name: '',
            loginName: '',
            phonenumber: '',
            email: '',
            role: '',
            status: 0,
          }
        }}>新增用户</Button>
      </div>
      <Table rowKey={(item: any) => item.id} rowSelection={{ ...rowSelection }} size={'small'} dataSource={state.data} pagination={false} columns={column} className={styles.table}>

      </Table>
      <div className={styles.pagination}>
        <Pagination onChange={(page: any, limit: any) => {
          state.page.pageNum = page;
          state.page.limit = limit;
          getList();
        }} showTotal={(total: any) => `共 ${total} 条数据`} showSizeChanger size='small' total={state.total} pageSize={state.page.limit} current={state.page.pageNum}></Pagination>
      </div>
    </div>
  );
}

export default SignIn;
