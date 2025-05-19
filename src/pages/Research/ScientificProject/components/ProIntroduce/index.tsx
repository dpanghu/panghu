/**
 * 项目介绍
 */
import IconFont from '@/components/Iconfont';
import Preview from '@/components/PreviewManage';
// import { getRemoteUrl } from '@/services/studentCourseList';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import info from '@/assets/images/info.png';
import { getRemoteUrl } from '@/services/studentCourseList';
import { Button, Tooltip, message } from 'antd';
import Cookies from 'js-cookie';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { base64 } from 'seent-tools';
import { DATA_VOLUME_VALUE } from '../../../DataSet/components/contant';
import styles from './index.less';
import lockSvg from '@/assets/images/reSearch/lock.svg';
import waitPng from '@/assets/images/reSearch/wait.png';
import adminSvg from '@/assets/images/reSearch/admin.svg';
import leftBtnSvg from '@/assets/images/reSearch/leftBtn.svg';
import rightBtnSvg from '@/assets/images/reSearch/rightBtn.svg';

interface IProps {
  detailObj: any;
  handleApply: () => void;
}
const ProIntroduce: React.FC<IProps> = ({ detailObj, handleApply }) => {
  const industryAnalysis =
    (detailObj.subSet?.length && detailObj.subSet[0]?.industryAnalysis) || '';
  const companyIntroduction =
    (detailObj.subSet?.length && detailObj.subSet[0]?.companyIntroduction) || '';
  const caseStudy = (detailObj.subSet?.length && detailObj.subSet[0]?.caseStudy) || '';
  const thinkingConclusion =
    (detailObj.subSet?.length && detailObj.subSet[0]?.thinkingConclusion) || '';

  const { userId, userName, userToken, schoolMemberId, schoolId, memberType } = Cookies.get();
  const roleAudit = Cookies.get('memberType') !== 'SCHOOL_ADMINISTRATOR';

  const dataset = detailObj?.subSet || [];
  const roles = detailObj?.mineInfo?.roles || [];
  const [left, setLeft] = useState(0);
  const [key, setKey] = useState('');
  const [content, setContent] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [materialsInfo, setMaterialsInfo] = useState([]);
  const [url, setUrl] = useState('');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    if (detailObj?.subSet?.length) {
      const fileArr = detailObj.subSet[0].materialsInfo || [];
      const type = fileArr[0]?.attachmentName.split('.').pop() || '';

      setKey(detailObj.subSet[0].id);
      setContent(detailObj.subSet[0].content);
      setMaterialsInfo(fileArr);
      setActiveKey(fileArr[0]?.id);
      setUrl(fileArr[0]?.htmlViewUrl);
      setFileType(type);
    }
  }, [detailObj]);

  const handleClickBtn = (type: string) => {
    if (type === 'right') {
      const number = (dataset.length * 256 + 72) / 1096;
      if (Math.floor(number) === Math.abs(left) / 1096) {
        return;
      }
      setLeft(left - 1096);
    } else {
      if (left === 0) {
        return;
      }
      setLeft(left + 1096);
    }
  };

  const handleClickBox = (record: any) => {
    setKey(record.id);
    setContent(record.content);
    setMaterialsInfo(record.materialsInfo || []);
    setActiveKey(record.materialsInfo?.[0].id);
    const type = record.materialsInfo?.[0]?.attachmentName.split('.').pop() || '';
    setUrl(record.materialsInfo?.[0]?.htmlViewUrl);
    setFileType(type);
  };

  const handleClickFile = (record: any) => {
    const type = record.attachmentName.split('.').pop();
    setUrl(record.htmlViewUrl);
    setFileType(type);
    setActiveKey(record.id);
  };

  const goPlat = (roleCode: string) => {
    const caseId = detailObj.subSet?.length && detailObj.subSet[0].platformCasesId;
    const id = detailObj.subSetType === 1 ? caseId : '99570681242730496';
    const qsParams = base64.encode(
      qs.stringify({
        userId,
        userToken,
        userName,
        memberId: schoolMemberId,
        schoolId,
        memberType,
        orgId: schoolId,
        classOrgId: schoolId,
        platformCode: 'DBE3',
        teamRank: detailObj?.mineInfo?.groupNo,
        businessType: 'no_post',
        classId: detailObj.id,
        busCaseId: id,
        dbeCourseVersionId: id,
        projectVersionId: id,
        realName: '',
        roleCode: !detailObj.isLeader ? roleCode : '',
      }),
    );

    const gourl = detailObj.isLeader ? detailObj.projectEnvAdminUrl : detailObj.projectEnvUrl;
    window.open(`${gourl}?qs=${qsParams}`);
  };

  const handleOpenDic = async () => {
    if (!key) {
      message.error('暂无数据集');
      return;
    }
    const target = dataset.find((item: RecordItem) => item.id === key);
    const referenceDatasets = JSON.parse(target?.referenceDatasets || '[]');
    if (!referenceDatasets.length) {
      message.info('当前数据集未关联外部数据源');
      return;
    }
    const result = await getRemoteUrl({
      remoteKey: 'dbe.xdata.datadict',
    });
    // 获取地址
    window.open(`${result}?appertainId=${referenceDatasets[0]?.id}`, '_blank');
  };

  const flag = (detailObj.isLeader && detailObj.closeStatus === 1) || detailObj.closeStatus === 0;

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.detailBg}>
          <div className={styles.title}>
            <span>平台信息</span>
          </div>
        </div>
        <div className={styles.platImg}>
          {detailObj.initStatus !== 2 ? (
            <div className={styles.mask}>
              {detailObj.initStatus === 0 ? (
                <div className={styles.maskContent}>
                  <div className={styles.text}>
                    <img src={lockSvg} />
                    需要申请平台环境才能访问哦～
                  </div>
                  {detailObj.isLeader && roleAudit && (
                    <Button className={styles.applyBtn} onClick={handleApply}>
                      申请环境
                    </Button>
                  )}
                </div>
              ) : detailObj.initStatus === 1 ? (
                <div className={styles.text}>
                  <img src={waitPng} />
                  正在申请中，用时可能比较长，您可稍后返回此处查看～
                </div>
              ) : detailObj.initStatus === 3 ? (
                <div>
                  <div>因系统原因或网络问题导致申请失败，请再次尝试～</div>
                  {detailObj.isLeader && roleAudit && (
                    <Button className={styles.applyBtn} onClick={handleApply}>
                      再次申请
                    </Button>
                  )}
                </div>
              ) : detailObj.initStatus === -2 ? (
                <div>
                  <div className={styles.text}>
                    <img src={lockSvg} />
                    当前学校租户数量已达上限，请清除其他项目或购买租户～
                  </div>
                  {detailObj.isLeader && roleAudit && (
                    <Button className={styles.applyBtn} onClick={handleApply}>
                      再次申请
                    </Button>
                  )}
                </div>
              ) : detailObj.initStatus === -3 ? (
                <div>
                  <div className={styles.text}>
                    <img src={lockSvg} />
                    没有可用租户～
                  </div>
                  {detailObj.isLeader && roleAudit && (
                    <Button className={styles.applyBtn} onClick={handleApply}>
                      再次申请
                    </Button>
                  )}
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            (detailObj.subSetType === 2 || detailObj.subSetType === 0) &&
            detailObj.initStatus === 2 &&
            !detailObj.clearStatus &&
            flag &&
            roleAudit && (
              <Button className={styles.enter} onClick={() => goPlat('')}>
                进入平台
              </Button>
            )
          )}
        </div>
        <div className={styles.roles}>
          {roles.map((item: any) => (
            <div className={styles.role} key={item.id}>
              <span className={styles.span}>
                <img src={adminSvg} />
                {item.roleName}
              </span>
              <span className={styles.roleDesc}>{item.roleDesc}</span>
              {detailObj.initStatus === 2 && !detailObj.clearStatus && flag && roleAudit && (
                <Button className={styles.btn} onClick={() => goPlat(item.id)}>
                  进入平台
                  <IconFont type="icon-tch_arrow_next" className={styles.icon} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {detailObj.subSetType === 2 && dataset.length && (
        <div>
          <div className={styles.detailBg} id="detailBgContainer">
            <div className={styles.title}>
              <span>数据集介绍</span>
              <Tooltip
                getPopupContainer={() =>
                  document.getElementById('detailBgContainer') as HTMLElement
                }
                title={
                  <div>
                    数据字典：用于描述和解释数据集字段的说明文档。
                    <Button type="link" onClick={handleOpenDic}>
                      立即查看
                    </Button>
                  </div>
                }
                // open={true}
              >
                <img src={info} style={{ width: 16, marginBottom: 5, marginLeft: 2 }} />
              </Tooltip>
              {/* <Button
                type="primary"
                className={styles.dataDicBtn}
                size="small"
                onClick={handleOpenDic}
              >
                数据字典
                <Tooltip title="数据集说明">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Button> */}
            </div>
          </div>
          {dataset.length > 1 && (
            <div className={styles.tag}>
              {dataset.length > 4 && (
                <div className={styles.leftBtn} onClick={() => handleClickBtn('left')}>
                  <img src={leftBtnSvg} />
                </div>
              )}
              <div className={styles.boxs_content}>
                <div className={styles.boxs} style={{ left }}>
                  {dataset.map((item: any) => (
                    <div
                      className={key === item.id ? styles.activeBox : styles.box}
                      key={item.id}
                      onClick={() => handleClickBox(item)}
                    >
                      <div title={item.name}>
                        {item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}
                      </div>
                      <div>数据量：{DATA_VOLUME_VALUE[item.datasetVolume]}</div>
                    </div>
                  ))}
                </div>
              </div>
              {dataset.length > 4 && (
                <div className={styles.rightBtn} onClick={() => handleClickBtn('right')}>
                  <img src={rightBtnSvg} />
                </div>
              )}
            </div>
          )}
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className={dataset.length > 1 ? styles.datasetContent : styles.datasetOne}
          />
          <div>
            <div className={styles.fileTag}>
              {materialsInfo.map((item: any) => (
                <span
                  key={item.id}
                  onClick={() => handleClickFile(item)}
                  className={activeKey === item.id ? styles.activeSpan : ''}
                >
                  {item.attachmentName}
                </span>
              ))}
            </div>
            <Preview url={url} fileType={fileType} height="calc(100vh - 584px)" />
          </div>
        </div>
      )}
      <div>
        {industryAnalysis !== '' && industryAnalysis !== '<p></p>' && (
          <div>
            <div className={styles.detailBg}>
              <div className={styles.title}>
                <span>行业背景</span>
              </div>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: industryAnalysis }}
              className={styles.content}
            />
          </div>
        )}
        {companyIntroduction !== '' && companyIntroduction !== '<p></p>' && (
          <div>
            <div className={styles.detailBg}>
              <div className={styles.title}>
                <span>公司介绍</span>
              </div>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: companyIntroduction }}
              className={styles.content}
            />
          </div>
        )}
        {caseStudy !== '' && caseStudy !== '<p></p>' && (
          <div>
            <div className={styles.detailBg}>
              <div className={styles.title}>
                <span>案例分析</span>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: caseStudy }} className={styles.content} />
          </div>
        )}
        {thinkingConclusion !== '' && thinkingConclusion !== '<p></p>' && (
          <div>
            <div className={styles.detailBg}>
              <div className={styles.title}>
                <span>案例结语</span>
              </div>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: thinkingConclusion }}
              className={styles.content}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProIntroduce;
