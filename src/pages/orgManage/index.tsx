/**
 * @author  zhangjn
 * @description 沟通
 */
import React from 'react';
import styles from './index.less';
import { useMount, useReactive } from 'ahooks';
import { orgList, addOrg, delOrg } from '@/services/public';
import { Button, Select, Table, Input, Tooltip, Pagination, Drawer, Radio, ConfigProvider, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, DisconnectOutlined } from '@ant-design/icons';
import locale from 'antd/locale/zh_CN';
/* Class */
type IState = {
    open: any; // 资源库弹窗
    page: any;
    total: any;
};
type Iprops = Record<any, string>;
const SignIn: React.FC<any> = () => {
    const state = useReactive<any>({
        selectedRowKeys: [],
        page: {
            pageNum: '1',
            limit: '10',
        },
        total: '',
        search: '',
        data: [
        ],
        open: false,
        value: {
            name: '',
            yonghu: '',
            phone: '',
            address: '',
            role: '',
            status: 1,
        },
    });
    const column: any = [
        {
            title: '企业名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '企业编码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '企业地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '企业电话',
            dataIndex: 'telephone',
            key: 'telephone',
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
                            state.value = JSON.parse(JSON.stringify(item));
                        }} style={{ fontSize: 14, color: '#5a73ff', cursor: 'pointer' }}>编辑</div>
                        {/* <EditOutlined onClick={()=> {
              state.open = true;
              state.value = JSON.parse(JSON.stringify(item));
            }} style={{ fontSize: 17, color: '#5a73ff', cursor: 'pointer' }} /> */}
                    </Tooltip>
                    <Tooltip title='删除'>
                        <div onClick={() => {
                            Modal.confirm({
                                title: '删除企业',
                                content: '请确认是否要删除！',
                                onOk: async () => {
                                    await delOrg({ id: item.id });
                                    message.success('删除成功！');
                                    getList();
                                },
                            });
                        }} style={{ marginLeft: 17, fontSize: 14, color: '#5a73ff', cursor: 'pointer' }} >删除</div>
                    </Tooltip>
                </div>
            }
        },
    ];

    const rowSelection: any = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            state.selectedRowKeys = selectedRowKeys;
        },
        selectedRowKeys: state.selectedRowKeys,
    };

    useMount(() => {
        getList();
    });

    const getList = () => {
        orgList({
            ...state.page,
            search: state.search,
        }).then((res: any) => {
            state.total = Number(res.total);
            state.data = res.data;
            console.log('3132121312', state.data);
        });
    };

    return (
        <div className={styles.sign_container}>
            <Drawer height={300} title="企业管理" closeIcon={false} placement='top' onClose={() => { state.open = false }} open={state.open}>
                <div style={{ display: 'flex', flexDirection: "column", width: '100%', position: 'relative', height: '100%' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center' }}>
                            <div style={{ minWidth: 100, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>企业名称：</div>
                            <Input onChange={(e: any) => {
                                state.value.name = e.target.value;
                            }} value={state.value.name} placeholder='请输入企业名称' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20 }}>
                            <div style={{ minWidth: 100, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>企业地址：</div>
                            <Input onChange={(e: any) => {
                                state.value.address = e.target.value;
                            }} value={state.value.address} placeholder='请输入企业地址' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20 }}>
                            <div style={{ minWidth: 100, display: 'flex', justifyContent: 'flex-end' }}>企业电话：</div>
                            <Input onChange={(e: any) => {
                                state.value.telephone = e.target.value;
                            }} value={state.value.telephone} placeholder='请输入企业电话' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
                        </div>
                    </div>
                    <div style={{ width: '100%', position: 'absolute', bottom: 0, height: 50, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type='default' onClick={() => {
                            state.open = false;
                        }}>取消</Button>
                        <Button type='primary' onClick={() => {
                            addOrg({
                                ...state.value,
                            }).then((res: any) => {
                                message.success('操作成功');
                                state.open = false;
                                getList();
                            })
                        }} style={{ background: '#5a73ff', marginLeft: 24 }}>保存</Button>
                    </div>
                </div>
            </Drawer>

            <div className={styles.head_title}>
                企业管理
            </div>
            <div className={styles.searchBox}>
                {/* <div className={styles.searchBoxs} style={{ marginLeft: 0 }}>
          <div className={styles.search_title}>企业编码：</div>
          <Input placeholder='请输入企业编码' style={{ width: 200, borderRadius: 4, marginLeft: 12 }}></Input>
        </div> */}
                <div className={styles.searchBoxs} style={{ marginLeft: 0 }}>
                    <div className={styles.search_title}>企业名称：</div>
                    <Input placeholder='请输入企业名称' value={state.search} onChange={(e: any) => {
                        state.search = e.target.value;
                        getList();
                    }} style={{ width: 200, borderRadius: 4, marginLeft: 12 }}></Input>
                </div>
                <div style={{ cursor: 'pointer', color: '#5a73ff', marginLeft: 24, display: 'flex', alignItems: 'center', paddingTop: 22 }}>重置</div>
            </div>
            <div className={styles.btn_box}>
                <Button type='primary' onClick={() => {
                    state.open = true;
                    state.value = {
                        name: '',
                        yonghu: '',
                        phone: '',
                        address: '',
                        role: '',
                        status: 1,
                    }
                }}>新增企业</Button>
            </div>
            <Table size='small' dataSource={state.data} pagination={false} columns={column} className={styles.table}>

            </Table>
            <div className={styles.pagination}>
                <ConfigProvider locale={locale}>
                    <Pagination showTotal={(total: any) => `共 ${total} 条数据`} showSizeChanger size='small' total={state.total} pageSize={state.page.limit} current={state.page.pageNum}></Pagination>
                </ConfigProvider>
            </div>
        </div>
    );
}

export default SignIn;
