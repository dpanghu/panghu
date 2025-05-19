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
            src: `/pm_teachcenter_web/chat`,
            style: {
              width: '100%',
              height: '100%',
            },
          }}
          postMessage={{
            componentInfo: {
              payload: {},
              eventHandler: () => {
                console.log('componentInfo post success');
              },
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
