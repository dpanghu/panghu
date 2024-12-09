import React, { useEffect, useState, useCallback } from 'react';
import { Space } from 'antd';
import styles from './index.less';
import { getAIProductList, getAllAIModel, publishPlugin } from '@/services/aiJobHunt';
import { getAiListTableData } from '@/services/aiListTable';
import { Select, Input, Button, Table, Pagination, Modal, ComboBox } from 'SeenPc';
import ScenePreview from '../../AiModule/scenePreview';

const AiListTable: React.FC = () => {
    const [value, setValue] = useState<any>();
    const [options, setOptions] = useState<any>([]);
    const [values, setValues] = useState<any>();
    const [optionss, setOptionss] = useState<any>([]);
    const [status, setStatus] = useState<any>('无');
    const [valuess, setValuess] = useState<any>('4');
    const [optionsss, setOptionsss] = useState<any>([
        {
            label: '请选择状态',
            value: 2,
        },
        {
            label: '待审核',
            value: 4,
        },
        {
            label: '已停用',
            value: 1,
        },
        {
            label: '编辑态',
            value: 3,
        },
        {
            label: '审核通过',
            value: 0,
        },
        {
            label: '审核驳回',
            value: 5,
        }
    ]);
    const [inputValue, setInputValue] = useState<any>();
    const [total, setTotal] = useState<any>();
    const [dataSource, setDataSource] = useState<any>([]);
    const [pageNums, setPageNums] = useState<any>('1');
    const [limits, setLimits] = useState<any>('10');
    const [open, setOpen] = useState<any>(false);
    const option = [
        {
            label: '审核通过',
            value: '0',
        },
        {
            label: '审核驳回',
            value: '5',
        }
    ];
    const [val, setVal] = useState();
    const [vals, setVals] = useState();
    const [opens, setOpens] = React.useState<any>(false);
    const [id, setId] = React.useState<any>(null);
    const handleChange = (e: any) => {
        setVal(e.target.value);
    };
    const gettabledata = (pageNums, limits, value, values, valuess, inputValue) => {
        // 对value进行判断，如果为空字符串则设置为null
        const actualValue = value === "" ? null : value;
        // 对values进行判断，如果为空字符串则设置为null
        const actualValues = values === "" ? null : values;
        // 对inputValue进行判断，如果为空字符串则设置为null
        const actualInputValue = inputValue === "" ? null : inputValue;
        // 获取表格数据
        getAiListTableData({ userId: 1, userToken: 2, schoolId: 3, memberId: 4, pageNum: pageNums, limit: limits, search: actualInputValue, status: valuess, domainId: actualValues, modelTypeId: actualValue }).then((res) => {
            // console.log(res);
            setTotal(res.total);
            const dataSources: any = [];
            for (let i = 0; i < res.data.length; i++) {
                const currentModelTypeId = res.data[i].modelTypeId;
                const currentModelId = res.data[i].modelId;
                const currentStatus = res.data[i].status;

                // 根据options查找modelTypeId对应的文字描述
                const modelTypeIdLabel = options.find(option => option.value === currentModelTypeId)?.label || currentModelTypeId;
                // 根据optionss查找modelId对应的文字描述
                const modelIdLabel = optionss.find(option => option.value === currentModelId)?.label || currentModelId;
                // 根据optionsss查找status对应的文字描述
                const statusLabel = optionsss.find(option => option.value === currentStatus)?.label || currentStatus;

                dataSources.push({
                    name: res.data[i].name,
                    modelId: modelIdLabel,
                    modelTypeId: modelTypeIdLabel,
                    note: res.data[i].note,
                    portfolio: res.data[i].portfolio,
                    status: statusLabel,
                    id: res.data[i].id,
                });
            }
            setDataSource(dataSources);
        });
    }
    const handleChangePage = (page: any, pageSize: any) => {
        setPageNums(page);
        setLimits(pageSize);
        gettabledata(page, pageSize, value, values, valuess, inputValue);
    };
    const shehe = (e: any) => {
        setOpen(true);
        setVals(e);
    }
    const sheheok = useCallback(() => {
        if (val === '0') {
            publishPlugin({ pluginId: vals, state: 'normal' }).then((res) => {
                gettabledata(pageNums, limits, value, values, valuess, inputValue);
            });
        } else if (val === '5') {
            publishPlugin({ pluginId: vals, state: 'rebut' }).then((res) => {
                gettabledata(pageNums, limits, value, values, valuess, inputValue);
            });
        }
        setOpen(false);
    }, [pageNums, limits, value, values, valuess, inputValue, vals, val]);
    useEffect(() => {
        // 获取AI产品列表
        getAIProductList({ userId: 1, userToken: 2, schoolId: 3, memberId: 4 }).then((res: any) => {
            const newOptions = res.map(item => ({
                label: item.name,
                value: item.id
            }));
            setOptions(newOptions);
        });
        // 获取AI模型领域
        getAllAIModel({ userId: 1, userToken: 2, schoolId: 3, memberId: 4 }).then((res) => {
            const newOptionss = res.map(item => ({
                label: item.name,
                value: item.id
            }));
            setOptionss(newOptionss);
        });
        if (options.length > 0 && optionss.length > 0) {
            gettabledata(pageNums, limits, value, values, valuess, inputValue);
        }
    }, [options.length > 0 && optionss.length > 0]);
    useEffect(() => {
        gettabledata(pageNums, limits, value, values, valuess, inputValue);
    }, [valuess, status])
    const columns: any = [
        {
            title: '工具名称',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            ellipsis: true,
        },
        {
            title: '所属领域',
            dataIndex: 'modelId',
            key: 'modelId',
            width: 100,
            ellipsis: true,
        },
        {
            title: '分类',
            dataIndex: 'modelTypeId',
            key: 'modelTypeId',
            width: 100,
            ellipsis: true,
        },
        {
            title: '工具描述',
            dataIndex: 'note',
            key: 'note',
            width: 150,
            ellipsis: true,
        },
        {
            title: '提示词',
            dataIndex: 'portfolio',
            key: 'portfolio',
            width: 150,
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            ellipsis: true,
        },
        {
            title: '操作',
            key: 'operation',
            width: 120,
            render: (text, record) => {
                const { status } = record;
                return (
                    <Space size="middle">
                        <a onClick={() => { setOpens(true); setId(text.id); }}>查看</a>
                        {status === '待审核' && <a onClick={() => shehe(text.id)}>审核</a>}
                        {status === '停用' && <a onClick={() => {
                            publishPlugin({ pluginId: text.id, state: 'published' }).then((res) => {
                                setStatus(text.id + false);
                            });
                        }}>启用</a>}
                        {status === '审核通过' && <a onClick={() => {
                            publishPlugin({ pluginId: text.id, state: 'stopped' }).then((res) => {
                                setStatus(text.id + true);
                            });
                        }}>停用</a>}
                    </Space>
                );
            }
        },
    ];
    return (
        <div className={styles.tableContainer} style={{ padding: '30px' }}>
            {
                opens && <ScenePreview id={id} onCancel={() => { setOpens(false) }} onOk={() => { setOpens(false) }}></ScenePreview>
            }
            <Modal
                open={open}
                title={'审核'}
                onCancel={() => {
                    setOpen(false);
                }}
                onOk={() => sheheok()}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '30px' }}><ComboBox options={option} value={val} onChange={handleChange}></ComboBox></div>
            </Modal>
            <div className={styles.tableTop} style={{ marginBottom: 24 }}>
                <div className={styles.tableTop1}>
                    <Select
                        option={options}
                        value={value}
                        allowClear={true}
                        placeholder='请选择分类'
                        onChange={(value1: any) => {
                            setValue(value1);
                            gettabledata(pageNums, limits, value1, values, valuess, inputValue);
                        }}
                    ></Select>
                </div>
                <div className={styles.tableTop2}>
                    <Select
                        option={optionss}
                        value={values}
                        allowClear={true}
                        placeholder='请选择领域'
                        onChange={(value2: any) => {
                            setValues(value2);
                            gettabledata(pageNums, limits, value, value2, valuess, inputValue);
                        }}
                    ></Select>
                </div>
                <div className={styles.tableTop3}>
                    <Select
                        option={optionsss}
                        value={valuess}
                        allowClear={true}
                        placeholder='请选择状态'
                        onChange={(value3: any) => {
                            setValuess(value3);
                        }}
                    ></Select>
                </div>
                <div className={styles.tableTop4}>
                    <Input
                        className={styles.input}
                        value={inputValue}
                        allowClear={true}
                        placeholder={'请输入搜索内容'}
                        onChange={(e: any) => {
                            setInputValue(e);
                        }}
                        size="medium"
                    ></Input>
                    <Button type="primary" style={{ marginLeft: 16 }} onClick={() => {
                        gettabledata(pageNums, limits, value, values, valuess, inputValue);
                    }}>搜索</Button>
                </div>
            </div>
            <div className={styles.tableContent}>
                <Table
                    className={styles.customTable}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
                <Pagination className={styles.pagination} total={total} onChange={handleChangePage}></Pagination>
            </div>
        </div>
    );
}

export default AiListTable;