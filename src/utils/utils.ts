import defaultHeadImg from '@/assets/images/avatar_passport.png';
import axios from 'axios';
import { Base64 } from 'js-base64';
import Cookies from 'js-cookie';
import moment from 'moment';
import qs from 'qs';
import querystring from 'querystring';
import { base64, md5 } from 'seent-tools';
import { FILE_TYPE_MAP } from './enum';
import { message } from 'antd';
import { isExcel, isImage, isPdf, isPpt, isVideo, isWord } from '@/utils/file_type_contents';
import { startSuccess } from './http/homework';
const role_code: any = {
  SCHOOL_ADMINISTRATOR_SZJM: 'OT_ADMIN_MSM',
  TEACHER_KY: 'OT_TEACHER_SCI_TECH_APP',
  TEACHER_JYKF: 'OT_TEACHER_RIE_DEVELOP',
};
// Object转FormData
export function transformFormData(param: RecordItem) {
  const fd = new FormData();
  Object.keys(param).forEach((key) => {
    fd.append(key, param[key]);
  });
  return fd;
}

// 判断url为hash类型还是history类型 解析qs参数
export function getQueryParam() {
  const { hash } = window.location;
  let query: qs.ParsedQs;
  if (hash) {
    // 查找 '?' 号所在的索引
    const index = hash.indexOf('?');
    if (index !== -1) {
      query = qs.parse(hash.substring(index + 1));
      return qs.parse(decodeURIComponent(Base64.atob(query.qs as string)));
    }
    return {};
  }
  query = qs.parse(window.location.search.substr(1));
  if (query.qs) {
    return qs.parse(decodeURIComponent(Base64.atob(query.qs as string)));
  }
  return {};
}

/**
 * Base64 加密
 * @param {string} text 加密字符
 */
export function encode(text: any) {
  return Base64.encode(text);
}

// 开发阶段模拟qs获取请求参数 后期替换为真实方法
export function _getQueryParam(config: any) {
  if (config.type === 'login') {
    return {};
  }
  const userInfo: any = JSON.parse(
    getItemInStorage('userInfo') == null ? '{}' : (getItemInStorage('userInfo') as any),
  );
  const memberInfo: any = JSON.parse(
    getItemInStorage('memberInfo') == null ? '{}' : (getItemInStorage('memberInfo') as any),
  );
  return {
    userId: userInfo.userId || '',
    userName: userInfo.userName || '',
    userToken: userInfo.userToken || '',
    userType: userInfo.userType || '',
    memberId: memberInfo.memberId || '',
    orgType: memberInfo.orgType || '',
    orgId: memberInfo.orgId || '',
    schoolId: memberInfo.orgId || '',
    userGroupCode: memberInfo.memberType == void 0 ? '' : role_code[memberInfo.memberType],
    memberType: memberInfo.memberType || '',
  };
}

// 获取交互式课件跳转后的qs参数
export function _getQueryCoursewareParam() {
  return getQueryParam();
}

// 判断当前环境是线上环境还是资产环境
export function isOnline() {
  let online: any = window.sessionStorage.getItem('isOnline') == 'false' ? false : true;
  return online;
}

// 分隔符转驼峰命名
export function transformVarName(variable: string, separator: string) {
  const separatorIndex = variable.indexOf(separator);
  if (separatorIndex === -1) {
    console.error(` '${variable}' 不存在 '${separator}' 分隔符，转换失败`);
    return variable;
  }
  let newVariable = '';
  for (let index = 0; index < variable.length; index++) {
    if (index !== separatorIndex) {
      newVariable +=
        index === separatorIndex + 1 ? variable[index].toLocaleUpperCase() : variable[index];
    }
  }
  return newVariable;
}

// 驼峰命名转分隔符
export function transformSplitName(variable: string, separator: string) {
  console.log(variable, separator);
}

// 千分位
export function formatPrice(price: string) {
  return price
    ? Number(price)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    : '0.00';
}

/* 通过传入 ref 实现 当前DOM元素滚动条一直处于最末尾*/
export const scrollToBottom = (
  contentRef: React.MutableRefObject<any>,
  isScroll: boolean = true,
) => {
  if (!contentRef.current) {
    return;
  }
  if (!isScroll) {
    return;
  }

  // 获取元素的全部高度
  const scrollHeight = contentRef.current.scrollHeight;
  // 获取元素在网页内的可视高度
  const clientHeight = contentRef.current.clientHeight;
  // 获取最大滚动高度
  const maxScrollTop = scrollHeight - clientHeight;
  // 动态设置 滚动条位置
  contentRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
};

