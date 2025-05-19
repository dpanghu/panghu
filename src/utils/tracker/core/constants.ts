// 事件类目
enum EventName {
  pageview = 'pageview', // web页面浏览 通过url访问或跳转页面
  webclick = 'webclick', // web页面元素点击	点击按钮或链接
  pageleave = 'pageleave', // Web页面浏览时长	离开页面
  pageload = 'pageload', // Web页面加载时长	页面加载完成
  online = 'online', // 上线	登录后、选择学校、进入班级时
  offline = 'offline', // 下线	离开班级时，关闭浏览器，退出登录，在其他地方登录
  onlineheart = 'onlineheart', // 是否在线心跳检测	30s触发一次事件
}

// location.pathname 到 当前路由页面名的映射
const pathname2pageLocationMap: Record<string, string> = {
  '/bus_tara_web/login': 'login', // 登录
  '/bus_tara_web/studentIndex': 'stu_index', // 学生端-首页
  '/bus_tara_web/student/index': 'stu_class_index', // 学生端-班级首页
  '/bus_tara_web/student/project': 'stu_class_project_index', // 学生端-项目首页
  '/bus_tara_web/student/task': 'stu_class_task_index', // 学生端-任务首页
  '/bus_tara_web/courseList': 'stu_classlist_studying', // 学生端-我的课程-学习中班级查询
  '/bus_tara_web/teacherIndex': 'tea_index', // 教师端首页
  '/bus_tara_web/teachClassList': 'tea_classlist_studying', // 教师端-班级-进行中
  '/bus_tara_web/teacher/addClass': 'tea_class_index', // 教师端-班级首页
};

const defaultOptions = {
  // baseUrl: '/bustracker/bustracker', // 走代理时用这个
  baseUrl: '/bustracker',
  tracePath: '/bus/trace',
  settingsPath: '/state',
  pulseInterval: 30000, // 心跳间隔, 30s一次
};

const enum appCodeEnum {
  teacherEnd = '1', // 教师端
  studentEnd = '2', // 学生端
  schoolEnd = '3', // 院校管理端
  courseEnd = '4', // 课程设计端
  systemEnd = '6', // 系统管理端
  // todo: 各个biz?
}

const SEENTAO_TRACKER_IS_ON_KEY = 'SEENTAO_TRACKER_IS_ON';

const SEENTAO_TRACKER_UUID_KEY = 'SEENTAO_TRACKER_UUID';

export const USER_LOCATION_KEY = 'USER_LOCATION';

export {
  EventName,
  pathname2pageLocationMap,
  defaultOptions,
  appCodeEnum,
  SEENTAO_TRACKER_IS_ON_KEY,
  SEENTAO_TRACKER_UUID_KEY,
};
