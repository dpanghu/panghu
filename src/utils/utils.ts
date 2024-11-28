import { Base64 } from 'js-base64';
import qs from 'qs';

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

// 开发阶段模拟qs获取请求参数 后期替换为真实方法
export function _getQueryParam() {
  return {
    classId: 1,
    memberId: 1,
    schoolId: 1,
  };
}

// 获取公共参数
export function getCommonData() {
  let qs: any = getQueryParam();
  let commonData: any = {};
  if (Object.keys(qs)?.length === 0) {
    commonData = JSON.parse(
      (window.sessionStorage.getItem('commonDatas') as any) || '{}',
    );
  } else {
    window.sessionStorage.setItem('commonDatas', JSON.stringify(qs));
    commonData = qs;
  }
  return commonData;
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
        index === separatorIndex + 1
          ? variable[index].toLocaleUpperCase()
          : variable[index];
    }
  }
  return newVariable;
}

// 千分位
export function formatPrice(price: string) {
  return price
    ? Number(price)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    : '0.00';
}

export function scrollToTop(element: HTMLElement | null) {
  if (!element) {
    return;
  }
  element.scrollTo({
    top: 0,
  });
}

export function scrollToBottom(element: HTMLElement | null) {
  if (!element) {
    return;
  }
  element.scrollTo({
    top: element.scrollHeight,
  });
}

// 根据url下载文件

export function downloadFile(url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.click();
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

// 获取sessionStorage
export const getSessionStorage = (key: string) => {
  return window.sessionStorage.getItem(key) === 'undefined'
    ? undefined
    : JSON.parse(window.sessionStorage.getItem(key) || '{}');
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
