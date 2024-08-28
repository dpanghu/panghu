import { FormItemType } from '../../type';

export const Sex = [
  {
    label: '男',
    value: '男',
  },
  {
    label: '女',
    value: '女',
  },
];

/**
 * 应届生
一年以内经验
1～3年经验
3～5年经验
5～10年经验
10年以上经验
 */
export const Experiencs = [
  {
    label: '应届生',
    value: '应届生',
  },
  {
    label: '一年以内经验',
    value: '一年以内经验',
  },
  {
    label: '1-3年经验',
    value: '1-3年经验',
  },
  {
    label: '3-5年经验',
    value: '3-5年经验',
  },
  {
    label: '5-10年经验',
    value: '5-10年经验',
  },
  {
    label: '10年以上经验',
    value: '10年以上经验',
  },
];

// 工作性质

export const WorkTypes = [
  {
    label: '全职',
    value: '全职',
  },
  {
    label: '兼职',
    value: '兼职',
  },
  {
    label: '实习',
    value: '实习',
  },
];

// 入职时间

/**
 * 随时到岗
一周内到岗
一个月内到岗
到岗时间另行商议
 */
export const EntryTimes = [
  {
    label: '随时到岗',
    value: '随时到岗',
  },
  {
    label: '一周内到岗',
    value: '一周内到岗',
  },
  {
    label: '一个月内到岗',
    value: '一个月内到岗',
  },
  {
    label: '到岗时间另行商议',
    value: '到岗时间另行商议',
  },
];

// 学历
/**
 * 初中及以下
中专/中技
高中
大专
本科
硕士
博士
 */
export const Education = [
  {
    label: '初中及以下',
    value: '初中及以下',
  },
  {
    label: '中专/中技',
    value: '中专/中技',
  },
  {
    label: '高中',
    value: '高中',
  },
  {
    label: '大专',
    value: '大专',
  },
  {
    label: '本科',
    value: '本科',
  },
  {
    label: '硕士',
    value: '硕士',
  },
  {
    label: '博士',
    value: '博士',
  },
];

// 超出文字长度文字信息
export const ExceedMaxLength = '输入内容已超出最大长度，请您减少文本内容';

export const InitialValue = {
  name: '',
  age: 0,
  sex: '',
  nativePlace: '',
  workYear: '',
  phone: '',
  email: '',
  intentPosition: '',
  intentSalary: '',
  intentCity: '',
  workNature: '',
  dutyDate: '',
  educationalBackgroundList: [
    {
      schoolName: '',
      education: '',
      graduationEndTime: '',
      graduationStartTime: '',
      rangeDate: [],
      major: '',
      description: '',
    },
  ],
  internshipExperienceList: [
    {
      description: '',
      rangeDate: [],
      periodEnd: '',
      periodStart: '',
      projectName: '',
      role: '',
    },
  ],
  campusExperienceList: [
    {
      description: '',
      rangeDate: [],
      periodEnd: '',
      periodStart: '',
      projectName: '',
      role: '',
    },
  ],
  projectExperienceList: [],
  workExperienceList: [],
  selfDefList: [],
};

export const formItemConfig: Record<
  string,
  | {
      className: string;
      name: string;
      formItems: FormItemType[][];
      draggable?: boolean;
      formName?: string;
      maxItems?: number;
      editableTitle?: boolean;
    }
  | FormItemType[][]
