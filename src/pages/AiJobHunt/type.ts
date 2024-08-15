import type { valueType } from 'antd/lib/statistic/utils';
import { Rule } from 'SeenPc';

export type Theme = {
  id: string;
  name: string;
  conversation_id: string;
  conversationId?: string;
};

export type HistoryItem = {
  id: string;
  type: 0 | 1;
  content: string;
};

export type Plugin = {
  code: string;
  id: string;
  tips: string;
  name: string;
  note: string;
  portfolio: string;
  paramMetadataList: FieldProperties[];
};

export interface FieldOptions {
  label: string;
  value: string | number; // 根据实际值调整，这里假设它可以是字符串或数字
}

export interface FieldProperties {
  dataFormat?: string; // 日期格式
  dataType?: 'string' | 'number' | 'file'; // 数据类型
  decimalLength?: number; // 小数位数
  defaultValue?: valueType;
  description?: string; // 字段描述
  displayName?: string; // 字段显示名称
  elementType?:
    | 'input'
    | 'number'
    | 'selectCheck'
    | 'select'
    | 'file'
    | 'datePicker'; // 控件类型
  maxLength?: number; // 最大长度
  maxValue?: number; // 最大值（仅当控件类型是数值型时）
  minValue?: number; // 最小值（仅当控件类型是数值型时）
  name: string; // 字段名（必填）
  options?: FieldOptions[]; // 下拉选项（仅当控件类型是select或selectCheck时）
  required?: boolean; // 是否必填
  treeSelectOptionsUrl?: string;
}

export interface SubmitMessage {
  userMessage: string;
  pluginCode?: string;
  qsParams?: string;
}

export interface PluginRecord {
  createTime: string;
  status: 0 | 1 | 2;
  failReason: string;
  id: string;
}

export interface FileType {
  id: string;
  name: string;
  pluginCode: string;
  pluginRecord: PluginRecord;
}

interface IEducationBackground {
  education: string;
  graduationEndTime: string;
  graduationStartTime: string;
  major: string;
  schoolName: string;
  description: string;
}

interface IInternshipExperience {
  projectName: string;
  description: string;
  periodStart: string;
  periodEnd: string;
  role: string;
}

export interface IResumeContent {
  age: string;
  campusExperienceList: any[]; // 假设此处为空数组或其他未定义的结构
  dutyDate: string;
  educationalBackgroundList: IEducationBackground[];
  email: string;
  honor: string;
  intent: string;
  intentCity: string;
  internshipExperienceList: IInternshipExperience[];
  name: string;
  phone: string;
  photo: string;
  projectExperienceList: any[]; // 假设此处为空数组或其他未定义的结构
  workExperienceList: any[];
  selfDefList: any[];
  salary: string;
  selfEvaluation: string;
  sex: string;
  skill: string;
  workYear: string;
  nativePlace?: string;
  intentPosition?: string;
  workNature?: string;
  intentPositionValue?: string;
}

interface IResume {
  classId: string;
  content: IResumeContent | string;
  conversationId: string;
  createTime: string;
  creator: string;
  id: string;
  modifyTime: string;
  name: string;
  paramId: string;
  themeId: string;
}

export interface ResumeResponse {
  postUrl?: string;
  resume_intern: number;
  resume_project: number;
  resume_school: number;
  resume_self: number;
  resume_work: number;
  xaiResume: IResume;
}

export type FormItemType = {
  cName?: string;
  name: string;
  rules: Rule[];
  className?: string;
  type:
    | 'input'
    | 'select'
    | 'inputNumber'
    | 'cascader'
    | 'rangerPicker'
    | 'textareaWithAi'
    | 'textarea';
  elementConfig: Record<string, any>;
};
