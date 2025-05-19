/**
 * @author zhangjn
 * @description 主头部侧边栏
 */
import a1 from '@/assets/images/a1.svg';
import a1c from '@/assets/images/a1_c.svg';
import a2 from '@/assets/images/a2.svg';
import a2c from '@/assets/images/a2_c.svg';
import a3 from '@/assets/images/a3.svg';
import a3c from '@/assets/images/a3_c.svg';
import a4 from '@/assets/images/a4.svg';
import a4c from '@/assets/images/a4_c.svg';
import b1 from '@/assets/images/course_anas.svg';
import layout1 from '@/assets/images/layout1.svg';
import layout10 from '@/assets/images/layout10.svg';
import layout11 from '@/assets/images/layout11.svg';
import layout110 from '@/assets/images/layout110.svg';
import layout12 from '@/assets/images/layout12.svg';
import layout13 from '@/assets/images/layout13.svg';
import layout14 from '@/assets/images/layout14.svg';
import layout17 from '@/assets/images/layout17.svg';
import layout18 from '@/assets/images/layout18.svg';
import layout19 from '@/assets/images/layout19.svg';
import layout2 from '@/assets/images/layout2.svg';
import layout20 from '@/assets/images/layout20.svg';
import layout20_1 from '@/assets/images/layout20_1.svg';
import layout21 from '@/assets/images/layout21.svg';
import layout21_1 from '@/assets/images/layout21_1.svg';
import layout3 from '@/assets/images/layout3.svg';
import layout4 from '@/assets/images/layout4.svg';
import layout5 from '@/assets/images/layout5.svg';
import layout6 from '@/assets/images/layout6.svg';
import layout7 from '@/assets/images/layout7.svg';
import layout8 from '@/assets/images/layout8.svg';
import layout9 from '@/assets/images/layout9.svg';
import b2 from '@/assets/images/learn_anas.svg';
import r1 from '@/assets/images/reSearch/menu/r1.svg';
import r2 from '@/assets/images/reSearch/menu/r2.svg';
import r4 from '@/assets/images/reSearch/menu/r4.png';
import r7 from '@/assets/images/reSearch/menu/r7.png';
import r8 from '@/assets/images/reSearch/menu/r8.svg';
import b1s from '@/assets/images/sta1.svg';
import b2s from '@/assets/images/sta2.svg';
import layout30 from '@/assets/images/课题组.svg';
import layout31 from '@/assets/images/课题.svg';
import layout32 from '@/assets/images/数据集市.svg';
import layout33 from '@/assets/images/数据工坊.svg';
import layout40 from '@/assets/images/课题组not.svg';
import layout41 from '@/assets/images/课题not.svg';
import layout42 from '@/assets/images/数据集市not.svg';
import layout43 from '@/assets/images/数据工坊not.svg';
import UserCenter from '@/components/userCenter';
import { Popover, message } from 'antd';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import React from 'react';
import { history } from 'umi';
/// import back from '../../assets/images/back.png';
import { PubSubApi } from '@/utils/enum';
import { connect } from 'umi';
import logo from '../../assets/images/logo.jpg';
import {
  admin_scientific_sideMenu,
  // admin_sideMenu,
  stu_scientific_sideMenu,
  // stu_sideMenu,
  tch_scientific_sideMenu,
  // tch_sideMenu,
} from '../../../pages/globalConfig';
import styles from './index.less';