> = {
  basicInfo: [
    [
      {
        cName: '姓名',
        name: 'name',
        rules: [
          { required: true, message: '输入姓名' },
          {
            max: 10,
            message: ExceedMaxLength,
          },
        ],
        className: 'form-item-full-width',
        type: 'input',
        elementConfig: {
          placeholder: '请输入姓名',
        },
      },
    ],
    [
      {
        cName: '年龄',
        name: 'age',
        className: 'form-gap',
        rules: [
          () => ({
            validator(_, value) {
              if (value === '') {
                return Promise.reject('请输入年龄');
              }
              if (/^[1-9]\d*$/.exec(value)) {
                if (Number(value) > 100 || Number(value) < 1) {
                  return Promise.reject('年龄范围1-100');
                } else {
                  return Promise.resolve();
                }
              } else {
                return Promise.reject('请输入整数');
              }
            },
          }),
        ],
        type: 'input',
        elementConfig: {
          placeholder: '请输入年龄',
          className: 'basic-short-input',
        },
      },
      {
        cName: '性别',
        name: 'sex',
        rules: [{ required: true, message: '请选择性别' }],
        type: 'select',
        elementConfig: {
          placeholder: '请选择性别',
          options: Sex,
          className: 'basic-long-input',
        },
      },
    ],
    [
      {
        cName: '籍贯',
        name: 'nativePlace',
        className: 'form-gap',
        rules: [
          { required: true, message: '请输入籍贯' },
          {
            max: 20,
            message: ExceedMaxLength,
          },
        ],
        type: 'input',
        elementConfig: {
          placeholder: '请输入籍贯',
          className: 'basic-short-input',
        },
      },
      {
        cName: '工作经验',
        name: 'workYear',
        rules: [{ required: true, message: '请选择工作经验' }],
        type: 'select',
        elementConfig: {
          placeholder: '请选择工作经验',
          options: Experiencs,
          className: 'basic-long-input',
        },
      },
    ],
    [
      {
        cName: '电话',
        name: 'phone',
        rules: [
          { required: true, message: '请输入电话' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式错误!',
          },
        ],
        type: 'input',
        className: 'form-gap',
        elementConfig: {
          placeholder: '请输入电话',
          className: 'basic-short-input',
        },
      },
      {
        cName: '邮箱',
        name: 'email',
        rules: [
          { required: true, message: '选择输入邮箱' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址!',
          },
          {
            max: 20,
            message: ExceedMaxLength,
          },
        ],
        type: 'input',
        elementConfig: {
          placeholder: '请输入邮箱',
          className: 'basic-long-input',
        },
      },
    ],
  ],
  employmentIntention: {
    className: 'employment-intention',
    name: '求职意向',
    formItems: [
      [
        {
          cName: '期望职位',
          name: 'intentPosition',
          className: 'form-gap',
          rules: [{ required: true, message: '请选择职位' }],
          type: 'cascader',
          elementConfig: {
            placeholder: '请选择职位',
            style: {
              width: 128,
            },
            className: 'basic-short-input',
          },
        },
        {
          cName: '薪资要求',
          name: 'salary',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入薪资' },
            {
              max: 99999999,
              min: 0,
              type: 'number',
              message: ExceedMaxLength,
            },
          ],
          type: 'inputNumber',
          elementConfig: {
            placeholder: '请输入薪资',
            className: 'basic-short-input',
          },
        },
        {
          cName: '期望城市',
          name: 'intentCity',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入城市' },
            {
              max: 10,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入城市',
            className: 'basic-short-input',
          },
        },
        {
          cName: '工作性质',
          name: 'workNature',
          className: 'form-gap',
          rules: [{ required: true, message: '请选择工作性质' }],
          type: 'select',
          elementConfig: {
            placeholder: '请选择工作性质',
            className: 'basic-short-input',
            options: WorkTypes,
          },
        },
        {
          cName: '入职时间',
          name: 'dutyDate',
          rules: [{ required: true, message: '请选择入职时间' }],
          type: 'select',
          elementConfig: {
            placeholder: '请选择入职时间',
            className: 'basic-short-input',
            options: EntryTimes,
          },
        },
      ],
    ],
  },
  educationalBackgroundList: {
    className: 'education-background',
    name: '教育背景',
    formName: 'educationalBackgroundList',
    draggable: true,
    formItems: [
      [
        {
          cName: '学校',
          name: 'schoolName',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入学校名称' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入学校名称',
            className: 'basic-short-input',
          },
        },
        {
          cName: '学历',
          name: 'education',
          className: 'form-gap',
          rules: [
            { required: true, message: '请选择学历' },
            {
              max: 20,
              message: ExceedMaxLength,
            },
          ],
          type: 'select',
          elementConfig: {
            placeholder: '请选择学历',
            options: Education,
            className: 'basic-short-input',
          },
        },
        {
          cName: '时间',
          name: 'rangeDate',
          className: 'form-gap',
          rules: [{ required: true, message: '请选择时间' }],
          type: 'rangerPicker',
          elementConfig: {
            placeholder: ['请选择开始时间', '请选择结束时间'],
            style: { width: 218 },
          },
        },
        {
          cName: '专业',
          name: 'major',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入专业' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入专业',
            className: 'basic-short-input',
          },
        },
      ],
      [
        {
          name: 'description',
          rules: [
            { required: true, message: '请输入经历描述' },
            {
              max: 2000,
              message: ExceedMaxLength,
            },
          ],
          className: 'form-item-full-width',
          type: 'textarea',
          elementConfig: {
            placeholder:
              '所修课程、成绩排名、在校的职务、参赛获奖情况等有利于突出个人优势的信息。尽量简洁，突出重点',
            className: 'content-text-area',
          },
        },
      ],
    ],
  },
  internshipExperienceList: {
    className: 'internship-experience',
    name: '实习经历',
    formName: 'internshipExperienceList',
    draggable: true,
    formItems: [
      [
        {
          cName: '公司',
          name: 'projectName',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入公司名称' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入公司名称',
            className: 'basic-short-input',
          },
        },
        {
          cName: '职位类型',
          name: 'role',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入职位' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入职位',
            className: 'basic-short-input',
          },
        },
        {
          cName: '时间',
          name: 'rangeDate',
          className: 'form-gap',
          rules: [{ required: true, message: '请选择时间' }],
          type: 'rangerPicker',
          elementConfig: {
            placeholder: ['请选择开始时间', '请选择结束时间'],
            style: { width: 218 },
          },
        },
      ],
      [
        {
          name: 'description',
          rules: [
            { required: true, message: '请输入实习经历描述' },
            {
              max: 2000,
              message: ExceedMaxLength,
            },
          ],
          className: 'form-item-full-width',
          type: 'textareaWithAi',
          elementConfig: {
            placeholder:
              '实习经验的描述与目标岗位的招聘要求尽量匹配，突出个人成果以及做出的共线，尽量具体简洁。',
            className: 'content-text-area',
            pluginCode: 'resume_intern',
          },
        },
      ],
    ],
  },
  campusExperienceList: {
    className: 'campus-experience',
    name: '校园经历',
    formName: 'campusExperienceList',
    draggable: true,
    formItems: [
      [
        {
          cName: '经历名称',
          name: 'projectName',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入校园经历名称' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入校园经历名称',
            className: 'basic-short-input',
          },
        },
        {
          cName: '角色',
          name: 'role',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入角色' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入职位',
            className: 'basic-short-input',
          },
        },
        {
          cName: '时间',
          name: 'rangeDate',
          className: 'form-gap',
          rules: [{ required: true, message: '请选择时间' }],
          type: 'rangerPicker',
          elementConfig: {
            placeholder: ['请选择开始时间', '请选择结束时间'],
            style: { width: 218 },
          },
        },
      ],
      [
        {
          name: 'description',
          rules: [
            { required: true, message: '请输入经历描述' },
            {
              max: 2000,
              message: ExceedMaxLength,
            },
          ],
          className: 'form-item-full-width',
          type: 'textareaWithAi',
          elementConfig: {
            placeholder: '描述校园经历的具体行动，内容，成果。',
            className: 'content-text-area',
            pluginCode: 'resume_school',
          },
        },
      ],
    ],
  },
  skill: {
    name: '技能特长',
    className: 'skill',
    formItems: [
      [
        {
          name: 'skill',
          rules: [
            { required: true, message: '输入技能特长' },
            {
              max: 2000,
              message: ExceedMaxLength,
            },
          ],
          className: 'form-item-full-width',
          type: 'textarea',
          elementConfig: {
            placeholder: '输入技能特长',
            className: 'content-text-area',
          },
        },
      ],
    ],
  },
  honor: {
    name: '荣誉证书',
    className: 'honor',
    formItems: [
      [
        {
          name: 'honor',
          rules: [
            { required: true, message: '输入荣誉证书' },
            {
              max: 2000,
              message: ExceedMaxLength,
            },
          ],
          className: 'form-item-full-width',
          type: 'textarea',
          elementConfig: {
            placeholder: '输入荣誉证书',
            className: 'content-text-area',
          },
        },
      ],
    ],
  },
  selfEvaluation: {
    name: '自我评价',
    className: 'self-evaluation',
    formItems: [
      [
        {
          name: 'selfEvaluation',
          rules: [
            { required: true, message: '请输入自我评价' },
            {
              max: 2000,
              message: ExceedMaxLength,
            },
          ],
          className: 'form-item-full-width',
          type: 'textareaWithAi',
          elementConfig: {
            placeholder: '自我评价应做到突出自身符合目标岗位要求',
            className: 'content-text-area',
            pluginCode: 'resume_self',
          },
        },
      ],
    ],
  },
  projectExperienceList: {
    className: 'project-experience',
    name: '项目经历',
    formName: 'projectExperienceList',
    draggable: true,
    formItems: [
      [
        {
          cName: '项目名称',
          name: 'projectName',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入项目名称' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入项目名称',
            className: 'basic-short-input',
          },
        },
        {
          cName: '项目角色',
          name: 'role',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入项目角色' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入项目角色',
            className: 'basic-short-input',
          },
        },
        {
          cName: '时间',
          name: 'rangeDate',
          className: 'form-gap',
          rules: [{ required: true, message: '请选择时间' }],
          type: 'rangerPicker',
          elementConfig: {
            placeholder: ['请选择开始时间', '请选择结束时间'],
            style: { width: 218 },
          },
        },
      ],
      [
        {
          name: 'description',
          rules: [
            { required: true, message: '请输入经历描述' },
            {
              max: 2000,
              message: ExceedMaxLength,
            },
          ],
          className: 'form-item-full-width',
          type: 'textareaWithAi',
          elementConfig: {
            placeholder: '请输入项目内容、成果和感悟，简洁突出重点',
            pluginCode: 'resume_project',
            className: 'content-text-area',
          },
        },
      ],
    ],
  },
  workExperienceList: {
    className: 'work-experience',
    name: '工作经历',
    formName: 'workExperienceList',
    draggable: true,
    formItems: [
      [
        {
          cName: '公司名称',
          name: 'projectName',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入公司名称' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入公司名称',
            className: 'basic-short-input',
          },
        },
        {
          cName: '职位类型',
          name: 'role',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入职位类型' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入职位类型',
            className: 'basic-short-input',
          },
        },
        {
          cName: '时间',
          name: 'rangeDate',
          className: 'form-gap',
          rules: [{ required: true, message: '请选择时间' }],
          type: 'rangerPicker',
          elementConfig: {
            placeholder: ['请选择开始时间', '请选择结束时间'],
            style: { width: 218 },
          },
        },
      ],
      [
        {
          name: 'description',
          rules: [
            { required: true, message: '请输入经历描述' },
            {
              max: 2000,
              message: ExceedMaxLength,
            },
          ],
          className: 'form-item-full-width',
          type: 'textareaWithAi',
          elementConfig: {
            placeholder:
              '详细描述你的职责范围、工作任务及取得的成绩，描述尽量具体简洁，尽量与目标岗位的招聘要求匹配。',
            className: 'content-text-area',
            pluginCode: 'resume_work',
          },
        },
      ],
    ],
  },
  selfDefList: {
    className: 'self-def',
    name: '自定义模块',
    formName: 'selfDefList',
    draggable: true,
    editableTitle: true,
    maxItems: 3,
    formItems: [
      [
        {
          cName: '模块名称',
          name: 'moduleName',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入模块名称' },
            {
              max: 10,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入模块名称',
            className: 'basic-short-input',
          },
        },
        {
          cName: '项目名称',
          name: 'projectName',
          className: 'form-gap',
          rules: [
            { required: true, message: '请输入项目名称' },
            {
              max: 30,
              message: ExceedMaxLength,
            },
          ],
          type: 'input',
          elementConfig: {
            placeholder: '请输入项目名称',
            className: 'basic-short-input',
          },
        },
        {
          cName: '时间',
          name: 'rangeDate',
          className: 'form-gap',
          rules: [{ required: true, message: '请选择时间' }],
          type: 'rangerPicker',
          elementConfig: {
            placeholder: ['请选择开始时间', '请选择结束时间'],
            style: { width: 218 },
          },
        },
      ],
      [
        {
          name: 'description',
          rules: [
            { required: true, message: '输入自定义内容' },
            {
              max: 2000,
              message: ExceedMaxLength,
            },
          ],
          className: 'form-item-full-width',
          type: 'textarea',
          elementConfig: {
            placeholder: '输入你的自定义内容',
            className: 'content-text-area',
          },
        },
      ],
    ],
  },
};
