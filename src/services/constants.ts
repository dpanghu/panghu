/**
 * @description 请求常量
 */

// 请求服务
const C_SERVER = {
  USER_CENTER: 'userCenter',
  PUBLIC_SERVER: 'public',
  COURSE_SERVER: 'course',
  SCHOOL_SERVER: 'school',
  VIDEO_CONVERT_SERVER: 'videoconvert',
  EDUFUNCTION_SERVER: 'public',
};

// 请求状态码
const C_REQUEST_CODE = {
  PBU_SUCCESS: 200,
  USER_TOKEN_EXPIRED: 401,
};

export { C_SERVER, C_REQUEST_CODE };
