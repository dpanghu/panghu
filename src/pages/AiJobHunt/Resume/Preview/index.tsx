import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { Col, Row } from 'antd';
import { default as classNames, default as classnames } from 'classnames';
import React from 'react';
import type { IResumeContent } from '../../type';
import styles from './index.less';

type Props = {
  resumeInfo: IResumeContent | null;
};
const ResumePreview: React.FC<Props> = ({ resumeInfo }) => {
  return (
    <div className={styles.container}>
      <div className={styles['resume-extra-icon']}></div>
      <div className={styles['basic-info']}>
        <div className={styles['basic-detail']}>
          <h2 className={styles['basic-detail-name']}>
            {resumeInfo?.name || ''}
          </h2>
          <Row className={styles['basic-detail-info']} gutter={[0, 16]}>
            <Col span={6}>
              <span
                className={classNames(
                  styles['basic-detail-info-item-label'],
                  styles['age'],
                )}
              >
                年龄
              </span>
              ：
              <span className={styles['basic-detail-info-item-content']}>
                {resumeInfo?.age + '岁' || '-'}
              </span>
            </Col>
            <Col span={12}>
              <span
                className={classNames(
                  styles['basic-detail-info-item-label'],
                  styles['sex'],
                )}
              >
                性别
              </span>
              ：
              <span className={styles['basic-detail-info-item-content']}>
                {resumeInfo?.sex || '-'}
              </span>
            </Col>
            <Col span={6} />
            <Col span={6}>
              <span
                className={classNames(
                  styles['basic-detail-info-item-label'],
                  styles['nativePlace'],
                )}
              >
                籍贯
              </span>
              ：
              <span className={styles['basic-detail-info-item-content']}>
                {resumeInfo?.nativePlace || '-'}
              </span>
            </Col>
            <Col span={12}>
              <span
                className={classNames(
                  styles['basic-detail-info-item-label'],
                  styles['workYear'],
                )}
              >
                工作年限
              </span>
              ：
              <span className={styles['basic-detail-info-item-content']}>
                {resumeInfo?.workYear || '-'}
              </span>
            </Col>
            <Col span={6} />
            <Col span={6}>
              <span
                className={classNames(
                  styles['basic-detail-info-item-label'],
                  styles['phone'],
                )}
              >
                联系电话
              </span>
              ：
              <span className={styles['basic-detail-info-item-content']}>
                {resumeInfo?.phone || '-'}
              </span>
            </Col>
            <Col span={12}>
              <span
                className={classNames(
                  styles['basic-detail-info-item-label'],
                  styles['email'],
                )}
              >
                联系邮箱
              </span>
              ：
              <span className={styles['basic-detail-info-item-content']}>
                {resumeInfo?.email || '-'}
              </span>
            </Col>
          </Row>
        </div>
      </div>
      <div
        className={classNames(styles['basic-avatar'], {
          [styles['basic-avatar-male']]: resumeInfo?.sex === '男',
          [styles['basic-avatar-female']]: resumeInfo?.sex === '女',
          [styles['basic-avatar-unknowAvatar']]: !resumeInfo?.sex,
        })}
      ></div>
      <div className={styles['employment-intention']}>
        <h4>
          <span>求职意向</span>
          <div></div>
        </h4>
        <Row>
          <Col span={4}>
            <span className={styles['info-title']}>意向职位：</span>
            <span className={styles['info-content']}>
              {resumeInfo?.intentPositionValue || '-'}
            </span>
          </Col>
          <Col span={4} offset={1} style={{ textAlign: 'center' }}>
            <span className={styles['info-title']}>意向城市：</span>
            <span className={styles['info-content']}>
              {resumeInfo?.intentCity || '-'}
            </span>
          </Col>
          <Col span={4} offset={1} style={{ textAlign: 'center' }}>
            <span className={styles['info-title']}>期望薪资：</span>
            <span className={styles['info-content']}>
              {resumeInfo?.intentCity || '-'}
            </span>
          </Col>
          <Col span={4} offset={1} style={{ textAlign: 'center' }}>
            <span className={styles['info-title']}>工作性质：</span>
            <span className={styles['info-content']}>
              {resumeInfo?.workNature || '-'}
            </span>
          </Col>
          <Col span={4} offset={1} style={{ textAlign: 'right' }}>
            <span className={styles['info-title']}>到岗时间：</span>
            <span className={styles['info-content']}>
              {resumeInfo?.dutyDate || '-'}
            </span>
          </Col>
        </Row>
      </div>
      {/* 教育背景 */}
      <div className={styles['education-background']}>
        <h4>
          <span>教育背景</span>
          <div></div>
        </h4>
        <div className={classnames(sf.sFlex, sf.sFlexDirC, sf.sFlexGap24)}>
          {resumeInfo?.educationalBackgroundList?.length === 0 ? (
            <div className={sf.sFlex1}>
              <div className={classnames(styles['title'])}>
                <span>时间段</span>
                <span>学校</span>
                <span>专业</span>
              </div>
              <pre className={styles['info-content']}>-</pre>
            </div>
          ) : (
            resumeInfo?.educationalBackgroundList?.map((item, index) => (
              <div key={index} className={sf.sFlex1}>
                <div className={classnames(styles['title'])}>
                  <span>
                    {item.graduationStartTime}~{item.graduationEndTime}
                  </span>
                  <span>{item.schoolName}</span>
                  <span>{`${item.major}（${item.education}）`}</span>
                </div>
                <pre className={styles['info-content']}>{item.description}</pre>
              </div>
            ))
          )}
        </div>
      </div>
      {/* 实习经验 */}
      <div className={styles['internship-experience']}>
        <h4>
          <span>实习经验</span>
          <div></div>
        </h4>
        <div className={classnames(sf.sFlex, sf.sFlexDirC, sf.sFlexGap24)}>
          {resumeInfo?.internshipExperienceList?.length === 0 ? (
            <div className={sf.sFlex1}>
              <div className={styles['title']}>
                <span>时间段</span>
                <span>学校</span>
                <span>职位类型</span>
              </div>
              <pre className={styles['info-content']}>-</pre>
            </div>
          ) : (
            resumeInfo?.internshipExperienceList?.map((item, index) => (
              <div key={index} className={sf.sFlex1}>
                <div className={styles['title']}>
                  <span>
                    {item.periodStart}~{item.periodEnd}
                  </span>
                  <span>{item.projectName}</span>
                  <span>{item.role}</span>
                </div>
                <pre className={styles['info-content']}>{item.description}</pre>
              </div>
            ))
          )}
        </div>
      </div>
      <div className={styles['campus-experience']}>
        <h4>
          <span>校园经历</span>
          <div></div>
        </h4>
        <div className={classnames(sf.sFlex, sf.sFlexDirC, sf.sFlexGap24)}>
          {resumeInfo?.campusExperienceList?.length === 0 ? (
            <div className={sf.sFlex1}>
              <div className={styles['title']}>
                <span>时间段</span>
                <span>经历名称</span>
                <span>角色</span>
              </div>
              <pre className={styles['info-content']}>-</pre>
            </div>
          ) : (
            resumeInfo?.campusExperienceList?.map((item, index) => (
              <div key={index} className={sf.sFlex1}>
                <div className={styles['title']}>
                  <span>
                    {item.periodStart}~{item.periodEnd}
                  </span>
                  <span>{item.projectName}</span>
                  <span>{item.role}</span>
                </div>
                <pre className={styles['info-content']}>{item.description}</pre>
              </div>
            ))
          )}
        </div>
      </div>
      <div className={styles['skill']}>
        <h4>
          <span>技能特长</span>
          <div></div>
        </h4>
        <div className={styles['info-content']}>{resumeInfo?.skill || '-'}</div>
      </div>
      <div className={styles['honor']}>
        <h4>
          <span>荣誉证书</span>
          <div></div>
        </h4>
        <div className={styles['info-content']}>{resumeInfo?.honor || '-'}</div>
      </div>
      <div className={styles['self-evaluation']}>
        <h4>
          <span>自我评价</span>
          <div></div>
        </h4>
        <div className={styles['info-content']}>
          {resumeInfo?.selfEvaluation || '-'}
        </div>
      </div>
      {resumeInfo?.projectExperienceList &&
        resumeInfo?.projectExperienceList.length > 0 && (
          <div className={styles['project-experience']}>
            <h4>
              <span>项目经历</span>
              <div></div>
            </h4>
            <div className={classnames(sf.sFlex, sf.sFlexDirC, sf.sFlexGap24)}>
              {resumeInfo?.projectExperienceList?.map((item, index) => (
                <div key={index} className={sf.sFlex1}>
                  <div className={styles['title']}>
                    <span>
                      {item.periodStart}~{item.periodEnd}
                    </span>
                    <span>{item.projectName}</span>
                    <span>{item.role}</span>
                  </div>
                  <pre className={styles['info-content']}>
                    {item.description}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      {resumeInfo?.workExperienceList &&
        resumeInfo?.workExperienceList.length > 0 && (
          <div className={styles['work-experience']}>
            <h4>
              <span>工作经历</span>
              <div></div>
            </h4>
            <div className={classnames(sf.sFlex, sf.sFlexDirC, sf.sFlexGap24)}>
              {resumeInfo?.workExperienceList?.map((item, index) => (
                <div key={index} className={sf.sFlex1}>
                  <div className={styles['title']}>
                    <span>
                      {item.periodStart}~{item.periodEnd}
                    </span>
                    <span>{item.projectName}</span>
                    <span>{item.role}</span>
                  </div>
                  <pre className={styles['info-content']}>
                    {item.description}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      {resumeInfo?.selfDefList && resumeInfo?.selfDefList.length > 0 && (
        <div className={styles['self-def']}>
          <h4>
            <span>自定义模块</span>
            <div></div>
          </h4>
          <div className={classnames(sf.sFlex, sf.sFlexDirC, sf.sFlexGap24)}>
            {resumeInfo?.selfDefList?.map((item, index) => (
              <div key={index} className={sf.sFlex1}>
                <div className={styles['title']}>
                  <span>
                    {item.periodStart}~{item.periodEnd}
                  </span>
                  <span>{item.projectName}</span>
                  <span>{item.role}</span>
                </div>
                <pre className={styles['info-content']}>{item.description}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