// 快速获取26个大小写英文字母
export const getLetter = (format: 'toUpperCase' | 'toLowerCase') => {
  const start = format === 'toUpperCase' ? 65 : 97;
  const end = format === 'toUpperCase' ? 91 : 123;
  let count = 0;
  const arr = [];
  for (let i = start; i < end; i++) {
    arr[count] = String.fromCharCode(i);
    count++;
  }
  return arr;
};

/**
 * @desc 文件大小 kb转成mb
 * @param size
 * @returns
 */
export function byteConvertMb(size: number): string {
  if (size === 0 || !size) {
    return 0 + 'B';
  }
  let kb = 1000; //or 1024
  let unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = Math.floor(Math.log(size) / Math.log(kb));
  return (size / Math.pow(kb, i)).toFixed(2) + ' ' + unit[i];
}
// 证件号脱敏（前3位后4位显示）
export function certificateNoEncrypt(str: string) {
  if (!str || str.length <= 7) {
    return str;
  }
  str = String(str);
  const nums = '*'.repeat(str.length - 7);
  return str.substring(0, 3) + nums + str.substring(str.length - 4);
}
// 邮箱脱敏（前1位后2位显示，@后显示一位其余为*，.后全部显示）
export function emailEncrypt(str: string) {
  if (str) {
    const index1 = str.lastIndexOf('@');
    const index2 = str.lastIndexOf('.');
    let nums1;
    let nums2 = '*'.repeat(index2 - index1 - 2);
    let str2 = nums2 + str.substring(index2);
    if (index1 > 5) {
      nums1 = '*'.repeat(index1 - 2);
      return (str = str.substring(0, 1) + nums1 + str.substring(index1 - 2, index1 + 2) + str2);
    } else {
      nums1 = '*'.repeat(5);
      return (str = str.substring(0, 1) + nums1 + str.substring(index1, index1 + 2) + str2);
    }
  }
  return '';
}

/**
 * 从0开始截取字符串str到maxLength最大长度
 * @param  {number} maxLength       最大长度
 * @param  {String} [replace='...'] 替代值
 * @return {[type]}                 [description]
 */
export function sliceString(str: string, maxLength: number, replace = '...') {
  if (typeof str !== 'string') {
    return str;
  }

  if (!str) {
    return '';
  }

  if (str.length > maxLength) {
    return `${str.slice(0, maxLength)}${replace}`;
  }

  return str;
}
/**
 * @description 格式化时间戳
 * @param second 秒
 * @param format 格式
 */
export function formatTimestamp(second: number, format = 'YYYY-MM-DD HH:mm') {
  return second ? moment(second * 1000).format(format) : null;
}
// 模拟请求数据
export const handleQuestion = (data: RecordItem[] | RecordItem, duration: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), duration);
  });
};

export function getUrlParams(url: string) {
  // 通过 ? 分割获取后面的参数字符串
  let obj: any = {};

  if (url) {
    let urlStr = url.split('?')[1];
    // 创建空对象存储参数
    // 再通过 & 将每一个参数单独分割出来
    let paramsArr = urlStr.split('&');
    for (let i = 0, len = paramsArr?.length; i < len; i++) {
      // 再通过 = 将每一个参数分割为 key:value 的形式
      let arr = paramsArr[i].split('=');
      // 汉字转码
      obj[arr[0]] = decodeURI(arr[1]);
    }
  }
  return obj;
}

export const getCcKeyId = () => {
  let ccSiteId = '5396EEEC83FBF34A';
  let playerId = '87809E07FA32B8AA';
  if (
    window.location.hostname !== 'edu.seentao.com' &&
    window.location.hostname !== 'dedu.seentao.com'
  ) {
    ccSiteId = 'BA2F0748E72D9B04';
    playerId = '58B0FAD73F08036D';
  }
  return { ccSiteId, playerId };
};

function enterFullscreen(docElm: any) {
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  }
}
function exitFullscreen() {
  let cfs = document as any;
  if (cfs.exitFullscreen) {
    cfs.exitFullscreen();
  } else if (cfs.msExitFullscreen) {
    cfs.msExitFullscreen();
  } else if (cfs.mozCancelFullScreen) {
    cfs.mozCancelFullScreen();
  } else if (cfs.webkitCancelFullScreen) {
    cfs.webkitCancelFullScreen();
  }
}

export function isFullscreen() {
  let cfs = document as any;
  return (
    cfs.fullscreenElement ||
    cfs.msFullscreenElement ||
    cfs.mozFullScreenElement ||
    cfs.webkitFullscreenElement ||
    false
  );
}

