export enum Builder {
  title = 'DBE3工作台',
}

export enum Runner_Student {
  title = 'DBE3工作台',
}

const video = ['flv', 'rm', 'rmvb', 'wmv', 'avi', 'mp4']; //视频格式
const image = ['jpg', 'png', 'gif', 'jpeg', 'webp']; // 图片格式
const word = ['docx', 'doc'];
const excel = ['xls', 'xlsx', 'xlsm'];
const ppt = ['ppt', 'pptx'];
const pdf = ['pdf'];
const txt = ['txt'];
const html = ['html'];
const compressed_file = ['zip', 'rar', '7z']; //  压缩文件类型

export { compressed_file, excel, html, image, pdf, ppt, txt, video, word };
//  步骤条
export const tch_sideMenu = [
  {
    title: '首页',
    page: 'teacherIndex',
    icon: '1',
  },
  {
    title: '教学班',
    page: 'teachClassList',
    icon: '20',
  },
  {
    title: '课程',
    page: 'classList',
    icon: '3',
  },
  {
    title: '项目',
    page: 'projectList',
    icon: '4',
  },
  {
    title: '数字建模',
    page: 'digital/professional',
    icon: 'a4',
  },
  {
    title: '考试',
    page: 'exam',
    icon: '7',
    // disable: true,
  },
  {
    title: '分析',
    page: 'classManage',
    icon: '9',
    children: [
      {
        title: '课程分析',
        page: 'classManage/classStatistics',
        icon: 'b1',
      },
      {
        title: '学情分析',
        icon: 'b2',
        page: 'classManage/learnStatistics',
      },
      {
        title: '专业统计',
        icon: 'b2',
        page: 'classManage/masterStatistics',
      },
    ],
  },
  {
    title: '更多',
    icon: '10',
    page: 'mores',
    children: [
      {
        title: '沟通',
        page: 'chat',
        icon: '2',
      },
      {
        title: '应用',
        page: 'applicationList',
        icon: '21',
      },
      {
        title: 'AI',
        page: 'chatsAI',
        icon: '4',
      },
      {
        title: '通讯录',
        page: 'contacts',
        icon: '8',
      },
      {
        title: '云盘',
        page: 'to_resource',
        icon: '8',
      },
    ],
  },
];
//  步骤条
export const stu_sideMenu = [
  {
    title: '首页',
    page: 'studentIndex',
    icon: '1',
  },
  {
    title: '课程',
    page: 'courseList',
    icon: '3',
  },
  {
    title: '项目',
    page: 'projectSquare',
    icon: '4',
    // disable: true,
  },
  {
    title: '应用',
    page: 'applicationList',
    icon: '21',
  },
  {
    title: '考试',
    page: 'examination',
    icon: '7',
    // disable: true,
  },
  // {
  //   title: '平台',
  //   page: 'classList',
  //   icon: '5',
  //   disable: true,
  // },
  {
    title: '通讯录',
    page: 'contacts',
    icon: '8',
  },
  {
    title: '沟通',
    page: 'chat',
    icon: '2',
  },
  {
    title: '统计',
    page: 'stuStatistics',
    icon: '9',
  },
  // {
  //   title: '更多',
  //   icon: '10',
  //   children: [
  //     {
  //       title: '通讯录',
  //       page: 'contacts',
  //       icon: '8',
  //     },
  //     {
  //       title: '统计',
  //       page: 'contacts',
  //       icon: '9',
  //       disable: true,
  //     },
  //   ],
  // },
];

//  步骤条
export const admin_sideMenu = [
  {
    title: '首页',
    page: 'adminIndex',
    icon: '1',
  },
  {
    title: '门户',
    page: 'menhu',
    icon: 'a1',
    children: [
      {
        title: '基本信息',
        page: 'baseinfo',
        icon: '9',
      },
      {
        title: '公告管理',
        icon: '9',
        page: 'newsAdmin',
      },
    ],
  },
  {
    title: '用户',
    page: 'yonghu',
    icon: 'a2',
    children: [
      {
        title: '教师管理',
        page: 'teacherManage',
        icon: '9',
      },
      {
        title: '学生管理',
        icon: '9',
        page: 'stuManage',
      },
      {
        title: '角色管理',
        icon: '9',
        page: 'userManage',
      },
    ],
  },
  {
    title: '初始化',
    page: 'initIndex',
    icon: 'a3',
    // disable: true,
  },

  {
    title: '数字建模',
    page: 'digital/professional',
    icon: 'a4',
  },
  {
    title: '课程',
    page: 'adminClassList',
    icon: '3',
  },
  {
    title: '项目',
    page: 'adminProjectList',
    icon: '4',
  },

  {
    title: '更多',
    icon: '10',
    page: 'mores',
    children: [
      {
        title: '导入管理',
        page: 'importClass',
        icon: '7',
        // disable: true,
      },
      {
        title: '课程升级',
        page: 'courseUpgrades',
        icon: '7',
        // disable: true,
      },
      {
        title: '考试',
        page: 'examAdmin',
        icon: '7',
        // disable: true,
      },
      {
        title: '在线用户',
        page: 'userAdmin',
        icon: '8',
        // disable: true,
      },
      {
        title: '专业中心',
        page: 'professionalGraph',
        icon: '10',
      },
    ],
  },
];

// 教师 科研工作台 步骤条
export const tch_scientific_sideMenu = [
  {
    title: '首页',
    page: 'researchIndex',
    icon: '1',
  },
  {
    title: '课题组',
    page: 'scientificProject',
    icon: '30',
    activeUrl: ['scientificProject', 'scientificProjectDetail'],
  },
  {
    title: '课题',
    page: 'topicConfig',
    icon: '31',
  },
  {
    title: '数据集市',
    page: 'dataSet',
    icon: '32',
  },
  {
    title: '数据工坊',
    page: 'dataWorkshop/macroStatistics',
    icon: '33',
  },
  {
    title: '通讯录',
    page: 'scientificContacts',
    icon: '8',
  },
  {
    title: '沟通',
    page: 'scientificChat',
    icon: '2',
  },
];

// 学生 科研工作台 步骤条
export const stu_scientific_sideMenu = [
  {
    title: '首页',
    page: 'researchIndex',
    icon: '1',
  },
  {
    title: '课题组',
    page: 'scientificProject',
    icon: '30',
    activeUrl: ['scientificProject', 'scientificProjectDetail'],
  },
  {
    title: '课题',
    page: 'topicConfig',
    icon: '31',
  },
  {
    title: '数据集市',
    page: 'dataSet',
    icon: '32',
  },
  {
    title: '数据工坊',
    page: 'dataWorkshop/macroStatistics',
    icon: '33',
  },
  // {
  //   title: '通讯录',
  //   page: 'scientificContacts',
  //   icon: '1',
  // },
  {
    title: '沟通',
    page: 'scientificChat',
    icon: '2',
  },
];

// 学生 科研工作台 步骤条
export const admin_scientific_sideMenu = [
  {
    title: '首页',
    page: 'researchIndex',
    icon: '1',
  },

  {
    title: '课题组',
    page: 'scientificProject',
    icon: '30',
    activeUrl: ['scientificProject', 'scientificProjectDetail'],
  },
  {
    title: '课题',
    page: 'topicConfig',
    icon: '31',
  },
  {
    title: '数据集市',
    page: 'dataSet',
    icon: '32',
  },
];
