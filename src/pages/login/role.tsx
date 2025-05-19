/**
 * @author  zhangjn
 * @description 登录- 角色
 */
import { connect } from 'dva';
import React from 'react';
import styles from './role.less';
import { getRoleList } from '@/services/public';
import { history } from 'umi';
import adminPng from '@/assets/images/admin.png';
import school_logoPng from '@/assets/images/school_logo.png';
import teacherPng from '@/assets/images/teacher.png';
import { removeItemInStorage, setItemInStorage, getItemInStorage } from '@/utils/utils';
import Cookies from 'js-cookie';
import studentPng from '@/assets/images/student.png';
import { Button } from 'antd';
const hostMap: any = {
  'https://tedu.seentao.com': 'https://tcloud.seentao.com',
  'https://dedu.seentao.com': 'https://dcloud.seentao.com',
  'https://edu.seentao.com': 'https://cloud.seentao.com',
};
/* Class */
type IState = {
  tchList: any;
  stuList: any;
  adminList: any;
  roleLength: number;
  authSchools: any;
  ky_tchList: any;
  ky_member: any;
  ky_admin: any;
  empty: any;
};
type Iprops = Record<any, string>;

// 角色：运营人员/院校管理员/教师/学生/科研人员
class TeacherHead extends React.Component<Iprops, IState> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      adminList: [],
      tchList: [],
      stuList: [],
      roleLength: 0,
      authSchools: [],
      ky_tchList: [],
      ky_member: [],
      ky_admin: [],
      empty: false,
    };
  }

  componentDidMount = () => {
    let arr: any = [];
    let arr1: any = [];
    let arr2: any = [];
    let arr4: any = [];
    let arr5: any = [];
    let arr6: any = [];
    removeItemInStorage('researchAuth');
    const isCloud: any = getItemInStorage('cloud');
    getRoleList({ memberId: '', orgType: '', orgId: '', schoolId: '', productType: 'DBE' }).then(
      (res: any) => {
        res.authSchools &&
          res.authSchools.map((item: any) => {
            item.orgId = item.schoolId;
            item.memberId = item.schoolMemberId;
            item.memberType === 'TEACHER'
              ? arr1.push(item)
              : item.memberType === 'SCHOOL_ADMINISTRATOR'
              ? arr2.push(item)
              : item.memberType == 'STUDENT'
              ? arr.push(item)
              : item.memberType == 'TEACHER_JYKF'
              ? arr4.push(item)
              : item.memberType == 'TEACHER_KY'
              ? arr5.push(item)
              : item.memberType == 'SCHOOL_ADMINISTRATOR_SZJM'
              ? arr6.push(item)
              : '';
          });
        if (isCloud == 'true') {
          if (arr4.length == 0 && arr5.length == 0 && arr6.length == 0) {
            this.setState({ empty: true });
          } else {
            this.setState({ empty: false });
          }
        } else {
          console.log('223123');
          this.setState({ empty: false });
        }
        this.setState({
          stuList: arr,
          tchList: arr1,
          adminList: arr2,
          ky_tchList: arr4,
          ky_member: arr5,
          ky_admin: arr6,
          roleLength: res.authSchools.length,
          authSchools: res.authSchools,
        });
      },
    );
  };

  handleClick = (item: any) => {
    console.log(item);
  };

  render() {
    const { tchList, adminList, stuList, ky_tchList, ky_member, ky_admin } = this.state;
    const isCloud: any = getItemInStorage('cloud');
    return (
      <div className={styles.config_container}>
        {this.state.empty == true ? (
          <div className={styles.emptyBox}>
            <div
              style={{
                position: 'absolute',
                bottom: '10%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginLeft: 15,
              }}
            >
              <span style={{ color: '#333333', fontSize: 16 }}>抱歉，您的账号当前没有体验权限</span>
              <span style={{ color: '#333333', fontSize: 16 }}>
                如需进入产品体验环境，请联系新道各地分公司
              </span>
              <Button
                onClick={() => {
                  window.open('https://www.seentao.com/about/contact_us');
                }}
                style={{
                  zIndex: 99,
                  background: '#5A73FF',
                  color: 'white',
                  marginTop: 16,
                  borderRadius: 4,
                }}
              >
                联系我们
              </Button>
              <span
                onClick={() => {
                  window.location.href = hostMap[window.location.origin];
                }}
                style={{
                  marginTop: 16,
                  color: '#5A73FF',
                  fontSize: 14,
                  cursor: 'pointer',
                  zIndex: 99,
                }}
              >
                返回首页
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.body}>
            <div className={styles.sort}>
              {adminList.length !== 0 && isCloud == null && (
                <div className={styles.card1}>
                  <div className={styles.admin}>
                    <img src={adminPng} className={styles.admin_image} />
                    <div className={styles.name}>院校管理员</div>
                    <div className={styles.tips}>进入管理员工作台</div>
                  </div>
                  <div className={styles.box1}>
                    <ul className={adminList.length < 5 ? styles.schoolbox1 : styles.schoolbox2}>
                      <React.Fragment>
                        {adminList.map((item: any) => {
                          return (
                            <li
                              className={styles.list1}
                              key={item}
                              onClick={() => {
                                Object.keys(item) &&
                                  Object.keys(item).map((el: any) => {
                                    Cookies.set(el, item[el], { expires: 7, path: '/' });
                                  });
                                setItemInStorage('memberInfo', JSON.stringify(item));
                                history.push('/adminIndex');
                              }}
                            >
                              <div className={styles.schools}>
                                <img src={school_logoPng} className={styles.school} />
                                <div style={{ marginLeft: 10, fontWeight: 600, fontSize: 16 }}>
                                  {item.schoolName}
                                </div>
                              </div>
                              <div className={styles.card_btn}></div>
                            </li>
                          );
                        })}
                      </React.Fragment>
                      {/* )} */}
                    </ul>
                  </div>
                </div>
              )}
              {tchList.length !== 0 && isCloud == null && (
                <div className={styles.card2}>
                  <div className={styles.teacher}>
                    <img src={teacherPng} className={styles.teacher_image} />
                    <div className={styles.name}>教师</div>
                    <div className={styles.tips}>进入教师工作台</div>
                  </div>
                  <div className={styles.box2}>
                    <ul className={tchList.length < 5 ? styles.schoolbox1 : styles.schoolbox2}>
                      <React.Fragment>
                        {tchList.map((item: any) => {
                          return (
                            <li
                              className={styles.list2}
                              key={item}
                              onClick={() => {
                                setItemInStorage('memberInfo', JSON.stringify(item));
                                Object.keys(item) &&
                                  Object.keys(item).map((el: any) => {
                                    Cookies.set(el, item[el], { expires: 7, path: '/' });
                                  });
                                if (
                                  item.memberType === 'TEACHER' ||
                                  item.memberType === 'SCHOOL_ADMINISTRATOR'
                                ) {
                                  history.push('/researchIndex');
                                } else {
                                  history.push('/researchIndex');
                                }
                              }}
                            >
                              <div className={styles.schools}>
                                <img src={school_logoPng} className={styles.school} />
                                <div style={{ marginLeft: 10, fontWeight: 600, fontSize: 16 }}>
                                  {item.schoolName}
                                </div>
                              </div>

                              <div className={styles.card_btn}></div>
                            </li>
                          );
                        })}
                      </React.Fragment>
                      {/* )} */}
                    </ul>
                  </div>
                </div>
              )}
              {stuList.length !== 0 && isCloud == null && (
                <div className={styles.card3}>
                  <div className={styles.student}>
                    <img src={studentPng} className={styles.student_image} />
                    <div className={styles.name}>学生</div>
                    <div className={styles.tips}>进入学生工作台</div>
                  </div>
                  <div className={styles.box3}>
                    <ul className={stuList.length < 5 ? styles.schoolbox1 : styles.schoolbox2}>
                      <React.Fragment>
                        {stuList.map((item: any) => {
                          return (
                            <li
                              className={styles.list3}
                              key={item}
                              onClick={() => {
                                setItemInStorage('memberInfo', JSON.stringify(item));
                                Object.keys(item) &&
                                  Object.keys(item).map((el: any) => {
                                    Cookies.set(el, item[el], { expires: 7, path: '/' });
                                  });
                                if (
                                  item.memberType === 'TEACHER' ||
                                  item.memberType === 'SCHOOL_ADMINISTRATOR'
                                ) {
                                  history.push('/researchIndex');
                                } else {
                                  history.push('/studentIndex');
                                }
                              }}
                            >
                              <div className={styles.schools}>
                                <img src={school_logoPng} className={styles.school} />
                                <div style={{ marginLeft: 10, fontWeight: 600, fontSize: 16 }}>
                                  {item.schoolName}
                                </div>
                              </div>

                              <div
                                className={styles.card_btn}
                                onClick={() => {
                                  setItemInStorage('memberInfo', JSON.stringify(item));
                                  if (
                                    item.memberType === 'TEACHER' ||
                                    item.memberType === 'SCHOOL_ADMINISTRATOR'
                                  ) {
                                    history.push('/researchIndex');
                                  } else {
                                    history.push('/studentIndex');
                                  }
                                }}
                              ></div>
                            </li>
                          );
                        })}
                      </React.Fragment>
                      {/* )} */}
                    </ul>
                  </div>
                </div>
              )}
              {ky_tchList.length !== 0 && (
                <div className={styles.card2}>
                  <div className={styles.teacher}>
                    <img src={teacherPng} className={styles.teacher_image} />
                    <div className={styles.name}>教师-教研开发</div>
                    <div className={styles.tips}>进入课开工作台</div>
                  </div>
                  <div className={styles.box2}>
                    <ul className={ky_tchList.length < 5 ? styles.schoolbox1 : styles.schoolbox2}>
                      <React.Fragment>
                        {ky_tchList.map((item: any) => {
                          return (
                            <li
                              className={styles.list2}
                              key={item}
                              onClick={() => {
                                setItemInStorage('memberInfo', JSON.stringify(item));
                                Object.keys(item) &&
                                  Object.keys(item).map((el: any) => {
                                    Cookies.set(el, item[el], { expires: 7, path: '/' });
                                  });
                                window.localStorage.setItem('loginOrigin', 'runner');
                                window.location.href = `${window.location.origin}/builder_web/projectList`;
                              }}
                            >
                              <div className={styles.schools}>
                                <img src={school_logoPng} className={styles.school} />
                                <div style={{ marginLeft: 10, fontWeight: 600, fontSize: 16 }}>
                                  {item.schoolName}
                                </div>
                              </div>
                              <div className={styles.card_btn}></div>
                            </li>
                          );
                        })}
                      </React.Fragment>
                      {/* )} */}
                    </ul>
                  </div>
                </div>
              )}
              {ky_member.length !== 0 && (
                <div className={styles.card2}>
                  <div className={styles.teacher}>
                    <img src={teacherPng} className={styles.teacher_image} />
                    <div className={styles.name}>教师-科研成员</div>
                    <div className={styles.tips}>进入科研工作台</div>
                  </div>
                  <div className={styles.box2}>
                    <ul className={ky_member.length < 5 ? styles.schoolbox1 : styles.schoolbox2}>
                      <React.Fragment>
                        {ky_member.map((item: any) => {
                          return (
                            <li
                              className={styles.list2}
                              key={item}
                              onClick={() => {
                                setItemInStorage('memberInfo', JSON.stringify(item));
                                Object.keys(item) &&
                                  Object.keys(item).map((el: any) => {
                                    Cookies.set(el, item[el], { expires: 7, path: '/' });
                                  });
                                history.push('/researchIndex');
                              }}
                            >
                              <div className={styles.schools}>
                                <img src={school_logoPng} className={styles.school} />
                                <div style={{ marginLeft: 10, fontWeight: 600, fontSize: 16 }}>
                                  {item.schoolName}
                                </div>
                              </div>

                              <div className={styles.card_btn}></div>
                            </li>
                          );
                        })}
                      </React.Fragment>
                      {/* )} */}
                    </ul>
                  </div>
                </div>
              )}
              {ky_admin.length !== 0 && (
                <div className={styles.card2}>
                  <div className={styles.teacher}>
                    <img src={adminPng} className={styles.teacher_image} />
                    <div className={styles.name}>管理员-数字建模</div>
                    <div className={styles.tips}>进入管理员工作台</div>
                  </div>
                  <div className={styles.box2}>
                    <ul className={ky_admin.length < 5 ? styles.schoolbox1 : styles.schoolbox2}>
                      <React.Fragment>
                        {ky_admin.map((item: any) => {
                          return (
                            <li
                              className={styles.list2}
                              key={item}
                              onClick={() => {
                                setItemInStorage('memberInfo', JSON.stringify(item));
                                Object.keys(item) &&
                                  Object.keys(item).map((el: any) => {
                                    Cookies.set(el, item[el], { expires: 7, path: '/' });
                                  });
                                history.push('/adminIndex');
                              }}
                            >
                              <div className={styles.schools}>
                                <img src={school_logoPng} className={styles.school} />
                                <div style={{ marginLeft: 10, fontWeight: 600, fontSize: 16 }}>
                                  {item.schoolName}
                                </div>
                              </div>

                              <div className={styles.card_btn}></div>
                            </li>
                          );
                        })}
                      </React.Fragment>
                      {/* )} */}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(({ Step1 }: any) => ({ Step1 }))(TeacherHead as any);
