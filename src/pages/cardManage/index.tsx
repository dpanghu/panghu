/**
 * @author  zhangjn
 * @description 沟通
 */
import React from 'react';
import UploadFile from '@/components/UploadFile';
import styles from './index.less';
import { useMount, useReactive } from 'ahooks';
import { Button, Select, Table, Input, InputNumber, Tooltip, Pagination, Drawer, DatePicker, ConfigProvider, message, Modal, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import locale from 'antd/locale/zh_CN';
import { orgList, cardList, delCard, deptList, addCard, getCheckDetail, addCheck, cardExport, excelExport } from '@/services/public';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import moment from 'moment';

dayjs.locale('zh-cn');
/* Class */
type IState = {
    open: any; // 资源库弹窗
};
type Iprops = Record<any, string>;
const { RangePicker } = DatePicker;
const SignIn: React.FC<any> = () => {
    const state = useReactive<any>({
        selectedRowKeys: [],
        list: [],
        list1: [],
        fileLists: [],
        open1: false,
        previewfileList: [],
        open3: false,
        data: [
        ],
        end: false,
        value1: {
            fesThickness: '',
            envGrade: '',
        },
        open: false,
        cabinetList: [],
        value: {
            name: '',
            yonghu: '',
            phone: '',
            address: '',
            role: '',
            status: 1,
        },
        search: {
            orgId: '',
            search: '',
            status: '',
        },
        page: {
            limit: 10,
            pageNum: 1,
        },
        total: 6,
    });
    const column: any = [
        {
            title: '测试片编号',
            width: 170,
            render: (item: any) => {
                return <div style={{ color: '#5a73ff', cursor: 'pointer', width: 160 }}>{item.code}</div>
            }
        },
        {
            title: '单位名称',
            dataIndex: 'orgName',
            key: 'orgName',
            width: 150,
        },
        {
            title: '机柜间名称',
            dataIndex: 'cabinetName',
            key: 'cabinetName',
            width: 120,
        },
        {
            title: '放置地点',
            dataIndex: 'addr',
            key: 'addr',
            width: 100,
        },
        {
            title: '放置时间',
            dataIndex: 'setDate',
            key: 'setDate',
            width: 100,
        },
        {
            title: '放置联系人',
            width: 120,
            render: (item: any) => {
                return <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex' }}><div style={{ color: '#5a73ff' }}>{item.fillPerson}</div></div>
                    <div style={{ display: 'flex' }}><div style={{ color: '#5a73ff' }}>{item.tel}</div></div>
                </div>
            }
        },
        {
            title: '放置照片',
            width: 80,
            render: (item: any) => {
                return <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {
                        item.setPhotoUrl == '' ? "" : <div onClick={() => {
                            if (item.setPhotoUrl !== '') {
                                state.open3 = true;
                                state.fileLists = item.setPhotoUrl.split(',');
                            }
                        }} style={{ cursor: "pointer", color: "#5a73ff" }}>{item.setPhotoUrl == '' ? 0 : item.setPhotoUrl?.split(',').length}张</div>
                    }
                </div>
            }
        },
        // {
        //     title: '现场填报人',
        //     dataIndex: 'fillPerson',
        //     key: 'fillPerson',
        // },
        // {
        //     title: '联系方式',
        //     dataIndex: 'tel',
        //     key: 'tel',
        // },
        {
            title: '取出时间',
            width: 100,
            render: (item: any) => {
                return <div>{(item.sample == '' || item.sample == void 0) ? '' : item.sample?.qdate}</div>
            }
        },
        {
            title: '取出联系人',
            width: 120,
            render: (item: any) => {
                return <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex' }}><div style={{ color: '#5a73ff' }}>{item.sample?.name}</div></div>
                    <div style={{ display: 'flex' }}><div style={{ color: '#5a73ff' }}>{item.sample?.tel}</div></div>
                </div>
            }
        },
        {
            title: '取样照片',
            width: 80,
            render: (item: any) => {
                return <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {
                        item.maths == '' ? '' : <div onClick={() => {
                            if (item.maths !== '') {
                                state.open3 = true;
                                state.fileLists = item.maths.split(',');
                            }
                        }} style={{ cursor: "pointer", color: "#5a73ff" }}>{item.maths == '' ? 0 : item.maths?.split(',').length}张</div>
                    }
                </div>
            }
        },
        {
            title: '测试周期（天）',
            width: 130,
            render: (item: any) => {
                return <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* {item.setDate}
                    {moment(Number(item.sample?.createTime)).format('YYYY-MM-DD')} */}
                    {item.sample == void 0 ? '' : daysBetweenDates(item.setDate, moment(Number(item.sample?.createTime)).format('YYYY-MM-DD'))}
                </div>
            }
        },
        {
            title: '腐蚀产物厚度(埃)',
            width: 150,
            render: (item: any) => {
                return <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex' }}>银片：<div style={{ color: '#5a73ff' }}>{item.silverFesThickness}</div></div>
                    <div style={{ display: 'flex' }}>铜片：<div style={{ color: '#5a73ff' }}>{item.fesThickness}</div></div>
                </div>
            }
        },
        {
            title: '环境等级',
            dataIndex: 'envGrade',
            key: 'envGrade',
            width: 100,
        },
        {
            title: '挂片状态',
            align: 'center',
            width: 120,
            render: (item: any) => {
                return <div style={{ color: item.status == 3 ? 'red' : item.status == 2 ? '#108ee9' : 'green' }}>{item.status == 3 ? '已采样' : item.status == 2 ? '待采样' : '待取片'}</div>
            }
        },
        {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 210,
            render: (item: any) => {
                return <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    {
                        item.status !== 1 && <Tooltip title='采样'>
                            <div onClick={() => {
                                getCheckDetail({
                                    qrId: item.id,
                                }).then((res: any) => {
                                    let end: any = res.sample?.createTime;
                                    let ends: any = moment(Number(end)).format('YYYY-MM-DD');
                                    let start: any = res.checkpoint.setDate;
                                    let mid: any = daysBetweenDates(start, ends);

                                    // if (state.value1.testPeriod !== '' && state.value1.testPeriod !== void 0) {
                                    //     state.value1.testPeriod = item.testPeriod;
                                    // } else {
                                    //     state.value1.testPeriod = mid;
                                    // }
                                    state.value1.testPeriod = mid;
                                    state.value1.qrId = item.id;
                                    state.value1.fesThickness = item.fesThickness;
                                    state.value1.silverFesThickness = item.silverFesThickness;
                                    state.value1.envGrade = item.envGrade;
                                    console.log('13123121212312121', state.value1);
                                    state.open1 = true;
                                    state.value1.orgId = item.orgId;  
                                    if (item.status == 3) {
                                        state.end = true;
                                    } else {
                                        state.end = false;
                                    }
                                })
                            }} style={{ fontSize: 14, color: '#5a73ff', cursor: 'pointer' }}>{
                                    item.status == 2 ? '采样' : '查看采样'
                                }</div>
                        </Tooltip>
                    }
                    <Tooltip title='编辑'>
                        <div onClick={() => {
                            state.open = true;
                            deptList({
                                orgId: item.orgId,
                            }).then((res1: any) => {
                                state.list1 = res1.data;
                                let obj: any = JSON.parse(JSON.stringify(item));
                                delete obj.sample;
                                obj.cabinetId = obj.cabinet;
                                state.value = obj;
                                state.previewfileList = item.setPhotoUrl.split(',');
                            })
                            console.log('22222', state.value);
                        }} style={{ fontSize: 14, color: '#5a73ff', cursor: 'pointer', marginLeft: 12 }}>编辑</div>
                    </Tooltip>
                    <Tooltip title='删除'>
                        <div onClick={() => {
                            Modal.confirm({
                                title: '删除挂片',
                                content: '请确认是否要删除,一经删除不可恢复！',
                                onOk: async () => {
                                    await delCard({ id: item.id });
                                    message.success('删除成功！');
                                    getList();
                                },
                            })
                        }} style={{ marginLeft: 12, fontSize: 14, color: '#5a73ff', cursor: 'pointer' }} >删除</div>
                    </Tooltip>
                    {/* <Tooltip title='导出'>
                        <div onClick={() => {
                            message.warning('暂未开放');
                        }} style={{ marginLeft: 12, fontSize: 14, color: '#5a73ff', cursor: 'pointer' }} >导出</div>
                    </Tooltip> */}
                </div>
            }
        },
    ];

    useMount(() => {
        orgList({
            pageNum: 1,
            limit: 9999,
        }).then((res: any) => {
            state.list = res.data;
        });
        getList();
    });

    const validatePhoneNumber = (phoneNumber: string) => {
        // 中国手机号正则表达式
        const phoneRegex = /^1[3-9]\d{9}$/;

        // 测试输入的手机号是否符合正则表达式
        return phoneRegex.test(phoneNumber);
    }

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
        // cardList({
        //     pageNum: state.page.pageNum,
        //     limit: state.page.limit,
        // }).then((res: any) => {
        //     state.data = res.data;
        //     state.total = Number(res.total);
        // });
        cardList({
            ...state.page,
            ...state.search,
        }).then((res: any) => {
            state.total = Number(res.total);
            res.data && res.data.map((item: any) => {
                if (item.sample == void 0) {
                    item.maths = '';
                } else {
                    item.maths = item.sample?.photos;
                }
                if (item.setPhotoUrl == void 0) {
                    console.log('itwmnww', item);
                    item.setPhotoUrl = '';
                }
            })
            state.data = res.data;
            console.log('3132121312', state.data);
        });
    }

    const uploadProps: any = {
        show: false,
        uploadUrl: '',
        multiple: false,
        // 上传成功之后调用自定义附件保存接口
        onUploadSuccess: async (url: string, name: any) => {
            console.log(url, name);
        },
        onBeforeUpload: () => {
            return true;
        },
        onUploadFail: () => { },
    };

    const rowSelection: any = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            state.selectedRowKeys = selectedRowKeys;
        },
        selectedRowKeys: state.selectedRowKeys,
    };

    return (
        <div className={styles.sign_container}>
            <Modal footer={false} title='图片预览' onCancel={() => { state.open3 = false }} open={state.open3}>
                <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', minHeight: 400 }}>
                    {
                        state.fileLists && state.fileLists.map((item: any) => {
                            return <img onClick={() => { state.previewUrl = item; state.open4 = true }} style={{ width: 90, height: 90, marginRight: 24, marginTop: 24, cursor: 'pointer' }} src={item}></img>
                        })
                    }
                </div>
            </Modal>
            <Modal style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} footer={false} onCancel={() => { state.open4 = false }} open={state.open4}>
                <img src={state.previewUrl} style={{ width: 400, height: 400 }}></img>
            </Modal>
            <Modal width={state.end ? 400 : 500} title='采样信息' onCancel={() => { state.open1 = false }} open={state.open1} footer={false}>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 24, width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: 15 }}>
                        <div style={{ width: 190, display: 'flex', justifyContent: 'flex-end' }}>测试周期（天）：</div>
                        <div style={{ marginLeft: 12 }}>{state.value1.testPeriod}天</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: 15, marginTop: 20 }}>
                        <div style={{ width: 190, display: 'flex', justifyContent: 'flex-end' }}>铜片腐蚀产物厚度(埃)：</div>
                        <div style={{ marginLeft: 12 }}>
                            {
                                state.end ? <div>{state.value1.fesThickness}</div> : <Input value={state.value1.fesThickness} onChange={(e: any) => {
                                    state.value1.fesThickness = e.target.value;
                                    if (state.value1.silverFesThickness !== '') {
                                        if (Number(e.target.value) > state.value1.silverFesThickness) {
                                            let resmath: any = Number(e.target.value);
                                            if (resmath < 300) {
                                                state.value1.envGrade = 'G1';
                                            } else if (resmath > 299 && resmath < 1000) {
                                                state.value1.envGrade = 'G2';
                                            } else if (resmath > 1001 && resmath < 2000) {
                                                state.value1.envGrade = 'G3';
                                            } else {
                                                state.value1.envGrade = 'GX';
                                            }
                                        }
                                        if (Number(e.target.value) <= state.value1.silverFesThickness) {
                                            let resmath: any = state.value1.silverFesThickness;
                                            if (resmath < 200) {
                                                state.value1.envGrade = 'G1';
                                            } else if (resmath > 199 && resmath < 1000) {
                                                state.value1.envGrade = 'G2';
                                            } else if (resmath > 1001 && resmath < 2000) {
                                                state.value1.envGrade = 'G3';
                                            } else {
                                                state.value1.envGrade = 'GX';
                                            }
                                        }
                                    }
                                }} style={{ width: 200, height: 35 }} placeholder='请输入铜片腐蚀产物厚度(埃)'></Input>
                            }

                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: 15, marginTop: 20 }}>
                        <div style={{ width: 190, display: 'flex', justifyContent: 'flex-end' }}>银片腐蚀产物厚度(埃)：</div>
                        <div style={{ marginLeft: 12 }}>
                            {
                                state.end ? <div>{state.value1.silverFesThickness}</div> : <Input value={state.value1.silverFesThickness} onChange={(e: any) => {
                                    state.value1.silverFesThickness = e.target.value;
                                    if (state.value1.fesThickness !== '') {
                                        if (Number(e.target.value) > state.value1.fesThickness) {
                                            let resmath: any = Number(e.target.value);
                                            if (resmath < 300) {
                                                state.value1.envGrade = 'G1';
                                            } else if (resmath > 299 && resmath < 1000) {
                                                state.value1.envGrade = 'G2';
                                            } else if (resmath > 1001 && resmath < 2000) {
                                                state.value1.envGrade = 'G3';
                                            } else {
                                                state.value1.envGrade = 'GX';
                                            }
                                        }
                                        if (Number(e.target.value) <= state.value1.fesThickness) {
                                            let resmath: any = state.value1.fesThickness;
                                            if (resmath < 200) {
                                                state.value1.envGrade = 'G1';
                                            } else if (resmath > 199 && resmath < 1000) {
                                                state.value1.envGrade = 'G2';
                                            } else if (resmath > 1001 && resmath < 2000) {
                                                state.value1.envGrade = 'G3';
                                            } else {
                                                state.value1.envGrade = 'GX';
                                            }
                                        }
                                    }
                                }} style={{ width: 200, height: 35 }} placeholder='请输入银片腐蚀产物厚度(埃)'></Input>
                            }

                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: 15, marginTop: 20, marginBottom: 30 }}>
                        <div style={{ width: 190, display: 'flex', justifyContent: 'flex-end' }}>环境等级：</div>
                        <div style={{ marginLeft: 12 }}>
                            {
                                state.end ? <div>{state.value1.envGrade}</div> : <Select value={state.value1.envGrade} onChange={(e: any) => {
                                    state.value1.envGrade = e;
                                }} style={{ width: 200, height: 35 }}>
                                    <Select value={'G1'}>G1</Select>
                                    <Select value={'G2'}>G2</Select>
                                    <Select value={'G3'}>G3</Select>
                                    <Select value={'GX'}>GX</Select>
                                </Select>
                            }

                        </div>
                    </div>
                    <div style={{ display: state.end == true ? 'none' : 'flex', width: '100%', justifyContent: 'center' }}>
                        <Button onClick={() => { state.open1 = false }}>取消</Button>
                        <Button onClick={() => {
                            addCheck({
                                ...state.value1,
                                // orgId: 1,
                            }).then(() => {
                                message.success('提交成功');
                                state.open1 = false;
                                getList();
                            })
                        }} type='primary' style={{ marginLeft: 24 }}>提交</Button>
                    </div>
                </div>
            </Modal>
            <Drawer height={560} title="挂片维护" closeIcon={false} placement='top' onClose={() => { state.open = false }} open={state.open}>
                <div style={{ display: 'flex', flexDirection: "column", width: '100%', position: 'relative', height: '100%' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center' }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>挂片编号：</div>
                            <Input disabled onChange={(e: any) => {
                                state.value.id = e.target.value;
                            }} value={state.value.id} placeholder='请输入挂片编号' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20 }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>企业名称：</div>
                            <Select style={{ borderRadius: 4, marginLeft: 12, height: 38, width: '100%' }} placeholder={'请选择企业'} value={state.value.orgId} onChange={(e: any) => {
                                state.value.orgId = e;
                            }}>
                                {
                                    state.list.map((item: any) => {
                                        return <Select.Option value={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>

                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20 }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>机柜间名称：</div>
                            <Select style={{ borderRadius: 4, marginLeft: 12, height: 38, width: '100%' }} placeholder={'请选择机柜间'} value={state.value.cabinetId} onChange={(e: any) => {
                                state.value.cabinetId = e;
                            }}>
                                {
                                    state.list1.map((item: any) => {
                                        return <Select.Option value={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginTop: 16 }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>放置地点：</div>
                            <Input onChange={(e: any) => {
                                state.value.addr = e.target.value;
                            }} value={state.value.addr} placeholder='请输入放置地点' style={{ borderRadius: 4, marginLeft: 12, height: 38, marginTop: 1 }}></Input>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20, marginTop: 16 }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>放置时间：</div>
                            <Input onChange={(e: any) => {
                                state.value.setDate = e.target.value;
                            }} value={state.value.setDate} placeholder='请输入放置时间' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20, marginTop: 16 }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>现场填报人：</div>
                            <Input onChange={(e: any) => {
                                state.value.fillPerson = e.target.value;
                            }} value={state.value.fillPerson} placeholder='请输入现场填报人' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginTop: 16 }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>联系方式：</div>
                            <Input onChange={(e: any) => {
                                state.value.tel = e.target.value;
                            }} value={state.value.tel} placeholder='请输入联系方式' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20, marginTop: 16 }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>测试周期（天）：</div>
                            <InputNumber onChange={(e: any) => {
                                state.value.testPeriod = e.target.value;
                            }} value={state.value.testPeriod} placeholder='请输入测试周期' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></InputNumber>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 20, marginTop: 16 }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>银片腐蚀产物厚度(埃)：</div>
                            <Input disabled onChange={(e: any) => {
                                state.value.silverFesThickness = e.target.value;
                            }} value={state.value.silverFesThickness} placeholder='请输入腐蚀产物厚度(埃)' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 0, marginTop: 16 }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>铜片腐蚀产物厚度(埃)：</div>
                            <Input disabled onChange={(e: any) => {
                                state.value.fesThickness = e.target.value;
                            }} value={state.value.fesThickness} placeholder='请输入腐蚀产物厚度(埃)' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
                        </div>
                        <div style={{ width: '32%', display: "flex", alignItems: 'center', marginLeft: 0, marginTop: 16 }}>
                            <div style={{ minWidth: 170, display: 'flex', justifyContent: 'flex-end' }}><span style={{ color: 'red', marginRight: 5, marginTop: 1 }}>*</span>环境等级：</div>
                            <Input disabled onChange={(e: any) => {
                                state.value.envGrade = e.target.value;
                            }} value={state.value.envGrade} placeholder='请输入环境等级' style={{ borderRadius: 4, marginLeft: 12, height: 38 }}></Input>
                        </div>
                    </div>
                    <div style={{ display: 'flex', marginTop: 30 }}>
                        <div style={{ width: 150, display: 'flex', justifyContent: 'flex-end', marginRight: 32 }}>放置照片：</div>
                        {
                            state.previewfileList && state.previewfileList.map((item: any, index: any) => {
                                return <div style={{ position: 'relative', width: 80, height: 80, borderRadius: 3, cursor: 'pointer', marginRight: 14, background: 'rgb(245, 245, 245)' }}>
                                    <img style={{ width: 80, height: 80 }} src={item || ''}></img>
                                    {/* <div onClick={() => {
                                                let indexs: any = state.fileList.findIndex((item: any) => item.url == item);
                                                Toast.show({
                                                    icon: 'success',
                                                    content: '删除成功',
                                                })
                                                state.fileList.splice(indexs, 1);
                                            }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 15, height: 15, position: 'absolute', top: 0, right: 0, cursor: 'pointer', background: 'rgba(0, 0, 0, .7)', borderRadius: 3 }}>
                                                <CloseOutline style={{ color: 'white' }}></CloseOutline>
                                            </div> */}
                                </div>
                            })
                        }
                        {/* <UploadFile {...uploadProps}>
                            <Button type='default' style={{ marginLeft: 12, width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'rgba(0,0,0,0.02)', border: '1px dashed #d9d9d9' }}><PlusOutlined style={{ fontSize: 16, marginBottom: 4 }}></PlusOutlined><div>上传</div></Button>
                        </UploadFile> */}
                    </div>

                    <div style={{ width: '100%', position: 'absolute', bottom: 0, height: 50, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type='default' onClick={() => {
                            state.open = false;
                        }}>取消</Button>
                        <Button type='primary' onClick={() => {
                            if (state.value.tel !== '') {
                                if (validatePhoneNumber(state.value.tel)) {
                                    addCard({
                                        ...state.value,
                                        qrId: state.value.id,
                                    }).then(() => {
                                        message.success('操作成功');
                                        state.open = false;
                                        getList();
                                    });
                                } else {
                                    message.error('请输入正确的手机号');
                                }
                            }else {
                                message.error('请输入手机号');
                            }

                        }} style={{ background: '#5a73ff', marginLeft: 24 }}>保存</Button>
                    </div>
                </div>
            </Drawer>

            <div className={styles.head_title}>
                测试片管理
            </div>
            <div className={styles.searchBox}>
                <div className={styles.searchBoxs} style={{ marginLeft: 0 }}>
                    <div className={styles.search_title}>企业名称：</div>
                    <Select onChange={(e: any) => {
                        state.search.orgId = e;
                        deptList({
                            orgId: e,
                        }).then((res1: any) => {
                            state.cabinetList = res1.data;
                            state.search.cabinetId = '';
                            getList();
                        })
                    }} allowClear placeholder='请选择企业' value={state.search.orgId} style={{ width: 150, borderRadius: 4, marginLeft: 8 }}>
                        <Select.Option value={''}>{'全部'}</Select.Option>
                        {
                            state.list.map((item: any) => {
                                return <Select.Option value={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                </div>
                <div className={styles.searchBoxs}>
                    <div className={styles.search_title}>机柜间：</div>
                    <Select allowClear onChange={(e: any) => {
                        state.search.cabinetId = e;
                        getList();
                    }} value={state.search.cabinetId} placeholder={'请选择机柜间'} style={{ width: 150, borderRadius: 4, marginLeft: 12 }}>
                        {
                            state.cabinetList.map((item: any) => {
                                return <Select.Option value={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                </div>
                <div className={styles.searchBoxs} style={{ marginLeft: 24 }}>
                    <div className={styles.search_title}>测试片编号：</div>
                    <Input allowClear placeholder='请输入挂片编号' value={state.search.search} onChange={(e: any) => {
                        state.search.search = e.target.value;
                        getList();
                    }} style={{ width: 150, borderRadius: 4, marginLeft: 12 }}></Input>
                </div>
                <div className={styles.searchBoxs}>
                    <div className={styles.search_title}>状态：</div>
                    <Select allowClear onChange={(e: any) => {
                        state.search.status = e;
                        getList();
                    }} value={state.search.status} placeholder={'请选择挂片状态'} style={{ width: 150, borderRadius: 4, marginLeft: 12 }}>
                        <Select.Option value={''}>全部</Select.Option>
                        <Select.Option value={1}>待取片</Select.Option>
                        <Select.Option value={2}>待采样</Select.Option>
                        <Select.Option value={3}>已采样</Select.Option>
                    </Select>
                </div>
                {/* <div className={styles.searchBoxs}>
                    <div className={styles.search_title}>挂片时间：</div>
                    <ConfigProvider locale={locale}>
                        <RangePicker
                            style={{ width: 230, borderRadius: 4, marginLeft: 8 }}
                        />
                    </ConfigProvider>
                </div> */}
                {/* <div className={styles.searchBoxs}>
                    <div className={styles.search_title}>取片时间：</div>
                    <ConfigProvider locale={locale}>
                    <RangePicker
                    style={{ width: 230, borderRadius: 4, marginLeft: 8 }}
                    />
                    </ConfigProvider>
                </div> */}
                <div style={{ cursor: 'pointer', color: '#5a73ff', marginLeft: 24, display: 'flex', alignItems: 'center', paddingTop: 22 }}>重置</div>
            </div>
            <div className={styles.btn_box}>
                <Button type='default' onClick={() => {
                    if (state.selectedRowKeys.length == 0) {
                        message.warning('请先选择测试片');
                        return;
                    }
                    excelExport({
                        ids: state.selectedRowKeys.join(',')
                    }).then((res: any) => {
                        window.location.href = res;
                    })
                }} className={styles.btns}>导出列表</Button>
                <Button type='primary' onClick={() => {
                    if (state.selectedRowKeys.length == 0) {
                        message.warning('请先选择测试片');
                        return;
                    }
                    cardExport({
                        ids: state.selectedRowKeys.join(',')
                    }).then((res: any) => {
                        window.location.href = res;
                    })
                }}>导出报告</Button>
            </div>
            <div style={{ width: "calc(100vw - 320px)" }}>
                <Table rowKey={(item: any) => item.id} scroll={{
                    x: 1196,
                    y: 400
                }} rowSelection={{ ...rowSelection }} size={'small'} dataSource={state.data} pagination={false} columns={column} className={styles.table}>

                </Table>
            </div>
            <div className={styles.pagination}>
                <Pagination onChange={(page: any,limit: any)=> {
                    state.page.pageNum = page;
                    state.page.limit = limit;
                    getList();
                }} showTotal={(total: any) => `共 ${total} 条数据`} showSizeChanger size='small' total={state.total} pageSize={state.page.limit} current={state.page.pageNum}></Pagination>
            </div>
        </div>
    );
}

export default SignIn;
