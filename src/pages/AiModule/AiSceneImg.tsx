/* eslint-disable array-callback-return */
import confings from '@/assets/images/configs.png';
import aiimg from '@/assets/images/rebotIcon.png';
import { getPluginDetail, saveImg, getPresetAnswer, recogNize, recogNizeResult, getFileUrl } from '@/services/aiModule';
import { getConvertParamId } from '@/services/aiJobHunt/index';
import { Button, ComboBox, Input, Select, Upload } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useCreation, useMount, useReactive, useUpdateEffect } from 'ahooks';
import { message } from 'antd';
import classNames from 'classnames';
import { exampleRandom } from '@/services/sentimentAnalysis';
import { isArray } from 'lodash';
import tushengwen from '@/assets/images/tushengwen.png';
import uploadspng from '@/assets/images/uploads.png';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Typewriter, { type TypewriterClass } from 'typewriter-effect';
import EventSourceStream from '../AiJobHunt/Home/DialogArea/EventSourceStream';
import styles from './AiSceneImg.less';
import { uploads } from '@/services/aiOCR';
import copyIcon from '@/assets/images/copyIcon.png'
// import SpeechInputComponent from '../Recognition/index';
const { Dragger } = Upload;
interface TState {
    curTheme: any;
    dialogList: any;
    userImg: any;
    excludeId: any;
    editId: string;
    editName: string;
    imgId: any;
    data: any;
    baseData: any;
    allow: any;
    introduce: any;
    aiData: any;
    imgUrl: any;
    isLoading: any;
    messageArr: any;
    patams: any;
    visible: any;
    isTyping: any;
    messageList: any;
    typewriterArrCache: any;
    status: any;
}

const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
);

