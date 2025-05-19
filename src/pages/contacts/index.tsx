/**
 * @author  zhangjn
 * @description 沟通
 */
import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { IframeViewer } from 'seent-rc';
import { base64 } from 'seent-tools';
import qs from 'qs';
import Cookies from 'js-cookie';
import { message } from 'antd';
import { history } from 'umi';
import { createRroupChat, createSingleChat } from '@/services/dtcService';
/* Class */
type IState = {
  open: any; // 资源库弹窗
};
type Iprops = Record<any, string>;
const { userId, userToken, schoolMemberId, schoolId, memberType } = Cookies.get();

const qsParams = base64.encode(
  qs.stringify({
    userId,
    userToken,
    memberId: schoolMemberId,
    schoolId,
    memberType: memberType,
    orgId: schoolId,
    //   orgName: schoolId,
  }),
);
class SignIn extends React.Component<Iprops, IState> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      open: false, // 资源库弹窗
    };
  }

  componentDidMount = () => {};
  render() {
    return (
      <div className={styles.sign_container}>
        <IframeViewer
          attributes={{
            src: `/pm_teachcenter_web/contacts?qs=${qsParams}`,
            style: {
              width: '100%',
              height: '100%',
            },
          }}
          listenMessage={{
            onSelectMember: ({ toObjectId, groupName }: any) => {
              if (groupName === '') {
                createSingleChat({
                  fromMemberId: schoolMemberId, //当前用户id
                  chatType: 'singleChat',
                  toObjectId,
                }).then(() => {
                  message.success('创建成功');
                  history.push('/chat');
                });
              } else {
                createRroupChat({
                  groupMemberIds: toObjectId,
                  groupName,
                }).then(() => {
                  message.success('创建成功');
                  history.push('/chat');
                });
              }
              console.log(toObjectId);
              console.log(groupName);
            },
          }}
          onReady={() => {
            console.log('iframe load success!');
          }}
        />
      </div>
    );
  }
}

export default connect(({ Teacher }: any) => ({ Teacher }))(SignIn);
