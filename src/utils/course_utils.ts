/**
 * @description 课程 相关 方法
 *
 * **/

import Cookies from 'js-cookie';
import { getSessionStorage } from './utils';

// 获取公共的 biz 跳转参数
export const getBizCommonParams = ({
  taskInfo = {},
  trainData = {},
  bizData = {},
  hasExtraParams = true,
  commonApplication = false,
  extra = {},
}: {
  taskInfo?: RecordItem; // getRoleInfo 接口返回的信息 包含是否加入团队 是否上岗 等
  trainData?: RecordItem;
  bizData?: RecordItem;
  commonApplication?: boolean;
  extra?: RecordItem;
  hasExtraParams?: boolean; // 是否需要额外的参数，默认需要，目前只有工作应用是不需要的，实践任务都需要
}) => {
  const {
    userId,
    userToken,
    userName,
    schoolMemberId,
    schoolId,
    memberType,
    userInfo = '{}',
    userType,
  } = Cookies.get();

  let params: RecordItem = {};
  const baseParams = {
    userId,
    userName,
    userToken,
    schoolId,
    orgId: schoolId,
    memberType,
    memberId: schoolMemberId,
    userType,
    classId: getSessionStorage('student_class')?.id,
    courseChapterId: 0,
    courseSectionId: 0,
    courseUnitId: 0,
    courseElementId: 0,
    postId: 0,
    activityId: 0,
    sourcePostId: 0,
    environment: 0,
    dbeProjectVersionId: 0,
    projectVersionId: 0,
    projectSubitemId: 0,
    courseVersionId: 0, // 新版课程版本id均为项目版本id 兼容旧biz
    teamId: getSessionStorage('student_team')?.id || 0, // 团队id
    isTeamLeader: getSessionStorage('student_team')?.isTeamLeader || 0, // 是否为组长
    isTeamInit: getSessionStorage('student_team')?.isInited, // 团队是否初始化
    realName: JSON.parse(userInfo || '{}')?.memberName || JSON.parse(userInfo || '{}')?.realName,
    platformCode: 'DBE3',
    businessType: 'no_post', // 是否需要团队 需要传post 不需要传 no_post
    teamRank: getSessionStorage('student_team')?.teamRank || 0, // 团队序号
    taskId: 0,
    classOrgId: getSessionStorage('student_class')?.schoolId,
    courseId: getSessionStorage('student_class')?.courseId,
    deployMode: getSessionStorage('inOnline') ? 'online' : 'offline', // online公有云 offline资产版
  };
  if (hasExtraParams) {
    const extraParmas = {
      businessType: trainData?.isNeedTeam === 1 ? 'post' : 'no_post', // 是否需要团队 需要传post 不需要传 no_post
      dbeProjectVersionId: getSessionStorage('student_project')?.dbeProjectVersionId,
      courseVersionId: bizData.isSpecial
        ? getSessionStorage('student_project')?.dbeProjectVersionId
        : getSessionStorage('student_project')?.id, // 新版课程版本id均为项目版本id 兼容旧biz
      projectVersionId: getSessionStorage('student_project')?.id,
      projectSubitemId: getSessionStorage('student_task')?.projectSubitemId,
      taskId: getSessionStorage('student_task')?.id || 0,
      activityId: getSessionStorage('student_task')?.id,
      teamRank: getSessionStorage('student_team')?.teamRank || 0,
      bizRoleCode: taskInfo?.postInfo?.roleCode,
      roleCode: taskInfo?.postInfo?.roleCode,
      bizRoleName: taskInfo?.postInfo?.roleName, // 上岗的角色name
      postCode: taskInfo?.postInfo?.roleCode,
      isOpenAnswer: getSessionStorage('student_task')?.isOpen,
      busCaseId: trainData?.busCaseId,
      caseCode: trainData?.caseCode,
      caseVersionId: getSessionStorage('student_class')?.courseVersionId,
      courseSectionId: getSessionStorage('student_project')?.id,
      courseUnitId: getSessionStorage('student_task')?.projectSubitemId,
      courseElementId: getSessionStorage('student_project')?.id,
      courseChapterId: getSessionStorage('student_project')?.chapterId,
      courseComponentId: getSessionStorage('student_task')?.id,
    };
    params = { ...baseParams, ...extraParmas };
  } else {
    params = { ...{ bizId: 0, originBizId: 0 }, ...baseParams };
  }
  if (commonApplication) {
    params = {
      ...params,
      orgId: schoolId,
      classOrgId: schoolId,
      classId: schoolId,
      dbeProjectVersionId: schoolId,
      projectVersionId: schoolId,
    };
  }
  return { ...params, ...extra };
};

// 根据 Routes中的
