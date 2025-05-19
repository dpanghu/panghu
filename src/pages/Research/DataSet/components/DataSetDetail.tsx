/**
 * 数据集详情
 */
import { delDataSet, getDataSetDetail, saveDataSet } from '@/services/dataSet';
import { getRemoteUrl } from '@/services/studentCourseList';
import { updateSessionStorage } from '@/utils/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, message, Tooltip } from 'antd';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useState } from 'react';
import { history, useSelector } from 'umi';
import ConfirmModal from '../../components/ConfirmModal';
import Header from '../../components/Header';
import { DATA_VOLUME_VALUE, TYPE_VALUE } from './contant';
import DataPreview from './DataPreview';
import style from './DataSetDetail.less';
import pathPng from '@/assets/images/reSearch/path.png';
import emptyJpg from '@/assets/images/reSearch/empty.jpg';

const DataSetDetail = () => {
  const [titleKey, setTitleKey] = useState('introduce');
  const [isShowDelModal, setIsShowDelModal] = useState(false);
  const [isShowPublishModal, setIsShowPublishModal] = useState(false);
  const [isShowEditTip, setIsShowEditTip] = useState(false);
  const [detailObj, setDetailObj] = useState<any>({});
  const [subjectStr, setSubjectStr] = useState('');
  const [tagArr, setTagArr] = useState<any>([]);
  const dataSetId = sessionStorage.getItem('dataSetId') as any;
  const subject = sessionStorage.getItem('subject') as any;
  const jurisdictionModal = useSelector((store: any) => store.app)?.jurisdictionModal;
  const roleAudit = Cookies.get('memberType') === 'TEACHER';

  const handleClickTitle = (key: string) => {
    setTitleKey(key);
  };

  const getDataSetDetailData = useCallback(() => {
    getDataSetDetail({ id: dataSetId }).then((res) => {
      setDetailObj(res);
      updateSessionStorage('dataSet', res);
      const domainArr = (res.domainLabel && JSON.parse(res.domainLabel)) || [];
      const industryArr = (res.industryLabel && JSON.parse(res.industryLabel)) || [];
      const arr: any = domainArr.concat(industryArr);
      setTagArr([...arr]);
    });
  }, [dataSetId]);

  useEffect(() => {
    getDataSetDetailData();
  }, [getDataSetDetailData]);

  useEffect(() => {
    const topicCode = detailObj.topicCode?.slice(1, -1).split(',');
    let str: any = '';
    if (topicCode) {
      JSON.parse(subject).map((item: any) => {
        if (item.key == topicCode[0]) {
          str = item.title;
        }
        item.children.map((iitem: any) => {
          if (iitem.key == topicCode[1]) {
            str = `${item.title}/${iitem.title}`;
          }
        });
      });
    }
    setSubjectStr(str);
  }, [detailObj.topicCode, subject]);

  // const handleDel = () => {
  //   if (detailObj.isPublish === 1) {
  //     message.error('已发布无法删除，请取消发布后重试');
  //     return;
  //   }

  //   setIsShowDelModal(true);
  // };

  const handleOk = () => {
    delDataSet({ id: dataSetId }).then(() => {
      history.push('/dataSet');
    });
  };
  // const handlePublish = () => {
  //   setIsShowPublishModal(true);
  // };

  const handleCreateProject = () => {
    updateSessionStorage('scientificProject', {});
    if (!jurisdictionModal.online && !jurisdictionModal.offline) {
      message.warning('您尚未购买当前数据集，请购买后再次尝试');
      return;
    }
    updateSessionStorage('case', {});
    // history.push('/addScientificProject');
    history.push({
      pathname: '/addScientificProject',
      search: '?isfrom=dataSet',
    });
  };

  const handlePublishOK = (type: string) => {
    saveDataSet({
      id: dataSetId,
      isPublish: detailObj.isPublish === 1 ? 0 : 1,
      isPropers: detailObj.isPropers,
      datasetCode: detailObj.datasetCode,
    }).then(() => {
      type === 'edit' ? message.success('取消发布成功') : message.success('发布成功');
      type === 'edit' && history.push('/addDataSet');
      getDataSetDetailData();
      setIsShowPublishModal(false);
      type === 'edit' && sessionStorage.setItem('detailObj', JSON.stringify(detailObj));
    });
  };
  // const handleEdit = () => {
  //   if (detailObj.isPublish === 1) {
  //     setIsShowEditTip(true);
  //     return;
  //   }
  //   sessionStorage.setItem('detailObj', JSON.stringify(detailObj));
  //   history.push('/addDataSet');
  // };

  const openDataDic = async () => {
    const result = await getRemoteUrl({
      remoteKey: 'dbe.xdata.datadict',
    });
    const referenceDatasets = JSON.parse(detailObj?.referenceDatasets || '[]');
    if (!referenceDatasets.length) {
      message.info('当前数据集未关联外部数据源');
      return;
    }

    window.open(`${result}?appertainId=${referenceDatasets[0]?.id}`, '_blank');
  };

  return (
    <div className={style.container}>
      <Header oneTitle="数据集市" seTitle="查看数据集介绍" oneRoutePath="/dataSet" />
      <div className={style.btns}>
        <Button type="primary" onClick={openDataDic}>
          数据字典
          <Tooltip title="数据集说明">
            <QuestionCircleOutlined />
          </Tooltip>
        </Button>
        {roleAudit && (
          <Button type="primary" onClick={() => handleCreateProject()}>
            新建课题组
          </Button>
        )}

        {/* <Button onClick={handleDel}>删除</Button>
        <Button onClick={handleEdit}>编辑</Button>
        <Button type="primary" onClick={handlePublish}>
          {detailObj.isPublish === 1 ? '取消发布' : '发布'}
        </Button> */}
      </div>
      <div className={style.detailContent}>
        <div className={style.content_top}>
          <p className={style.first}>
            <span className={style.title}>{detailObj.name}</span>
            {detailObj.isPropers === 1 && <span className={style.recommend}>推荐</span>}
          </p>
          <p className={style.content}>{detailObj.datasetDesc}</p>
          <div className={style.tag}>
            {tagArr.map((item: any) => (
              <span key={item.code}>{item.name}</span>
            ))}
          </div>
          <div className={style.plat}>
            <span>使用平台：{detailObj.platform}</span>
            <span>类型：{TYPE_VALUE[detailObj.interfaceType]}</span>
            <span>数量级：{DATA_VOLUME_VALUE[detailObj.datasetVolume]}</span>
          </div>
          <div className={style.reference}>
            引用数据集：
            {detailObj?.referenceDatasets && JSON.parse(detailObj?.referenceDatasets)[0]?.name}
          </div>
          <div className={style.reference}>主题板块：{subjectStr}</div>
        </div>
        <div className={style.content_bottom}>
          <div className={style.header}>
            {detailObj.content !== '<p></p>' && (
              <span
                onClick={() => handleClickTitle('introduce')}
                style={{ color: titleKey === 'introduce' ? '#000' : '#666' }}
              >
                数据集介绍
                {titleKey === 'introduce' && <img src={pathPng} />}
              </span>
            )}
            {detailObj?.materialsInfo?.length > 0 && (
              <span
                onClick={() => handleClickTitle('preview')}
                style={{ color: titleKey === 'preview' ? '#000' : '#666' }}
              >
                数据预览
                {titleKey === 'preview' && <img src={pathPng} />}
              </span>
            )}
          </div>
          <div className={style.box}>
            {titleKey === 'preview' && detailObj?.materialsInfo?.length > 0 ? (
              <DataPreview fileArr={detailObj.materialsInfo} />
            ) : detailObj.content !== '<p></p>' ? (
              <div
                dangerouslySetInnerHTML={{ __html: detailObj.content }}
                className={style.rickText}
              />
            ) : (
              // detailObj.content === '<p></p>' &&
              // detailObj?.materialsInfo?.length === 0 && (
              <div className={style.empty}>
                <img src={emptyJpg} />
                <div>暂无数据集介绍和数据预览，请编辑详情</div>
              </div>
              // )
            )}
          </div>
        </div>
      </div>
      {isShowDelModal && (
        <ConfirmModal
          handleCancel={() => setIsShowDelModal(false)}
          content="是否确认删除该数据集？删除后信息不可恢复"
          title="删除数据集"
          handleOk={handleOk}
        />
      )}
      {isShowPublishModal && (
        <ConfirmModal
          handleCancel={() => setIsShowPublishModal(false)}
          content={
            detailObj.isPublish === 1
              ? '是否确认改数据集取消发布！'
              : '该数据集即将发布到科研广场中，是否确认发布！'
          }
          title={detailObj.isPublish === 1 ? '取消发布' : '发布'}
          handleOk={() => handlePublishOK('')}
          okText={detailObj.isPublish === 1 ? '取消发布' : '发布'}
        />
      )}
      {isShowEditTip && (
        <ConfirmModal
          handleCancel={() => setIsShowEditTip(false)}
          content="当前数据集已发布，取消发布才可编辑！"
          title="编辑"
          handleOk={
            detailObj.isPublish === 1
              ? () => handlePublishOK('edit')
              : () => setIsShowEditTip(false)
          }
          okText={detailObj.isPublish === 1 ? '取消发布' : '确定'}
        />
      )}
    </div>
  );
};

export default DataSetDetail;