//全屏
export function fullscreen(fullscreenState: any, docElm: any) {
  if (isFullscreen()) {
    exitFullscreen();
  } else {
    enterFullscreen(docElm);
  }
}

export function checkUrlIsHttp(url: any) {
  const hostUrl = url.split('?')[0];
  return /(http|https):\/\/([\w.]+\/?)\S*/.test(hostUrl);
}

export function openWindow(url: any, target?: string) {
  const isHttp = checkUrlIsHttp(url);
  let cfs = window as any;
  const targetUrl = isHttp ? url : cfs.routerBase.replace(/\/$/g, '') + url;
  window.open(targetUrl, target);
}
/**
 * 根据不同文件后缀，展示不同Icon
 * @param suffixName 文件后缀名 png、zip等 不传 展示默认 file Icon
 * @returns ReactNode
 */
export const getIconBySuffixName = (suffixName?: string) => {
  let Icon: any = FILE_TYPE_MAP.get([]);
  if (!suffixName) {
    return 'icon-stu_bill_file';
  }
  FILE_TYPE_MAP.forEach((value, key) => {
    if (key.includes(suffixName)) {
      Icon = value;
    }
  });
  return Icon;
};

/**
 * uri 打开客户端的uri
 * failCb 打开客户端失败回调
 * successCb 打开客户端成功回调
 */
