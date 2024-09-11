import React, { useEffect, useState } from 'react'
import styles from './index.less';
import { deletePic, FruitRecognition, getImageList, uploadPic, uploads } from '@/services/aiOCR';
import { useMount, useReactive } from 'ahooks';
import { Upload } from 'SeenPc';
import { Input, message, Modal, Spin } from 'antd';
const { Dragger } = Upload;
import zoomOut from '@/assets/images/zoomOut@2x.png';
import zoomIn from '@/assets/images/zoomIn@2x.png';
import copy from '@/assets/images/copy@2x.png';
import refresh from '@/assets/images/refresh@2x.png';
import err from '@/assets/images/err@2x.png';
import { getConvertParamId } from '@/services/aiJobHunt';
import { CloseCircleFilled } from '@ant-design/icons';
import ImageAnnotator from '../AiOCR/ImageAnnotator';

type TState = {
    preData: any[];
    message: any;
    isCheck: boolean; //点击校验
    isSelect: any;
    isrec: boolean;
    isHover: boolean;
    IdentifyData: any[];
    imgUrl: any,
    isLoading: boolean;
    isValid: boolean;
    timer: any;
    isChooseFirst: boolean;
    isPreset: boolean;
}
const AiFVR: React.FC = ({ }) => {
    const [scale, setScale] = useState(1);
    const [shouldPaste, setShouldPaste] = useState(false);
    const state = useReactive<TState>({
        preData: [],
        message: '',
        isCheck: false,
        isSelect: '',
        isrec: false,
        isHover: false,
        IdentifyData: [],
        imgUrl: '',
        isLoading: false,
        isValid: false,
        timer: null,
        isChooseFirst: true,
        isPreset: false,
    });
    const handleZoomOut = () => {
        let newScale = scale - 0.1;
        newScale = parseFloat(newScale.toFixed(1));
        setScale(newScale > 0.1 ? newScale : 0.1);
    };

    const handleZoomIn = () => {
        let newScale = scale + 0.1;
        newScale = parseFloat(newScale.toFixed(1));
        setScale(newScale < 3 ? newScale : 3);
    };
    const copyText = () => {
        const wordsText = state.IdentifyData.map((item: any, index: any) => `${index + 1}\t${item.name}\t${item.score.toFixed(3)}`).join('\n');
        navigator.clipboard.writeText(wordsText)
            .then(() => {
                message.success('复制成功!');
            })
            .catch((err) => {
                message.error('复制失败，请重新尝试！');
                console.error('Copy to clipboard failed', err);
            });
    }
    const refreshText = () => {
        state.IdentifyData = [];
        state.isChooseFirst = false
        postTextRecognition(state.imgUrl, state.isSelect, state.isPreset)
    }
    const postTextRecognition = async (url: any, picUid: any, isPreset: any) => {
        state.isLoading = true;
        try {
            const recognitionResults = await FruitRecognition({ url, picUid, isPreset });
            const recognitionResult = recognitionResults.note
            const recognitionUrl = recognitionResults.url;
            const res = await getImageList();
            state.preData = res;
            const { id, url: imageUrl, note, Preset } = state.preData[0];
            if (state.isChooseFirst) {
                selectImage(id, imageUrl, note, Preset);
            } else {
                selectImage(picUid, recognitionUrl, recognitionResult, isPreset)
            }
        } catch (err) {
            console.error("An error occurred during text recognition:", err);
        } finally {
            state.isLoading = false;
            state.isSelect = picUid
        }
    };

    const uploadPics = (url: any) => {
        // url = 'https://dbe3-public.oss-cn-beijing.aliyuncs.com/bus-runner/undefined/task/1723115090995/doujiao.png'
        uploadPic({
            url
        }).then(res => {
            getImageList().then(res => {
                state.preData = res
                state.imgUrl = state.preData[0].url
                postTextRecognition(state.preData[0].url, state.preData[0].picUid, state.preData[0].isPreset ? 1 : 0)
            })
        })
    }

    const extraParams = JSON.parse(
        window.sessionStorage.getItem('queryParams') || '{}',
    );
    const props: any = {
        name: 'file',
        seenOss: {
            url: '/api/bus-xai/dbe3.private.params.upload.get',
            extraParams
        },
        beforeUpload: (file: any) => {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];

            if (!allowedFormats.includes(file.type)) {
                message.warning('上传的图片不符合要求，请重新选择合适的图片')
                return false;
            }
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                message.warning('上传的图片不符合要求，请重新选择合适的图片');
                return false;
            }
            if (state.preData.length > 19) {
                message.warning('图片已满，请删除图片后，再上传')
                return false
            }

            return true;
        },

        onChange(info: any) {
            state.IdentifyData = []
            state.isSelect = ""
            const { status } = info.file;
            if (status === 'done') {
                console.log(`${info.file.name} file uploaded successfully.`);
                state.isrec = true;
                state.isLoading = true;
                uploadPics(info.file.key)
            } else if (status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const getImageLists = () => {
        getImageList().then(res => {
            state.preData = res
        })
    }
    const selectImage = (id: any, url: any, note: any, isPreset: any) => {
        setScale(1)
        state.isPreset = isPreset
        state.isSelect = id
        state.imgUrl = url
        state.isrec = true;
        if (typeof note === 'string') {
            state.IdentifyData = JSON.parse(note);
        } else {
            state.IdentifyData = note || [];
        }
    }

    const delImage = (index: any) => {
        if (state.isPreset == true) return;
        Modal.confirm({
            title: '你确定要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                deletePic({ picUid: state.isSelect }).then((res) => {
                    if (index < 0) {
                        if (state.preData.length > 1) {
                            selectImage(
                                state.preData[1].picUid,
                                state.preData[1].url,
                                state.preData[1].note,
                                state.preData[1].isPreset,
                            );
                        }
                        getImageLists();
                        return;
                    }
                    let item = state.preData[index];
                    selectImage(
                        item.picUid,
                        item.url,
                        item.note,
                        item.isPreset,
                    );
                    getImageLists();
                });
            },
            onCancel() { },
        });
    };

    useMount(() => {
        const queryParams = JSON.parse(
            window.sessionStorage.getItem('queryParams') || '{}',
        );
        getConvertParamId(queryParams)
            .then((id) => {
                window.sessionStorage.setItem(
                    'queryParams',
                    JSON.stringify({ ...queryParams, paramId: id }),
                );
            }).then(() => { getImageLists() })

    })

    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
            setShouldPaste(true);
        }
    };
    const handlePaste = (event: any) => {
        if (shouldPaste) {
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
                let maxSize = 2 * 1024 * 1024;
                if (file.size > maxSize) {
                    message.warning('图片过大，请上传2MB以内图片');
                    return;
                }
                if (state.preData.length > 19) {
                    message.warning('图片已满，请删除图片后，再上传');
                    return;
                }
                state.IdentifyData = [];
                state.isrec = true;
                state.isLoading = true;
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
                                    uploadPics(res.file_url);
                                }
                            });
                        }
                    })
                    .catch(() => {
                        return Promise.reject('获取OSS上传参数失败');
                    });
            }
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
    return (
        <div className={styles.aiFvr}>
            <div className={styles.title}>果蔬识别</div>
            <div className={styles.bottom}>
                <div className={styles.content}>
                    <div className={state.isrec ? styles.aleft : styles.left}>
                        {state.isrec && state.preData.length > 0 ? (
                            <div className={styles.imageAnnotator}>
                                <ImageAnnotator
                                    imageSrc={state.imgUrl}
                                    annotations={state.IdentifyData}
                                    angle={0}
                                    scale={scale}
                                    disabled={true}
                                />
                            </div>
                        ) : (
                            <Dragger
                                className='dragger'
                                {...props}
                                showUploadList={false}
                                onMouseEnter={() => state.isHover = true}
                                onMouseLeave={() => state.isHover = false}
                            >
                                <div className={styles.text}>
                                    支持jpg、jpeg、png,2MB以内
                                    <br />
                                    将图片拖到这里
                                    <br />
                                    或按【ctrl+v】粘贴到这里
                                    <br />
                                    或点击此处【上传】
                                </div>
                            </Dragger>
                        )}
                        <div className={styles.function}>
                            <img src={zoomOut} alt="Zoom Out" onClick={handleZoomOut} />
                            <img src={zoomIn} alt="Zoom In" onClick={handleZoomIn} />
                        </div>
                    </div>
                    {state.isrec && state.preData.length > 0 && (<div className={styles.right}>
                        <div className={state.isLoading || state.IdentifyData.length === 0 ? styles.lRightResult : styles.rightResult}>
                            {state.isLoading && <Spin tip="正在识别中"></Spin>}
                            <div className={styles.rightItems}>
                                {state.IdentifyData.length > 0 && <div className={styles.rightItem}>
                                    <div className={styles.rightIndex}>序号</div>
                                    {state.IdentifyData?.map((item: any, index: any) => (<div className={styles.rightItem}>
                                        <div className={styles.rightIndex}>{index + 1}</div>
                                    </div>))}
                                </div>}
                                {state.IdentifyData.length > 0 && <div className={styles.rightItem}>
                                    <div className={styles.rightNumber}>果蔬名称</div>
                                    {state.IdentifyData?.map((item: any, index: any) => (<div className={styles.rightItem}>
                                        <div className={styles.rightNumber}>{item.name}</div>
                                    </div>))}
                                </div>}
                                {state.IdentifyData.length > 0 && <div className={styles.rightItem}>
                                    <div>分值</div>
                                    {state.IdentifyData?.map((item: any, index: any) => (<div className={styles.rightItem}>
                                        <div>{item.score.toFixed(3)}</div>
                                    </div>))}
                                </div>}
                            </div>
                            {state.IdentifyData.length === 0 && !state.isLoading && <div className={styles.rightErr}>
                                <img src={err} />
                                <div>识别失败，请稍后再次尝试</div>
                            </div>}
                        </div>
                        <div className={styles.rightBottom}>
                            <img src={copy} alt="" onClick={copyText} />
                            <img src={refresh} alt="" onClick={refreshText} />
                        </div>
                    </div>)}
                </div>
                {
                    state.preData && state.preData.length > 0 && (
                        <div className={styles.imageLists}>
                            {state.preData.map((item: any, index: any) => (
                                <div className={state.isSelect === item.picUid ? styles.checkImageList : styles.imageList} key={item.id} onClick={() => selectImage(item.picUid, item.url, item.note || [], item.isPreset)}>
                                    <div className={styles.imageIndex}>{index + 1}</div>
                                    <div className={styles.imageDel} onClick={() => delImage(index - 1)}><CloseCircleFilled /></div>
                                    <img src={item.url} alt="" />
                                </div>
                            ))}
                            <div className={styles.imageUpload}>
                                <Dragger {...props} showUploadList={false}>
                                    <div className={styles.text}>
                                        <p>+</p>
                                        <p>上传</p>
                                    </div>
                                </Dragger>
                            </div>
                        </div>
                    )
                }

            </div>
        </div >
    )
}

export default AiFVR