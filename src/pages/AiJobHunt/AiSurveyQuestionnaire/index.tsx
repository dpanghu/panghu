import React, { useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import styles from './index.less';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Input, SeenTable } from 'SeenPc';
import { Form } from 'antd';
import qs from 'qs';
import { Radio } from 'antd';
import { importData, saveQuestionnaire, getQuestionnaire, getImportDataList, deleteImportData } from '@/services/aiLearnPlan';

const AiSurveyQuestionnaire: React.FC = () => {

    const [form] = Form.useForm();
    const [dataSources, setDataSources] = useState<any>([])//表格数据
    const [isModalOpen, setIsModalOpen] = useState(false);//保存模态框是否打开
    const [isModalOpens, setIsModalOpens] = useState(false);//导入模态框是否打开
    const [atttachIdValue, setAttatchIdValue] = useState<any>('');//模态框中的问卷附件id
    const [isModalOpenss, setIsModalOpenss] = useState(false);//删除模态框是否打开
    const [uploadValue, setUpLoadValue] = useState<any>(false);//上传文件失败控制打开模态框
    const [fileValue, setFileValue] = useState<any>();//上传文件失败分析后的文件
    const [openValue, setOpenValue] = useState<any>(false);//上传文件成功后控制打开保存模态框

    useEffect(() => {
        //获取问卷列表
        getImportDataList({ taskId: 2, projectVersionId: 1, memberId, userId, schoolId, userToken }).then((res: any) => {
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
            setDataSources(dataSource)
            if (res.length != 0) {
                setOpenValue(true)
            } else {
                setOpenValue(false)
            }
        })
    }, [])
    const Param = qs.parse(window.atob(window.sessionStorage.getItem('qs') || '{}'));
    // 提取必要的参数
    const { memberId, userId, schoolId, userToken } = Param;
    //上传文件成功调用builder-导入数据接口
    const importDataMethod = (url: any) => {
        importData({ url, projectVersionId: 1, taskId: 2, memberId, userId, schoolId, userToken }).then((res: any) => {
            message.success('上传成功');
            setOpenValue(true)
        }).catch((msg: any) => {
            message.error('上传失败,请下载分析后的表格查看错误信息');
            setUpLoadValue(true)
            setFileValue(msg.data)
            // console.log(msg.data)
        })
    }
    //关闭上传文件失败的模态框
    const handleCancels = () => {
        setUpLoadValue(false)
    }
    //点击下载上传文件失败分析后的文件
    const onDownload = () => {
        window.open(fileValue)
        setUpLoadValue(false)
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
            const fileType = file.name.split('.').pop();
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

            }
            if (status === 'done') {
                // console.log(info.file.key)
                importDataMethod(info.file.key);
                setAttatchIdValue(info.file.uid)
            } else if (status === 'error') {
                message.error(`${info.file.name} 上传失败.`);
            }
        },
        onDrop(e: any) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const [data, setData] = useState<any>([]);//存储关联题目及其选项
    //点击保存按钮，弹出模态框
    const showModal = () => {
        if (openValue === false) {
            message.error('请先导入数据');
        } else {
            setIsModalOpen(true);
            //查询builder-问卷设置信息接口
            getQuestionnaire({ classId: 1, taskId: 2, projectVersionId: 1, memberId, userId, schoolId, userToken }).then((res: any) => {
                setChioceValue(res.question.name)
                setChioceValueID(res.question.id)
                let arr: any = [];
                const options = res.options || [];//防止options为空报错
                for (let i = 0; i < options.length; i++) {
                    //初始化
                    if (!arr[i]) {
                        arr[i] = {};
                    }
                    arr[i].label = options[i].name
                    arr[i].value = options[i].id
                    arr[i].inputValue = ''
                }
                setData(arr)
                if (res.xaiSp) {
                    form.setFieldsValue({
                        titleValue: res.xaiSp.name,
                        contentValue: res.xaiSp.content,
                        conclusionValue: res.xaiSp.endtips,
                    })
                    setPromptValue(JSON.stringify(res.xaiSp.bind))
                    // function tryParseJSON(str: any) {
                    //     try {
                    //         JSON.parse(str);
                    //         return true;
                    //     } catch (e) {
                    //         return false;
                    //     }
                    // }
                    // if (typeof res.xaiSp.portfolio === 'string' && tryParseJSON(res.xaiSp.portfolio) && promptValue === '1') {
                    if (promptValue === '1') {
                        const jsonValue = JSON.parse(res.xaiSp.portfolio).portfolios
                        let arr: any = [];
                        const options = res.options || [];//防止options为空报错
                        for (let i = 0; i < options.length; i++) {
                            //初始化
                            if (!arr[i]) {
                                arr[i] = {};
                            }
                            arr[i].label = options[i].name
                            arr[i].value = options[i].id
                            arr[i].inputValue = jsonValue[i].portfolio
                        }
                        setData(arr);
                        setPromptValues(options[0].id)
                        let obj = {};
                        obj = {
                            ...jsonValue[0],
                            value: jsonValue[0].answerOptionId,
                            inputValue: jsonValue[0].portfolio,
                            label: options[0].name
                        }
                        setchooseData(obj)
                        setNoValue('')
                    } else if (promptValue === '0') {
                        setNoValue(res.xaiSp.portfolio)
                        setchooseData({})
                    }
                }
            })
        }
    };
    //点击导入按钮，弹出模态框
    const showModals = () => {
        setIsModalOpens(true);
    };
    //点击删除按钮，弹出模态框
    const showModalss = () => {
        if (openValue === false) {
            message.error('请先导入数据');
        } else {
            setIsModalOpenss(true);
        }
    }
    //点击确认按钮，关闭模态框(保存)
    const handleOk = () => {
        let clone: any = JSON.parse(JSON.stringify(data));
        let dataIndex: any = clone.findIndex(((item: any) => item.value === chooseData.value));
        clone[dataIndex] = chooseData;
        setData(clone);
        const values = form.getFieldsValue();
        if (values.titleValue === '' || values.contentValue === '' || values.conclusionValue === '') {
            message.error('请填写完整问卷内容');
        } else {
            if (promptValue === '1') {
                let error = clone.find((element: any) => element.inputValue === '');
                if (error) {
                    message.error('请填写绑定题目的各个选项的人设');
                } else if (error === undefined) {
                    let arr: any = [];
                    for (let i = 0; i < clone.length; i++) {
                        if (!arr[i]) {
                            arr[i] = {};
                        }
                        arr[i].answerOptionId = clone[i].value;
                        arr[i].portfolio = clone[i].inputValue;
                    }
                    const val = JSON.stringify({ "questionId": chioceValueID, "portfolios": arr });
                    saveQuestionnaire({ name: values.titleValue, content: values.contentValue, endtips: values.conclusionValue, bind: promptValue, portfolio: val, projectVersionId: 1, taskId: 2, memberId, userId, schoolId, userToken }).then((res) => {
                        message.success('保存成功');
                    })
                    setIsModalOpen(false);
                }
            } else if (promptValue === '') {
                message.error('请选择是否绑定题目');
            } else if (promptValue === '0') {
                saveQuestionnaire({ name: values.titleValue, content: values.contentValue, endtips: values.conclusionValue, bind: promptValue, portfolio: noValue, projectVersionId: 1, taskId: 2, memberId, userId, schoolId, userToken }).then((res) => {
                    message.success('保存成功');
                })
                setIsModalOpen(false);
            }
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
    //点击确认按钮，关闭模态框(删除)
    const handleOkss = () => {
        setIsModalOpenss(false);
        //builder-删除导入数据接口
        deleteImportData({ taskId: 2, projectVersionId: 1, memberId, userId, schoolId, userToken }).then((res: any) => {
            //删除后调用列表接口
            getImportDataList({ taskId: 2, projectVersionId: 1, memberId, userId, schoolId, userToken }).then((res: any) => {
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
                setDataSources(dataSource)
                setOpenValue(false)
            })
            message.success('删除成功')
            form.setFieldsValue({
                titleValue: '',
                contentValue: '',
                conclusionValue: '',
            })
            setPromptValue('')
            setData([])
            setchooseData({})
            setNoValue('')
        })
    }
    //点击确认按钮，关闭模态框(导入)
    const handleOks = () => {
        // message.success('上传成功');
        setIsModalOpens(false);
        getList();
    }
    // 获取列表题目
    const getList = () => {
        // builder-查询导入数据列表接口
        getImportDataList({ taskId: 2, projectVersionId: 1, memberId, userId, schoolId, userToken }).then((res: any) => {
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
            setDataSources(dataSource)
        })
    }
    //点击取消按钮，关闭模态框
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalOpens(false);
        setIsModalOpenss(false);
    };
    //下载已有模版
    const downloadTemplate = () => {
        window.location.href = `${window.location.origin}/bus_xai_web/wenjaun.xlsx`;
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
    const [promptValue, setPromptValue] = useState<any>();//是否关联题目选项
    const [noValue, setNoValue] = useState<any>();//不与题目选项绑定的输入框的值
    const [promptValues, setPromptValues] = useState<any>();//获取大模型提示语关联题目
    const [chioceValue, setChioceValue] = useState();//获取关联题目
    const [chioceValueID, setChioceValueID] = useState();//获取关联题目id
    //是否关联题目选项
    const handleChange = (e: any) => {
        setPromptValue(e.target.value);
    };
    //关联题目选项value
    const handleChanges = (e: any) => {
        if (chooseData.value !== void 0) {
            let clone: any = JSON.parse(JSON.stringify(data));
            let dataIndex: any = clone.findIndex(((item: any) => item.value === chooseData.value));
            clone[dataIndex] = chooseData;
            setData(clone);
        }
        let choose: any = data.find(((item: any) => item.value === e.target.value));
        setchooseData(choose);
        setPromptValues(e.target.value);
    }
    // const [values, setvalues] = useState<any>('');//输入框的值
    const [chooseData, setchooseData] = useState<any>({});//选项文本框的值
    return (
        <div className={styles.all}>
            <Modal
                open={isModalOpen}
                footer={false}
                title={'问卷内容说明:'}
                onCancel={handleCancel}
                style={{ minWidth: '1000px' }}
            >
                <Form
                    form={form}
                    name="basic"
                    autoComplete="off"
                >
                    <Form.Item
                        label="问卷标题"
                        name="titleValue"
                        rules={[{ required: true, message: '问卷标题不可为空' }]}
                    >
                        <Input style={{ width: '862px', marginLeft: '1px' }}
                            allowClear={true}
                            showCount maxLength={20}
                            placeholder={'请输入问卷标题'}
                            size="medium" />
                    </Form.Item>

                    <Form.Item
                        label="问卷说明"
                        name="contentValue"
                        rules={[{ required: true, message: '问卷说明不可为空' }]}
                    >
                        <Input style={{ width: '862px', marginLeft: '1px' }}
                            showCount maxLength={200}
                            allowClear={true}
                            placeholder={'请输入问卷说明'}
                            size="medium" />
                    </Form.Item>
                    <Form.Item
                        label="问卷结束语"
                        name="conclusionValue"
                        rules={[{ required: true, message: '问卷结束语不可为空' }]}
                    >
                        <Input style={{ width: '847px', marginLeft: '1px' }}
                            allowClear={true}
                            placeholder={'请输入问卷结束语'}
                            showCount maxLength={50}
                            size="medium" />
                    </Form.Item>
                    <div>
                        <p style={{ color: 'rgb(0,0,0,0.88)', fontWeight: '600', fontSize: '16px' }}>编辑大模型提示语:</p>
                        <Radio.Group style={{ display: 'flex', justifyContent: 'space-evenly' }} options={options} onChange={handleChange} value={promptValue} />
                    </div>
                    {promptValue === '1' && (
                        <div style={{ position: 'relative' }}>
                            <p style={{ color: 'rgb(0,0,0,0.88)', fontWeight: '600', fontSize: '16px' }}>{chioceValue}</p>
                            <Radio.Group style={{ display: 'flex', justifyContent: 'space-evenly' }} options={data} onChange={handleChanges} value={promptValues} />
                            {/* <Input value={values} disabled
                                onChange={(e: any) => {
                                    setvalues(e);
                                }} maxLength={10} style={{ width: '50px', height: '20px', position: 'absolute', top: '43px', right: ' -22px' }}></Input> */}
                            <Input
                                style={{ width: '1000px', marginTop: '10px' }}
                                value={chooseData.inputValue}
                                onChange={(e: any) => {
                                    chooseData.inputValue = e;
                                    let clone: any = JSON.parse(JSON.stringify(chooseData));
                                    clone.inputValue = e;
                                    setchooseData(clone);
                                }}
                                type={'textarea'}
                            ></Input>
                        </div>
                    )}
                    {promptValue === '0' && (
                        <Input
                            style={{ width: '1000px', marginTop: '10px' }}
                            value={noValue}
                            onChange={(e: any) => {
                                setNoValue(e);
                            }}
                            type={'textarea'}
                        ></Input>
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
                <Button type='primary' danger style={{ marginLeft: 10 }} onClick={showModalss} >全部删除</Button>
            </div>
            {/* {isDataReady && listValue === '1' && ( */}
            <div>
                <SeenTable style={{ marginTop: '50px', minWidth: '100%', overflowX: 'none' }} scroll={{ x: 2000 }} columns={columns} dataSource={dataSources}></SeenTable >
            </div>
            {/* ) */}
            {/* } */}
        </div >
    );
};

export default AiSurveyQuestionnaire;