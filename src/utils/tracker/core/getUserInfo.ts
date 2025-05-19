// @ts-ignore
import { getLocation, getIpLocation, setConfig as setGetLocationConfig } from '@pikaz/location';
import { USER_LOCATION_KEY } from './constants';

setGetLocationConfig({ timeout: 5000 });

type UserInfoType = {
  taskId?: string;
  projectId?: string;
  projectVersionId?: string;
  clientIp?: string;
  country?: string;
  province?: string;
  city?: string;
};

export async function getUserInfo() {
  const userInfo: UserInfoType = {};

  // taskId
  const taskStr = window.sessionStorage.getItem('student_task');
  if (taskStr) {
    const task = JSON.parse(taskStr);
    userInfo.taskId = task.id;
  }
  const projectStr = window.sessionStorage.getItem('student_project');
  if (projectStr) {
    const project = JSON.parse(projectStr);
    userInfo.projectId = project.dbeProjectId;
    userInfo.projectVersionId = project.dbeProjectVersionId;
  }

  userInfo.country = '中国';
  try {
    let locationInfo: { ip: string; province: string; city: string; type: string } | null = null;
    const localInfoStr = window.sessionStorage.getItem(USER_LOCATION_KEY);
    if (localInfoStr) {
      locationInfo = JSON.parse(localInfoStr);
    } else {
      locationInfo = await getLocation();
      if (locationInfo?.type === 'h5') {
        const { ip } = await getIpLocation();
        locationInfo.ip = ip;
      }
      window.sessionStorage.setItem(USER_LOCATION_KEY, JSON.stringify(locationInfo));
    }

    userInfo.clientIp = locationInfo?.ip;
    userInfo.province = locationInfo?.province || '';
    userInfo.city = locationInfo?.city || '';
  } catch (error) {
    // 未获取到用户的ip、省份、城市等信息
    console.error(error);
  }

  return userInfo;
}
