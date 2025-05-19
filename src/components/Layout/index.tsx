import UserCenter from '@/components/userCenter';
import { Input, Popover, Drawer, message, ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { history, useDispatch } from 'umi';
import { PubSubApi } from '@/utils/enum';
import { connect } from 'umi';
import logo from '../../assets/images/zhiyanLogo.png';
import { cloneDeep } from 'lodash-es';
import {
  admin_scientific_sideMenu,
  stu_scientific_sideMenu,
  tch_scientific_sideMenu,
} from '../../pages/globalConfig';
import styles from './index.less';
import type { ILayoutProps, ILayoutState } from './typings';
import { useMount, useReactive } from 'ahooks';
import { _assets, customStyle } from './constants';
import Cookies from 'js-cookie';
import backs from '@/assets/imgs/bacs.png';
import head from '@/assets/imgs/earch.png';
import people from '@/assets/imgs/people.png';
import aigif from '@/assets/people.png';
import { getMenu } from '@/services/dbeIndex';
import { Outlet } from 'umi';
import { UserOutlined, SearchOutlined,QrcodeOutlined, ApartmentOutlined,HourglassOutlined, LogoutOutlined, DashboardOutlined, TeamOutlined, PieChartOutlined, BlockOutlined, DeploymentUnitOutlined, ExperimentOutlined } from '@ant-design/icons';
// import aigif from '@/assets/images/aigif.gif';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
const role_code: any = {
  SCHOOL_ADMINISTRATOR_SZJM: 'OT_ADMIN_MSM',
  TEACHER_KY: 'OT_TEACHER_SCI_TECH_APP',
  TEACHER_JYKF: 'OT_TEACHER_RIE_DEVELOP',
};
const Layout: React.FC<any> = ({ app, children }) => {
  const _memberType = Cookies.get('memberType') as any;
  const state = useReactive<any>({
    sideMenus: [],
    info: {},
    activeTitle: '用户管理',
    menu: [
      // {
      //   title: '首页',
      //   url: '/pageIndex',
      // },
      {
        title: '数据大屏',
        url: '/dataBoard',
      },
      {
        title: '二维码生成',
        url: '/qrcodeManage',
      },
      {
        title: '测试片管理',
        url: '/cardManage',
      },
      // {
      //   title: '采样管理',
      //   url: '/sampleManage',
      // },
      {
        title: '企业管理',
        url: '/orgManage',
      },
      {
        title: '机柜间管理',
        url: '/deptManage',
      },
      // {
      //   title: '腐蚀产物厚度(埃)',
      //   url: '/index2',
      //   disable: true,

      // },
      // {
      //   title: '环境等级',
      //   url: '/index3',
      //   disable: true,
      // },
      {
        title: '用户管理',
        url: '/userManage',
      },
      // {
      //   title: '角色管理',
      //   url: '/roleManage',
      // }
    ],
    noScroll: true,
    aiShow: false,
  });
  // 路由地址
  const basePathname = window.location.pathname.split('/')[1];
  // 监听实例
  const PubSubToken = useRef<string | number | null>(null);

  // 获取当前侧边栏
  const getSidebarMenu = () => {
    let sidebarMenu: RecordItem[] = [];
    switch (_memberType) {
      case 'TEACHER':
        sidebarMenu = state.currentMenu === 1 ? tch_scientific_sideMenu : tch_scientific_sideMenu;
        break;
      case 'TEACHER_KY':
        sidebarMenu = tch_scientific_sideMenu;
        break;
      case 'STUDENT':
        sidebarMenu = state.currentMenu === 1 ? stu_scientific_sideMenu : stu_scientific_sideMenu;
        break;
      case 'SCHOOL_ADMINISTRATOR':
        sidebarMenu =
          state.currentMenu === 1 ? admin_scientific_sideMenu : admin_scientific_sideMenu;
        break;
      case 'SCHOOL_ADMINISTRATOR_SZJM':
        sidebarMenu =
          state.currentMenu === 1 ? admin_scientific_sideMenu : admin_scientific_sideMenu;
        break;
      default:
        sidebarMenu = [];
        break;
    }
    return cloneDeep(sidebarMenu);
  };

  const get_url = (url: any): void => {
    const menus = getSidebarMenu();
    
    if (role_code[_memberType] !== void 0) {
      let menu: any = [];
      /* 处理动态菜单 */
      getMenu({
        userRoleCode: role_code[_memberType],
      }).then((res: any) => {
        res &&
          res.map((item: any) => {
            let menuitem: any = menus.find((el: any) => el.title == item.menuName);
            menu.push(menuitem);
          });
        switch (url) {
          case 'classManage/classStatistics':
          case 'classManage/learnStatistics':
            url = 'classManage';
            break;
          case 'teacherManage':
          case 'stuManage':
          case 'userManage':
            url = 'yonghu';
            break;
          case 'baseinfo':
          case 'newsAdmin':
            url = 'menhu';
            break;
          case 'contacts':
            url = 'contacts';
            break;
          case 'chat':
            url = 'chat';
            break;
          default:
            break;
        }
        const sideMenus: any =
          menus.find((e: any) => e.activeUrl?.includes(url) || e.page === url) || {};
        sideMenus.active = true;
        state.sideMenus = menu;
      });
    } else {
      if (_memberType === 'TEACHER') {
        if (
          url === 'chat' ||
          url === 'contacts' ||
          url === 'to_resource' ||
          url === 'importClass' ||
          url === 'examAdmin' ||
          url === 'userAdmin'
        ) {
          url = 'mores';
        }
      }
      switch (url) {
        case 'classManage/classStatistics':
        case 'classManage/learnStatistics':
          url = 'classManage';
          break;
        case 'teacherManage':
        case 'stuManage':
        case 'userManage':
          url = 'yonghu';
          break;
        case 'baseinfo':
        case 'newsAdmin':
          url = 'menhu';
          break;
        case 'contacts':
          url = 'contacts';
          break;
        case 'chat':
          url = 'chat';
          break;
        default:
          break;
      }
      const sideMenus: any =
        menus.find((e: any) => e.activeUrl?.includes(url) || e.page === url) || {};
      sideMenus.active = true;
      state.sideMenus = menus;
    }
  };

  const getNormalIcon = (icon: any) => {
    switch (icon) {
      case '1':
        return <img src={_assets.layout1}></img>;
      case '2':
        return <img src={_assets.layout2}></img>;
      case '3':
        return <img src={_assets.layout3}></img>;
      case '4':
        return <img src={_assets.layout4}></img>;
      case '5':
        return <img src={_assets.layout5}></img>;
      case '6':
        return <img src={_assets.layout6}></img>;
      case '7':
        return <img src={_assets.layout7}></img>;
      case '8':
        return <img src={_assets.layout8}></img>;
      case '9':
        return <img src={_assets.layout9}></img>;
      case '21':
        return <img src={_assets.layout21}></img>;
      case 'b1':
        return <img src={_assets.b1}></img>;
      case 'b2':
        return <img src={_assets.b2}></img>;
      case '10':
        return <img src={_assets.layout10}></img>;
      case '20':
        return <img src={_assets.layout20}></img>;
      case 'a1':
        return <img src={_assets.a1}></img>;
      case 'a2':
        return <img src={_assets.a2}></img>;
      case 'a3':
        return <img src={_assets.a3}></img>;
      case 'a4':
        return <img src={_assets.a4}></img>;
      case 'r1':
        return <img src={_assets.r1}></img>;
      case 'r2':
        return <img src={_assets.r2}></img>;
      case 'r4':
        return <img src={_assets.r4}></img>;
      case 'r7':
        return <img src={_assets.r7}></img>;
      case 'r8':
        return <img src={_assets.r8}></img>;
      case '30':
        return <img src={_assets.layout40}></img>;
      case '31':
        return <img src={_assets.layout41}></img>;
      case '32':
        return <img src={_assets.layout42}></img>;
      case '33':
        return <img src={_assets.layout43}></img>;
    }
    return;
  };

  const getActiveIcon = (icon: any) => {
    switch (icon) {
      case '1':
        return <img src={_assets.layout11}></img>;
      case '2':
        return <img src={_assets.layout12}></img>;
      case '3':
        return <img src={_assets.layout13}></img>;
      case '4':
        return <img src={_assets.layout14}></img>;
      case '5':
        return <img src={_assets.layout5}></img>;
      case '6':
        return <img src={_assets.layout21_1}></img>;
      case '7':
        return <img src={_assets.layout17}></img>;
      case '8':
        return <img src={_assets.layout18}></img>;
      case '9':
        return <img src={_assets.layout19}></img>;
      case '10':
        return <img src={_assets.layout110}></img>;
      case '20':
        return <img src={_assets.layout20_1}></img>;
      case '21':
        return <img src={_assets.layout21_1}></img>;
      case 'a1':
        return <img src={_assets.a1c}></img>;
      case 'a2':
        return <img src={_assets.a2c}></img>;
      case 'a3':
        return <img src={_assets.a3c}></img>;
      case 'a4':
        return <img src={_assets.a4c}></img>;
      case 'r1':
        return <img src={_assets.r1}></img>;
      case 'r2':
        return <img src={_assets.r2}></img>;
      case 'r4':
        return <img src={_assets.r4}></img>;
      case 'r7':
        return <img src={_assets.r7}></img>;
      case 'b1':
        return <img src={_assets.b2s}></img>;
      case 'b2':
        return <img src={_assets.b1s}></img>;
      case 'r8':
        return <img src={_assets.r8}></img>;
      case '30':
        return <img src={_assets.layout30}></img>;
      case '31':
        return <img src={_assets.layout31}></img>;
      case '32':
        return <img src={_assets.layout32}></img>;
      case '33':
        return <img src={_assets.layout33}></img>;
    }
    return;
  };

  //  更改当前系统 (学习工作台 / 科研工作台)
  const handleChangeCurrentPanel = (current: number) => {
    state.currentMenu = current;
    dispatch({
      type: 'app/updateStates',
      payload: {
        currentSystem: current,
      },
    });
    switch (_memberType) {
      case 'TEACHER':
        get_url('researchIndex');
        history.push(`${'/researchIndex'}`);
        break;
      case 'STUDENT':
        get_url('researchIndex');
        history.push(`${'/researchIndex'}`);
        break;
      case 'SCHOOL_ADMINISTRATOR':
        get_url(state.currentMenu === 1 ? 'adminIndex' : 'researchIndex');
        history.push(`${state.currentMenu === 1 ? '/adminIndex' : '/researchIndex'}`);
        break;
      default:
        break;
    }
  };

  useMount(() => {
    console.log('basePathname', basePathname);
    state.activeTitle = '/' + basePathname;
    get_url(basePathname);
  });
  console.log('state.sideMenus', state.sideMenus);

  useEffect(() => {
    get_url(basePathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfigProvider locale={locale}>
    <div className={styles.layout_container} id="layout_container">
      <div className={styles.left}>
        {/* <div className={styles.left_head}>
          <img src={head} style={{ width: 60 }}></img>
          <div style={{ color:'black',fontSize: 16 }}>中石化(大连)石油化工研究院有限公司</div>
        </div> */}
        <div className={styles.left_body}>
          <div className={styles.user_box}>
            <img className={styles.average} src={people}></img>
            <div className={styles.user_data}>
              <div>admin</div>
              <div style={{ marginTop: 7, color: '#009099', fontSize: 13, fontWeight: 600 }}>超级管理员</div>
            </div>
          </div>
          <div className={styles.menuBox}>
            {
              state.menu && state.menu.map((item: any, index: any) => {
                return <div onClick={() => {
                  if(item.disable == true) {
                    message.warning('暂未开放');
                    return;
                  }
                  state.activeTitle = item.url;
                  history.push(item.url);
                  // if(item.title == '数据大屏') {
                  //   window.open(`${window.location.origin}/dataBoard`)
                  // }else {
                  //   history.push(item.url);
                  // }
                }} className={item.url == state.activeTitle ? styles.activemenus : styles.menus}>
                  {
                    item.title == '首页' ? <DashboardOutlined style={{ color: 'white', marginRight: 10, marginLeft: 10, fontSize: 18 }}></DashboardOutlined> : item.title == '用户管理' ? <TeamOutlined  style={{ color: 'white', marginRight: 10, marginLeft: 10, fontSize: 18 }}></TeamOutlined> :
                    item.title == '角色管理' ? <UserOutlined style={{ color: 'white', marginRight: 10, marginLeft: 10, fontSize: 18 }}></UserOutlined> : item.title == '数据大屏' ? <PieChartOutlined style={{ color: 'white', marginRight: 10, marginLeft: 10, fontSize: 18 }}></PieChartOutlined> : item.title == '挂片管理' ?  <BlockOutlined style={{ color: 'white', marginRight: 10, marginLeft: 10, fontSize: 18 }}></BlockOutlined> : 
                    item.title == '环境等级' ? <DeploymentUnitOutlined style={{ color: 'white', marginRight: 10, marginLeft: 10, fontSize: 18 }}></DeploymentUnitOutlined> : item.title == '企业管理' ? <HourglassOutlined style={{ color: 'white', marginRight: 10, marginLeft: 10, fontSize: 18 }}></HourglassOutlined> : item.title == '二维码生成' ? <QrcodeOutlined style={{ color: 'white', marginRight: 10, marginLeft: 10, fontSize: 18 }}></QrcodeOutlined> : <ApartmentOutlined style={{ color: 'white', marginRight: 10, marginLeft: 10, fontSize: 18 }}/>
                  }
                  <div>{item.title}</div>
                </div>
              })
            }
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.right_head}>
          <div></div>
        <div style={{ cursor:'pointer',color: 'black',fontSize: 16,marginRight: 25 }}>机柜间环境检测分级平台</div>
            {/* <Input style={{ width: 440,height: 38,borderRadius: 6,border:'none',background:'#F5F6F7' }} suffix={<SearchOutlined />} placeholder='请输入要搜索的内容'></Input> */}
            <div className={styles.logout} onClick={()=> {
              message.success('退出成功');
              history.push('/login');
              
            }}>
               <div style={{ cursor:'pointer',color: '#5a73ff',fontSize: 14 }}>退出登陆</div>
               <LogoutOutlined style={{ marginLeft: 12, fontSize: 18,color:'#5a73ff' }}/>
            </div>
        </div>
        <div className={styles.right_body}>
            <div className={styles.content}>
               <Outlet></Outlet>
            </div>
          </div>
      </div>
    </div>
    </ConfigProvider>
  );
};

export default Layout;
