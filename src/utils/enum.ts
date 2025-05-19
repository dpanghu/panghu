/***
 * @description Pubsub发布订阅消息名称 枚举值
 *
 */
export enum PubSubApi {
  // 课程 列表搜索
  COURSE_PAGE_SEARCH = 'course_page_search',
  // 课程 课程内容 拖拽
  COURSE_PROJECT_DRAG_ID = 'course_project_drag_id',
  // 学生 完成任务按钮
  STUDENT_TASK_FINISH = 'student_task_finish',
  // 学生 任务详情页  任务目录切换任务
  STUDENT_TASK_CHANGE_TASK = 'student_task_change_task',
  // 学习 任务头部记录时间
  STUDENT_TASK_COMMON_TIME = 'student_task_common_time',
  // 学生 实践任务 产业平台 点击 角色上岗按钮
  STUDENT_TASK_BIND_ROLE = 'student_task_bind_role',
  // 学生 实践任务 角色上岗下岗后 开始任务面板刷新
  STUDENT_TASK_REFRESH_START_PAGE = 'student_task_refresh_start_page',
  // 学生 实践任务 是否上岗 是否团队初始化 等参数
  STUDENT_TASK_ROLE_DETAIL = 'STUDENT_TASK_ROLE_DETAIL',
  // 学生 任务 倒计时 时组件内部传递给 公共头部
  STUDENT_TASK_COUNT_DOWN = 'student_task_count_down',
  // 学生 任务 当某一任务需要组件内部点击提交后外层完成任务按钮才允许点击
  STUDENT_TASK_WITHIN_COMPONENT_ISFINISHED = 'student_task_within_component_isFinished',
  // 学生  任务 点击完成任务后  查询左侧 任务列表 更新状态
  STUDENT_TASK_CLICK_FINISH_BUTTON = 'student_task_click_finish_button',
  // 学生  任务 点击下一任务按钮 触发 切换任务事件
  STUDENT_TASK_CLICK_NEXT_TASK_BUTTON = 'student_task_click_next_button',
  // 学生  任务 完成任务 按钮 点击事件
  STUDENT_TASK_CLICK_FINISH_BTN = 'student_task_click_finish_btn',
  // 学生 任务完成且当前无下一任务 点击下个项目按钮 触发 切换项目事件
  STUDENT_TASK_CLICK_NEXT_PROJECT_BUTTON = 'student_task_click_next_project_button',
  // 学生 任务 团队成果 是否被退回
  STUDENT_TASK_TEAMRESULT_SENDBACK = 'student_task_teamresult_sendback',
  // 学生 任务 作业  定时刷新
  STUDENT_TASK_HOMEWORK_REFRESH = 'student_task_homework_refresh',
  // 学生 任务 作业  定时刷新
  STUDENT_ENTER_VR = 'student_enter_vr',

  // ----------------------------------------
  // Layout 路由切换时  左侧Icon是否应该Active
  LAYOUT_CHANGE_ICON_ACTIVE_STATUS = 'layout_change_icon_active_status',
}

export enum PrefixApi {
  BUILDER = '/tara',
  RUNNER = '/tara',
  OLD__BUILDER = '/builder',
  EXCEL = '/busbill',
  RESOURCE = 'bus-resource',
  STURUNNER = '/runner',
  RUNNER_TC = 'tc',
  SKS = 'sks',
  DTC = 'interact',
  PORTAL = '/portal',
  USER = '/user-service',
  XDATA = '/xdata',
  XAI = 'bus-xai',
}

export const clearCookie = [
  'userId',
  'userName',
  'userToken',
  'userType',
  'orgType',
  'schoolId',
  'schoolMemberId',
  'memberType',
  'userInfo',
  'memberCode',
];

/***
 * @description 不同类型文件 对应的Icon
 */
export const FILE_TYPE_MAP: Map<string[], string> = new Map([
  [['doc', 'docx'], 'icon-stu_bill_word'], // Word文档
  [['xls', 'xlsx'], 'icon-stu_bill_xlx'], // Excel表格
  [['ppt', 'pptx'], 'icon-stu_bill_p'], // PPT 幻灯片
  [['pdf'], 'icon-stu_bill_pdf'], // PDF
  [['zip', '7z', 'rar'], 'icon-stu_bill_file'], // 压缩包
  [['avi', 'mpg', 'mov', 'mp4'], 'icon-stu_bill_video'], // 视频文件
  [['gif'], 'icon-stu_bill_img'], // GIF
  [['png'], 'icon-stu_bill_img'], // PNG
  [['jpg', 'jpeg'], 'icon-stu_bill_img'], // JPG
  [['txt'], 'icon-stu_bill_word'], // Txt
  [['link'], 'icon-fuzhilianjie-copy'], // 链接
  [[], 'icon-stu_bill_file'], // Other
]);
