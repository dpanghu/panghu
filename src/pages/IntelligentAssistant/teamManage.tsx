import React from 'react';
import { useMount, useReactive } from 'ahooks';
import styles from './index.less';
import layout1 from '@/assets/images/layout1.png';
import layout2 from '@/assets/images/layout2.png';
import layout3 from '@/assets/images/layout3.png';
import layout4 from '@/assets/images/layout4.png';
import { Table, Button, Modal, ComboBox, Input, Pagination } from 'SeenPc';
import { getTeamList, delTeams, getAllTeam, saveTeam } from '@/services/aiassistant';
import logos from '@/assets/images/seentao_logo.svg';
import { SearchOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { saveResult } from '@/services/dataVisualization';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
interface TState {
    layoutData: any;
    currentLayout: any;
    page: any;
    total1: any;
    limit: any;
    page1: any;
    role: any;
    limit1: any;
    search: any;
    data: any;
    open: any;
    currentRole: any;
    total: any;
    selectedRowKeys: any;
    selectedRowKeys1: any;
    team_id: any;
    account_id: any;
    data1: any;
    open1: any;

}
const role: any = {
    'normal': '普通用户',
    'admin': '管理员',
    'owner': '超级管理员'
}
const App: React.FC = () => {
    const state = useReactive<TState>({
        page: 1,
        limit: 10,
        page1: 1,
        currentRole: '',
        selectedRowKeys1: [],
        role: 'normal',
        total: 0,
        limit1: 10,
        search: '',
        selectedRowKeys: [],
        total1: 0,
        open: false,
        team_id: '',
        data1: [],
        open1: false,
        data: [],
        account_id: '',
        layoutData: [
            {
                name: '应用管理',
                id: '1',
            },
            {
                name: '知识库',
                id: '2',
            },
            {
                name: '团队管理',
                id: '3',
            },
            {
                name: '数据统计',
                id: '4',
            }
        ],
        currentLayout: '1'
    });


    const getList = () => {
        getTeamList({
            page: state.page,
            limit: state.limit,
        }).then((res: any) => {
            console.log(res);
            state.data = res.data;
            state.team_id = res.team_id;
            state.total = Number(res.total);
        })
    }

    const getLists = (params: any) => {
        getAllTeam({
            ...params
        }).then((res: any) => {
            console.log(res);
            state.data1 = res.data;
            state.total1 = Number(res.total);
        })
    }

    useMount(() => {
        state.currentRole = JSON.parse(
            (window.sessionStorage.getItem('commonDatas') as any) || '{}',
        ).currentRole;
        console.log('222',state.currentRole);
        getList();
    })

    const column = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '角色',
            render: (item: any) => {
                return <div>{role[item.role]}</div>
            }
        },
        {
            title: '最后操作时间',
            render: (item: any) => {
                return <div>{item.last_login_at && new Date(item.last_login_at * 1000).toLocaleString()}</div>
            }
        },
        {
            title: '操作',
            render: (item: any) => {
                return <div onClick={() => {
                    if (item.role == 'owner') {
                        message.warning('该角色为超级管理员，无法进行移除');
                    } else {
                        state.open = true; state.account_id = item.account_id
                    }
                }} style={{ cursor: "pointer", color: '#5a73ff',display: state.currentRole == 'normal' ? 'none' : 'flex' }}>移除</div>
            }
        },
    ]
    const column1 = [
        {
            title: '姓名',
            dataIndex: 'memberName',
            key: 'memberName',
        },
        {
            title: '账号',
            dataIndex: 'userName',
            key: 'userName',
        },
    ]

    const rowSelection = {
        selectedRowKeys: state.selectedRowKeys,
        onChange: (item: any, items: any) => {
            console.log(items);
            state.selectedRowKeys = item;
            state.selectedRowKeys1 = items;
        },
    };

    return (
        <div>
            <Modal title='移除成员' onCancel={() => { state.open = false }} onOk={() => {
                delTeams({
                    team_id: state.team_id,
                    account_id: state.account_id,
                }).then(() => {
                    state.open = false;
                    message.success('操作成功');
                    getList();
                })
            }} open={state.open} width={380}>
                <div style={{ fontSize: 15, marginLeft: 12 }}>确定移除该用户吗</div>
            </Modal>
            <Modal title='邀请成员' onCancel={() => { getList(); state.open1 = false }} onOk={() => {
                let members: any = [];
                state.selectedRowKeys1 && state.selectedRowKeys1.map((el: any) => {
                    members.push({
                        cloud_user_id: el.userId,
                        name: el.memberName,
                        account: el.userName
                    })
                })
                saveTeam({
                    role: state.role,
                    members: members,
                }).then((res: any) => {
                    console.log(res);
                    message.success(res.msg);
                    // state.open1 = false;
                    // getList();
                })
            }} open={state.open1}>
                <div style={{ display: 'flex', flexDirection: 'column', padding: 16 }}>
                    <div style={{ display: 'flex' }}>
                        <span style={{ width: 80 }}>用户类型：</span>
                        <ComboBox value={state.role} onChange={(e: any) => { state.role = e.target.value }} type='radio' options={[{
                            label: '普通用户',
                            value: 'normal',
                        }, {
                            label: '管理员',
                            value: 'admin',
                        }]}></ComboBox>
                    </div>
                    <div style={{ display: 'flex', marginTop: 16, flexDirection: 'column' }}>
                        <span style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>用户名：<Input allowClear={true} value={state.search} onChange={(e: any) => state.search = e} suffix={<SearchOutlined onClick={() => {
                            getLists({
                                pageNum: state.page1,
                                limit: state.limit1,
                                search: state.search,
                            });
                        }} style={{ cursor: 'pointer' }} />} style={{ marginLeft: 24 }}></Input></span>
                        <Table rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }} rowKey={(item: any) => item.memberId} pagination={false} dataSource={state.data1} columns={column1}></Table>
                        <Pagination onChange={(page, limit) => {
                            state.page1 = page;
                            getLists({
                                pageNum: state.page1,
                                limit: state.limit,
                                search: state.search,
                            });
                        }} pageSize={state.limit1} current={state.page1} total={state.total1} style={{ marginTop: 16, alignSelf: 'flex-end' }}></Pagination>
                    </div>
                </div>
            </Modal>
            <div style={{ display: 'flex', width: '100%', paddingLeft: 0, marginBottom: 20, justifyContent: 'space-between' }}>
                <div>我的团队</div>
                <Button style={{ display: state.currentRole == 'normal' ? 'none' : 'flex' }} type='primary' onClick={() => {
                    state.open1 = true;
                    state.selectedRowKeys = [];
                    state.selectedRowKeys1 = [];
                    state.search = '';
                    state.page1 = 1;
                    state.limit1 = 10;
                    getLists({
                        pageNum: 1,
                        limit: 10,
                        search: '',
                    });
                }}>邀请成员</Button>
            </div>
            <Table pagination={false} dataSource={state.data} columns={column}></Table>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination onChange={(page, limit) => {
                            state.page = page;
                            state.limit = limit;
                            getList();
                        }} pageSize={state.limit} current={state.page} total={state.total} style={{ marginTop: 16 }}></Pagination>
            </div>

        </div>
    );
};

export default App;
