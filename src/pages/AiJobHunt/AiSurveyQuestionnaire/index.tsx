import React, { useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import styles from './index.less';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload, Form, Input } from 'SeenPc';
import qs from 'qs';
import { history } from 'umi';

type FieldType = {
    问卷标题?: any;
    问卷说明?: any;
    问卷结束语?: any;
};
const AiSurveyQuestionnaire: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);//保存模态框是否打开
    const [isModalOpens, setIsModalOpens] = useState(false);//导入模态框是否打开
    const [titleValue, setTitleValue] = useState<any>('');//模态框中的问卷标题输入框的值
    const [contentValue, setContentValue] = useState<any>('');//模态框中的问卷说明输入框的值
    const [conclusionValue, setConclusionValue] = useState<any>('');//模态框中的问卷结束语输入框的值

    // const { qs: queryStr } = history.location.query as any;
    // // 从location.query获取参数
    // const Param = qs.parse(window.atob(queryStr));
    const Param = qs.parse(window.atob(window.sessionStorage.getItem('qs') || '{}'));
    // console.log(Param);
    // localStorage.setItem('Param', JSON.stringify(Param));
    // 提取必要的参数
    const { projectVersionId, taskId, memberId, userId, schoolId, userToken } = Param;

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
                message.warning('请上传文件，仅支持xls,xlsx格式')
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
                console.log(info)
            }
            if (status === 'done') {
                message.success(`${info.file.name} 上传成功.`);
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
    //点击确认按钮，关闭模态框(保存)
    const handleOk = () => {
        if (titleValue === '' || contentValue === '' || conclusionValue === '') {
            message.error('请填写完整问卷内容');
        }
        else {
            setIsModalOpen(false);
            setTitleValue('');
            setContentValue('');
            setConclusionValue('');
        }
    };
    //点击确认按钮，关闭模态框(导入)
    const handleOks = () => {
        setIsModalOpens(false);
    }
    //点击取消按钮，关闭模态框
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalOpens(false);
    };
    //下载已有模版
    const downloadTemplate = () => {
        window.location.href = '../../../public/wenjuan.xlsx';
    }

    return (
        <div className={styles.all}>
            <Modal
                open={isModalOpen}
                footer={false}
                title={'问卷内容说明:'}
                destroyOnClose={true}
                onCancel={handleCancel}
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
                    <Form.Item style={{ position: 'relative' }}>
                        <Button style={{ lineHeight: '100%', backgroundColor: '#fff', borderColor: '#d9d9d9', position: 'absolute', right: '100px', top: '10px' }} type="text" htmlType="submit" onClick={() => { setIsModalOpen(false); }
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
                    <Button type="primary" onClick={downloadTemplate} style={{ marginBottom: 10, }}>样例模板</Button></div>
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
            <div className={styles.mainbtn}>
                <Button type="primary" onClick={showModals}>导入</Button>
                <Button style={{ marginLeft: 10 }} onClick={showModal}>保存</Button>
            </div>
        </div>
    );
};

export default AiSurveyQuestionnaire;