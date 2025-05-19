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
const { userId, userToken, schoolMemberId, schoolId, memberType } = Cookies.get();

const qsParams = handleQs.encode({
  userId,
  userToken,
  memberId: schoolMemberId,
  schoolId,
  memberType: memberType,
  orgId: schoolId,
});

console.log('qsParams', qsParams);
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
        <iframe
          src={`https://tedu.seentao.com/dtc_schoolmanage_web/schoolManagement?qs=${qsParams}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    );
  }
}

export default connect(({ Teacher }: any) => ({ Teacher }))(SignIn);
