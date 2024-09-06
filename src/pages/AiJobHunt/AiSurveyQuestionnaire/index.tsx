import React, { useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { Input } from 'SeenPc';
import styles from './index.less';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'SeenPc';

const AiSurveyQuestionnaire: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);//保存模态框是否打开
    const [isModalOpens, setIsModalOpens] = useState(false);//导入模态框是否打开
    const [titleValue, setTitleValue] = useState<any>('');//模态框中的问卷标题输入框的值
    const [contentValue, setContentValue] = useState<any>('');//模态框中的问卷说明输入框的值
    const [conclusionValue, setConclusionValue] = useState<any>('');//模态框中的问卷结束语输入框的值
    //上传文件
    const { Dragger } = Upload;

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        listType: 'text',
        maxCount: 1,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
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
    const downloadTemplate = async () => {
        try {
            const response = await fetch('./wenjuan.xlsx');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'wenjuan.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('下载文件时出现错误：', error);
        }
    };
    // const downloadTemplate = () => {
    //     window.location.href = './wenjuan.xlsx';
    // }

    return (
        <div className={styles.all}>
            <Modal title="问卷内容说明:" okText={"保存"} cancelText={"取消"} destroyOnClose={true} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: 120,
                        justifyContent: 'space-evenly',
                    }}
                >
                    <div>
                        <span>问卷标题：</span>
                        <Input
                            // style={{ width: 380, position: 'absolute', right: 24 }}
                            showCount maxLength={20}
                            value={titleValue}
                            onChange={(e: any) => {
                                setTitleValue(e);
                            }}
                            size="small"
                        ></Input>
                    </div>
                    <div>
                        <span>问卷说明：</span>
                        <Input
                            // style={{ width: 380, position: 'absolute', right: 24 }}
                            showCount maxLength={200}
                            value={contentValue}
                            onChange={(e: any) => {
                                setContentValue(e);
                            }}
                            size="small"
                        ></Input>
                    </div>
                    <div>
                        <span>问卷结束语：</span>
                        <Input
                            // style={{ width: 380, position: 'absolute', right: 24 }}
                            showCount maxLength={50}
                            value={conclusionValue}
                            onChange={(e: any) => {
                                setConclusionValue(e);
                            }}
                            size="small"
                        ></Input>
                    </div>
                </div>
            </Modal>
            <Modal title="问卷模版:" okText={"确定"} cancelText={"取消"} open={isModalOpens} onOk={handleOks} onCancel={handleCancel}>
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
            <div className={styles.btn}>
                <Button type="primary" onClick={showModals}>导入</Button>
                <Button onClick={showModal}>保存</Button>
            </div>
        </div>
    );
};

export default AiSurveyQuestionnaire;
