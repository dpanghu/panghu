type OptionsType = {
  baseUrl: string; // 埋点数据上送地址
  tracePath: string; // 埋点数据上送path
  settingsPath: string; // 埋点是否开启path
  pulseInterval?: number; // 心跳间隔
  condition?: () => boolean; // 是否上送心跳的条件
  [key: string]: any;
};

// 事件类型
type EventType = string | [];

// 事件数据
type TrackerDataType = {
  // 用户
  userId: number;
  userName: string;
  schoolId: number;
  memberId: number;
  clientIp: string;
  country: string;
  province: string;
  city: string;
  classId: string;
  courseId: number;
  projectId: number;
  taskId: number;

  // 基础属性
  uid: string;
  appId: string;
  appCode: string;
  funCode: string;
  eventDuration: number;
  viewDuration: number;
  url: string;
  urlHost: string;
  referer: string;
  triggerTime: string;

  browser: string;
  browserVersion: string;
  elementType: string;
  eventName: string;
};

type TrackerEventDataType = Partial<TrackerDataType>;

type BaseInfoType = {
  uid: string; // 全局唯一标识
  appId: string; // 应用唯一标识
  appCode: number; // 应用名称
  funCode: string; // 埋点位置
  eventDuration: number; // 事件时长
  viewDuration: number; // 页面访问时长
  url: string; // 页面地址
  urlHost: string; // 页面地址域名
  referer: string; // 页面来源
  triggerTime?: string; // 事件触发时间

  browser: string | undefined;
  browserVersion: string | undefined;
};

export type ListenerType = (to: ToType, from: FromType) => void;

export type PushAndReplaceStateFuncType = (state: any, unused: any, url: any) => void;

export type ToType = {
  url?: string;
  leaveTime?: number;
  enterTime?: number;
  state?: Record<string, any>;
};

export type FromType = ToType;

export { EventType, TrackerDataType, BaseInfoType, OptionsType, TrackerEventDataType };
