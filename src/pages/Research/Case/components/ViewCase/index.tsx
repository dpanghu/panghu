import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Header from '@/pages/Research/components/Header';
import { Button, Modal, message } from 'antd';
import {
  delScientificCase,
  getScientificCaseDetail,
  getScientificTagAll,
  updateScientificCase,
} from '@/services/research';
import { getSessionStorage, updateSessionStorage } from '@/utils/utils';
import { nanoid } from 'nanoid';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import platformImg from '@/assets/images/reSearch/platform.png';
import postIcon from '@/assets/images/reSearch/post_icon.png';
// import { CloseOutlined } from '@ant-design/icons';
import { history, useSelector } from 'umi';
import { getCoverByIndex } from '@/pages/Research/components/CoverModal';
import ConfirmModal from '../../../components/ConfirmModal';

const Container: React.FC = () => {
  const [caseDetail, setCaseDetail] = useState<RecordItem>(getSessionStorage('case'));
  const [industryName, setIndustryName] = useState<string[][]>([]);
  const [open, setOpen] = useState<any>(false);
  const [deleteModal, setDeleteModal] = useState<any>(false);
  const [confirmModal, setConfirmModal] = useState<any>(false);
  const jurisdictionModal = useSelector((store: any) => store.app)?.jurisdictionModal;
  const queryCaseDetail = async () => {
    const industry = await getScientificTagAll({ tagTypeEnum: 'industry' });
    const result = await getScientificCaseDetail({
      code: caseDetail.casesCode,
    });
    try {
      if (result.pertainIndustry) {
        const nameArr = JSON.parse(JSON.stringify(JSON.parse(result.pertainIndustry))).map(
          (item: string[]) =>
            item.map((ele) => industry?.find((val: RecordItem) => val.code === ele)?.name),
        );
        setIndustryName(nameArr);
      }
    } catch (error) {}
    setCaseDetail(result);
    console.log('resultresultresultresult', result);
    updateSessionStorage('case', result);
  };

  const handleDeleteOk = async () => {
    await delScientificCase({
      code: caseDetail.casesCode,
    });
    message.success('删除成功');
    history.push('/case');
  };

  const handleConfirmOk = async () => {
    await updateScientificCase({
      casesName: caseDetail.casesName,
      casesDesc: caseDetail.casesDesc,
      isPropose: caseDetail.isPropose,
      pertainIndustry: caseDetail.pertainIndustry,
      pertainDomain: caseDetail.pertainDomain,
      involvingTechnology: caseDetail.involvingTechnology,
      casesCover: caseDetail.casesCover,
      platformCasesId: caseDetail.platformCasesId,
      industryAnalysis: caseDetail.industryAnalysis,
      companyIntroduction: caseDetail.companyIntroduction,
      caseStudy: caseDetail.caseStudy,
      thinkingConclusion: caseDetail.thinkingConclusion,
      schoolId: caseDetail.schoolId,
      casesState: caseDetail.casesState ? 0 : 1,
      casePostData: caseDetail.casePostData,
      casesCode: caseDetail.casesCode,
      platform: caseDetail.platform,
      platformCasesName: caseDetail?.platformCasesName,
    });
    queryCaseDetail();
    if (caseDetail.casesState) {
      message.success('取消发布成功');
      setConfirmModal(false);
    } else {
      // history.push('/case');
      message.success('发布成功');
      setConfirmModal(false);
    }
  };

  const handleCreateProject = () => {
    if (!jurisdictionModal.online && !jurisdictionModal.offline) {
      message.warning('您尚未购买当前案例，请购买后再次尝试');
      return;
    }
    updateSessionStorage('dataSet', {});
    history.push({
      pathname: '/addScientificProject',
      search: '?isfrom=case',
    });
  };

  useEffect(() => {
    if (caseDetail?.casesCode) {
      console.log('250257205720');
      queryCaseDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseDetail?.casesCode]);

  const handleOk = async () => {
    await updateScientificCase({
      casesName: caseDetail.casesName,
      casesDesc: caseDetail.casesDesc,
      isPropose: caseDetail.isPropose,
      pertainIndustry: caseDetail.pertainIndustry,
      pertainDomain: caseDetail.pertainDomain,
      involvingTechnology: caseDetail.involvingTechnology,
      casesCover: caseDetail.casesCover,
      platformCasesId: caseDetail.platformCasesId,
      industryAnalysis: caseDetail.industryAnalysis,
      companyIntroduction: caseDetail.companyIntroduction,
      caseStudy: caseDetail.caseStudy,
      thinkingConclusion: caseDetail.thinkingConclusion,
      schoolId: caseDetail.schoolId,
      casesState: caseDetail.casesState ? 0 : 1,
      casePostData: caseDetail.casePostData,
      casesCode: caseDetail.casesCode,
      platform: caseDetail.platform,
      platformCasesName: caseDetail?.platformCasesName,
    });
    queryCaseDetail();
    history.push('/addCase');
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className={styles.container} id="caseViewContainerMain">
      <div className={styles.header}>
        <Header
          oneTitle="科研广场"
          seTitle="案例列表"
          thTitle="查看案例介绍"
          oneRoutePath="/scientificSquare"
          routePath="/case"
        />
        <div className={styles.action}>
          <Button type="primary" onClick={() => handleCreateProject()}>
            创建项目
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.banner}>
          <img src={getCoverByIndex(caseDetail.casesCover)} alt="" className={styles.logo} />
          <div className={styles.detail}>
            <span className={styles.titleBox}>
              <span className={styles.title} title={caseDetail.casesName}>
                {caseDetail.casesName}
              </span>
              {!!caseDetail.isPropose && <span className={styles.isPropose}>推荐</span>}
            </span>
            <div className={styles.desc}>{caseDetail.casesDesc}</div>
            <div className={styles.tags}>
              {Boolean(
                [
                  ...JSON.parse(caseDetail?.involvingTechnology || '[]'),
                  ...JSON.parse(caseDetail?.pertainDomain || '[]'),
                ].length,
              ) &&
                [
                  ...JSON.parse(caseDetail?.involvingTechnology || '[]'),
                  ...JSON.parse(caseDetail?.pertainDomain || '[]'),
                ].map((ele) => <span key={ele.code}>{ele.name}</span>)}
            </div>
            <div className={styles.info}>
              <span>使用平台: &nbsp;</span>
              <span>YonBIP 3</span>
            </div>
            {caseDetail.platformCasesName && (
              <div className={styles.info}>
                <span>引用案例: &nbsp;</span>
                <span>{caseDetail.platformCasesName}</span>
              </div>
            )}
            <div className={styles.info}>
              <span>行业分类: &nbsp;</span>
              <span>
                {industryName.map((item) => (
                  <span key={nanoid()} style={{ paddingRight: 10 }}>
                    {item.join('—')}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.main}>
          {caseDetail.industryAnalysis !== '<p></p>' && (
            <div className={styles.casePanel}>
              <div className={styles.title}>行业背景</div>
              <BraftEditor
                className={styles.caseBraftEditor}
                value={BraftEditor.createEditorState(caseDetail.industryAnalysis || '')}
                style={{ width: '100%', background: 'none' }}
                controls={[]}
                readOnly={true}
              />
            </div>
          )}
          {caseDetail.companyIntroduction !== '<p></p>' && (
            <div className={styles.casePanel}>
              <div className={styles.title}>公司介绍</div>
              <BraftEditor
                className={styles.caseBraftEditor}
                value={BraftEditor.createEditorState(caseDetail.companyIntroduction || '')}
                style={{ width: '100%', background: 'none' }}
                controls={[]}
                readOnly={true}
              />
            </div>
          )}
          {caseDetail.caseStudy !== '<p></p>' && (
            <div className={styles.casePanel}>
              <div className={styles.title}>案例分析</div>
              <BraftEditor
                className={styles.caseBraftEditor}
                value={BraftEditor.createEditorState(caseDetail.caseStudy || '')}
                style={{ width: '100%', background: 'none' }}
                controls={[]}
                readOnly={true}
              />
            </div>
          )}
          {caseDetail.thinkingConclusion !== '<p></p>' && (
            <div className={styles.casePanel}>
              <div className={styles.title}>案例结语</div>
              <BraftEditor
                className={styles.caseBraftEditor}
                value={BraftEditor.createEditorState(caseDetail.thinkingConclusion || '')}
                style={{ width: '100%', background: 'none' }}
                controls={[]}
                readOnly={true}
              />
            </div>
          )}

          <div className={styles.casePanel}>
            <div className={styles.title}>平台信息</div>
            <div className={styles.platform}>
              <img src={platformImg} alt="" />
              {Boolean(JSON.parse(caseDetail?.casePostData || '[]').length) &&
                JSON.parse(caseDetail?.casePostData || '[]').map((item: RecordItem) => (
                  <div className={styles.detail} key={item.id}>
                    <span>
                      <img src={postIcon} alt="" />
                      &nbsp;&nbsp;{item.postName}
                    </span>
                    <span>{item.postDesc}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {deleteModal && (
        <ConfirmModal
          handleCancel={() => setDeleteModal(false)}
          content="是否删除该案例？删除后信息不可恢复"
          title="删除案例"
          handleOk={handleDeleteOk}
        />
      )}
      <Modal
        open={open}
        // title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            取消发布
          </Button>,
        ]}
      >
        <p>当前案例已发布，取消发布才可编辑!</p>
      </Modal>
      {confirmModal && (
        <ConfirmModal
          handleCancel={() => setConfirmModal(false)}
          content={
            caseDetail.casesState
              ? '该案例已发布至科研广场中，是否取消发布?'
              : '该案例即将发布到科研广场中，是否确认发布?'
          }
          title={caseDetail.casesState ? '取消案例' : '发布案例'}
          handleOk={handleConfirmOk}
        />
      )}
    </div>
  );
};

export default Container;
