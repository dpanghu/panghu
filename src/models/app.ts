/*
 *@description:app model
 *@author: 王冰
 *@date: 2022-04-11 13:33:26
 */
 import { getSchoolAuthModuls, getUserInfo } from '@/services/app';
 import { C_REQUEST_CODE } from '@/services/constants';
 // import { verifyRepositoryAuth } from '@/services/verifyRepositoryAuth';
 import { message } from 'antd';
 import { jurisdictionModal } from '@/services/research';
 import { getQueryParam } from '@/utils/utils';
 import { logout } from '@/services/workspace';
 import { clearCookie } from '@/utils/enum';
 
 interface UserData {
   userName: string;
   headImgUrl: string;
   realName: string;
 }
 
 
 interface CommonModel {
   namespace: string;
   state: any;
   subscriptions: {
     setup: any;
   };
 }
 
 const app: any = {
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
     setup({ history, dispatch }: { history: any; dispatch: any }) {
        console.log('3213');
       return history.listen((location: Location) => {
         if (location.pathname === '/login') {
           console.log('2212321');
           return;
         }
       });
     },
   },
   reducers: {
     updateStates(state: any, action: any) {
       return {
         ...state,
         ...action.payload,
       };
     },
   },
 };
 
 export default app;
 