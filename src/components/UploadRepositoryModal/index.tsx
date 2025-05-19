/**
 * 资源库弹框
 * fuxueyan
 */
import Iconfont from '@/components/Iconfont';
import UploadFile from '@/components/UploadFile';
import {
  getFolderInfo,
  getRepositoryFileList,
  getTeamList,
  saveUploadFile,
  searchFile,
  uploadFile,
} from '@/services/resource';
import { Button, Input, Modal, Spin, message } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import AddFolder from './components/AddFolder';
import Breadcrumb from './components/BreadcrumbManage';
import { FORMAT_COLOR, getFileMajorType, renderResourceIcon } from './components/contants';
import FileTree from './components/tree';
import style from './index.less';
import resourceFolderSvg from '@/assets/images/resource-folder.svg';

type Props = {
  handleCancel: any; // 关闭弹窗的方法
  isMultiple: boolean; // 是否支持多选
  fileTypes?: any; // 上传文件的类型
  handleOk: any; // 点击确定的方法
  uploadType: string; // 上传的类型 file:上传文件  video:上传视频  image:上传图片 '' 视频和文件都可以
  fileLimitSize?: any; // 上传文件的大小
  videoLimitSize?: any; // 上传视频的大小
  imgLimitSize?: any; // 上传图片的大小
  objectKey: string; // 项目编码或课程编码
};
const UploadRepositoryModal: React.FC<Props> = ({
  handleCancel,
  isMultiple,
  fileTypes,
  handleOk,
  uploadType,
  fileLimitSize,
  objectKey,
  videoLimitSize,
  imgLimitSize,
}) => {
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false); // 新建文件夹弹框
  const [myFolderId, setMyFolderId] = useState(''); // 文件夹id
  const [teamId, setTeamId] = useState(''); // 团队id
  const [fileData, setFileData] = useState<any[]>([]); // 文档数据
  const [videoData, setVideoData] = useState<any[]>([]); // 视频数据
  const [imageData, setImageData] = useState<any[]>([]); // 图片数据
  const [fileAndVideoData, setFileAndVideoData] = useState<any[]>([]); // 文档和视频数据
  const [folderArr, setFolderArr] = useState<any[]>([]); // 文件夹
  const [parentId, setParentId] = useState<string>(''); // 父级id
  const [filePath, setFilePath] = useState<any[]>([]); // 面包屑
  const [repositoryParams, setRepositoryParams] = useState<any[]>([]); // 选中文件的参数
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]); // 树选中的key
  const [teamList, setTeamList] = useState<any>([]); // 团队列表
  const [loading, setLoading] = useState<boolean>(false);
  const [timeObj, setTimeObjs] = useState<any>({}); // 视频时长

  const TREE_DATA: any = {
    file: fileData,
    video: videoData,
    image: imageData,
    '': fileAndVideoData,
  };

  // 新建文件夹
  const handleAdd = () => {
    setIsShowAdd(true);
  };

  const getTreeData = useCallback(
    (res: any) => {
      let folder: any[] = [];
      let arr: any[] = [];
      let fileArr: any[] = [];
      let videoArr: any[] = [];
      let iArr: any[] = [];
      res.attachments.map((item: any) => {
        if (item.attachmentType === 'FOLDER') {
          folder.push(item);
        } else {
          const { type } = renderResourceIcon(item.suffixName);
          const name = item.attachmentName;
          item.key = item.id;
          item.title = (
            <div className={style.treeTitle}>
              <div className={style.file}>
                {' '}
                <Iconfont type={type} className={style.fileIcon} />
                <span title={item.attachmentName}>
                  {name.length > 20
                    ? name.substring(0, 10) + '...' + name.substring(8, name.length - 5)
                    : name}
                </span>
              </div>
              <div className={style.size}>{item.sizeDesc}</div>
              <div className={style.time}>
                {moment(Number(item.modifyTime)).format('YYYY.MM.DD HH:mm')}
              </div>
            </div>
          );

          if (getFileMajorType(item.suffixName) === 'DOC' && item.attachmentSize <= fileLimitSize) {
            fileArr.push(item);
          }
          if (
            getFileMajorType(item.suffixName) === 'VIDEO' &&
            item.attachmentSize <= videoLimitSize
          ) {
            videoArr.push(item);
          }
          if (
            getFileMajorType(item.suffixName) === 'IMAGE' &&
            item.attachmentSize <= imgLimitSize
          ) {
            iArr.push(item);
          }
          // 补充：如果uploadType传空字符串，代表需要上传文件和视频，此时判断，文件类型是否在fileTypes中包含 解决设置了fileTypes但未将其他类型附件过滤掉的问题
          if (fileTypes && fileTypes.length && fileTypes.includes(item.suffixName)) {
            arr.push(item);
          }
          // 如果未设置fileTypes 则将所有附件都展示出来
          if (!fileTypes || !fileTypes?.length) {
            arr.push(item);
          }
        }
      });

      setFolderArr([...folder]);
      setFileAndVideoData([...arr]);
      setFilePath(res.path);
      setFileData([...fileArr]);
      setVideoData([...videoArr]);
      setImageData([...iArr]);
    },
    [fileLimitSize, videoLimitSize, imgLimitSize],
  );

  const getRepositoryFileListData = useCallback(
    (id: string) => {
      setLoading(true);
      getRepositoryFileList({ teamId: id, parentId }).then((res) => {
        setLoading(false);
        getTreeData(res);
      });
    },
    [parentId, getTreeData],
  );

  // 获取公共目录
  const getFolderInfoData = useCallback(() => {
    getFolderInfo({ folderType: 'MY_DOCUMENT', memberType: 'TEACHER' }).then((res) => {
      setMyFolderId(res.MY_DOCUMENT);
      setTeamId(res.MY_DOCUMENT);
      getRepositoryFileListData(res.MY_DOCUMENT);
    });
  }, [getRepositoryFileListData]);

  // 获取团队列表
  const getTeamListData = useCallback(() => {
    getTeamList().then((res) => {
      setTeamList(res.teams);
    });
  }, []);

  useEffect(() => {
    getFolderInfoData();
    getTeamListData();
  }, [getFolderInfoData, getTeamListData]);

  const onSelect = (keys: any, info: any) => {
    setSelectedKeys(keys);
    setRepositoryParams(info.selectedNodes);
  };

  // 上传前
  const beforeUploadDoc = (file: any) => {
    const attachmentType = file.name.split('.').pop().toLocaleLowerCase();

    if (file.name.length > 50) {
      message.error('文件的长度不能超过50个字符');
      return false;
    }

    if (getFileMajorType(attachmentType) === 'DOC' && file.size > fileLimitSize) {
      message.error(`文件大小不能超过${fileLimitSize / 1024 / 1024}M`);
      return false;
    }

    if (getFileMajorType(attachmentType) === 'IMAGE' && file.size > imgLimitSize) {
      message.error(`图片大小不能超过${imgLimitSize / 1024 / 1024}M`);
      return false;
    }
    return true;
  };

  // 上传成功后
  const onUploadSuccess = (url: string, name: string, type: string, file: any) => {
    setLoading(false);
    const attachmentType = file.name.split('.').pop().toLocaleLowerCase();
    const params = {
      attachmentUrl: url,
      attachmentName: name,
      attachmentType: attachmentType,
      attachmentCategory: getFileMajorType(attachmentType),
      attachmentSize: file.size,
      isConvert: 1,
      suffixName: attachmentType,
    };
    saveUploadFile(params).then((res) => {
      uploadFile({ attachmentId: res, teamId, parentId }).then((data) => {
        let arr = [];
        selectedKeys.splice(0, 1, data.id);
        setSelectedKeys([...selectedKeys]);
        getRepositoryFileListData(teamId);
        arr.push(data);
        setRepositoryParams([...arr]);
      });
    });
  };

  // 搜索
  const onChangeInput = (e: any) => {
    searchFile({ attachmentName: e, teamId, attachmentType: 'FILE' }).then((res) => {
      getTreeData(res);
    });
  };

  // 获取视频时长
  const getVideoTimes = (file: any) => {
    const videoUrl = URL.createObjectURL(file);
    const videoObj = document.createElement('video');
    videoObj.preload = 'metadata';
    videoObj.src = videoUrl;
    videoObj.onloadedmetadata = () => {
      URL.revokeObjectURL(videoUrl);
      let times: any = Math.floor(videoObj.duration);
      timeObj[file.name] = times;
      setTimeObjs({ ...timeObj });
    };
  };

  // 上传视频
  const beforeUploadVideo = (file: any) => {
    getVideoTimes(file);
    if (file.size > videoLimitSize) {
      message.error(`文件大小不能超过${videoLimitSize / 1024 / 1024}M`);
      return false;
    }
    return true;
  };

  // 上传视频成功
  const onUploadSuccessVideo = (url: string, name: string, type: string, file: any) => {
    setLoading(false);
    const attachmentType = file.name.split('.').pop().toLocaleLowerCase();
    const params = {
      attachmentUrl: url,
      attachmentName: name,
      attachmentType: attachmentType,
      attachmentCategory: getFileMajorType(attachmentType),
      attachmentSize: file.size,
      isConvert: 1,
      suffixName: attachmentType,
      attachmentSeconds: timeObj[file.name],
    };

    saveUploadFile(params).then((res) => {
      uploadFile({ attachmentId: res, teamId, parentId }).then((data) => {
        let arr = [];
        selectedKeys.splice(0, 1, data.id);
        setSelectedKeys([...selectedKeys]);
        getRepositoryFileListData(teamId);
        arr.push(data);
        setRepositoryParams([...arr]);
      });
    });
  };

  // 双击文件夹
  const handleOnDoubleClick = (id: string) => {
    setParentId(id);
  };

  // 面包屑点击方法
  const onTriggerPath = (item: any) => {
    setParentId(item.repositoryAttachmentId);
  };

  // 我的文档点击
  const onTriggerTeam = () => {
    setParentId('');
  };

  const formatColor = (letter: string) => {
    let color = '';
    FORMAT_COLOR.forEach((value, key) => {
      if (key.includes(letter)) {
        color = value;
      }
    });
    const styleConfig = {
      color,
      borderColor: color,
      background: `${color}26`,
    };
    return (
      <span className={style.team_icon} style={styleConfig}>
        {letter}
      </span>
    );
  };

  const onUploading = (file: any) => {
    if (file.status === 'uploading') {
      setLoading(true);
    }
  };

  return (
    <Modal
      open={true}
      width={880}
      title="云盘"
      onOk={() => handleOk(repositoryParams)}
      onCancel={handleCancel}
      className={style.file_tree_modal}
    >
      <Spin spinning={loading}>
        <div className={style.top}>
          <Breadcrumb
            filePath={filePath}
            onTriggerPath={onTriggerPath}
            onTriggerTeam={onTriggerTeam}
          />
          <div className={style.right}>
            <Input.Search
              className={style.input}
              onSearch={onChangeInput}
              placeholder="请输入文件名称搜索"
            />
            <Button type="primary" onClick={handleAdd} className={style.button}>
              新建文件夹
            </Button>
            {uploadType === 'file' || uploadType === 'image' ? (
              <UploadFile
                onBeforeUpload={beforeUploadDoc}
                onUploadSuccess={onUploadSuccess}
                multiple={isMultiple}
                fileTypes={fileTypes}
                objectKey={objectKey}
                message={`只支持上传${fileTypes?.toString()}格式的文件`}
                onUploading={onUploading}
              >
                <Button type="primary" className={style.button}>
                  上传文件
                </Button>
              </UploadFile>
            ) : uploadType === 'video' ? (
              <UploadFile
                onBeforeUpload={beforeUploadVideo}
                onUploadSuccess={onUploadSuccessVideo}
                multiple={isMultiple}
                fileTypes={fileTypes}
                objectKey={objectKey}
                message={`只支持上传${fileTypes?.toString()}格式的视频`}
                onUploading={onUploading}
              >
                <Button type="primary" className={style.button}>
                  上传视频
                </Button>
              </UploadFile>
            ) : (
              <div style={{ display: 'flex' }}>
                <UploadFile
                  onBeforeUpload={beforeUploadDoc}
                  onUploadSuccess={onUploadSuccess}
                  multiple={isMultiple}
                  fileTypes={fileTypes}
                  objectKey={objectKey}
                  message={`只支持上传${fileTypes?.toString()}格式的文件`}
                  onUploading={onUploading}
                >
                  <Button type="primary" className={style.button}>
                    上传文件
                  </Button>
                </UploadFile>
                <UploadFile
                  onBeforeUpload={beforeUploadVideo}
                  onUploadSuccess={onUploadSuccessVideo}
                  multiple={isMultiple}
                  fileTypes={fileTypes}
                  objectKey={objectKey}
                  message={`只支持上传${fileTypes?.toString()}格式的视频`}
                  onUploading={onUploading}
                >
                  <Button type="primary" className={style.button}>
                    上传视频
                  </Button>
                </UploadFile>
              </div>
            )}
          </div>
        </div>
        <div className={style.teams_file_tree}>
          <div className={style.teams}>
            <ul className={style.navigation}>
              <li
                onClick={() => {
                  setTeamId(myFolderId);
                  getRepositoryFileListData(myFolderId);
                }}
                className={myFolderId === teamId ? style.active : ''}
              >
                <img src={resourceFolderSvg} />
                我的文档
              </li>
            </ul>
            <div className={style.add_team}>我的团队</div>
            <ul className={style.team_list}>
              {teamList.map((item: any) => (
                <li
                  onClick={() => {
                    setTeamId(item.repositoryTeamId);
                    getRepositoryFileListData(item.repositoryTeamId);
                  }}
                  className={item.repositoryTeamId === teamId ? style.active : ''}
                  key={item.repositoryTeamId}
                >
                  {formatColor(item.firstLetter)}
                  <p className={style.team_name}>{item.teamName}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className={style.files}>
            {folderArr.length === 0 && TREE_DATA[uploadType].length === 0 ? (
              <div className={style.emptyText}>暂无数据</div>
            ) : (
              <div>
                <div className={style.folders}>
                  {folderArr.map((item) => (
                    <div
                      key={item.id}
                      className={style.folder}
                      onClick={() => handleOnDoubleClick(item.id)}
                    >
                      <div className={style.file} title={item.attachmentName}>
                        <Iconfont type="icon-wenjianjia1" className={style.icon} />
                        {item.attachmentName}
                      </div>
                      <div>{item.sizeDesc}</div>
                      <div className={style.time}>
                        {moment(Number(item.modifyTime)).format('YYYY.MM.DD HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
                <FileTree
                  onSelect={onSelect}
                  fileData={TREE_DATA[uploadType]}
                  isMultiple={isMultiple}
                  selectedKeys={selectedKeys}
                />
              </div>
            )}
          </div>
        </div>

        {isShowAdd && (
          <AddFolder
            onCancel={() => {
              setIsShowAdd(false);
              getRepositoryFileListData(teamId);
            }}
            teamId={teamId}
            parentId={parentId}
          />
        )}
      </Spin>
    </Modal>
  );
};

UploadRepositoryModal.defaultProps = {
  videoLimitSize: 50 * 1024 * 1024,
  fileLimitSize: 50 * 1024 * 1024,
  imgLimitSize: 20 * 1024 * 1024,
};
export default UploadRepositoryModal;
