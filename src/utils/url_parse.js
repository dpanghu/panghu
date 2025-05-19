/**
 * @description 用于处理文件存储服务器地址
 */

const env = require('./env');
var parse = require('url-parse');

export default function (url) {
  if (!url) {
    return '';
  }

  // 本地化环境处理
  if (env.mode == 'local') {
    url = url.replace('pbu-public/', '');
    var urlInstance = parse(url, true);
    return env.publicUrl + urlInstance.pathname;
  }

  return url;
}
