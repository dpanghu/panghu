import Cookies from 'js-cookie';
import qs from 'qs';
import React from 'react';
import { IframeViewer } from 'seent-rc';
import { base64 } from 'seent-tools';

const Operations: React.FC = () => {
  const { id: projectVersionId, projectName } =
    JSON.parse(window.sessionStorage.getItem('student_task') || '{}') || {};
  const { id: teachClassId } =
    JSON.parse(window.sessionStorage.getItem('student_class') || '{}') || {};
  const { userId, userToken, schoolMemberId, schoolId, userName, userType } = Cookies.get();

  const qsParams = base64.encode(
    qs.stringify({
      userId,
      userToken,
      memberId: schoolMemberId,
      schoolId,
      memberType: 'STUDENT',
      orgId: schoolId,
      userName,
      userType,
      //   orgName: schoolId,
    }),
  );

  return (
    <IframeViewer
      attributes={{
        src: `/pm_usercenter_web/SchoolManage?qs=${qsParams}`,
        style: {
          width: '100%',
          height: '100%',
        },
      }}
      postMessage={{
        componentInfo: {
          payload: {
            teachClassId,
            projectVersionId,
            projectName,
          },
          eventHandler: () => {
            console.log('componentInfo post success');
          },
        },
      }}
      onReady={() => {
        console.log('iframe load success!');
      }}
    />
  );
};

export default Operations;