export async function openUriWithInputTimeoutHack(
  url: string,
  checkVrRequestValue = {},
  fail: any,
  success: any,
) {
  window.location.href = url;
  let isInvokerStatus: any = false;
  function checkVRStatus() {
    return new Promise((resolve) => {
      setTimeout(() => {
        startSuccess({
          params: checkVrRequestValue,
        }).then(({ data }) => {
          if (data.code === 200 && data.isStart === '1') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }, 2000);
    });
  }

  for (let i = 0; i < 5; i++) {
    isInvokerStatus = await checkVRStatus();
    if (isInvokerStatus) {
      break;
    }
  }
  if (!isInvokerStatus) {
    fail && fail();
  } else {
    success && success();
  }
}

// 下载资源展示进度
// @ts-ignore
export function download({
  // @ts-ignore
  url,
  // @ts-ignore
  source,
  // @ts-ignore
  downloading,
  // @ts-ignore
  success,
  // @ts-ignore
  fail,
}) {
  const fileName = url.split('/').pop();
  console.log(fileName);
  axios({
    url,
    method: 'get',
    onDownloadProgress: (ProgressEvent) => {
      const load = ProgressEvent.loaded;
      const total = ProgressEvent.total || 1;
      const progress = (load / total) * 100;
      downloading(Math.ceil(progress));
    },
    responseType: 'blob',
    cancelToken: source.token,
  })
    .then((res) => {
      let blob = new Blob([res.data], { type: res.headers['content-type'] });
      let newUrl = window.URL.createObjectURL(blob); // 创建 url 并指向 blob
      let a = document.createElement('a') as any;
      a.href = newUrl;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(newUrl); // 释放该 url
      success();
    })
    .catch((err) => {
      console.log(err);
      fail();
    });
}

// 计算时间
export const s_to_hs = (s: any) => {
  if (s < 1) {
    return '--';
  } else {
    //计算分钟
    //算法：将秒数除以60，然后下舍入，既得到分钟数
    let h: any;
    h = Math.floor(s / 60);
    //计算秒
    //算法：取得秒%60的余数，既得到秒数
    s = s % 60;
    //将变量转换为字符串
    h += '';
    s += '';
    //如果只有一位数，前面增加一个0
    h = h.length == 1 ? '0' + h : h;
    s = s.length == 1 ? '0' + s : s;
    return h + '’' + s + '’’';
  }
};

/**
 * 身份证 校验
 */
export const isIDCard = function (value: string) {
  const regIdCard =
    /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  return regIdCard.test(value);
};

// 下载
export const downloadURL = (url: string) => {
  let el: any = document.createElement('a');
  el.href = url;
  el.download;
  el.style.display = 'none';
  el.click();
};

// 将秒 格式化为 hh:mm:ss
export const formatSeconds = (value: string) => {
  let secondTime: string | number = parseInt(value);
  let minuteTime: string | number = 0;
  let hourTime: string | number = 0;
  if (secondTime >= 60) {
    minuteTime = Math.floor(secondTime / 60);
    secondTime = Math.floor(secondTime % 60);
    if (minuteTime >= 60) {
      hourTime = Math.floor(minuteTime / 60);
      minuteTime = Math.floor(minuteTime % 60);
    }
  }
  // 补0
  hourTime = hourTime < 10 ? '0' + hourTime : hourTime;
  minuteTime = minuteTime < 10 ? '0' + minuteTime : minuteTime;
  secondTime = secondTime < 10 ? '0' + secondTime : secondTime;
  let res = hourTime + ':' + minuteTime + ':' + secondTime;
  return res;
};

/**
 * [formatMin 秒数转为小时，分钟](question！)
 * @param  {[int]} seconds [秒数  int]
 * @return {[String]} time [转化值]
 */
export function formatMin(seconds: number) {
  let time = '';
  let duration = moment.duration(seconds * 1000);
  if (duration.hours() != 0) {
    time += duration.asHours().toFixed(0) + '小时';
  }
  if (duration.minutes() != 0) {
    time += duration.minutes() + '分钟';
  }
  if (time == '') {
    return 0 + '分钟';
  }
  return time;
}

// 从cookie中获取用户头像
export const getItemInCookieBase64Value = (key: string) => {
  if (Cookies.get(key)) {
    return new Buffer(Cookies.get(key) as string, 'base64').toString();
  }
  return defaultHeadImg;
};

/**
 * [formatMin 秒数转为小时，分钟](question！)
 * @param  {[int]} seconds [秒数  int]
 * @return {[String]} time [转化值]
 */
export const formatSecond = (seconds: number) => {
  let time = '';
  let duration = moment.duration(seconds * 1000);
  let hours = parseInt(String(duration.asHours()));
  if (hours != 0) {
    time += hours + '小时';
  }
  if (duration.minutes() != 0) {
    time += duration.minutes() + '分钟';
  }
  if (duration.seconds() != 0) {
    time += duration.seconds() + '秒';
  }
  return time;
};

/**
 * [formatDate 时间戳格式化为指定日期格式]
 * @param  {[String]} timestamp [时间戳字符串]
 * @param  {[String]} format [转换格式，全格式"YYYY MM DD HH:mm:ss" 缺省则默认"MM-DD HH:mm"]
 * @return {[String]}           [日期格式]
 */
export const formatDate = (timestamp: any, format: string) => {
  // eslint-disable-next-line no-var
  var day = moment.unix(Number(timestamp));
  // eslint-disable-next-line no-var
  var thisFormat = format == undefined ? 'MM-DD HH:mm' : format;
  return day.format(thisFormat).toString();
};

export const dateToTimestamp = (dateString: string, format = 'X') => {
  return moment(dateString).format(format);
};

// 获取sessionStorage
export const getSessionStorage = (key: string) => {
  return window.sessionStorage.getItem(key) === 'undefined'
    ? undefined
    : JSON.parse(window.sessionStorage.getItem(key) || '{}');
};

// 更新sessionStorage
export const updateSessionStorage = (key: string, data: unknown) => {
  window.sessionStorage.setItem(key, JSON.stringify(data || null));
};

export function isDBEorBcloudorProject(type: string) {
  return type === 'DIGITAL_EXPERIMENT' || type === 'DBE_TRAINING' || type === 'PROJECTLIB_PACKAGE';
}

// 将 时分秒格式化为秒
export const formatHMStoSecond = (time: string, format: string) => {
  let hour = Number(time.split(format)[0]);
  let min = Number(time.split(format)[1]);
  let sec = Number(time.split(format)[2]);
  return Number(hour * 3600) + Number(min * 60) + Number(sec);
};

// 根据资源id返回资源
export const getResourceById = (sourceId: string) => {
  return sourceId ? `/api/dbe3/res/download/${sourceId}` : undefined;
};

// 下载文件 attachmentUrl:下载地址 filename:文件名称
export const onDownloadFile = (attachmentUrl: string, filename: string) => {
  fetch(attachmentUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
};

// pdf预览  url:预览地址  fileType: doc,docx,pdf等
export const onPreview = (url: string, fileType: string, downUrl: string) => {
  if (url === '0') {
    window.location.href = downUrl;
    return;
  }
  window.open(
    `${process.env.PUBLIC_PATH}preview?` +
      querystring.stringify({
        url,
        fileType,
      }),
  );
};

// 预览地址为空时，提示该文件不可预览
export const onPreviewFile = (url: string, fileType: string) => {
  if (url === '0') {
    message.warning('该文件无法预览');
    return;
  }
  if (
    !isExcel(fileType) &&
    !isImage(fileType) &&
    !isPdf(fileType) &&
    !isPpt(fileType) &&
    !isVideo(fileType) &&
    !isWord(fileType)
  ) {
    message.warning('该资源暂不支持预览');
    return;
  }
  window.open(
    `${process.env.PUBLIC_PATH}preview?` +
      querystring.stringify({
        url,
        fileType,
      }),
  );
};

// 将url后面携带的参数，和 新传入参数合并成一个 url
export const transformUrlQuery = (url: string, params: RecordItem) => {
  const dynParams = getSessionStorage('dynParams');
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, baseQuery = ''] = url.split('?');
  // 移除undefined
  Object.keys(params).forEach((item) => {
    if (params[item] === undefined) {
      delete params[item];
    }
  });
  const newQuery = {
    ...params,
    ...(qs.parse(baseQuery) || {}),
  };
  let query = qs.stringify(newQuery);
  if (dynParams && Object.keys(dynParams).length) {
    query += `&${dynParams}`;
  }

  if (baseQuery === '') {
    return `${url}?qs=${base64.encode(query).replaceAll(' ', '%2B')}`;
  } else {
    return `${url}&qs=${base64.encode(query).replaceAll(' ', '%2B')}`;
  }
};

/**
 * @description 给地址添加query参数
 * @param {string} url  //地址
 * @param {object} obj //需要添加的query参数
 * @returns url
 */
export function appendQuery(url: string, obj?: RecordItem) {
  if (!obj) {
    return url;
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const [path, querystring] = url.split('?');
  let query: RecordItem = {};
  if (querystring) {
    querystring.split('&').map((item) => {
      const [key, value] = item.split('=');
      query[key] = value;
    });
  }
  Object.assign(query, obj);
  // eslint-disable-next-line @typescript-eslint/no-shadow
  let qs = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&');
  return path + '?' + qs;
}

export function formatSecondsTwo(seconds: any, type: any) {
  console.log(type);
  let time = '';
  let duration = moment.duration(seconds * 1000);
  if (duration.years() != 0) {
    time += duration.years() + '年';
  }
  if (duration.months() != 0) {
    time += duration.months() + '月';
  }
  if (duration.weeks() != 0) {
    time += duration.weeks() + '周';
  }
  if (duration.days() != 0) {
    time += duration.days() + '天';
  }
  if (duration.hours() != 0) {
    time += duration.hours() + '小时';
  }
  if (duration.minutes() != 0) {
    time += duration.minutes() + '分钟';
  }
  if (duration.seconds() != 0) {
    time += duration.seconds() + '秒';
  }
  if (seconds == 0) {
    time = '0秒';
  }
  return time;
}

export function IsURL(str_url: string) {
  const strRegex =
    '^((https|http|ftp|rtsp|mms)?://)' +
    "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + //ftp的user@
    '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
    '|' + // 允许IP和DOMAIN（域名）
    "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
    '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
    '[a-z]{2,6})' + // first level domain- .com or .museum
    '(:[0-9]{1,4})?' + // 端口- :80
    '((/?)|' + // a slash isn't required if there is no file name
    "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  const re = new RegExp(strRegex);
  return re.test(str_url);
}

export function toChineseNumber(num: number) {
  const numList = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (num < 10) {
    return numList[num];
  }
  if (num >= 10 && num < 20) {
    return numList[num % 10] === '零' ? '十' : '十' + numList[num % 10];
  }
  const ten = Math.floor(num / 10);
  const unit = num % 10;
  if (unit === 0) {
    return numList[ten] + '十';
  }
  return numList[unit] === '零' ? numList[ten] + '十' : numList[ten] + '十' + numList[unit];
}

//存储
export function setItemInStorage(key: string, value: string) {
  const hashedKey = md5(key);
  const encodedValue = base64.encode(value);
  window.localStorage.setItem(hashedKey, encodedValue);
}
//读取
export function getItemInStorage(key: string) {
  const hashedKey = md5(key);
  const encodedValue = window.localStorage.getItem(hashedKey);
  return encodedValue ? base64.decode(encodedValue) : null;
}
//移除
export function removeItemInStorage(key: string) {
  const hashedKey = md5(key);
  window.localStorage.removeItem(hashedKey);
}
//移除
export function getLocalUserData(key: 'userInfo' | 'memberInfo') {
  const userInfo: any = JSON.parse(
    getItemInStorage('userInfo') == null ? '{}' : (getItemInStorage('userInfo') as any),
  );
  const memberInfo: any = JSON.parse(
    getItemInStorage('memberInfo') == null ? '{}' : (getItemInStorage('memberInfo') as any),
  );
  return key == 'userInfo' ? userInfo : memberInfo;
}
