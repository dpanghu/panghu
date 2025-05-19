/**
 * 业务侧
 */
import { EventName, SEENTAO_TRACKER_IS_ON_KEY, pathname2pageLocationMap } from '../core';
import { Tracker } from '../core/tracker';
import type { TrackerDataType, TrackerEventDataType } from '../core/typings';

const loginPage = '/bus_tara_web/login';
// 心跳上送的条件
const condition = () => window.location.pathname !== loginPage;
const tracker = new Tracker({ condition });
tracker.listenHistory((to, from) => {
  /* 进入班级、离开班级 */
  // 进入班级
  // if (
  //   to.url === '/bus_tara_web/student/index' &&
  //   (from.url === '/bus_tara_web/courseList' || from.url === '/bus_tara_web/studentIndex')
  // ) {
  //   this.sendTracker(EventName.online);
  // }
  // // 离开班级
  // if (
  //   from.url === '/bus_tara_web/student/index' &&
  //   (to.url === '/bus_tara_web/courseList' || to.url === '/bus_tara_web/studentIndex')
  // ) {
  //   this.sendTracker(EventName.offline);
  // }

  const sendData: Partial<TrackerDataType> = {};
  // 离开页面事件
  let pathname = from.url!;
  let funCode = pathname2pageLocationMap[pathname];
  // 当前是哪个页面
  sendData.funCode = funCode;
  sendData.url = pathname;
  // 页面停留时长
  if (from.leaveTime && from.enterTime) {
    sendData.viewDuration = Math.floor((from.leaveTime - from.enterTime) / 1000);
  }

  tracker.sendTracker(EventName.pageleave, sendData);

  // 进入页面事件
  pathname = to.url!;
  funCode = pathname2pageLocationMap[pathname];
  // 进一个新页面，立马发一次心跳
  tracker.sendTracker(`${EventName.pageview},${EventName.onlineheart}`, {
    funCode,
    url: pathname,
  });
});

export { tracker };

// 页面上的元素
// todo: 后续去掉funCode，以pathname或接口区分
export enum itemEnum {
  joinClassButton, // 加入课程按钮
  logoutButton, // 退出登录按钮按钮
  login, // 登录
  enterClassButton, // 进入班级按钮
  leaveClassButton, // 离开班级按钮
}

/**
 * 说明：offline、online事件暂时废弃了，统一走online事件。
 * 这里暂时保留。
 */
export async function sendTracker(itemFlag: itemEnum, data: TrackerEventDataType = {}) {
  const isOn = sessionStorage.getItem(SEENTAO_TRACKER_IS_ON_KEY);
  if (isOn !== 'true') {
    return;
  }
  const sendData: TrackerEventDataType = {};
  switch (itemFlag) {
    case itemEnum.joinClassButton:
      sendData.funCode = 'stu_joinclass';
      await tracker.sendTracker(EventName.webclick, { ...sendData, ...data });
      break;
    case itemEnum.logoutButton:
      await tracker.sendTracker(EventName.offline, { ...sendData, ...data });
      break;
    case itemEnum.login:
      await tracker.sendTracker(EventName.online, { ...sendData, ...data });
      break;
    case itemEnum.enterClassButton:
      await tracker.sendTracker(EventName.online, { ...sendData, ...data });
      break;
    case itemEnum.leaveClassButton:
      await tracker.sendTracker(EventName.offline, { ...sendData, ...data });
      break;
  }
}
