/**
 * @author  zhangjn
 * @description 沟通
 */
import React from 'react';
import styles from './index.less';
import { useMount, useReactive } from 'ahooks';
import { qrcodeList, addQrcode, delDepf, delQrcode } from '@/services/public';
import { Button, Tabs, Table, Input, Tooltip, Pagination, Checkbox, Radio, ConfigProvider, message, Modal, QRCode } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined, CheckCircleFilled,InfoCircleFilled } from '@ant-design/icons';
import locale from 'antd/locale/zh_CN';
import { InputNumber } from 'antd/lib';
/* Class */
type IState = {
    open: any; // 资源库弹窗
    page: any;
    total: any;
    num: any;
    data1: any;
};
type Iprops = Record<any, string>;
const SignIn: React.FC<any> = () => {
    const state = useReactive<any>({
        selectedRowKeys: [],
        num: 10,
        page: {
            pageNum: 1,
            limit: 10,
        },
        total: '',
        search: '',
        data1: [],
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
            title: '部门名称',
            dataIndex: 'name',
            key: 'name',
            width: 270,
        },
        {
            title: '部门编码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            render: (item: any) => {
                return <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    <Tooltip title='编辑'>
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
                                    await delDepf({ id: item.id });
                                    message.success('删除成功！');
                                    getList();
                                },
                            });
                        }} style={{ marginLeft: 17, fontSize: 17, color: '#5a73ff', cursor: 'pointer' }} />
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
        qrcodeList({
            ...state.page
        }).then((res: any) => {
            state.data = res.data;
            state.total = Number(res.total);
        });
    };

    return (
        <div className={styles.sign_container}>
            <Modal footer={false} width={450} title='生成二维码' open={state.open} onCancel={() => { state.open = false }} onOk={() => {
                addQrcode({
                    num: state.num,
                }).then(() => {
                    message.success('生成成功');
                    state.open = false;
                    getList();
                })
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 40, marginBottom: 40, width: "100%", justifyContent: 'center' }}>
                    数量：<InputNumber min={0} onChange={(e: any) => {
                        state.num = e;
                    }} value={state.num}></InputNumber>
                    <Button type='primary' style={{ marginLeft: 24, background: '#5a73ff' }} onClick={() => {
                        addQrcode({
                            num: state.num,
                        }).then(() => {
                            message.success('生成成功');
                            state.open = false;
                            getList();
                        })
                    }}>开始生成</Button>
                </div>
            </Modal>

            <div className={styles.head_title}>
                二维码管理
            </div>
            <Tabs
            style={{ marginTop: 30 }}
                    onChange={(e: any) => {
                       if(e == 2) {
                        state.page.gp = 1
                        state.page.qp = ''
                       }
                       if(e == 3) {
                        state.page.qp = 1
                       }
                       if(e == 1) {
                        state.page.qp = '';
                        state.page.gp = ''
                       }
                       getList();
                    }}
                    type="card"
                    items={[
                        {
                          label: '全部',
                          key: '1',
                        },
                        {
                          label: '已挂片',
                          key: '2',
                        },
                        {
                          label: '已取片',
                          key: '3',
                        },
                      ]}
                />
            {/* <div className={styles.btn_box} style={{ marginTop: 24 }}>
      <Button type='default' className={styles.btns}>批量下载</Button>
        <Button type='primary' onClick={() => {
          state.open = true;
          state.num = 10;
         }}>生成二维码</Button>
      </div> */}
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #ddd', borderRadius: 5, paddingBottom: 50, marginTop: -16 }}>
                
                <div className={styles.qrhead} style={{ justifyContent: 'space-between' }}>
                    <Checkbox>当页全选</Checkbox>
                    <div>
                 <Button type='default' className={styles.btns}>批量下载</Button>
                        <Button type='primary' onClick={() => {
                            state.open = true;
                            state.num = 10;
                        }}>生成二维码</Button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 0, width: 990 }}>
                    {
                        state.data && state.data.map((item: any) => {
                            return <div className={styles.cards}>
                                {/* {
                                    item.qp == 1 ? item.gp == 1 ? item.show ? <img src={item.url} style={{ width: 158, height: 158 }}></img>  : <QRCode value={item.url} status="expired" statusRender={() => <div>
                                        <InfoCircleFilled
                                            style={{
                                                color: 'orange',
                                                marginRight: 10
                                            }}
                                        />{'已放置'}
                                        <div onClick={()=> {
                                            item.show = true;
                                        }} style={{ color: '#5a73ff',marginTop: 8,cursor:'pointer' }}>点击取片</div>
                                    </div>} /> : <QRCode value={item.url} status="scanned" statusRender={() => <div>
                                        <CheckCircleFilled
                                            style={{
                                                color: 'green',
                                                marginRight: 10
                                            }}
                                        />{'已取片'}
                                    </div>} /> : <img src={item.url} style={{ width: 158, height: 158 }}></img>
                                } */}
                                 {
                                    item.qp == 1 ? <QRCode value={item.url} status="scanned" statusRender={() => <div>
                                        <CheckCircleFilled
                                            style={{
                                                color: 'green',
                                                marginRight: 10
                                            }}
                                        />{'已取片'}
                                    </div>} /> : item.gp == 1 ? item.show ?  <img src={item.url} style={{ width: 158, height: 158 }}></img> : <QRCode value={item.url} status="expired" statusRender={() => <div>
                                        <InfoCircleFilled
                                            style={{
                                                color: 'orange',
                                                marginRight: 10
                                            }}
                                        />{'已放置'}
                                        <div onClick={()=> {
                                            item.show = true;
                                        }} style={{ color: '#5a73ff',marginTop: 8,cursor:'pointer' }}>点击取片</div>
                                    </div>} /> : <img src={item.url} style={{ width: 158, height: 158 }}></img>
                                }
                                {/* <img src={item.url} style={{ width:158,height: 158 }}></img> */}
                                {/* <QRCode style={{ borderRadius: '0px 0px 0px 0px' }} value={item.url} /> */}
                                <div className={styles.card_bottom}>
                                    <div onClick={() => {
                                        delQrcode({ id: item.id }).then(() => {
                                            message.success('删除成功');
                                            getList();
                                        })
                                    }} style={{ width: '50%', display: "flex", alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #f0f0f0', cursor: 'pointer', color: '#5a73ff' }}><DeleteOutlined style={{ fontSize: 18 }} /></div>
                                    <div style={{ width: '50%', display: "flex", alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5a73ff', fontWeight: 500 }} onClick={() => {
                                        window.location.href = item.url;
                                    }}><DownloadOutlined style={{ fontSize: 18 }} /></div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
            {/* <Table rowKey={(item: any) => item.id} rowSelection={{ ...rowSelection }} size='small' dataSource={state.data} pagination={false} columns={column} className={styles.table}>

      </Table> */}
            <div className={styles.pagination}>
                <ConfigProvider locale={locale}>
                    <Pagination onChange={(page: any, limit: any) => {
                        state.page.pageNum = page;
                        state.page.limit = limit;
                        getList();
                    }} showTotal={(total: any) => `共 ${total} 条数据`} showSizeChanger total={state.total} pageSize={state.page.limit} current={state.page.pageNum}></Pagination>
                </ConfigProvider>
            </div>
        </div>
    );
}

export default SignIn;
