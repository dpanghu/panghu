import A from '@/assets/images/A@2x.png';
import blueA from '@/assets/images/blueA@2x.png';
import blueRectangle from '@/assets/images/blueRectangle@2x.png';
import copy from '@/assets/images/copy@2x.png';
import err from '@/assets/images/err@2x.png';
import rectangle from '@/assets/images/rectangle@2x.png';
import refresh from '@/assets/images/refresh@2x.png';
import rotate from '@/assets/images/rotate@2x.png';
import success from '@/assets/images/success@2x.png';
import zoomIn from '@/assets/images/zoomIn@2x.png';
import zoomOut from '@/assets/images/zoomOut@2x.png';
import { getConvertParamId } from '@/services/aiJobHunt';
import {
  deletePic,
  getImageList,
  TextRecognition,
  uploadPic,
  uploads,
} from '@/services/aiOCR';
import { CloseCircleFilled } from '@ant-design/icons';
import { useMount, useReactive } from 'ahooks';
import { Input, message, Spin } from 'antd';
import React, { useState } from 'react';
import { Upload } from 'SeenPc';
import ImageAnnotator from './ImageAnnotator';
import styles from './index.less';
const { Dragger } = Upload;

type TState = {
  preData: any[];
  message: any;
  isCheck: boolean; //点击校验
  isSelect: any;
  isrec: boolean;
  isHover: boolean;
  IdentifyData: any[];
  imgUrl: any;
  isMark: boolean;
  isLoading: boolean;
  isBlue: boolean;
  isBlueLine: boolean;
  isValid: boolean;
  angle: any;
  timer: any;
  isChooseFirst: boolean;
  isPreset: boolean;
};
const AiOCR: React.FC = ({ }) => {
  const [scale, setScale] = useState(1);
  const state = useReactive<TState>({
    preData: [],
    message: '',
    isCheck: false,
    isSelect: '',
    isrec: false,
    isHover: false,
    IdentifyData: [],
    imgUrl: '',
    isMark: false,
    isLoading: false,
    isBlue: false,
    isBlueLine: false,
    isValid: false,
    angle: {},
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
    const wordsText = state.IdentifyData.map((item) => item.words).join('\n');
    navigator.clipboard
      .writeText(wordsText)
      .then(() => {
        message.success('复制成功!');
      })
      .catch((err) => {
        message.error('复制失败，请重新尝试！');
        console.error('Copy to clipboard failed', err);
      });
  };
  const changeAngle = () => {
    if (!state.isSelect) return;
    state.isLoading = true;
    state.IdentifyData = [];
    const angles = [0, 90, 180, 270];
    const currentAngle = state.angle[state.isSelect] || 0;
    const nextAngle = (angles.indexOf(currentAngle) + 1) % angles.length;
    state.angle[state.isSelect] = angles[nextAngle];
    if (state.timer) {
      clearTimeout(state.timer);
    }
    const newTimer = setTimeout(() => {
      state.isChooseFirst = false;
      postTextRecognition(
        state.imgUrl,
        state.isSelect,
        state.angle[state.isSelect],
        state.isPreset,
      );
    }, 4000);

    state.timer = newTimer;
  };
  const refreshText = () => {
    state.IdentifyData = [];
    state.isChooseFirst = false;
    postTextRecognition(
      state.imgUrl,
      state.isSelect,
      state.angle[state.isSelect],
      state.isPreset,
    );
  };
  const postTextRecognition = async (
    url: any,
    picUid: any,
    rotationAngle: any,
    isPreset: any,
  ) => {
    state.isLoading = true;
    try {
      const recognitionResults = await TextRecognition({
        url,
        picUid,
        rotationAngle,
        isPreset,
      });
      const recognitionResult = recognitionResults.note;
      const recognitionUrl = recognitionResults.url;
      const res = await getImageList();
      state.preData = res;
      const { id, url: imageUrl, note, Preset } = state.preData[0];
      if (state.isChooseFirst) {
        selectImage(id, imageUrl, rotationAngle, note, Preset);
      } else {
        selectImage(
          picUid,
          recognitionUrl,
          rotationAngle,
          recognitionResult,
          isPreset,
        );
      }
    } catch (err) {
      console.error('An error occurred during text recognition:', err);
    } finally {
      state.isLoading = false;
      state.isSelect = picUid;
    }
  };

  const uploadPics = (url: any) => {
    uploadPic({
      url,
    }).then((res) => {
      getImageList().then((res) => {
        state.preData = res;
        state.imgUrl = state.preData[0].url;
        postTextRecognition(
          state.preData[0].url,
          state.preData[0].picUid,
          0,
          state.preData[0].isPreset ? 1 : 0,
        );
      });
    });
  };

  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );
  const props: any = {
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
      if (state.preData.length > 19) {
        message.warning('图片已满，请删除图片后，再上传');
        return false;
      }
      return true;
    },

    onChange(info: any) {
      state.IdentifyData = [];
      state.isSelect = '';
      const { status } = info.file;
      if (status === 'done') {
        console.log(`${info.file.name} file uploaded successfully.`);
        state.isrec = true;
        state.isLoading = true;
        uploadPics(info.file.key);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  const getImageLists = () => {
    getImageList().then((res) => {
      state.preData = res;
      state.preData.map((item) => {
        state.angle[item.picUid] = item.rotationAngle;
      });
    });
  };
  const selectImage = (
    id: any,
    url: any,
    rotationAngle: any,
    note: any,
    isPreset: any,
  ) => {
    setScale(1);
    state.isPreset = isPreset;
    state.isSelect = id;
    state.imgUrl = url;
    state.angle[state.isSelect] = rotationAngle;
    state.isrec = true;
    if (typeof note === 'string') {
      state.IdentifyData = JSON.parse(note);
    } else {
      state.IdentifyData = note || [];
    }
  };

  const delImage = (index: any) => {
    if (state.isPreset == true) return;
    deletePic({ picUid: state.isSelect }).then((res) => {
      if (index < 0) {
        if (state.preData.length > 1) {
          selectImage(
            state.preData[1].picUid,
            state.preData[1].url,
            state.preData[1].rotationAngle,
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
        item.rotationAngle,
        item.note,
        item.isPreset,
      );
      getImageLists();
    });
  };

  const handleChange = (e: any) => {
    state.message = e.target.value;
    const inputChars = state.message
      .split('')
      .filter((char: any) => char.trim() !== '');
    const allDataChars = state.IdentifyData.flatMap((item: any) =>
      item.words.split(''),
    ).filter((char: any) => char.trim() !== '');
    const isValid = inputChars.some((char: any) => allDataChars.includes(char));
    if (isValid) {
      state.isValid = true;
    } else {
      state.isValid = false;
    }
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
      })
      .then(() => {
        getImageLists();
      });
  });

  const handlePaste = (event) => {
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
  };

  return (
    <div className={styles.aiOcr}>
      <div className={styles.title}>文字识别</div>
      <div className={styles.bottom}>
        <div className={styles.content}>
          <div className={state.isrec ? styles.aleft : styles.left}>
            {state.isrec && state.preData.length > 0 ? (
              <div className={styles.imageAnnotator}>
                <ImageAnnotator
                  imageSrc={state.imgUrl}
                  annotations={state.IdentifyData}
                  isMark={state.isMark}
                  isBlue={state.isBlue}
                  angle={0}
                  scale={scale}
                />
              </div>
            ) : (
              <Dragger
                {...props}
                showUploadList={false}
                onMouseEnter={() => (state.isHover = true)}
                onMouseLeave={() => (state.isHover = false)}
              >
                <div className={styles.text} onPaste={handlePaste}>
                  支持jpg、jpeg、png,1MB以内
                  <br />
                  将图片拖到这里
                  <br />
                  或按【ctrl+v】粘贴到这里
                  <br />
                  或点击此处【上传】
                </div>
              </Dragger>
            )}
            {state.isCheck && (
              <div
                className={
                  state.isBlueLine || state.message === ''
                    ? styles.checkTextBlue
                    : styles.checkText
                }
              >
                <Input.TextArea
                  onMouseEnter={() => (state.isBlueLine = true)}
                  onMouseLeave={() => (state.isBlueLine = false)}
                  placeholder={'请输入设定识别文字'}
                  value={state.message}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className={styles.function}>
              <div
                className={state.isCheck ? styles.ischeck : styles.check}
                onClick={() => (state.isCheck = !state.isCheck)}
              >
                校验
              </div>
              <img
                src={state.isMark ? blueA : A}
                alt=""
                className={styles.A}
                onClick={() => (state.isMark = !state.isMark)}
              />
              <img
                src={state.isBlue ? blueRectangle : rectangle}
                alt=""
                className={styles.rectangle}
                onClick={() => (state.isBlue = !state.isBlue)}
              />
              <img src={zoomOut} alt="Zoom Out" onClick={handleZoomOut} />
              <img src={zoomIn} alt="Zoom In" onClick={handleZoomIn} />
              <img src={rotate} alt="" onClick={changeAngle} />
            </div>
          </div>
          {state.isrec && state.preData.length > 0 && (
            <div className={styles.right}>
              <div
                className={
                  state.isLoading || state.IdentifyData.length === 0
                    ? styles.lRightResult
                    : styles.rightResult
                }
              >
                {state.isLoading && <Spin tip="正在识别中"></Spin>}
                {state.IdentifyData.length > 0 && (
                  <div className={styles.rightItem}>
                    <div className={styles.rightIndex}>序号</div>
                    <div>内容</div>
                  </div>
                )}
                {state.IdentifyData?.map((item: any, index: any) => (
                  <div className={styles.rightItem}>
                    <div className={styles.rightIndex}>{index + 1}</div>
                    <div>{item.words}</div>
                  </div>
                ))}
                {state.IdentifyData.length === 0 && !state.isLoading && (
                  <div className={styles.rightErr}>
                    <img src={err} />
                    <div>未识别图片文字</div>
                  </div>
                )}
              </div>
              {state.isCheck && (
                <div className={styles.recResult}>
                  {state.message &&
                    (state.isValid ? (
                      <div className={styles.sucRecResult}>
                        <img src={success} alt="" />
                        识别到校验内容，校验成功！
                      </div>
                    ) : (
                      <div className={styles.errRecResult}>
                        {' '}
                        <img src={err} alt="" /> 未识别到校验内容，校验失败！
                      </div>
                    ))}
                </div>
              )}
              <div className={styles.rightBottom}>
                <img src={copy} alt="" onClick={copyText} />
                <img src={refresh} alt="" onClick={refreshText} />
              </div>
            </div>
          )}
        </div>
        {state.preData && state.preData.length > 0 && (
          <div className={styles.imageLists}>
            {state.preData.map((item: any, index: any) => (
              <div
                className={
                  state.isSelect === item.picUid
                    ? styles.checkImageList
                    : styles.imageList
                }
                key={item.id}
                onClick={() =>
                  selectImage(
                    item.picUid,
                    item.url,
                    item.rotationAngle,
                    item.note || [],
                    item.isPreset,
                  )
                }
              >
                <div className={styles.imageIndex}>{index + 1}</div>
                <div
                  className={styles.imageDel}
                  onClick={() => delImage(index - 1)}
                >
                  <CloseCircleFilled />
                </div>
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
        )}
      </div>
    </div>
  );
};

export default AiOCR;
