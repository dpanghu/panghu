/*
 *@description:app model
 *@author: 王冰
 *@date: 2022-04-11 13:33:26
 */
import { C_REQUEST_CODE } from '@/services/constants';
import { getBaseInfo, getIps, getEnvironment } from '@/services/public';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';
import routes from '../../../config/routes';
import { jurisdictionModal } from '@/services/research';
import Cookies from 'js-cookie';
import {
  getQueryParam,
  updateSessionStorage,
  getLocalUserData,
  setItemInStorage,
  getItemInStorage,
} from '@/utils/utils';
import { logout } from '@/services/workspace';
import { clearCookie } from '@/utils/enum';
import { getSchoolAuthModuls } from '@/services/app';

interface UserData {
  userName: string;
  headImgUrl: string;
  realName: string;
}

export interface AppState {
  jurisdictionModal: RecordItem; // 科研工作台是否授权
  userInfo: UserData;
  isRepositoryAuth: boolean; //资源库是否被授权
  currentSystem: number;
}

interface CommonModel {
  namespace: string;
  state: AppState;
  subscriptions: any;
  effects: {
    getUserInfo: Effect;
    getSchoolAuthModuls: Effect;
    getJurisdictionModal: Effect;
  };
  reducers: {
    updateStates: Reducer<AppState>;
  };
}

let ResearchAuthFlag = false;

const app: CommonModel = {
  namespace: 'app',
  state: {
    jurisdictionModal: {},
    userInfo: {
      userName: '',
      headImgUrl: '',
      realName: '',
    },
    isRepositoryAuth: false,
    currentSystem: 1,
  },
  subscriptions: {
    // 全局监听
    async setup({ history, dispatch }: any) {
      return history.listen((location: Location) => {
        // const userInfo: any = getLocalUserData('userInfo'); // 用户信息
        // const memberInfo: any = getLocalUserData('memberInfo'); // 角色信息
        // /* 在登录页或者手动输入根路径时存在的情况：1：有用户信息，无角色信息，跳转登录页   2: 用户信息和角色信息均有，跳转对应角色首页 */
        // if (location.pathname === '/login') {
        //   if (userInfo.userId !== void 0) {
        //     if (memberInfo.memberType == void 0) {
        //       window.location.href = '/bus_tara_web/role';
        //     } else {
        //       switch (memberInfo.memberType) {
        //         case 'TEACHER':
        //           window.location.href = '/bus_tara_web/teacherIndex';
        //           break;
        //         case 'SCHOOL_ADMINISTRATOR':
        //         case 'SCHOOL_ADMINISTRATOR_SZJM':
        //           window.location.href = '/bus_tara_web/adminIndex';
        //           break;
        //         case 'TEACHER_KY':
        //           window.location.href = '/bus_tara_web/researchIndex';
        //           break;
        //         case 'TEACHER_JYKF':
        //           window.location.href = '/bus_tara_web/role';
        //           break;
        //         default:
        //           window.location.href = '/bus_tara_web/studentIndex';
        //           break;
        //       }
        //     }
        //   }
        // }
      });
    },
  },
  effects: {
    *getUserInfo({}, { call, put }) {
      const { data } = yield call(getBaseInfo);
      if (data.code == C_REQUEST_CODE.PBU_SUCCESS) {
        Cookies.set('userInfo', JSON.stringify(data));
        updateSessionStorage('userInfo', data);
        yield put({
          type: 'updateStates',
          payload: {
            userInfo: {
              userName: data.userName,
              headImgUrl: data.headImgUrl,
              realName: data.realName,
            },
          },
        });
      } else {
        message.error(data.msg, 5);
      }
    },
    *getSchoolAuthModuls({}, { call, put }) {
      const { data } = yield call(getSchoolAuthModuls);
      if (data.code == C_REQUEST_CODE.PBU_SUCCESS) {
        const isRepositoryAuth =
          data.moduleTypes.find((item: RecordItem) => item.moduleType === 'REPOSITORY')
            ?.isAuthorized === 1;
        yield put({
          type: 'updateStates',
          payload: {
            isRepositoryAuth,
          },
        });
        // 检查授权
        // verifyRepositoryAuth(isRepositoryAuth);
      } else {
        message.error(data.msg, 5);
      }
    },
    *getJurisdictionModal({}, { call, put }): any {
      let qs: any = getQueryParam();
      const data = yield call(jurisdictionModal, { ...qs, memberType: Cookies.get('memberType') });
      put({
        type: 'updateStates',
        payload: {
          jurisdictionModal: data,
        },
      });
      setItemInStorage('researchAuth', 'true');
      return data;
    },
  },
  reducers: {
    updateStates(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default app;