const JobHunt: React.FC = () => {
    const queryData = useCreation(() => {
        return JSON.parse(window.sessionStorage.getItem('commonDatas') || '{}');
    }, []);
    const typeWriter = useRef<TypewriterClass | null>(null);
    const typewriterStrCache = useRef<string>('');
    const [shouldPaste, setShouldPaste] = useState(false);
    const state = useReactive<TState>({
        curTheme: undefined,
        introduce: false,
        status: 'ending',
        dialogList: [],
        baseData: [],
        typewriterArrCache: [],
        editId: '',
        userImg: '',
        excludeId: '',
        messageArr: [],
        isLoading: false,
        isTyping: false,
        messageList: [],
        allow: '',
        aiData: {},
        imgUrl: '',
        editName: '',
        imgId: '',
        visible: false,
        patams: '',
        data: [],
    });

    const imgProps: any = {
        name: 'file',
        seenOss: {
            url: '/api/bus-xai/dbe3.private.params.upload.get',
            extraParams,
        },
        beforeUpload: (file: any) => {
            console.log('type', file.type);
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];

            if (!allowedFormats.includes(file.type)) {
                message.warning('请上传图片，支持jpg,jpeg,png格式');
                return false;
            }
            const maxSize = 1 * 1024 * 1024;
            if (file.size > maxSize) {
                message.warning('图片过大，请上传1MB以内图片');
                return false;
            }
            return true;
        },


        onChange: (info: any) => {
            const { status } = info.file;
            if (status === 'done') {
                message.success('上传成功');
                state.imgUrl = info.file.key;
                state.imgId = info.file.id;
                saveImg({
                    picUrl: info.file.key,
                    paramId: state.patams,
                }).then((res: any) => {
                    state.imgId = res.id;
                })
            } else if (status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
        onDrop(e: any) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
            setShouldPaste(true);
        }
    };
    const handlePaste = (event: any) => {
        if (!shouldPaste) return
        setShouldPaste(false);
        const items = (event.clipboardData || event.originalEvent.clipboardData)
            .items;
        let file = null;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                file = items[i].getAsFile();
                break;
            }
        }
        if (file) {
            let allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];

            if (!allowedFormats.includes(file.type)) {
                message.warning('请上传图片，支持jpg,jpeg,png格式');
                return;
            }
            let maxSize = 1 * 1024 * 1024;
            if (file.size > maxSize) {
                message.warning('图片过大，请上传1MB以内图片');
                return;
            }
            let param = new FormData();
            param.append('file', file);
            uploads({
                bucketNameType: 'pub',
                ossResCategory: 'builder',
                objectKey: `/res/task/${file.name}` || '',
            })
                .then((res) => {
                    // 处理fentch 的response
                    if (!res) {
                        message.error('获取OSS上传参数失败');
                        return Promise.reject('获取OSS上传参数失败');
                    } else {
                        const formData = new FormData();
                        Object.keys(res.tokenParams).forEach((key) => {
                            formData.append(key, res.tokenParams[key]);
                        });
                        formData.append('file', file);
                        fetch(res.endpoint, {
                            method: 'POST',
                            body: formData,
                        }).then((rst) => {
                            if (rst.ok) {
                                state.imgUrl = res.file_url;
                                saveImg({
                                    picUrl: res.file_url,
                                    paramId: state.patams,
                                }).then((res: any) => {
                                    state.imgId = res.id;
                                })
                            }
                        });
                    }
                })
                .catch(() => {
                    return Promise.reject('获取OSS上传参数失败');
                });
        }
    };
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown as EventListener);
        document.addEventListener('paste', handlePaste as EventListener);

        return () => {
            document.removeEventListener('keydown', handleKeyDown as EventListener);
            document.removeEventListener('paste', handlePaste as EventListener);
        };
    }, [shouldPaste]);

    const renderPreview = (item: any) => {
        switch (item.elementType) {
            case 'file':
                return <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Upload {...imgProps} showUploadList={false}><Button icon={<img src={uploadspng} style={{ width: 16, height: 16, marginRight: 4 }}></img>} style={{ width: 92, marginTop: 12 }} size={'small'} type='primary'>上传图片</Button></Upload>
                    <Dragger {...imgProps} showUploadList={false}>
                        <div className={styles.previewBox} style={{ width: '100%', height: 178, display: 'flex', marginTop: 8, justifyContent: 'center', flexDirection: 'column', cursor: 'pointer', color: '#333333', fontSize: 14, lineHeight: '21px' }}>
                            <img src={state.imgUrl === '' ? tushengwen : state.imgUrl} style={{ position: 'absolute', width: '100%', height: 178 }}></img>
                            {
                                state.imgUrl === '' ? <>
                                    <div className={styles.file_text}>支持jpg、jpeg、png、1MB以内</div>
                                    <div className={styles.file_text}>或将图片拖到这里</div>
                                    <div className={styles.file_text}>或按【ctrl+v】粘贴到这里</div>
                                    <div className={styles.file_text}>或点击此处【上传】</div>
                                </> : ''
                            }
                        </div>
                    </Dragger>
                </div>
            case 'input':
                return (
                    <div className={styles.previewBox}>
                        {
                            item.error === true && <div className={styles.errorBox}>未输入，请输入！</div>
                        }
                        <div className={styles.previewTitle}>{item.displayName}</div>
                        <Input
                            maxLength={item.maxLength}
                            showCount={true}
                            type={Number(item.maxLength) < 30 ? 'default' : 'textarea'}
                            style={{ width: '100%' }}
                            placeholder={item.placeholder}
                            value={item.value}
                            onChange={(e: any) => {
                                item.value = e;
                                if (e !== '') {
                                    item.error = false;
                                }
                                if (e === '/') {
                                    state.introduce = true;
                                }
                            }}
                        ></Input>
                    </div>
                );
            case 'select':
                return (
                    <div className={styles.previewBox}>
                        {
                            item.error === true && <div className={styles.errorBox}>未选择，请选择！</div>
                        }
                        <div className={styles.previewTitle}>{item.displayName}</div>
                        <Select
                            style={{ width: '100%' }}
                            value={item.value}
                            placeholder={item.placeholder}
                            option={item.options}
                            onChange={(e: any) => {
                                item.value = e;
                                if (e !== '') {
                                    item.error = false;
                                }
                            }}
                        ></Select>
                    </div>
                );
            case 'treeSelect':
                return (
                    <div className={styles.previewBox}>
                        {
                            item.error === true && <div className={styles.errorBox}>未选择，请选择！</div>
                        }
                        <div className={styles.previewTitle}>{item.displayName}</div>
                        <ComboBox
                            style={{ width: '100%' }}
                            onChange={(e: any) => {
                                item.value = e.target.value;
                                if (e !== '') {
                                    item.error = false;
                                }
                            }}
                            value={item.value}
                            options={item.options}
                        ></ComboBox>
                    </div>
                );
            case 'radio':
                return (
                    <div className={styles.previewBox}>
                        {
                            item.error === true && <div className={styles.errorBox}>未选择，请选择！</div>
                        }
                        <div className={styles.previewTitle}>{item.displayName}</div>
                        <ComboBox
                            style={{ width: '100%' }}
                            onChange={(e: any) => {
                                item.value = e.target.value;
                                if (e !== '') {
                                    item.error = false;
                                }
                            }}
                            value={item.value}
                            options={item.options}
                        ></ComboBox>
                    </div>
                );
            case 'selectCheck':
                return (
                    <div className={styles.previewBox}>
                        {
                            item.error === true && <div className={styles.errorBox}>未选择，请选择！</div>
                        }
                        <div className={styles.previewTitle}>{item.displayName}</div>
                        <div className={styles.previewCheckBox}>
                            {item.options &&
                                item.options.map((items: any) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                if (item.value === void 0) {
                                                    item.value = [];
                                                    item.value.push(items.value);
                                                    item.error = false;
                                                } else {
                                                    if (item.value?.includes(items.value)) {
                                                        console.log(JSON.stringify(item.value));
                                                        let delIndex: any = item.value.findIndex(
                                                            (el: any) => el === items.value,
                                                        );
                                                        console.log(delIndex);
                                                        item.value.splice(delIndex, 1);
                                                    } else {
                                                        item.value.push(items.value);
                                                        item.error = false;
                                                    }
                                                }
                                            }}
                                            key={items.id}
                                            style={{
                                                border: item.value?.includes(items.value)
                                                    ? '1px solid rgb(86, 114, 255)'
                                                    : '1px solid rgba(0, 0, 0, 0.25)',
                                            }}
                                            className={styles.previewCheck}
                                        >
                                            {items.label}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                );
            case 'checkbox':
                return (
                    <div className={styles.previewBox}>
                        {
                            item.error === true && <div className={styles.errorBox}>未选择，请选择！</div>
                        }
                        <div className={styles.previewTitle}>{item.displayName}</div>
                        <div className={styles.previewCheckBox}>
                            {item.options &&
                                item.options.map((items: any) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                item.options.forEach((el: any) => el.choose = false);
                                                items.choose = true;
                                                item.value = items.value;
                                                console.log(JSON.stringify(state.data))
                                            }}
                                            key={items.id}
                                            style={{
                                                border: item.value === items.value
                                                    ? '1px solid rgb(86, 114, 255)'
                                                    : '1px solid rgba(0, 0, 0, 0.25)',
                                            }}
                                            className={styles.previewCheck}
                                        >
                                            {items.label}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                );
        }
    };

    // 是否完成对话
    const isTypeFinished = useMemo(() => {
        return (
            state.typewriterArrCache.length === 0 &&
            !state.isTyping &&
            !state.isLoading
        );
    }, [state.typewriterArrCache, state.isLoading, state.isTyping]);

    useUpdateEffect(() => {
        if (
            (state.typewriterArrCache.length > 0 || state.isLoading) &&
            !state.isTyping &&
            typeWriter.current
        ) {
            state.isTyping = true;
            const curStr: string = state.typewriterArrCache.shift()! || '';
            typewriterStrCache.current += curStr;
            typeWriter
                .current!.typeString(curStr)
                .start()
                .callFunction(() => {
                    state.isTyping = false;
                });
        } else {
            if (state.isLoading === false && state.typewriterArrCache.length === 0) {
                console.log('22222222222222', state.status);
                state.visible = false;
                if (state.status !== 'ending') {
                    state.messageList.push({
                        type: 2,
                        data: typewriterStrCache.current
                    })
                }
            }
        }
    }, [state.isTyping]);

    const send = () => {
        if (isArray(state.allow)) {
            if (state.allow[0] === '1') {
                let messages: any = state.data.find((element: any) => element.elementType === 'input');
                let checks: any = state.data.find((element: any) => element.elementType === 'checkbox');
                if (messages.value === '' || messages.value === void 0) {
                    message.warning('请输入描述场景');
                    return;
                }
                if (state.imgId === '' || state.imgId === void 0) {
                    message.warning('请先上传图片');
                    return;
                }
                state.isLoading = true;
                state.messageList.push({
                    data: messages.value,
                    type: 1
                });
                state.status = 'waiting';
                recogNize({
                    paramId: state.patams,
                    id: state.imgId,
                }).then((res: any) => {
                    console.log(res);
                    const interView = setInterval(() => {
                        recogNizeResult({
                            id: state.imgId,
                        }).then((res: any) => {
                            console.log(res);
                            if (res.recognizeResult === 2) {
                                let testData: any = {
                                    '内容': 'content',
                                    '情感': 'emotion',
                                    '风格': 'style',
                                    '故事': 'story',
                                    '关系': 'relation',
                                    '场景': 'scene',
                                    '联想': 'associate',
                                    '时空': 'space',
                                };
                                let sendData: any = {
                                    picId: state.imgId,
                                    pointCode: testData[checks.value],
                                }
                                clearInterval(interView);
                                state.visible = true;
                                typewriterStrCache.current = '';
                                let qsData = {
                                    ...queryData,
                                    paramId: state.patams,
                                    pluginCode: 'pictotext',
                                    qsParams: sendData,
                                    userMessage: messages.value
                                    // userMessage: '根据图片内容，创作一首包含标题和内容的'
                                };
                                new EventSourceStream(
                                    '/api/bus-xai/xai/plugin/create/stream',
                                    {
                                        method: 'POST',
                                        data: qsData,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Accept: 'text/event-stream',
                                        },
                                    },
                                    {
                                        // 结束，包括接收完毕所有数据、报错、关闭链接
                                        onFinished: (code: any) => {
                                            if (code === '500') {
                                                state.visible = false;
                                                state.messageList.push({
                                                    type: 2,
                                                    data: '请更换图片或提问内容，重新生成。'
                                                });
                                                state.status = 'ending';
                                                // state.typewriterArrCache.push('请更换图片或提问内容，重新生成。')
                                            }
                                            state.isLoading = false;
                                        },
                                        onError: (error) => {
                                            console.log(error);
                                        },
                                        // 接收到数据
                                        receiveMessage: (data) => {
                                            if (data) {
                                                state.status = 'pending';
                                                state.typewriterArrCache.push(data!.answer);
                                            }
                                        },
                                    },
                                ).run();
                            } else if (res.recognizeResult === 3) {
                                state.status = 'ending';
                                clearInterval(interView);
                                state.messageList.push({
                                    type: 2,
                                    data: res.recognizeErrMsg || '',
                                });
                                state.isLoading = false;
                            }
                        })
                    }, 2000);
                    console.log(interView);
                })
            } else {
                message.warning('请先勾选并同意《AI内容生成功能使用说明》');
                return;
            }
        }
        else {
            message.warning('请先勾选并同意《AI内容生成功能使用说明》');
            return;
        }
    };

    useMount(() => {
        getPresetAnswer({}).then((res: any) => {
            console.log(res);
            state.baseData = res;
        })
        getConvertParamId({}).then((res: any) => {
            state.patams = res;
        });
        let qsData: any = JSON.parse(window.sessionStorage.getItem('commonDatas') as any);
        state.userImg = qsData?.userImg;
        getPluginDetail({
            id: qsData.imageId,
            userId: '1',
            memberId: '1',
            schoolId: '1',
        }).then((res: any) => {
            let clone: any = JSON.parse(JSON.stringify(JSON.parse(res.param?.params)));
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            clone && clone.map((el: any) => {
                if (el.elementType === 'checkbox') {
                    console.log(el);
                    el.value = '内容';
                }
            });
            console.log(';22222', JSON.stringify(clone));
            state.data = clone;
            state.aiData = res;
        });
    });

    const copyText = (data: any) => {
        navigator.clipboard
            .writeText(data)
            .then(() => {
                message.success('复制成功!');
            })
            .catch((err) => {
                message.error('复制失败，请重新尝试！');
                console.error('Copy to clipboard failed', err);
            });
    }

    return (
        <div className={styles.aicontainer}>
            {/* <div className={styles.head}>{state.aiData.plugin?.name}</div> */}
            <div className={styles.head}>{'AI图生文'}</div>
            <div className={styles.content}>
                <div className={styles.left_content}>
                    <div className={styles.config_head}>
                        <img
                            src={confings}
                            style={{ width: 16, height: 16, marginRight: 4 }}
                        ></img>
                        <div>生成配置</div>
                        <div
                            className={styles.confing_text}
                            onClick={() => {
                                exampleRandom({
                                    pluginCode: 'pictotext',
                                    excludeId: state.excludeId,
                                }).then((res: any) => {
                                    state.imgId = JSON.parse(res.params)?.picId;
                                    state.excludeId = res.id;
                                    getFileUrl({
                                        id: JSON.parse(res.params)?.picId
                                    }).then((res1: any) => {
                                        state.imgUrl = res1.picUrl;
                                    })
                                })
                            }}
                        >
                            随机示例
                        </div>
                    </div>
                    <div className={styles.left_top}>
                        {/* <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Button icon={<img src={uploadspng} style={{ width: 16, height: 16, marginRight: 4 }}></img>} style={{ width: 92, marginTop: 12 }} size={'small'} type='primary'>上传图片</Button>
                            <Dragger {...imgProps} showUploadList={false}>
                                <div className={styles.previewBox} style={{ width: '100%', height: 178, display: 'flex', marginTop: 8, justifyContent: 'center', flexDirection: 'column', cursor: 'pointer', color: '#333333', fontSize: 14, lineHeight: '21px' }}>
                                    <img src={state.imgUrl === '' ? tushengwen : state.imgUrl} style={{ position: 'absolute', width: '100%', height: 178 }}></img>
                                    {
                                        state.imgUrl === '' ? <>
                                            <div className={styles.file_text}>支持jpg、jpeg、png、1MB以内</div>
                                            <div className={styles.file_text}>或将图片拖到这里</div>
                                            <div className={styles.file_text}>或按【ctrl+v】粘贴到这里</div>
                                            <div className={styles.file_text}>或点击此处【上传】</div>
                                        </> : ''
                                    }
                                </div>
                            </Dragger>
                        </div> */}
                        {state.data &&
                            state.data.map((item: any) => {
                                return renderPreview(item);
                            })}
                    </div>
                    <div className={styles.left_bottom}>
                        <Button
                            disabled={state.isLoading || state.typewriterArrCache.length > 0}
                            type="primary"
                            onClick={() => {
                                send();
                            }}
                        >
                            AI生成
                        </Button>
                        <div
                            style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}
                        >
                            <ComboBox
                                type="checkbox"
                                options={[
                                    {
                                        label: '',
                                        value: '1',
                                    },
                                ]}
                                value={state.allow}
                                onChange={(e: any) => {
                                    state.allow = e;
                                }}
                            ></ComboBox>
                            <div
                                style={{ fontSize: 12, color: '#666666', lineHeight: '12px' }}
                            >
                                我已阅读并同意《AI内容生成功能使用说明》
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mid_content}>
                    <div className={styles.warningBox}>
                        <img
                            src={aiimg}
                            style={{ width: 24, height: 24, marginRight: 16 }}
                        ></img>
                        <div className={styles.warning}>
                            <div>{state.aiData.plugin?.tips}</div>
                            <div className={styles.subwarning}>
                                {state.aiData.plugin?.note}
                            </div>
                        </div>
                    </div>
                    {
                        state.introduce && <div className={styles.warningBox} style={{ marginTop: 20 }}>
                            <img
                                src={aiimg}
                                style={{ width: 24, height: 24, marginRight: 16 }}
                            ></img>
                            <div className={styles.warningbase}>
                                <div className={styles.baseTitle}>你可以这么提问：</div>
                                {
                                    state.baseData && state.baseData.map((el: any, index: any) => {
                                        return <div key={el.id} style={{ borderBottom: index === state.baseData.length - 1 ? 'none' : '1px solid #F0E8FF' }} className={styles.titleBox}>
                                            <div>{el.example}</div>
                                            <div className={styles.basetest} onClick={() => {
                                                let inputs: any = state.data.find((element: any) => element.elementType === 'input');
                                                if (inputs !== void 0) {
                                                    inputs.value = el.example;
                                                }
                                                let check: any = state.data.find((checks: any) => checks.elementType === 'checkbox');
                                                check.value = el.pointName;

                                            }}>试一试</div>
                                        </div>
                                    })
                                }

                            </div>
                        </div>
                    }
                    <div className={styles.messageList}>
                        {
                            state.messageList && state.messageList.map((item: any) => {
                                return <>
                                    {
                                        item.type === 1 ? <div className={styles.send}>
                                            <div className={styles.sendData}>{item.data}</div>
                                            <img src={state.userImg} style={{ width: 32, height: 32, marginLeft: 16, borderRadius: '50%', }}></img>
                                        </div> : <div className={styles.receive}>
                                            <img src={aiimg} style={{ width: 24, height: 24, marginRight: 16, borderRadius: '50%', }}></img>
                                            <div className={styles.sendData}>
                                                {item.data}
                                                <img src={copyIcon} style={{ width: 15, height: 15 }} onClick={() => copyText(item.data)} />
                                            </div>
                                        </div>
                                    }
                                </>
                            })
                        }
                        {
                            state.status === 'waiting' && <div className={styles.receive}>
                                <img src={aiimg} style={{ width: 24, height: 24, marginRight: 16, borderRadius: '50%', }}></img>
                                <div className={styles.sendData}>{'等我想想...'}</div>
                            </div>
                        }
                    </div>
                    {state.visible && (
                        <div>
                            <span className={classNames(sf.sFs14, sf.sFwBold)}>
                                {isTypeFinished ? (
                                    <div className={styles.warningBox} style={{ marginTop: 24 }}>
                                        <img
                                            src={aiimg}
                                            style={{ width: 24, height: 24, marginRight: 16 }}
                                        ></img>
                                        <div className={styles.finallText}>
                                            {typewriterStrCache.current}
                                            {/* <pre className={styles.texts} style={{ whiteSpace: 'pre-wrap', margin: 0, color: '#272648', fontSize: 14, lineHeight: '24px',fontWeight: 400 }}>
                    {typewriterStrCache.current}
                  </pre> */}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.warningBox} style={{ marginTop: 24 }}>
                                        <img
                                            src={aiimg}
                                            style={{ width: 24, height: 24, marginRight: 16 }}
                                        ></img>
                                        <div className={styles.warnings}>
                                            <Typewriter
                                                onInit={(typewriter: TypewriterClass) => {
                                                    state.isTyping = true;
                                                    typeWriter.current = typewriter;
                                                    typewriter
                                                        .typeString('')
                                                        .start()
                                                        .callFunction(() => {
                                                            state.isTyping = false;
                                                        });
                                                }}
                                                options={{
                                                    delay: 25,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobHunt;
