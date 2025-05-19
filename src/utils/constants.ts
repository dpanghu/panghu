/**
 * @description 常量
 */
import { getLetter } from './utils';
import wcdPng from '@/assets/images/blankImg/wcd.png';
import stcsPng from '@/assets/images/blankImg/stcs.png';
import tddfPng from '@/assets/images/blankImg/tddf.png';
import xtzqdPng from '@/assets/images/blankImg/xtzqd.png';
import zydfPng from '@/assets/images/blankImg/zydf.png';
import zywcdPng from '@/assets/images/blankImg/zywcd.png';

export const C_TEAM_MODAL_STATE = {
  C_TEAM_ADD: 'TEAM_ADD',
  C_TEAM_EDIT: 'TEAM_EDIT',
  C_TEAM_INFO: 'TEAM_INFO',
  C_MEMBER_ADD: 'MEMBER_ADD',
  C_MEMBER_REMOVE: 'MEMBER_REMOVE',
};

export const MEMBER_TYPE = {
  TEACHER: 'TEACHER',
  SCHOOL_ADMINISTRATOR: 'SCHOOL_ADMINISTRATOR',
  STUDENT: 'STUDENT',
};

// 根据英文字母匹配颜色
export const FORMAT_COLOR = new Map([
  [['0', '1', '2', '3', ...getLetter('toUpperCase').slice(0, 9)], '#FF8000'],
  [['4', '5', '6', ...getLetter('toUpperCase').slice(9, 17)], '#47CC5E'],
  [['7', '8', '9', ...getLetter('toUpperCase').slice(17)], '#4285F4'],
]);

export const VIDEO_COMPRESS_STATE: RecordItem = {
  UNCOMPRESSION: '未压缩',
  READY_TO_COMPRESSION: '准备压缩',
  COMPRESSING: '压缩中',
  COMPRESSION_SUCCESS: '压缩成功',
  COMPRESSION_FAILURE: '压缩失败',
};

export const VIDEO_CONVERT_STATE: RecordItem = {
  NOT_ARCHIVED: '未转存',
  ARCHIVING: '转存中',
  ARCHIVED_SUCCESS: '转存成功',
  ARCHIVED_FAILURE: '转存失败',
};

export const VIDEO_COMPRESS_TYPE: RecordItem = {
  LOW_DEFINITION: '普清',
  STANDARD_DEFINITION: '标清',
};

export const OPTIONS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

// 理事一体课程组件的icon
export const COURSE_COMPONENT_ICON = {
  1: 'icon-school_icon_video_h',
  8: 'icon-tch_icon_richtxt',
  2: 'icon-school_icon_txt',
  4: 'icon-school_icon_work_h',
  3: 'icon-course_link',
  10: 'icon-school_icon_task',
  5: 'icon-school_icon_exam',
  11: 'icon-tch_icon_posttest',
  6: 'icon-tch_icon_achievement',
  12: 'icon-s_question',
  7: 'icon-paint-board',
  9: 'icon-stu_hudong',
} as RecordItem;

// 学习状态
export const LEARN_STATUS = {
  1: '未开始',
  2: '进行中',
  3: '已完成',
  9: '无学习状态',
  //   /** 未开始 */
  // NOT_LEARN(1, "NOT_LEARN"),
  // /** 进行中 */
  // LEARNING(2, "LEARNING"),
  // /** 已完成 */
  // HAVE_LEARNED(3, "HAVE_LEARNED"),
  // /** 没有组件, 无学习状态 **/
  // NO_LEARN_STATE(9, "NO_LEARN_STATE");
} as RecordItem;

// 成绩的空白页面图片
export const EMPTY_IMG = {
  wcd: wcdPng,
  stcs: stcsPng,
  tddf: tddfPng,
  xtzqd: xtzqdPng,
  zydf: zydfPng,
  zywcd: zywcdPng,
};

export const default_headUrl =
  'https://pbu-public.oss-cn-beijing.aliyuncs.com/webapps/default_images/team_default.png';

//团队的作业单据类型
export const TEAMBILLTYPE = [
  '应付单',
  '付款单',
  '付款结算单',
  '应收单',
  '收款单',
  '收款结算单',
  '差旅费报销单',
  '采购合同通用类型',
  '销售合同通用类型',
];
export const PERBILLTYPE = ['交通费报销单', '通讯费报销单', '招待费报销单'];
