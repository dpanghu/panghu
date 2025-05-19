import platform from 'platform';
import Cookies from 'js-cookie';
import type { BaseInfoType } from './typings';
import { getUuid } from './getUuid';
import { pathname2pageLocationMap } from './constants';

enum appIdEnum {
  Web = 'Web',
  Android = 'Android',
  iOS = 'iOS',
  Applet = '小程序',
}

// enum appNameEnum {
//   TEACHER = 1,
//   STUDENT = 2,
//   SCHOOL_ADMINISTRATOR = 3,
//   course = 4,
//   system = 6,
// }

const appNameMap: Record<string, number> = {
  TEACHER: 1,
  STUDENT: 2,
  SCHOOL_ADMINISTRATOR: 3,
};

export function getBaseInfo(): BaseInfoType {
  const data: BaseInfoType = {} as BaseInfoType;

  const memberType = Cookies.get('memberType');

  const windowTop = window.top || window;
  const pathname = windowTop.location.pathname;

  const funCode = pathname2pageLocationMap[pathname];

  data.uid = getUuid();
  data.appId = appIdEnum.Web;
  data.appCode = appNameMap[memberType!];
  data.funCode = funCode; // 路由信息里去拿
  data.url = pathname;
  data.urlHost = windowTop.location.host;
  data.referer = windowTop.document.referrer;

  data.browser = platform.name;
  data.browserVersion = platform.version;

  return data;
}
