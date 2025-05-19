/**
 * 科研团队
 */
import { getIps } from '@/services/public';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { Carousel } from 'antd';
import defaultAvatarPng from '@/assets/images/reSearch/defaultAvatar.png';

interface IProps {
  detailObj: any;
  teamInfo: any;
  memberArr: any;
  teacherArr: any;
  partnersArr: any;
}
const ScTeam: React.FC<IProps> = ({ teamInfo, memberArr, teacherArr, partnersArr }) => {
  const [sourceIp, setSourceIp] = useState('');

  useEffect(() => {
    // 获取ip
    getIps().then((ele: any) => {
      setSourceIp(ele?.['dbe.remote.api.ip']);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {teamInfo.teamName && (
          <div className={styles.title}>
            <span>团队信息</span>
          </div>
        )}
        <div className={styles.box}>
          <div className={styles.text}>{teamInfo.teamName}</div>
          <div className={styles.article}>{teamInfo.teamProfiles}</div>
          {teamInfo?.teamPhoto && (
            <div className={styles.photos}>
              <Carousel>
                {teamInfo?.teamPhoto?.split(',')?.map((item: any) => (
                  <div className={styles.photo} key={item}>
                    <img src={`${sourceIp}/dbe3/res/download/${item}`} />
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </div>
      <div className={styles.content}>
        {(teacherArr.length > 0 || memberArr.length > 0) && (
          <div className={styles.title}>
            <span>团队成员</span>
          </div>
        )}
        {teacherArr.map((item: any) => (
          <div className={styles.teacher} key={item.id}>
            <img
              src={
                item.memberPhoto
                  ? `${sourceIp}/dbe3/res/download/${item.memberPhoto}`
                  : defaultAvatarPng
              }
            />
            <div>
              <div className={styles.name}>{item.memberName}</div>
              <div className={styles.span}>项目导师</div>
              <div className={styles.describe}>{item.memberProfiles}</div>
            </div>
          </div>
        ))}
        <div className={styles.member}>
          {memberArr.map((item: any) => (
            <div className={styles.member_box} key={item.id}>
              <img
                src={
                  item.memberPhoto
                    ? `${sourceIp}/dbe3/res/download/${item.memberPhoto}`
                    : defaultAvatarPng
                }
              />
              <div>
                <div className={styles.name}>{item.memberName}</div>
                <div className={styles.member_span}>项目成员</div>
                <div className={styles.member_des}>{item.memberProfiles}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        {partnersArr.length > 0 && (
          <div className={styles.title}>
            <span>合作伙伴</span>
          </div>
        )}
        <div className={styles.cooperate_content}>
          {partnersArr.map((item: any) => (
            <div className={styles.cooperate} key={item.id}>
              <img src={`${sourceIp}/dbe3/res/download/${item.memberPhoto}`} />
              <div className={styles.cooperate_title}>{item.memberName}</div>
              <div className={styles.cooperate_des}>{item.memberProfiles}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScTeam;
