/**
 * @author  zhangjn
 * @description 沟通
 */
import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import { handleQs } from 'seent-tools';
/* Class */
type IState = {
  open: any; // 资源库弹窗
};
type Iprops = Record<any, string>;

class SignIn extends React.Component<Iprops, IState> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      open: false, // 资源库弹窗
    };
  }

  componentDidMount = () => {};

  getParams = () => {
    const { userId, userToken, schoolMemberId, schoolId, memberType } = Cookies.get();
    const qsParams = handleQs.encode({
      userId,
      userToken,
      memberId: schoolMemberId,
      schoolId,
      memberType: memberType,
      orgId: schoolId,
    });
    return qsParams;
  };

  render() {
    console.log('this.getParams()', this.getParams());
    return (
      <div className={styles.sign_container}>
        <iframe
          src={`/dtc_schoolmanage_web/Notice?qs=${this.getParams()}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    );
  }
}

export default connect(({ Teacher }: any) => ({ Teacher }))(SignIn);