type IState = {
  sideMenus: any; // 侧边栏-菜单列表
  info: RecordItem; // 头部信息;
  currentMenu: number;
  noScroll: boolean;
};
type Iprops = any;
class Layout extends React.Component<Iprops, IState> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      sideMenus: [],
      info: {},
      noScroll: true,
      currentMenu: props.app.currentSystem,
    };
  }
  PubSubToken: null | string = null;
  customStyle = ['studentIndex', 'teacherIndex', 'researchIndex'];
  componentDidMount = (): void => {
    // let that: any = this;
    this.get_url(window.location.pathname.split('/bus_tara_web/')[1]);
    // (document.getElementById('noPaddindBgConten') as any).addEventListener('wheel', function () {
    //   let scroll: any = that.state.noScroll;
    //   if (scroll == true) {
    //     that.setState({ noScroll: false });
    //   }
    //   // 处理鼠标滚动事件的代码
    // });
    // (document.getElementById('noPaddindBgConten') as any).addEventListener(
    //   'scrollend',
    //   (event: any) => {
    //     console.log('scroll has ended2222222222222222');
    //   },
    // );
    // 监听路由变化 设置 Icon Active状态
    this.PubSubToken = PubSub.subscribe(
      PubSubApi.LAYOUT_CHANGE_ICON_ACTIVE_STATUS,
      (_, url: string) => {
        this.get_url(url);
      },
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<any>): void {
    this.setState(
      {
        currentMenu: nextProps.app.currentSystem,
      },
      () => {
        this.get_url(window.location.pathname.split('/bus_tara_web/')[1]);
      },
    );
  }

  getIcon = (icon: any) => {
    switch (icon) {
      case '1':
        return <img src={layout1}></img>;
      case '2':
        return <img src={layout2}></img>;
      case '3':
        return <img src={layout3}></img>;
      case '4':
        return <img src={layout4}></img>;
      case '5':
        return <img src={layout5}></img>;
      case '6':
        return <img src={layout6}></img>;
      case '7':
        return <img src={layout7}></img>;
      case '8':
        return <img src={layout8}></img>;
      case '9':
        return <img src={layout9}></img>;
      case '21':
        return <img src={layout21}></img>;
      case 'b1':
        return <img src={b1}></img>;
      case 'b2':
        return <img src={b2}></img>;
      case '10':
        return <img src={layout10}></img>;
      case '20':
        return <img src={layout20}></img>;
      case 'a1':
        return <img src={a1}></img>;
      case 'a2':
        return <img src={a2}></img>;
      case 'a3':
        return <img src={a3}></img>;
      case 'a4':
        return <img src={a4}></img>;
      case 'r1':
        return <img src={r1}></img>;
      case 'r2':
        return <img src={r2}></img>;
      case 'r4':
        return <img src={r4}></img>;
      case 'r7':
        return <img src={r7}></img>;
      case 'r8':
        return <img src={r8}></img>;
      case '30':
        return <img src={layout40}></img>;
      case '31':
        return <img src={layout41}></img>;
      case '32':
        return <img src={layout42}></img>;
      case '33':
        return <img src={layout43}></img>;
    }
    return;
  };

  getIcons = (icon: any) => {
    switch (icon) {
      case '1':
        return <img src={layout11}></img>;
      case '2':
        return <img src={layout12}></img>;
      case '3':
        return <img src={layout13}></img>;
      case '4':
        return <img src={layout14}></img>;
      case '5':
        return <img src={layout5}></img>;
      case '6':
        return <img src={layout21_1}></img>;
      case '7':
        return <img src={layout17}></img>;
      case '8':
        return <img src={layout18}></img>;
      case '9':
        return <img src={layout19}></img>;
      case '10':
        return <img src={layout110}></img>;
      case '20':
        return <img src={layout20_1}></img>;
      case '21':
        return <img src={layout21_1}></img>;
      case 'a1':
        return <img src={a1c}></img>;
      case 'a2':
        return <img src={a2c}></img>;
      case 'a3':
        return <img src={a3c}></img>;
      case 'a4':
        return <img src={a4c}></img>;
      case 'r1':
        return <img src={r1}></img>;
      case 'r2':
        return <img src={r2}></img>;
      case 'r4':
        return <img src={r4}></img>;
      case 'r7':
        return <img src={r7}></img>;
      case 'b1':
        return <img src={b2s}></img>;
      case 'b2':
        return <img src={b1s}></img>;
      case 'r8':
        return <img src={r8}></img>;
      case '30':
        return <img src={layout30}></img>;
      case '31':
        return <img src={layout31}></img>;
      case '32':
        return <img src={layout32}></img>;
      case '33':
        return <img src={layout33}></img>;
    }
    return;
  };

  get_url = (url: any): void => {
    let menus: any = JSON.parse(
      JSON.stringify(
        Cookies.get('memberType') === 'TEACHER'
          ? this.state.currentMenu === 1
            ? tch_scientific_sideMenu
            : tch_scientific_sideMenu
          : Cookies.get('memberType') === 'SCHOOL_ADMINISTRATOR'
          ? this.state.currentMenu === 1
            ? admin_scientific_sideMenu
            : admin_scientific_sideMenu
          : this.state.currentMenu === 1
          ? stu_scientific_sideMenu
          : stu_scientific_sideMenu,
      ),
    );
    if (url == 'classManage/classStatistics' || url == 'classManage/learnStatistics') {
      url = 'classManage';
    }
    if (Cookies.get('memberType') === 'TEACHER') {
      if (
        url == 'chat' ||
        url == 'contacts' ||
        url == 'to_resource' ||
        url == 'importClass' ||
        url == 'examAdmin' ||
        url == 'userAdmin'
      ) {
        url = 'mores';
      }
    }
    if (url == 'teacherManage' || url == 'stuManage' || url == 'userManage') {
      url = 'yonghu';
    }
    if (url == 'baseinfo' || url == 'newsAdmin') {
      url = 'menhu';
    }
    if (url == 'contacts') {
      url = 'contacts';
    }
    if (url == 'chat') {
      url = 'chat';
    }

    let sideMenus: any = menus.find((e: any) => e.page === url) || {};
    sideMenus.active = true;

    this.setState({ sideMenus: menus }, () => {});
    // history.push(`/${url}`);
  };

  handleChangeCurrentPanel = (current: number) => {
    this.setState(
      {
        currentMenu: current,
      },
      () => {
        if (Cookies.get('memberType') === 'TEACHER') {
          this.get_url(this.state.currentMenu === 1 ? 'teacherIndex' : 'researchIndex');
          history.push(`${this.state.currentMenu === 1 ? '/teacherIndex' : '/researchIndex'}`);
        } else {
          this.get_url(this.state.currentMenu === 1 ? 'studentIndex' : 'researchIndex');
          history.push(`${this.state.currentMenu === 1 ? '/studentIndex' : '/researchIndex'}`);
        }
      },
    );
  };

  // 渲染头部
  renderHeader = () => {
    const type = Cookies.get('memberType');
    const { currentMenu } = this.state;
    const { jurisdictionModal } = this.props.app;
    switch (type) {
      case 'TEACHER':
        return jurisdictionModal.online || jurisdictionModal.offline ? (
          <div className={styles.teacherMenu}>
            <span
              className={classNames(currentMenu === 1 ? styles.active : styles.default)}
              onClick={() => {
                this.handleChangeCurrentPanel(1);
              }}
            >
              {currentMenu === 1 ? '教学工作台' : '教'}
            </span>
            <span
              className={classNames(currentMenu === 2 ? styles.active : styles.default)}
              onClick={() => {
                this.handleChangeCurrentPanel(2);
              }}
            >
              {currentMenu === 2 ? '科研工作台' : '科'}
            </span>
          </div>
        ) : (
          <div className={styles.title}>教学工作台</div>
        );
      case 'SCHOOL_ADMINISTRATOR':
        return jurisdictionModal.online || jurisdictionModal.offline ? (
          <div className={styles.teacherMenu}>
            <span
              className={classNames(currentMenu === 1 ? styles.active : styles.default)}
              onClick={() => {
                this.handleChangeCurrentPanel(1);
              }}
            >
              {currentMenu === 1 ? '管理工作台' : '管'}
            </span>
            <span
              className={classNames(currentMenu === 2 ? styles.active : styles.default)}
              onClick={() => {
                this.handleChangeCurrentPanel(2);
              }}
            >
              {currentMenu === 2 ? '科研工作台' : '科'}
            </span>
          </div>
        ) : (
          <div className={styles.title}>管理工作台</div>
        );
      default:
        return jurisdictionModal.online || jurisdictionModal.offline ? (
          <div className={styles.teacherMenu}>
            <span
              className={classNames(currentMenu === 1 ? styles.active : styles.default)}
              onClick={() => {
                this.handleChangeCurrentPanel(1);
              }}
            >
              {currentMenu === 1 ? '学习工作台' : '学'}
            </span>
            <span
              className={classNames(currentMenu === 2 ? styles.active : styles.default)}
              onClick={() => {
                this.handleChangeCurrentPanel(2);
              }}
            >
              {currentMenu === 2 ? '科研工作台' : '科'}
            </span>
          </div>
        ) : (
          <div className={styles.title}>学生工作台</div>
        );
    }
  };

  render() {
    const { sideMenus } = this.state;
    return (
      <div className={styles.layout_container} id="layout_container">
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src={logo}></img>
          </div>
          {this.renderHeader()}
          <div className={styles.login_message} id="Tooltip">
            <UserCenter />
          </div>
        </div>
        <div
          id={Cookies.get('memberType') === 'STUDENT' ? 'stuBodyContainer' : undefined}
          className={classNames(
            styles.body,
            Cookies.get('memberType') === 'STUDENT' && styles.stuBody,
          )}
        >
          <div className={styles.sideMenu}>
            {sideMenus.map((item: any) => {
              return (
                <React.Fragment key={item.id}>
                  {item.children ? (
                    <Popover
                      placement="rightTop"
                      getPopupContainer={() => {
                        return document.getElementById('layout_container') as any;
                      }}
                      content={
                        <div style={{ padding: 0, display: 'flex', alignItems: 'center' }}>
                          {item.children &&
                            item.children.map((e: any) => {
                              return (
                                <div
                                  key={`${e.page}${e.title}`}
                                  className={styles.menu}
                                  onMouseOver={() => {
                                    console.log('22132132132112');
                                    if (!e.active) {
                                      e.move = true;
                                      this.setState({ sideMenus });
                                    }
                                  }}
                                  onMouseLeave={() => {
                                    if (!e.active) {
                                      e.move = false;
                                      this.setState({ sideMenus });
                                    }
                                  }}
                                  style={{
                                    marginLeft: 15,
                                    padding: 4,
                                    marginTop: 0,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                  }}
                                  onClick={() => {
                                    if (e.disable) {
                                      message.warning('该功能暂未开放');
                                    } else {
                                      console.log('1111111121', e.page);
                                      console.log(
                                        '22222222222222',
                                        window.location.pathname.split('/bus_tara_web/')[1],
                                      );
                                      if (
                                        e.page !==
                                        window.location.pathname.split('/bus_tara_web/')[1]
                                      ) {
                                        this.get_url(e.page);
                                        history.push(`/${e.page}`);
                                      }
                                    }
                                  }}
                                >
                                  <div
                                    className={
                                      e.active || e.move ? styles.menuIcons : styles.menuIcon
                                    }
                                  >
                                    {e.active || e.move
                                      ? this.getIcons(e.icon)
                                      : this.getIcon(e.icon)}
                                  </div>
                                  <div
                                    className={
                                      e.title.length > 3 ? styles.longTitle : styles.menuTitle
                                    }
                                    style={{ width: 60, display: 'flex', justifyContent: 'center' }}
                                  >
                                    {e.title}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      }
                    >
                      <div
                        key={`${item.page}${item.title}`}
                        className={styles.menu}
                        onMouseOver={() => {
                          if (!item.active) {
                            item.move = true;
                            this.setState({ sideMenus });
                          }
                        }}
                        onMouseLeave={() => {
                          if (!item.active) {
                            item.move = false;
                            this.setState({ sideMenus });
                          }
                        }}
                        // onClick={() => {
                        //   if (item.disable) {
                        //     message.warning('该功能暂未开放');
                        //   } else {
                        //     this.get_url(item.page);
                        //   }
                        // }}
                      >
                        <div
                          className={item.active || item.move ? styles.menuIcons : styles.menuIcon}
                        >
                          {item.active || item.move
                            ? this.getIcons(item.icon)
                            : this.getIcon(item.icon)}
                        </div>
                        <div className={styles.menuTitle}>{item.title}</div>
                      </div>
                    </Popover>
                  ) : (
                    <div
                      key={`${item.page}${item.title}`}
                      className={styles.menu}
                      style={{ display: 'flex' }}
                      onMouseOver={() => {
                        if (!item.active) {
                          item.move = true;
                          this.setState({ sideMenus });
                        }
                      }}
                      onMouseLeave={() => {
                        if (!item.active) {
                          item.move = false;
                          this.setState({ sideMenus });
                        }
                      }}
                      onClick={() => {
                        if (item.disable) {
                          message.warning('该功能暂未开放');
                        } else {
                          // window._hmt.push(['_trackEvent', item.title, 'click']);
                          if (item.page !== window.location.pathname.split('/bus_tara_web/')[1]) {
                            this.get_url(item.page);
                            history.push(`/${item.page}`);
                          }
                        }
                      }}
                    >
                      <div
                        className={item.active || item.move ? styles.menuIcons : styles.menuIcon}
                      >
                        {item.active || item.move
                          ? this.getIcons(item.icon)
                          : this.getIcon(item.icon)}
                      </div>
                      <div
                        className={classNames(
                          item.title.length > 3 ? styles.longTitle : styles.menuTitle,
                        )}
                      >
                        {item.title}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          {this.customStyle.includes(window.location.pathname.split('/bus_tara_web/')[1]) ? (
            <div
              className={classNames(
                this.customStyle.includes(window.location.pathname.split('/bus_tara_web/')[1])
                  ? this.state.noScroll
                    ? Cookies.get('memberType') === 'STUDENT'
                      ? styles.noPaddindBgContent
                      : styles.noScroll
                    : styles.noPaddindBgContent
                  : styles.content,
              )}
              id="noPaddindBgConten"
            >
              {this.props.children}
            </div>
          ) : (
            <div className={styles.content} id="noPaddindBgConten">
              <div className={styles.contents}>{this.props.children}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(({ app }: AppState) => ({ app }))(Layout);
