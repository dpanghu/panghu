import React, { useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import styles from './index.less';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload, Form, Input, SeenTable } from 'SeenPc';
import qs from 'qs';
import { history } from 'umi';
import { Radio } from 'antd';
import { importData, saveQuestionnaire, getQuestionnaire, getImportDataList, deleteImportData } from '@/services/aiLearnPlan';
import { set } from 'lodash';

type FieldType = {
    问卷标题?: any;
    问卷说明?: any;
    问卷结束语?: any;
};
const AiSurveyQuestionnaire: React.FC = () => {
    const [dataSources, setDataSources] = useState<any>([])//表格数据
    const [isDataReady, setIsDataReady] = useState(false);//控制表格显示
    const [isModalOpen, setIsModalOpen] = useState(false);//保存模态框是否打开
    const [isModalOpens, setIsModalOpens] = useState(false);//导入模态框是否打开
    const [titleValue, setTitleValue] = useState<any>('');//模态框中的问卷标题输入框的值
    const [contentValue, setContentValue] = useState<any>('');//模态框中的问卷说明输入框的值
    const [conclusionValue, setConclusionValue] = useState<any>('');//模态框中的问卷结束语输入框的值
    const [atttachIdValue, setAttatchIdValue] = useState<any>('');//模态框中的问卷附件id
    const [listValue, setListValue] = useState<any>('');//是否展示问卷列表
    const [isModalOpenss, setIsModalOpenss] = useState(false);//删除模态框是否打开
    const [uploadValue, setUpLoadValue] = useState<any>(false);//上传文件失败控制打开模态框
    const [fileValue, setFileValue] = useState<any>();//上传文件失败分析后的文件
    // const { qs: queryStr } = history.location.query as any;
    // // 从location.query获取参数
    // const Param = qs.parse(window.atob(queryStr));
    const Param = qs.parse(window.atob(window.sessionStorage.getItem('qs') || '{}'));
    // console.log(Param);
    // localStorage.setItem('Param', JSON.stringify(Param));
    // 提取必要的参数
    const { memberId, userId, schoolId, userToken } = Param;
    //上传文件成功调用builder-导入数据接口
    const importDataMethod = (url: any) => {
        importData({ url, projectVersionId: 1, taskId: 2, memberId, userId, schoolId, userToken }).then((res: any) => {
            // if (res.code === 200) {
            // console.log(res);
            // setUpLoadValue('1')
            message.success('上传成功');
            // }
        }).catch((msg: any) => {
            message.error('上传失败,请下载分析后的表格查看错误信息');
            // console.log(msg);
            setUpLoadValue(true)
            setFileValue(msg.data)
        })
    }
    //关闭上传文件失败的模态框
    const handleCancels = () => {
        setUpLoadValue(false)
    }
    //点击下载上传文件失败分析后的文件
    const onDownload = () => {
        window.open(fileValue)
    }
    const { Dragger } = Upload;
    //获取文件上传的参数
    const extraParams = JSON.parse(
        window.sessionStorage.getItem('queryParams') || '{}',
    );
    //上传文件
    const props: any = {
        seenOss: {
            url: '/api/bus-xai/dbe3.private.params.upload.get',
            extraParams
        },
        name: 'file',
        multiple: false,
        listType: 'text',
        maxCount: 1,
        beforeUpload: (file: any) => {
            // console.log(file);
            const fileType = file.name.split('.').pop();
            // console.log(fileType);
            const allowedFormats = ['xls', 'xlsx'];

            if (!allowedFormats.includes(fileType)) {
                message.warning('文件上传的格式不正确，仅支持xls,xlsx格式')
                return false;
            }
            const maxSize = 4 * 1024 * 1024;
            if (file.size > maxSize) {
                message.warning('文件过大，请上传4MB以内文件');
                return false;
            }
            return true;
        },
        onChange(info: any) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
                // console.log(info)
            }
            if (status === 'done') {
                importDataMethod(info.file.key);
                setAttatchIdValue(info.file.uid)
                // if (uploadValue === '1') {
                // message.success(`${info.file.name} 上传成功.`);
                // setUpLoadValue('0')
                // }
            } else if (status === 'error') {
                message.error(`${info.file.name} 上传失败.`);

            }
        },
        onDrop(e: any) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    //点击保存按钮，弹出模态框
    const showModal = () => {
        setIsModalOpen(true);
    };
    //点击导入按钮，弹出模态框
    const showModals = () => {
        setIsModalOpens(true);
    };
    //点击删除按钮，弹出模态框
    const showModalss = () => {
        setIsModalOpenss(true);
    }
    //点击确认按钮，关闭模态框(保存)
    const handleOk = () => {
        if (titleValue === '' || contentValue === '' || conclusionValue === '') {
            message.error('请填写完整问卷内容');
        }
        else {
            const val = JSON.stringify({ "questionId": chioceValueID, "portfolios": [{ "answerOptionId": chioceAID, "portfolio": chioceA + value1 }, { "answerOptionId": chioceBID, "portfolio": chioceB + value2 }, { "answerOptionId": chioceCID, "portfolio": chioceC + value3 }] });
            saveQuestionnaire({ name: titleValue, content: contentValue, endtips: conclusionValue, bind: promptValue, portfolio: val, projectVersionId: 1, taskId: 2, memberId, userId, schoolId, userToken }).then((res) => {
                // console.log(res, '11111111')
                message.success('保存成功');
            })
            setIsModalOpen(false);
            setTitleValue('');
            setContentValue('');
            setConclusionValue('');
            setPromptValue('');
            setvalue1('');
            setvalue2('');
            setvalue3('');
        }
    };
    const columns: any = [
        {
            title: '题号',
            dataIndex: 'sort',
            key: 'sort',
            align: 'center',
            width: 80,
        },
        {
            title: '题型',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '题目',
            dataIndex: 'sno',
            key: 'sno',
        },
        {
            title: '选项A',
            dataIndex: 'school',
            key: 'school',
        },
        {
            title: '选项B',
            dataIndex: 'college',
            key: 'college',
        },
        {
            title: '选项C',
            dataIndex: 'master',
            key: 'master',
        },
        {
            title: '选项D',
            dataIndex: 'class',
            key: 'class',
        },
        {
            title: '选项E',
            dataIndex: 'classe',
            key: 'classe',
        },
        {
            title: '选项F',
            dataIndex: 'classf',
            key: 'classf',
        },
        {
            title: '选项设置文本',
            dataIndex: 'classg',
            key: 'classg',
        },
        {
            title: '备注',
            dataIndex: 'classh',
            key: 'classh',
        },
        {
            title: '是否必选',
            dataIndex: 'classi',
            key: 'classi',
        },
        {
            title: '是否与其他题目关联',
            dataIndex: 'classj',
            key: 'classj',
        },
        {
            title: '关联的题目',
            dataIndex: 'classk',
            key: 'classk',
        },
    ];
    // const [dataSource, setDataSource] = useState<any>([]);
    //点击确认按钮，关闭模态框(删除)
    const handleOkss = () => {
        setIsModalOpenss(false);
        //builder-删除导入数据接口
        deleteImportData({ taskId: 2, projectVersionId: 1, memberId, userId, schoolId, userToken }).then((res: any) => {
            setListValue('0')
            setIsDataReady(false)
            setDataSources([])
            message.success('删除成功')
            // console.log(dataSources)
        })
    }
    //点击确认按钮，关闭模态框(导入)
    const handleOks = () => {
        setIsModalOpens(false);
        setListValue('1')//控制表格显示
        getList();
    }
    // let dataSource: any = [];
    // useEffect(() => {
    // getList();
    // if (listValue === '1') {
    //     // setDataSources([])
    //     // builder-查询导入数据列表接口
    //     getImportDataList({ taskId: 2, projectVersionId: 1, memberId, userId, schoolId, userToken }).then((res: any) => {
    //         // console.log(res, '22222')
    //         // const dataSource: any = [];
    //         for (let i = 0; i < res.length; i++) {
    //             dataSources.push({
    //                 sort: res[i].serialNo,
    //                 name: res[i].type,
    //                 sno: res[i].name,
    //                 school: res[i].optionA,
    //                 college: res[i].optionB,
    //                 master: res[i].optionC,
    //                 class: res[i].optionD,
    //                 classe: res[i].optionE,
    //                 classf: res[i].optionF,
    //                 classg: res[i].needInput,
    //                 classh: res[i].note,
    //                 classi: res[i].required,
    //                 classj: res[i].rel,
    //                 classk: res[i].relOptions,
    //             });
    //         }
    //         // console.log(dataSource, 'dataSource')
    //         setIsDataReady(true)
    //         // setDataSources(dataSources)
    //     })
    // }
    // }, [])

    // 获取列表题目
    const getList = () => {
        // builder-查询导入数据列表接口
        getImportDataList({ taskId: 2, projectVersionId: 1, memberId, userId, schoolId, userToken }).then((res: any) => {
            // console.log(res, '22222')
            const dataSource: any = [];
            for (let i = 0; i < res.length; i++) {
                dataSource.push({
                    sort: res[i].serialNo,
                    name: res[i].type,
                    sno: res[i].name,
                    school: res[i].optionA,
                    college: res[i].optionB,
                    master: res[i].optionC,
                    class: res[i].optionD,
                    classe: res[i].optionE,
                    classf: res[i].optionF,
                    classg: res[i].needInput,
                    classh: res[i].note,
                    classi: res[i].required,
                    classj: res[i].rel,
                    classk: res[i].relOptions,
                });
            }
            // console.log(dataSource, 'dataSource')
            setIsDataReady(true)
            setDataSources(dataSource)
        })
    }
    //点击取消按钮，关闭模态框
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalOpens(false);
        setIsModalOpenss(false);
        setPromptValue('');
        setPromptValues('');
    };
    //下载已有模版
    const downloadTemplate = () => {
        window.location.href = './wenjuan.xlsx';
    }
    //大模型提示语选项
    const options = [
        {
            label: '与题目选项绑定',
            value: '1',
        },
        {
            label: '不与题目选项绑定',
            value: '0',
        },
    ];
    //获取大模型提示语
    const [promptValue, setPromptValue] = useState('null');//是否关联题目选项
    const [promptValues, setPromptValues] = useState('null');//获取大模型提示语关联题目
    const [chioceValue, setChioceValue] = useState('null');//获取关联题目
    const [chioceA, setChioceA] = useState('null');//获取关联题目的选项A
    const [chioceB, setChioceB] = useState('null');//获取关联题目的选项B
    const [chioceC, setChioceC] = useState('null');//获取关联题目的选项C
    const [chioceValueID, setChioceValueID] = useState('null');//获取关联题目的ID
    const [chioceAID, setChioceAID] = useState('null');//获取关联题目的选项A的ID
    const [chioceBID, setChioceBID] = useState('null');//获取关联题目的选项B的ID
    const [chioceCID, setChioceCID] = useState('null');//获取关联题目的选项C的ID
    //是否关联题目选项
    const handleChange = (e: any) => {
        // console.log(e.target.value);
        setPromptValue(e.target.value);
        setPromptValues('');
    };
    //查询builder-问卷设置信息接口
    useEffect(() => {
        if (promptValue === '1') {
            getQuestionnaire({ classId: 1, taskId: 2, projectVersionId: 1, memberId, userId, schoolId, userToken }).then((res: any) => {
                // const data = res.options
                // console.log(res, 'res');
                setChioceValue(res.question.name)
                setChioceA(res.options[0].name)
                setChioceB(res.options[1].name)
                setChioceC(res.options[2].name)
                setChioceValueID(res.question.id)
                setChioceAID(res.options[0].id)
                setChioceBID(res.options[1].id)
                setChioceCID(res.options[2].id)
            })
        }
    });
    //关联题目选项
    const optionss = [
        {
            label: chioceA,
            value: '1',
        },
        {
            label: chioceB,
            value: '2',
        },
        {
            label: chioceC,
            value: '3',
        },
    ];
    //关联题目选项value
    const handleChanges = (e: any) => {
        setPromptValues(e.target.value);
    }
    const [value, setvalue] = useState<any>('');//输入框的值
    const [value1, setvalue1] = useState<any>('');//关联题目选项1文本框的值
    const [value2, setvalue2] = useState<any>('');//关联题目选项2文本框的值
    const [value3, setvalue3] = useState<any>('');//关联题目选项3文本框的值
    return (
        <div className={styles.all}>
            <Modal
                open={isModalOpen}
                footer={false}
                title={'问卷内容说明:'}
                destroyOnClose={true}
                onCancel={handleCancel}
            // width={800}
            >
                <Form
                    name="basic"
                    style={{ maxWidth: 800 }}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="问卷标题"
                        name="问卷标题"
                        rules={[{ required: true, message: '问卷标题不可为空' }]}
                    >
                        <Input style={{ width: '384px', marginLeft: '1px' }}
                            value={titleValue}
                            allowClear={true}
                            showCount maxLength={20}
                            placeholder={'请输入问卷标题'}
                            onChange={(e: any) => {
                                setTitleValue(e);
                            }}
                            size="medium" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="问卷说明"
                        name="问卷说明"
                        rules={[{ required: true, message: '问卷说明不可为空' }]}
                    >
                        <Input style={{ width: '384px', marginLeft: '1px' }}
                            value={contentValue}
                            showCount maxLength={200}
                            allowClear={true}
                            placeholder={'请输入问卷说明'}
                            onChange={(e: any) => {
                                setContentValue(e);
                            }}
                            size="medium" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="问卷结束语"
                        name="问卷结束语"
                        rules={[{ required: true, message: '问卷结束语不可为空' }]}
                    >
                        <Input style={{ width: '370px', marginLeft: '1px' }}
                            value={conclusionValue}
                            allowClear={true}
                            placeholder={'请输入问卷结束语'}
                            showCount maxLength={50}
                            onChange={(e: any) => {
                                setConclusionValue(e);
                            }}
                            size="medium" />
                    </Form.Item>
                    <div>
                        <p style={{ color: 'rgb(0,0,0,0.88)', fontWeight: '600', fontSize: '16px' }}>编辑大模型提示语:</p>
                        <Radio.Group style={{ display: 'flex', justifyContent: 'space-evenly' }} options={options} onChange={handleChange} value={promptValue} />
                    </div>
                    {promptValue === '1' && (
                        <div style={{ position: 'relative' }}>
                            <p style={{ color: 'rgb(0,0,0,0.88)', fontWeight: '600', fontSize: '16px' }}>{chioceValue}</p>
                            <Radio.Group style={{ display: 'flex', justifyContent: 'space-evenly' }} options={optionss} onChange={handleChanges} value={promptValues} />
                            <Input value={value} disabled
                                onChange={(e: any) => {
                                    setvalue(e);
                                }} maxLength={10} style={{ width: '50px', height: '20px', position: 'absolute', top: '43px', right: ' -22px' }}></Input>
                            {promptValues === '1' && (
                                <Input
                                    style={{ width: '1000px', marginTop: '10px' }}
                                    value={value1}
                                    onChange={(e: any) => {
                                        setvalue1(e);
                                    }}
                                    type={'textarea'}
                                ></Input>
                            )}
                            {promptValues === '2' && (
                                <Input
                                    style={{ width: '1000px', marginTop: '10px' }}
                                    value={value2}
                                    onChange={(e: any) => {
                                        setvalue2(e);
                                    }}
                                    type={'textarea'}
                                ></Input>
                            )}
                            {promptValues === '3' && (
                                <Input
                                    style={{ width: '1000px', marginTop: '10px' }}
                                    value={value3}
                                    onChange={(e: any) => {
                                        setvalue3(e);
                                    }}
                                    type={'textarea'}
                                ></Input>
                            )}
                        </div>
                    )}
                    <Form.Item style={{ position: 'relative' }}>
                        <Button style={{ lineHeight: '100%', backgroundColor: '#fff', borderColor: '#d9d9d9', position: 'absolute', right: '100px', top: '10px' }} type="text" htmlType="submit" onClick={() => { setIsModalOpen(false); setPromptValue(''); }
                        }>
                            取消
                        </Button>
                        <Button style={{ lineHeight: '100%', position: 'absolute', right: '0px', top: '10px' }} type="primary" htmlType="submit" onClick={handleOk}>
                            确定
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal destroyOnClose={true} title="问卷模版:" okText={"确定"} cancelText={"取消"} open={isModalOpens} onOk={handleOks} onCancel={handleCancel}>
                <div style={{ textAlign: 'center', }}>
                    <Button type="primary" onClick={downloadTemplate} style={{ marginBottom: 10, }}>下载样例模板</Button></div>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击/拖拽文件上传模版</p>
                    <p className="ant-upload-hint">
                        支持选择/拖拽问卷的方式导入.xls、.xlsx单文件,单个文件不超过 4M;
                    </p>
                </Dragger>
            </Modal>
            <Modal destroyOnClose={true} title="删除:" okText={"确定"} cancelText={"取消"} open={isModalOpenss} onOk={handleOkss} onCancel={handleCancel}>
                确定删除吗？
            </Modal>
            <Modal destroyOnClose={true} open={uploadValue} onCancel={handleCancels} footer={false} style={{ textAlign: 'center' }} >
                <Button onClick={onDownload} type="primary">下载</Button>
            </Modal>
            <div className={styles.mainbtn}>
                <Button type="primary" onClick={showModals}>导入</Button>
                <Button style={{ marginLeft: 10 }} onClick={showModal}>保存</Button>
                <Button type='primary' danger style={{ marginLeft: 10 }} onClick={showModalss} >删除</Button>
            </div>
            {isDataReady && listValue === '1' && (
                <div>
                    <SeenTable style={{ marginTop: '50px', minWidth: '100%' }} scroll={{ x: 2000 }} columns={columns} dataSource={dataSources}></SeenTable >
                </div>
            )
            }
        </div >
    );
};

export default AiSurveyQuestionnaire;