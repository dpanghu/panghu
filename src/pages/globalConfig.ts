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
// 教师 科研工作台 步骤条
export const tch_scientific_sideMenu = [
  {
    title: '首页',
    page: 'researchIndex',
    icon: '1',
  },
  // {
  //   title: '门户',
  //   page: 'menhu',
  //   icon: 'a1',
  //   children: [
  //     {
  //       title: '基本信息',
  //       page: 'baseinfo',
  //       icon: '9',
  //     },
  //     {
  //       title: '公告管理',
  //       icon: '9',
  //       page: 'newsAdmin',
  //     },
  //   ],
  // },
  // {
  //   title: '用户',
  //   page: 'yonghu',
  //   icon: 'a2',
  //   children: [
  //     {
  //       title: '教师管理',
  //       page: 'teacherManage',
  //       icon: '9',
  //     },
  //     {
  //       title: '学生管理',
  //       icon: '9',
  //       page: 'stuManage',
  //     },
  //     {
  //       title: '角色管理',
  //       icon: '9',
  //       page: 'userManage',
  //     },
  //   ],
  // },
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
    title: '配置',
    page: 'configIndex',
    icon: '6',
  },
  // {
  //   title: '在线用户',
  //   page: 'userAdmin',
  //   icon: '8',
  //   // disable: true,
  // },
  {
    title: '通讯录',
    page: 'contacts',
    icon: '8',
  },
  {
    title: '沟通',
    page: 'chat',
    icon: '1',
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
  //   title: '配置',
  //   page: 'configIndex',
  //   icon: '6',
  // },
  // {
  //   title: '在线用户',
  //   page: 'userAdmin',
  //   icon: '8',
  //   // disable: true,
  // },
  {
    title: '通讯录',
    page: 'contacts',
    icon: '8',
  },
  {
    title: '沟通',
    page: 'chat',
    icon: '1',
  },
  // {
  //   title: '通讯录',
  //   page: 'scientificContacts',
  //   icon: '1',
  // },
];

// 学生 科研工作台 步骤条
export const admin_scientific_sideMenu = [
  {
    title: '首页',
    page: 'researchIndex',
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
    title: '配置',
    page: 'configIndex',
    icon: '6',
  },
  {
    title: '在线用户',
    page: 'userAdmin',
    icon: '8',
    // disable: true,
  },
  {
    title: '沟通',
    page: 'chat',
    icon: '1',
  },
];
