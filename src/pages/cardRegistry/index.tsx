/**
 * @author  zhangjn
 * @description 沟通
 */
import React from 'react';
import styles from './index.less';
import { useReactive, useMount } from 'ahooks';
import { orgList, addSample, checkSample, addCard, Upload, deptList } from '@/services/public';
import { CloseOutline, FillinOutline } from 'antd-mobile-icons'
import {
    Form,
    Input,
    Button,
    Dialog,
    TextArea,
    Selector,
    Slider,
    Stepper,
    CalendarPicker,
    Modal,
    Switch,
    Picker,
    Toast,
    ImageUploader,
} from 'antd-mobile'
import { FlagTwoTone, PlusCircleFilled, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { message, Select } from 'antd';

/* Class */
type IState = {
    open: any; // 资源库弹窗
};
type Iprops = Record<any, string>;
const SignIn: React.FC<any> = () => {
    const state = useReactive<any>({
        selectedRowKeys: [],
        visible1: false,
        visible2: false,
        previewDatas: {},
        orgData: {},
        cabinetData: [],
        list1: [],
        fileList: [],
        status: 1,
        disable: false,
        columns: [
            [
                { label: '周一', value: 'Mon' },
                { label: '周二', value: 'Tues' },
                { label: '周三', value: 'Wed' },
                { label: '周四', value: 'Thur' },
                { label: '周五', value: 'Fri' },
            ],
            [
                { label: '上午', value: 'am' },
                { label: '下午', value: 'pm' },
            ],
        ],
        list: [],
        data: {
            qrId: '',
            tel: '',
            name: '',
            cabinet: '',
            setDate: '',
            addr: '',
            fillPerson: '',
            testPeriod: '',
            fesThickness: '',
            envGrade: '',
        },
        open: false,
        value: {
            name: '',
            yonghu: '',
            phone: '',
            address: '',
            role: '',
            status: 1,
        },
        page: {
            limit: 10,
            pageNum: 1,
        },
        total: 6,
    });
    const column: any = [
        {
            title: '挂片编号',
            render: (item: any) => {
                return <div style={{ color: '#5a73ff', cursor: 'pointer' }}>{item.a1}</div>
            }
        },
        {
            title: '挂片位置',
            dataIndex: 'a2',
            key: 'a2',
        },
        {
            title: '挂片时间',
            dataIndex: 'a3',
            key: 'a3',
        },
        {
            title: '取片时间',
            dataIndex: 'a4',
            key: 'a4',
        },
        {
            title: '联系人',
            dataIndex: 'a5',
            key: 'a5',
        },
        {
            title: '挂片状态',
            render: (item: any) => {
                return <div style={{ color: 'green' }}>{'待取'}</div>
            }
        },
    ];

    useMount(() => {
        state.data.qrId = window.location.search.split('qrId=')[1];
        checkSample({
            qrId: window.location.search.split('qrId=')[1],
        }).then((res: any) => {
            console.log(res);
            if (res.checkpoint !== void 0) {
                state.status = 3;
                state.data.qdate = getCurrentDate();
                if (res.sample !== void 0) {
                    state.disable = true;
                    state.data.qdate = getCurrentDate();
                    state.data = res.sample;
                }
                deptList({
                    orgId: res.checkpoint.orgId,
                    pageNum: 1,
                    limit: 999
                }).then((res1: any)=> {
                    res1.data && res1.data.map((items: any)=>{
                        items.value = items.id;
                        items.label = items.name;
                    })
                    state.list1 = res1.data;
                })
            } else {
                state.data.setDate = getCurrentDate();
                state.status = 2;
            }
            state.previewDatas = res.checkpoint;
        })
        orgList({
            pageNum: 1,
            limit: 9999,
        }).then((res: any) => {
            res.data && res.data.map((item: any) => {
                item.value = item.id;
                item.label = item.name;
            });
            state.list = res.data;
        });
    })

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1，并使用padStart确保是两位数
        const day = String(now.getDate()).padStart(2, '0'); // 使用padStart确保日期是两位数

        return `${year}-${month}-${day}`;
    }

    const validatePhoneNumber = (phoneNumber: string) => {
        // 中国手机号正则表达式
        const phoneRegex = /^1[3-9]\d{9}$/;
        
        // 测试输入的手机号是否符合正则表达式
        return phoneRegex.test(phoneNumber);
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
            {
                state.status == 3 ? <>
                    <div className={styles.head}><FillinOutline style={{ marginRight: 10, fontSize: 20 }}></FillinOutline>取样登记</div>
                    <div className={styles.subtitle}>请按实际情况如实填写登记信息</div>
                    <div className={styles.forms}>
                        <div className={styles.subtitles}>1. 单位信息</div>
                        <Select disabled style={{ width: '100%', borderRadius: 10, height: 45, marginTop: 12 }} value={state.previewDatas.orgId}>
                            {
                                state.list && state.list.map((item: any) => {
                                    return <Select.Option value={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                        {/* <Input
                            className={styles.forms_input}
                            disabled
                            style={{ width: '100%', borderRadius: 10 }}
                            value={state.previewDatas.orgName}
                            placeholder='请输入联系电话'
                           
                        /> */}
                    </div>
                    <div className={styles.forms}>
                        <div className={styles.subtitles}>2. 机柜间名称</div>
                        <Select disabled style={{ width: '100%', borderRadius: 10, height: 45, marginTop: 12 }} value={state.previewDatas.cabinet}>
                            {
                                state.list1 && state.list1.map((item: any) => {
                                    return <Select.Option value={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                        {/* <Input
                            className={styles.forms_input}
                            disabled
                            style={{ width: '100%', borderRadius: 10 }}
                            value={state.previewDatas.cabinet}
                            placeholder='请输入联系电话'

                        /> */}
                    </div>
                    <div className={styles.forms}>
                        <div className={styles.subtitles}>3. 放置地点</div>
                        <Input
                            className={styles.forms_input}
                            disabled
                            style={{ width: '100%', borderRadius: 10 }}
                            value={state.previewDatas.addr}
                            placeholder='请输入联系电话'
                            onChange={(e: any) => {
                                state.data.tel = e;
                            }}
                        />
                    </div>
                    <div className={styles.forms}>
                        <div className={styles.subtitles}>4. 取样时间<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                        <div style={{ display: "flex", alignItems: 'center' }}>
                            {/* <Button disabled size='small' color='primary' style={{ height: 35, marginTop: 15, paddingLeft: 10, paddingRight: 10 }} onClick={() => { state.visible1 = true }}>选择日期</Button> */}
                            <CalendarPicker
                                visible={state.visible1}
                                selectionMode='single'
                                
                                onChange={(e: any) => {
                                    state.data.qdate = moment(e).format('YYYY-MM-DD');
                                }}
                                value={new Date(state.data.qdate)}
                                onClose={() => {
                                    state.visible1 = false;
                                }}
                                onMaskClick={() => {
                                    state.visible1 = false;
                                }}
                            />
                            {
                                state.data.qdate ? <div style={{ marginLeft: 16, marginTop: 14, fontSize: 16, color: 'red' }}>{state.data.qdate}</div> : <div style={{ marginLeft: 12, marginTop: 14 }}>{'未选择'}</div>
                            }
                        </div>
                    </div>
                    <div className={styles.forms}>
                        <div className={styles.subtitles}>5. 现场填报人<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                        <Input
                            className={styles.forms_input}
                            style={{ width: '100%', borderRadius: 6 }}
                            value={state.data.name}
                            disabled={state.disable}
                            placeholder='请输入现场填报人'
                            onChange={(e: any) => {
                                state.data.name = e;
                            }}
                        />
                    </div>
                    <div className={styles.forms}>
                        <div className={styles.subtitles}>6. 联系方式<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                        <Input
                            className={styles.forms_input}
                            disabled={state.disable}
                            style={{ width: '100%', borderRadius: 10 }}
                            value={state.data.tel}
                            placeholder='请输入联系电话'
                            onChange={(e: any) => {
                                state.data.tel = e;
                            }}
                        />
                    </div>
                    <div className={styles.forms} style={{ marginBottom: 200 }}>
                        <div className={styles.subtitles} style={{ marginBottom: 15 }}>7. 取样照片<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                        <div style={{ display: 'flex' }}>
                            {
                                state.fileList && state.fileList.map((item: any, index: any) => {
                                    return <div style={{ position: 'relative', width: 80, height: 80, borderRadius: 3, cursor: 'pointer', marginRight: 14, background: 'rgb(245, 245, 245)' }}>
                                        <img style={{ width: 80, height: 80 }} src={item.url}></img>
                                        <div onClick={() => {
                                            let indexs: any = state.fileList.findIndex((item: any) => item.url == item);
                                            Toast.show({
                                                icon: 'success',
                                                content: '删除成功',
                                            })
                                            state.fileList.splice(indexs, 1);
                                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 15, height: 15, position: 'absolute', top: 0, right: 0, cursor: 'pointer', background: 'rgba(0, 0, 0, .7)', borderRadius: 3 }}>
                                            <CloseOutline style={{ color: 'white' }}></CloseOutline>
                                        </div>
                                    </div>
                                })
                            }
                            <ImageUploader
                                value={state.fileList}
                                onDelete={(e: any) => {
                                    console.log('31232112', e);
                                }}
                                children={<div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f5f5f5', borderRadius: 3 }}>
                                    <PlusOutlined style={{ fontSize: 20 }}></PlusOutlined>
                                </div>}
                                upload={(file: any) => {
                                    Upload({
                                        fileName: file.name,
                                        moduleName: 'test'
                                    }).then((res: any) => {
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        Object.keys(res.tokenParams).forEach((key) => {
                                            formData.append(key, res.tokenParams[key]);
                                        });
                                        fetch(res.endpoint, {
                                            method: 'POST',
                                            body: formData,
                                        })
                                            .then(() => {
                                                state.fileList.push({
                                                    url: res.file_url
                                                });
                                            })
                                            .catch(() => {
                                            });
                                    })
                                    return {

                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, border: '1px solid #ddd', position: 'fixed', bottom: 0, width: '100%', zIndex: 90, background: 'white' }}>
                        <Button onClick={() =>
                            Modal.confirm({
                                content: '注意：提交之后不可修改',
                                onConfirm: async () => {
                                    let setPhotoUrls: any = [];
                                    state.fileList && state.fileList.map((item: any) => {
                                        setPhotoUrls.push(item.url);
                                    });
                                    if(state.data.tel !== '') {
                                        if(validatePhoneNumber(state.data.tel)) {
                                            addSample({
                                                ...state.data,
                                                orgId: state.orgData.id,
                                                photos: setPhotoUrls.length == 0 ? '' : setPhotoUrls.join(','),
                                            }).then(() => {
                                                Toast.show({
                                                    icon: 'success',
                                                    content: '提交成功',
                                                });
                                                state.disable = true;
                                            })
                                        }else {
                                            Toast.show({
                                                icon: 'fail',
                                                content: '请输入正确的手机号',
                                            })
                                        }
                                    }else {
                                        Toast.show({
                                            icon: 'fail',
                                            content: '请输入手机号',
                                        })
                                    }

                                },
                            })
                        } className={styles.submit} disabled={state.disable} block color='danger' size='large'>
                            {
                                state.disable ? '已提交' : '提交'
                            }
                        </Button>
                    </div></> : state.status == 2 ? <>
                        <div className={styles.head}><FillinOutline style={{ marginRight: 10, fontSize: 20 }}></FillinOutline>挂片登记</div>
                        <div className={styles.subtitle}>请按实际情况如实填写登记信息</div>
                        {/* <div className={styles.forms}>
                            <div className={styles.subtitles}>1. 挂片编号<div style={{ fontSize: 14, color: '#999' }}>（必填，唯一标识）</div></div>
                            <Input
                                className={styles.forms_input}
                                style={{ width: '100%', borderRadius: 6 }}
                                value={state.data.code}
                                 placeholder='请输入'
                                onChange={(e: any) => {
                                    state.data.code = e;
                                }}
                            />
                        </div> */}
                        <div className={styles.forms}>
                            <div className={styles.subtitles}>1. 单位信息<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Picker
                                    columns={[state.list]}
                                    value={[state.orgData.id]}
                                    onConfirm={(v: any) => {
                                        deptList({
                                            orgId: v[0],
                                            pageNum: 1,
                                            limit: 999
                                        }).then((res1: any)=> {
                                            res1.data && res1.data.map((items: any)=>{
                                                items.value = items.id;
                                                items.label = items.name;
                                            })
                                            state.list1 = res1.data;
                                            let name: any = state.list.find((item: any) => item.id === v[0]);
                                            state.orgData = name;
                                            state.visible2 = false;
                                        })
                                        
                                    }}
                                >
                                    {(_, actions) => <Button size='small' color='primary' style={{ width: '20%', height: 35, marginTop: 15 }} onClick={actions.open}>选择</Button>}
                                </Picker>
                                {
                                    state.orgData.id ? <div style={{ marginLeft: 16, marginTop: 12, fontSize: 16, color: 'red' }}>{state.orgData.name}</div> : <div style={{ marginLeft: 12, marginTop: 14 }}>{'未选择'}</div>
                                }
                            </div>
                        </div>
                        <div className={styles.forms}>
                            <div className={styles.subtitles}>2. 机柜间名称<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Picker
                                    columns={[state.list1]}
                                    value={[state.cabinetData.id]}
                                    onConfirm={(v: any) => {
                                        let name: any = state.list1.find((item: any) => item.id === v[0]);
                                        state.cabinetData = name || {};
                                        state.visible2 = false;
                                    }}
                                >
                                    {(_, actions) => <Button size='small' color='primary' style={{ width: '20%', height: 35, marginTop: 15 }} onClick={actions.open}>选择</Button>}
                                </Picker>
                                {
                                    state.cabinetData.id ? <div style={{ marginLeft: 16, marginTop: 12, fontSize: 16, color: 'red' }}>{state.cabinetData.name}</div> : <div style={{ marginLeft: 12, marginTop: 14 }}>{'未选择'}</div>
                                }
                            </div>
                            {/* <Input
                                className={styles.forms_input}
                                style={{ width: '100%', borderRadius: 6 }}
                                value={state.data.cabinet}
                                placeholder='请输入机柜间名称'
                                onChange={(e: any) => {
                                    state.data.cabinet = e;
                                }}
                            /> */}
                        </div>
                        <div className={styles.forms}>
                            <div className={styles.subtitles}>3. 放置地点<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                            <Input
                                className={styles.forms_input}
                                style={{ width: '100%', borderRadius: 6 }}
                                value={state.data.addr}
                                placeholder='请输入放置地点'
                                onChange={(e: any) => {
                                    state.data.addr = e;
                                }}
                            />
                        </div>
                        <div className={styles.forms}>
                            <div className={styles.subtitles}>4. 放置时间<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                            {/* <Input
                                className={styles.forms_input}
                                style={{ width: '100%', borderRadius: 6 }}
                                value={state.data.setDate}
                                placeholder='请输入挂片时间，例：2025-01-01'
                                onChange={(e: any) => {
                                    state.data.setDate = e;
                                }}
                            /> */}
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                {/* <Button disabled size='small' color='primary' style={{ paddingLeft: 10, paddingRight: 10, height: 35, marginTop: 15 }} onClick={() => { state.visible1 = true }}>选择日期</Button> */}

                                <CalendarPicker
                                    visible={state.visible1}
                                    selectionMode='single'
                                    onConfirm={(e: any) => {
                                        if(e == null) {
                                            Toast.show({
                                                icon: 'fail',
                                                content: '请选择正确的放置时间 ',
                                            })
                                        }else {
                                            state.data.setDate = moment(e).format('YYYY-MM-DD');
                                        }
                                        // state.data.setDate = moment(e).format('YYYY-MM-DD');
                                    }}
                                    onClose={() => {
                                        state.visible1 = false;
                                    }}
                                    onMaskClick={() => {
                                        state.visible1 = false;
                                    }}
                                />
                                {
                                    state.data.setDate ? <div style={{ marginLeft: 16, marginTop: 12, fontSize: 16, color: 'red' }}>{state.data.setDate}</div> : <div style={{ marginLeft: 12, marginTop: 14 }}>{'未选择'}</div>
                                }
                            </div>
                        </div>
                        <div className={styles.forms}>
                            <div className={styles.subtitles}>5. 现场填报人<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                            <Input
                                className={styles.forms_input}
                                style={{ width: '100%', borderRadius: 6 }}
                                value={state.data.fillPerson}
                                placeholder='请输入现场填报人'
                                onChange={(e: any) => {
                                    state.data.fillPerson = e;
                                }}
                            />
                        </div>
                        <div className={styles.forms}>
                            <div className={styles.subtitles}>6. 联系方式<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                            <Input
                                className={styles.forms_input}
                                style={{ width: '100%', borderRadius: 10 }}
                                value={state.data.tel}
                                type='tel'
                                placeholder='请输入联系电话'
                                onChange={(e: any) => {
                                    state.data.tel = e;
                                }}
                            />
                        </div>
                        {/* <div className={styles.forms}>
                            <div className={styles.subtitles}>8. 测试周期<div style={{ fontSize: 14, color: '#999' }}>（天）</div></div>
                            <Input
                                className={styles.forms_input}
                                style={{ width: '100%', borderRadius: 10 }}
                                value={state.data.testPeriod}
                                placeholder='请输入测试周期'
                                type='number'
                                onChange={(e: any) => {
                                    state.data.testPeriod = e;
                                }}
                            />
                        </div>
                        <div className={styles.forms}>
                            <div className={styles.subtitles}>9. 腐蚀产物厚度(埃)<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                            <Input
                                className={styles.forms_input}
                                style={{ width: '100%', borderRadius: 10 }}
                                value={state.data.fesThickness}
                                placeholder='请输入腐蚀产物厚度'
                                onChange={(e: any) => {
                                    state.data.fesThickness = e;
                                }}
                            />
                        </div> */}

                        {/* <div className={styles.forms}>
                            <div className={styles.subtitles}>10. 环境等级<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                            <Input
                                className={styles.forms_input}
                                style={{ width: '100%', borderRadius: 10 }}
                                value={state.data.envGrade}
                                placeholder='请输入环境等级'
                                onChange={(e: any) => {
                                    state.data.envGrade = e;
                                }}
                            />
                        </div> */}
                        <div className={styles.forms} style={{ marginBottom: 200 }}>
                            <div className={styles.subtitles} style={{ marginBottom: 15 }}>7. 放置照片<div style={{ fontSize: 14, color: '#999' }}>（必填）</div></div>
                            <div style={{ display: 'flex' }}>
                                {
                                    state.fileList && state.fileList.map((item: any, index: any) => {
                                        return <div style={{ position: 'relative', width: 80, height: 80, borderRadius: 3, cursor: 'pointer', marginRight: 14, background: 'rgb(245, 245, 245)' }}>
                                            <img style={{ width: 80, height: 80 }} src={item.url}></img>
                                            <div onClick={() => {
                                                let indexs: any = state.fileList.findIndex((item: any) => item.url == item);
                                                Toast.show({
                                                    icon: 'success',
                                                    content: '删除成功',
                                                })
                                                state.fileList.splice(indexs, 1);
                                            }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 15, height: 15, position: 'absolute', top: 0, right: 0, cursor: 'pointer', background: 'rgba(0, 0, 0, .7)', borderRadius: 3 }}>
                                                <CloseOutline style={{ color: 'white' }}></CloseOutline>
                                            </div>
                                        </div>
                                    })
                                }
                                <ImageUploader
                                    value={state.fileList}
                                    children={<div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f5f5f5', borderRadius: 3 }}>
                                        <PlusOutlined style={{ fontSize: 20 }}></PlusOutlined>
                                    </div>}
                                    onDelete={(e: any) => {
                                        console.log('dele', e);
                                        let index: any = state.fileList.findIndex((item: any) => item.url == e.url);
                                        console.log('index', index)
                                    }}
                                    upload={(file: any) => {
                                        Upload({
                                            fileName: file.name,
                                            moduleName: 'test'
                                        }).then((res: any) => {
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            Object.keys(res.tokenParams).forEach((key) => {
                                                formData.append(key, res.tokenParams[key]);
                                            });
                                            fetch(res.endpoint, {
                                                method: 'POST',
                                                body: formData,
                                            })
                                                .then(() => {
                                                    state.fileList.push({
                                                        url: res.file_url
                                                    });
                                                })
                                                .catch(() => {
                                                });
                                        })
                                        return {

                                        }
                                    }}
                                />
                            </div>

                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, border: '1px solid #ddd', position: 'fixed', bottom: 0, width: '100%', zIndex: 90, background: 'white' }}>
                            <Button onClick={() =>
                                Modal.confirm({
                                    content: '注意：提交之后不可修改',
                                    onConfirm: async () => {
                                        if (state.orgData.id == void 0 || state.orgData.id == '') {
                                            Toast.show({
                                                icon: 'fail',
                                                content: '请选择企业',
                                            })
                                        } else {
                                            if(state.data.tel !== '') {
                                                if(validatePhoneNumber(state.data.tel)) {
                                                    let setPhotoUrls: any = [];
                                                    state.fileList && state.fileList.map((item: any) => {
                                                        setPhotoUrls.push(item.url);
                                                    });
                                                    if(state.data.setDate == '') {
                                                        Toast.show({
                                                            icon: 'fail',
                                                            content: '请选择放置时间',
                                                        })
                                                        return;
                                                    }
                                                    addCard({
                                                        ...state.data,
                                                        orgId: state.orgData.id,
                                                        id: state.data.qrId,
                                                        setPhotoUrl: setPhotoUrls.length == 0 ? '' : setPhotoUrls.join(','),
                                                        cabinet: state.cabinetData.id,
                                                    }).then(() => {
                                                        Toast.show({
                                                            icon: 'success',
                                                            content: '提交成功'
                                                        });
                                                        state.disable = true;
                                                    })
                                                }else {
                                                    Toast.show({
                                                        icon: 'fail',
                                                        content: '请输入正确的手机号',
                                                    })
                                                }
                                            }else {
                                                Toast.show({
                                                    icon: 'fail',
                                                    content: '请输入手机号',
                                                })
                                            }
                                         
                                        }

                                    },
                                })
                            } className={styles.submit} disabled={state.disable} block color='danger' size='large'>
                                {
                                    state.disable ? '已提交' : '提交'
                                }
                            </Button>
                        </div>
                    </> : <></>
            }
        </div>
    );
}

export default SignIn;
