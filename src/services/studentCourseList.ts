import { PrefixApi } from '@/utils/enum';
import { $axios } from '@/utils/http';

//[学生] 我的课程分页
export async function getClassStuPage(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/class/stu/page`,
    method: 'POST',
    params,
  });
}

//[学生] 加入课程
export async function joinClassByCode(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/class/stu/code/join`,
    method: 'POST',
    params,
  });
}

//[学生] 课程详情-项目分页
export async function getStuProjectList(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/class/stu/project/list`,
    method: 'POST',
    params,
  });
}

//[学生] 首页-统计
export async function getTeachIndexStat(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/index/stat`,
    method: 'POST',
    params,
  });
}

//[学生] 首页-统计
export async function getStudentIndexCount(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/class/member/count`,
    method: 'POST',
    params,
  });
}

//[学生] 首页-统计
export async function getStudentElementStat(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/index/element/stat`,
    method: 'POST',
    params,
  });
}

//[学生] 教师信息（头像名称）
export async function getTeacherList(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/index/teacher/list`,
    method: 'POST',
    params,
  });
}

//[学生] 课程章节脑图查询
export async function getCourseMindMap(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/tc/course/course/mindmap/init`,
    method: 'POST',
    params,
  });
}

//[学生] 项目详情
export async function getCourseProjectDetails(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/project/details`,
    method: 'POST',
    params,
  });
}

//[学生] 项目情景
export async function getProjectScene(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/project/scene`,
    method: 'POST',
    params,
  });
}

//[学生] 能力词云
export async function getAbilityEntryList(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/course/ability/entry/list`,
    method: 'POST',
    params,
  });
}

//[学生] 网页链接
export async function getWebUrl(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/task/weburl/get`,
    method: 'POST',
    params,
  });
}

//[学生] 查询任务详情
export async function getTaskDetail(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/tc/project/project/task/get`,
    method: 'POST',
    params,
  });
}

//[学生] 查询任务列表
export async function getStuTaskList(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/stu/task/list`,
    method: 'POST',
    params,
  });
}

//[学生] 查询下一课程任务
export async function getStuNextProject(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/stu/task/project/next`,
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

//[学生] 教学资源
export async function getResourceDownloadableList(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teacher/resource/downloadable/list`,
    method: 'POST',
    params,
  });
}

//[学生] 教学资源-拓展资源
export async function getResourceExpandList(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teacher/resource/expand/list`,
    method: 'POST',
    params,
  });
}

//[学生] 进入任务
export async function enterTask(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/stu/task/enter`,
    method: 'POST',
    params,
  });
}

//[学生] 修改任务
export async function updateTask(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/stu/task/update`,
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

//[学生] 完成任务
export async function completeTask(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/stu/task/complete`,
    method: 'POST',
    params,
  });
}

//[学生] 成员所属团队信息
export async function getStuTeam(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/stu/team/find`,
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

//[学生] 顶部成员数据
export async function getStudy(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/worktable/getStudy`,
    method: 'POST',
    params,
  });
}

//[学生] 待办事项
export async function getMattersCommission(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/worktable/commission/matters`,
    method: 'POST',
    params,
  });
}

//[学生] 推荐项目
export async function getRecommendProject(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/worktable/recommend/project`,
    method: 'POST',
    params,
  });
}

//[学生] 教学资源-拓展资源-浏览量
export async function addExpandOne(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teacher/resource/expand/add/one`,
    method: 'POST',
    params,
  });
}

//[学生] 远程地址查询
export async function getRemoteUrl(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/public/remote/url/get`,
    method: 'POST',
    params,
  });
}

//[学生] 仿真题库查询
export async function getQuestionSimulation(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/classstudy/task/simulation/question/get`,
    method: 'POST',
    params,
  });
}

//[学生] 交互课件查询
export async function getCoursewareTask(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/classstudy/task/courseware/get`,
    method: 'POST',
    params,
  });
}

//[学生] [实践任务]查询本人所在岗位
export async function getBizRole(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/classstudy/tc/rel/student/biz/role/get`,
    method: 'POST',
    params,
  });
}

//[学生] [实践任务]上岗
export async function bindBizRole(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/classstudy/tc/rel/student/biz/role/bind`,
    method: 'POST',
    params,
  });
}

//[学生] [实践任务]下岗
export async function delBizRole(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/classstudy/tc/rel/student/biz/role/del`,
    method: 'POST',
    params,
  });
}

//[学生] [实践任务]查询任务相关信息
export async function getRelInfo(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/stu/task/relInfo`,
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

//[学生] 进入项目列表 埋点
export async function addScoreProject(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/manager/stat/project/score/add`,
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

export async function enterProjectLast(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/stu/project/enter`,
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

// [学生]工作应用查询
export async function getProjectTeachClassApp(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/class/stu/app/list`,
    method: 'POST',
    params,
    hiddenLoading: true,
  });
}

// [学生]项目资源
export async function getProjectResList(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/tc/project/resource/project/list`,
    method: 'POST',
    params,
  });
}

// [学生端]查询学生可以学习的项目
export async function getProjectStudyList(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/project/project/stu/study/page`,
    method: 'POST',
    params,
  });
}

// [学生端]项目学习进班
export async function enterClass(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/stu/project/study/enterclass`,
    method: 'POST',
    params,
  });
}

// [学生端] 工作台 我的职业路径
export async function getStatPostMateList(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/worktable/occupation`,
    method: 'GET',
    params,
  });
}

// [学生端] 工作台 我的知识图谱
export async function getKnowledgeGraph(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/worktable/stu/knowledgeGraph`,
    method: 'POST',
    params,
  });
}

// [学生端] 课程首页 查询思维导图缩略图
export async function getMindMapUrl(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/tc/course/course/mindmap/url`,
    method: 'POST',
    params,
  });
}

// [学生端] 课程首页 能力词云
export async function getPageWordCloud(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/worktable/stu/ability/wordCloud`,
    method: 'POST',
    params,
  });
}

// [学生端] 课程首页 岗位匹配topN
export async function getPostMateTopN(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/manager/stat/student/postMate/topN`,
    method: 'POST',
    params,
  });
}

//[学生] 获取上一次学习的项目
export async function getLastLearnRecord(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/stu/task/record/last`,
    method: 'POST',
    params,
  });
}

//[学生] 获取上一次学习的项目
export async function studentLicense(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/runner/class/license/hold`,
    method: 'POST',
    params,
  });
}
//[学生] 获取上一次学习的项目
export async function openLogin(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/seentao/jskfdx/login`,
    method: 'POST',
    params,
    type: 'login',
  });
}
//[学生] 获取上一次学习的项目
export async function enterProject(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/seentao/jskfdx/enter/class`,
    method: 'POST',
    params,
  });
}

//[学生]切换项目
export async function getProjectList(params?: RecordItem) {
  return $axios.request({
    url: `${'/tara'}/class/teach/stu/project/list`,
    method: 'POST',
    params,
  });
}
