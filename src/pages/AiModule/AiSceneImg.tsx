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
import tushengwen from '@/assets/images/tushengwen.png';
import uploadspng from '@/assets/images/uploads.png';
import React, { useMemo, useRef } from 'react';
import Typewriter, { type TypewriterClass } from 'typewriter-effect';
import EventSourceStream from '../AiJobHunt/Home/DialogArea/EventSourceStream';
import styles from './AiSceneImg.less';
// import SpeechInputComponent from '../Recognition/index';
const { Dragger } = Upload;
interface TState {
    curTheme: any;
    dialogList: any;
    excludeId: any;
    editId: string;
    editName: string;
    imgId: any;
    data: any;
    baseData: any;
    allow: any;
    aiData: any;
    imgUrl: any;
    isLoading: any;
    messageArr: any;
    patams: any;
    visible: any;
    isTyping: any;
    messageList: any;
    typewriterArrCache: any;
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
    const state = useReactive<TState>({
        curTheme: undefined,
        dialogList: [],
        baseData: [],
        typewriterArrCache: [],
        editId: '',
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

    const renderPreview = (item: any) => {
        switch (item.elementType) {
            case 'file':
                return <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
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
                                                if (item.value === void 0) {
                                                    item.value = [];
                                                    item.value.push(items.value);
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
        }else{
            if(state.isLoading === false && state.typewriterArrCache.length === 0 ) {
                state.visible = false;
                state.messageList.push({
                    type: 2,
                    data: typewriterStrCache.current
                })
            }
        }
    }, [state.isTyping]);

    // useUpdateEffect(() => {
    //     if (
    //         (state.typewriterArrCache.length > 0 || state.isLoading) &&
    //         !state.isTyping &&
    //         typeWriter.current
    //     ) {
    //         state.isTyping = true;
    //         const curStr: string = state.typewriterArrCache.shift()! || '';
    //         typewriterStrCache.current += curStr;
    //         typeWriter
    //             .current!.typeString(curStr)
    //             .start()
    //             .callFunction(() => {
    //                 state.isTyping = false;
    //             });
    //     }else{
    //         if(state.isLoading === false && state.typewriterArrCache.length === 0 ) {
    //             alert('22222222222');
    //         }
    //     }
    // }, [state.isTyping]);

    const send = () => {
        let messages: any = state.data.find((element: any) => element.elementType === 'input');
        // let checks: any = state.data.find((element: any) => element.elementType === 'checkbox');
        state.messageList.push({
            data: messages.value,
            type: 1
        });
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
                        let sendData: any = {
                            picId: state.imgId,
                            pointCode: 'content',
                        }
                        clearInterval(interView);
                        state.visible = true;
                        state.isLoading = true;
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
                                onFinished: () => {
                                    state.isLoading = false;
                                },
                                onError: (error) => {
                                    console.log(error);
                                },
                                // 接收到数据
                                receiveMessage: (data) => {
                                    if (data) {
                                        state.typewriterArrCache.push(data!.answer);
                                    }
                                },
                            },
                        ).run();
                    } else if (res.recognizeResult === 3) {
                        clearInterval(interView);
                        state.messageList.push({
                            type: 2,
                            data: '识别失败',
                        });
                    }
                })
            }, 2000);
            console.log(interView);
        })
        // let error: any = false;
        // if (isArray(state.allow)) {
        //     if (state.allow[0] === '1') {
        //         let sendData: any = {};
        //         // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
        //         state.data &&
        //             // eslint-disable-next-line array-callback-return
        //             state.data.map((item: any) => {
        //                 if (item.value === void 0 || item.value === '') {
        //                     item.error = true;
        //                     error = true;
        //                 } else {
        //                     item.error = false;
        //                 }
        //                 sendData[item.name] = item.value;
        //             });
        //         if (error !== true) {
        //             state.visible = true;
        //             state.isLoading = true;
        //             typewriterStrCache.current = '';
        //             let qsData = {
        //                 ...queryData,
        //                 paramId: state.patams,
        //                 pluginCode: state.aiData.plugin?.code,
        //                 qsParams: sendData,
        //             };
        //             new EventSourceStream(
        //                 '/api/bus-xai/xai/plugin/create/stream',
        //                 {
        //                     method: 'POST',
        //                     data: qsData,
        //                     headers: {
        //                         'Content-Type': 'application/json',
        //                         Accept: 'text/event-stream',
        //                     },
        //                 },
        //                 {
        //                     // 结束，包括接收完毕所有数据、报错、关闭链接
        //                     onFinished: () => {
        //                         state.isLoading = false;
        //                         getHistoryList(state.patams, 1);
        //                     },
        //                     onError: (error) => {
        //                         console.log(error);
        //                     },
        //                     // 接收到数据
        //                     receiveMessage: (data) => {
        //                         if (data) {
        //                             console.log('2222222222', data.answer);
        //                             state.typewriterArrCache.push(data!.answer);
        //                         }
        //                     },
        //                 },
        //             ).run();
        //         }
        //     } else {
        //         message.warning('请先勾选并同意《AI内容生成功能使用说明》');
        //         return;
        //     }
        // } else {
        //     message.warning('请先勾选并同意《AI内容生成功能使用说明》');
        //     return;
        // }
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
        getPluginDetail({
            id: qsData.imageId,
            userId: '1',
            memberId: '1',
            schoolId: '1',
        }).then((res: any) => {
            state.data = JSON.parse(res.param?.params);
            state.aiData = res;
        });
    });

    return (
        <div className={styles.aicontainer}>
            <div className={styles.head}>{state.aiData.plugin?.name}</div>
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
                                  }).then((res: any)=> {
                                     state.imgId = JSON.parse(res.params)?.picId;
                                     state.excludeId = res.id;
                                     getFileUrl({
                                        id: JSON.parse(res.params)?.picId
                                     }).then((res1: any)=> {
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
                    
                    <div className={styles.warningBox} style={{ marginTop: 0 }}>
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
                                        <div className={styles.basetest} onClick={()=> {
                                            let inputs: any = state.data.find((element: any)=> element.elementType === 'input');
                                            if(inputs !== void 0) {
                                                inputs.value = el.example;
                                            }
                                        }}>试一试</div>
                                    </div>
                                })
                            }

                        </div>
                    </div>
                    <div className={styles.messageList}>
                        {
                            state.messageList && state.messageList.map((item: any) => {
                                return <>
                                    {
                                        item.type === 1 ? <div className={styles.send}>
                                            <div className={styles.sendData}>{item.data}</div>
                                            <img src={''} style={{ width: 32, height: 32, marginLeft: 16, borderRadius: '50%', }}></img>
                                        </div> : <div className={styles.receive}>
                                            <img src={aiimg} style={{ width: 24, height: 24, marginRight: 16, borderRadius: '50%', }}></img>
                                            <div className={styles.sendData}>{item.data}</div>
                                        </div>
                                    }
                                </>
                            })
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
