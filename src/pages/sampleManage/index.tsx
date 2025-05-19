/**
 * @author  zhangjn
 * @description 沟通
 */
import React from 'react';
import styles from './index.less';
import { useMount, useReactive } from 'ahooks';
import { sampleList, addOrg, delSample, cardList, addCheck, getCheckDetail } from '@/services/public';
import { Button, Select, Table, Input, Tooltip, Pagination, Drawer, DatePicker, ConfigProvider, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, DisconnectOutlined } from '@ant-design/icons';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import moment from 'moment';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
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
        end: false,
        value1: {
            fesThickness: '',
            envGrade: '',
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
        open1: false,
    });

    const getDate: any = (dates: any) => {

        // 使用该时间戳创建一个新的 Date 对象
        let date: any = new Date(dates);

        // 提取年、月、日、小时、分钟和秒
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需加1，并格式化为两位数
        let day = ('0' + date.getDate()).slice(-2); // 格式化为两位数
        let hours = ('0' + date.getHours()).slice(-2); // 格式化为两位数
        let minutes = ('0' + date.getMinutes()).slice(-2); // 格式化为两位数
        let seconds = ('0' + date.getSeconds()).slice(-2); // 格式化为两位数

        // 将这些部分组合成一个易读的日期时间字符串
        let readableDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        return readableDateTime;
    }
    const column: any = [
        {
            title: '挂片编号',
            render: (item: any) => {
                return <div style={{ color: '#5a73ff', cursor: 'pointer' }}>{item.code}</div>
            }
        },
        {
            title: '单位信息',
            dataIndex: 'orgId',
            key: 'orgId',
        },
        {
            title: '放置地点',
            dataIndex: 'addr',
            key: 'addr',
        },
        {
            title: '放置时间',
            dataIndex: 'setDate',
            key: 'setDate',
        },
        {
            title: '现场填报人',
            dataIndex: 'fillPerson',
            key: 'fillPerson',
        },
        {
            title: '联系方式',
            dataIndex: 'tel',
            key: 'tel',
        },
        {
            title: '挂片状态',
            render: (item: any) => {
                return <div style={{ color: item.status == 3 ? 'red' : 'green' }}>{item.status == 3 ? '已采样' : '待采样'}</div>
            }
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            render: (item: any) => {
                return <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    {/* <div onClick={() => {
                        message.warning('暂无权限');
                    }} style={{ fontSize: 14, color: '#5a73ff', cursor: 'pointer' }} >
                        取片信息
                    </div> */}
                    <div onClick={() => {
                        getCheckDetail({
                            qrId: item.id,
                        }).then((res: any)=> {                     
                            let end: any = res.sample?.createTime;
                            let ends: any = moment(Number(end)).format('YYYY-MM-DD');
                            let start: any = res.checkpoint.setDate;
                            let mid: any = daysBetweenDates(start,ends);
                            console.log(mid);
                            if(state.value1.testPeriod !== '') {
                                state.value1.testPeriod = item.testPeriod;
                            }else {
                                state.value1.testPeriod = mid;
                            }
                        
                            state.value1.qrId = item.id;
                            state.value1.fesThickness = item.fesThickness;
                            state.value1.envGrade = item.envGrade;
                            state.open1 = true;
                            if(item.status == 3) {
                                state.end = true;
                            }else {
                                state.end = false;
                            }
                        })
                    }} style={{ fontSize: 14, marginLeft: 0, color: '#5a73ff', cursor: 'pointer' }} >
                      {item.status == 3 ? '查看采样' : '采样'}
                    </div>  
                    {/* <div onClick={() => {
                        message.warning('暂无权限');
                    }} style={{ fontSize: 14, marginLeft: 16, color: '#5a73ff', cursor: 'pointer' }} >
                        预览
                    </div> */}
                    {/* <Tooltip title='编辑'>
                        <EditOutlined onClick={() => {
                            state.open = true;
                            state.value = JSON.parse(JSON.stringify(item));
                        }} style={{ fontSize: 17, color: '#5a73ff', cursor: 'pointer' }} />
                    </Tooltip>
                    <Tooltip title='删除'>
                        <DeleteOutlined onClick={() => {
                            Modal.confirm({
                                title: '删除企业',
                                content: '请确认是否要删除！',
                                onOk: async () => {
                                    await delOrg({ id: item.id });
                                    message.success('删除成功！');
                                    getList();
                                },
                            });
                        }} style={{ marginLeft: 17, fontSize: 17, color: '#5a73ff', cursor: 'pointer' }} />
                    </Tooltip> */}
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

    const daysBetweenDates = (date1Str: any, date2Str: any) => {
        // 解析日期字符串为Date对象
        const date1: any = new Date(date1Str.replace(/-/g, '/')); // 有些浏览器可能不支持yyyy-mm-dd格式，所以替换为yyyy/mm/dd
        const date2: any = new Date(date2Str.replace(/-/g, '/'));
     
        // 计算时间差（毫秒）
        const timeDiff = Math.abs(date2 - date1);
     
        // 将时间差转换为天数（1天 = 24小时 * 60分钟 * 60秒 * 1000毫秒）
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 使用Math.ceil来确保得到整数天数，包括开始和结束日期不在同一天的情况下的部分天数
     
        // 注意：如果你想要得到两个日期之间的完整天数差（不包括结束日期当天），则使用Math.floor而不是Math.ceil
        // const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
     
        return daysDiff;
    }

    const getList = () => {
        cardList({
            ...state.page,
        }).then((res: any) => {
            state.total = Number(res.total);
            res.data && res.data.map((item: any)=> {
                if(item.testPeriod !== '' && item.envGrade !== '' && item.fesThickness !== '') {
                    item.status = 3
                }
                console.log(item);
            })
            state.data = res.data;
            console.log('3132121312', state.data);
        });
    };

    return (
        <ConfigProvider locale={locale}>
            <div className={styles.sign_container}>
                <Modal width={state.end ? 350 : 500} title='采样信息' onCancel={()=> { state.open1 = false }} open={state.open1} footer={false}>
                    <div style={{ display:'flex',flexDirection:'column',marginTop: 24,width:'100%'}}>
                        <div style={{ display:'flex',alignItems:'center',width:'100%',paddingLeft: 15 }}>
                            <div style={{ width: 150,display:'flex',justifyContent:'flex-end' }}>测试周期（天）：</div>
                            <div style={{ marginLeft: 12 }}>{state.value1.testPeriod}天</div>
                        </div>
                        <div style={{ display:'flex',alignItems:'center',width:'100%',paddingLeft: 15,marginTop: 20 }}>
                            <div style={{ width: 150,display:'flex',justifyContent:'flex-end' }}>腐蚀产物厚度(埃)：</div>
                            <div style={{ marginLeft: 12 }}>
                                {
                                    state.end ? <div>{state.value1.fesThickness}</div> : <Input value={state.value1.fesThickness} onChange={(e: any)=> {
                                        state.value1.fesThickness = e.target.value;
                                    }} style={{ width: 200,height: 35 }} placeholder='请输入腐蚀产物厚度(埃)'></Input>
                                }
                                
                            </div>
                        </div>
                        <div style={{ display:'flex',alignItems:'center',width:'100%',paddingLeft: 15,marginTop: 20,marginBottom: 30 }}>
                            <div style={{ width: 150,display:'flex',justifyContent:'flex-end' }}>环境等级：</div>
                            <div style={{ marginLeft: 12 }}>
                            {
                                    state.end ? <div>{state.value1.envGrade}</div> :  <Input value={state.value1.envGrade} onChange={(e: any)=> {
                                        state.value1.envGrade = e.target.value;
                                    }} style={{ width: 200,height: 35 }} placeholder='请输入环境等级'></Input>
                                }
                               
                            </div>
                        </div>
                        <div style={{ display: state.end == true ? 'none' : 'flex',width:'100%',justifyContent:'center' }}>
                            <Button onClick={()=> { state.open1 = false }}>取消</Button>
                            <Button onClick={()=> {
                                addCheck({
                                    ...state.value1,
                                    orgId: 1,
                                }).then(()=> {
                                    message.success('提交成功');
                                    state.open1 = false;
                                    getList();
                                })
                            }} type='primary' style={{ marginLeft: 24 }}>提交</Button>
                        </div>
                    </div>
                </Modal>
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
                    采样管理
                </div>
                <div className={styles.searchBox}>
                    <div className={styles.searchBoxs} style={{ marginLeft: 0 }}>
                        <div className={styles.search_title}>挂片编号：</div>
                        <Input placeholder='请输入挂片编号' value={state.search} onChange={(e: any) => {
                            state.search = e.target.value;
                            getList();
                        }} style={{ width: 200, borderRadius: 4, marginLeft: 12 }}></Input>
                    </div>
                    <div className={styles.searchBoxs} style={{ marginLeft: 12 }}>
                        <div className={styles.search_title}>挂片状态：</div>
                        <Select style={{ width: 200, borderRadius: 4, marginLeft: 12 }}>
                            <Select.Option value={0}>全部</Select.Option>
                            <Select.Option value={1}>待取片</Select.Option>
                            <Select.Option value={2}>待采样</Select.Option>
                            <Select.Option value={3}>已采样</Select.Option>
                        </Select>
                        {/* <Input placeholder='请输入挂片编号' value={state.search} onChange={(e: any) => {
                            state.search = e.target.value;
                            getList();
                        }} style={{ width: 200, borderRadius: 4, marginLeft: 12 }}></Input> */}
                    </div>
                    {/* <div className={styles.searchBoxs} style={{ marginLeft: 24 }}>
                        <div className={styles.search_title}>采样时间：</div>
                        <DatePicker
                            allowClear
                            placeholder='请输入采样时间'
                            onChange={(value, dateString) => {
                                console.log('Selected Time: ', value);
                                console.log('Formatted Selected Time: ', dateString);
                            }}
                            style={{ width: 200, borderRadius: 4, marginLeft: 12 }}
                        /> */}
                    {/* <Input placeholder='请输入企业名称' value={state.search} onChange={(e: any)=> {
            state.search = e.target.value;
            getList();
          }} style={{ width: 200, borderRadius: 4, marginLeft: 12 }}></Input> */}
                    {/* </div> */}
                    {/* <div style={{ cursor: 'pointer', color: '#5a73ff', marginLeft: 24, display: 'flex', alignItems: 'center', paddingTop: 22 }}>重置</div> */}
                </div>
                {/* <div className={styles.btn_box}>
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
                }}>新增采样</Button>
            </div> */}
                <Table size='small' dataSource={state.data} pagination={false} columns={column} className={styles.table}>

                </Table>
                <div className={styles.pagination}>
                    <Pagination showTotal={(total: any) => `共 ${total} 条数据`} showSizeChanger size='small' total={state.total} pageSize={state.page.limit} current={state.page.pageNum}></Pagination>
                </div>
            </div>
        </ConfigProvider>
    );
}

export default SignIn;
