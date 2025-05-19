/*
 *@description: 密码验证工具对象
 */
const CryptoJS = require('crypto-js');
import { RegExUtil, md5 } from 'seent-tools';
//  import request from './request';
import { PBU_SUCCESS, USER_SERVER } from '@/services/constants';
import { message } from 'antd';

export const IS_LOW_PASSWORD_SECURITY = 'IS_LOW_PASSWORD_SECURITY';
export const IS_PASSWORD_EXPIRED = 'IS_PASSWORD_EXPIRED';

// 密码校验状态
const PWD_VALIDATION_STATUS = {
  LENGTH_ERROR: 3001,
  UPPERCASE_ERROR: 3002,
  SPECIAL_CHAR_ERROR: 3003,
  WORD_ERROR: 3004,
  HAS_USERNAME_ERROR: 3005,
  SUCCESS: 3000,
};

const SPECIAL_CHAR_REGEXS = [
  '_',
  '!',
  '”',
  '…',
  '#',
  ',',
  '?',
  '[',
  ']',
  '^',
  '`',
  '{',
  '}',
  '~',
  '=',
  '%',
  's',
  '&',
  '(',
  ')',
  '*',
  ',',
  '/',
  ':',
  ';',
  '@',
  '~',
  '+',
  '<',
  '>',
];

// 密码内容正则
const UPPERCASE_REGEX = /[A-Z]/;
const SPECIAL_CHAR_REGEX = /[_!”#,…?\[\]^`{}~=]/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`\{\}\[\]\|\\:;\"'<>,.\/?]).{8,}$/;

// 加密相关常量
const AES_MODE = CryptoJS.mode.CBC;
const AES_PADDING = CryptoJS.pad.Pkcs7;

// aes偏移量
const AES_IV = CryptoJS.enc.Utf8.parse('1234567887654321');
/**
 * 校验特殊字符
 * @param inputString
 * @returns
 */
function validSpecialChars(inputString) {
  const chars = inputString.match(/[\W_]/g) || [];
  if (chars.length === 0) {
    return false;
  }
  return !chars.some((char) => !SPECIAL_CHAR_REGEXS.includes(char));
}
const PasswordUtil = {
  STATUS: PWD_VALIDATION_STATUS,
  determiner() {},
  /**
   * md5 加密
   * @param {string} text - 待加密的文本
   * @returns
   */
  md5(text) {
    return md5(text);
  },
  /**
   * AES 加密
   * @param {string} text - 待加密的文本
   * @param {string} key - 加密密钥
   * @param {object} options - 可选的加密配置
   * @returns {string} - 加密后的 Base64 字符串
   */
  AESEncrypt(text, key) {
    const passwordKey = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(text, passwordKey, {
      iv: AES_IV,
      mode: AES_MODE,
      padding: AES_PADDING,
    });

    const encryptedMessageBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    return encryptedMessageBase64;
  },

  /**
   * 密码校验
   * @param {string} username - 用户名或邮箱
   * @param {string} password - 用户密码
   * @param {string[]} forbiddenWords - 禁用词列表
   * @returns {string} - 校验结果
   */
  validate(username, password, forbiddenWords) {
    if (password.length < 12 || password.length > 20) {
      return {
        status: PWD_VALIDATION_STATUS.LENGTH_ERROR,
        msg: '新密码位数须大于12位',
      };
    }

    if (UPPERCASE_REGEX.test(password) === false) {
      return {
        status: PWD_VALIDATION_STATUS.UPPERCASE_ERROR,
        msg: '新密码须包含大写字母',
      };
    }

    if (validSpecialChars(password) === false) {
      return {
        status: PWD_VALIDATION_STATUS.SPECIAL_CHAR_ERROR,
        msg: '新密码须包含特殊字符',
      };
    }

    if (forbiddenWords.some((word) => password.includes(word))) {
      return {
        status: PWD_VALIDATION_STATUS.WORD_ERROR,
        msg: '新密码不能使用限定词',
      };
    }

    if (RegExUtil.isEmail(username)) {
      if (password.includes(username.split('@')[0])) {
        return {
          status: PWD_VALIDATION_STATUS.HAS_USERNAME_ERROR,
          msg: '密码不能包含登录账号',
        };
      }
    } else if (RegExUtil.isMobilePhone(username)) {
      if (password.includes(username)) {
        return {
          status: PWD_VALIDATION_STATUS.HAS_USERNAME_ERROR,
          msg: '密码不能包含登录账号',
        };
      }
    }

    return {
      status: PWD_VALIDATION_STATUS.SUCCESS,
    };
  },
  //  /**
  //   * 获取密码限定词
  //   */
  //  async getDeterminer() {
  //    const { data } = await request(USER_SERVER + '/determiner.get');
  //    if (data.code === PBU_SUCCESS) {
  //      return data.determiner.split(',');
  //    } else {
  //      message.error(data.msg);
  //    }
  //  },
  //  /**
  //   * 获取AES加密密钥
  //   * @param {string} userName - 用户名
  //   * @returns
  //   */
  //  async getAESEncryptKey(userName) {
  //    const { data } = await request(USER_SERVER + '/randomStr.get', {
  //      userName,
  //    });
  //    if (data.code === PBU_SUCCESS) {
  //      return data.data.randomStr;
  //    } else {
  //      throw new Error(data.msg);
  //    }
  //  },
};

export default PasswordUtil;
