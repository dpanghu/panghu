import { $axios } from '@/utils/http';
/** ------------------------------------------------- 求职 ------------------------------------ */

// 获取转换参数id
export async function getConvertParamId(params?: RecordItem) {
  return $axios.request({
    url: '/platform/param/platformId',
    method: 'GET',
    params,
  });
}

// 获取转换参数id
export async function getAiPlanList(params?: RecordItem) {
  return $axios.request({
    url: '/xai/plugin/create',
    method: 'POST',
    params,
    isJSON: true,
  });
}

// 获取转换参数id
export async function getQuestion(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/sp/detail/get',
    method: 'GET',
    params,
  });
}

// 查询任务左侧的聊天主题

export async function getChatThemeList<T>(params?: RecordItem): Promise<T[]> {
  return $axios.request({
    url: '/xai/theme/querybyparamid',
    method: 'GET',
    params,
  });
}

// 查询我的成果
export async function getMyResult<T>(params?: RecordItem): Promise<T[]> {
  return $axios.request({
    url: '/xai/theme/plugin/querybyparamid',
    method: 'GET',
    params,
  });
}

// 删除我的成果

export async function deleteMyResult<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/theme/del',
    method: 'POST',
    params,
  });
}

// 获取主题下的聊天记录
export async function getChatRecord<T>(params?: RecordItem): Promise<T[]> {
  return $axios.request({
    url: '/xai/chat/message/last',
    method: 'GET',
    params,
  });
}

// 修改主题名称
export async function modifyThemeName<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/theme/updatename',
    method: 'POST',
    params,
  });
}

// 插件列表
export async function getPluginList<T>(params?: RecordItem): Promise<T[]> {
  return $axios.request({
    // url: '/xai/plugin/list',
    url: '/xai/resume/plugin/list',
    method: 'POST',
    params,
  });
}

// 插件生成

export async function generatePlugin<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/plugin/create',
    method: 'POST',
    params: {
      ...params,
      async: true,
    },
    isJSON: true,
  });
}

// 我的成果进度
export async function getMyResultProgress<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/theme/plugin/state',
    method: 'GET',
    hiddenLoading: true,
    params,
  });
}

/** ---------------------------- 简历页面 --------------------- */
// 根据主题id查询简历

export async function getResumeByThemeId<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/widget/resume/get/bythemeid',
    method: 'POST',
    params,
  });
}

//导出简历
export async function exportResume<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/resume/export',
    method: 'GET',
    params,
  });
}

// 保存简历
export async function saveResume<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/resume/save',
    method: 'POST',
    params,
    isJSON: true,
  });
}

/** ------------------------------------------------- 面试页面 ------------------------------------ */
//查询AI面试题列表

export async function getInterviewQuestionList<T>(
  params?: RecordItem,
): Promise<T[]> {
  return $axios.request({
    url: '/widget/xai/interviewer/list',
    method: 'GET',
    params,
  });
}

//导出面试
export async function exportInterview<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/interviewer/export',
    method: 'POST',
    params,
  });
}

//查询是否显示ai回答和ai点评
export async function getShowAIAnswer<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/interviewer/state/get',
    method: 'GET',
    params,
  });
}

//是否显示ai回答和ai点评
export async function updateShowAIAnswer<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/interviewer/state/update',
    method: 'POST',
    params,
  });
}
/** ------------------------------------------------- AI产品页面 ------------------------------------ */
//查询AI通用工具分类查询列表
export async function getAIProductList<T>(params?: RecordItem): Promise<T[]> {
  return $axios.request({
    url: '/xai/xai/model/type/list',
    method: 'GET',
    params,
  });
}
//查询全部AI领域
export async function getAllAIModel<T>(params?: RecordItem): Promise<T[]> {
  return $axios.request({
    url: '/xai/xai/domain/all',
    method: 'GET',
    params,
  });
}
//查询可编辑AI插件列表
export async function getAICardDetail<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/plugin/editable/list',
    method: 'GET',
    params,
  });
}
//删除插件
export async function deletePlugin<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/remote/plugin/del',
    method: 'POST',
    params,
  });
}
//复制插件
export async function copyPlugin<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/remote/plugin/copy',
    method: 'POST',
    params,
  });
}
//复制插件
export async function saveAnswer<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/sp/answer/pager/save',
    method: 'POST',
    params,
  });
}
//发布/取消发布插件
export async function publishPlugin<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/remote/plugin/release',
    method: 'POST',
    params,
  });
}

//智能生成插件实例-流式
export async function generatePluginInstance<T>(
  params?: RecordItem,
): Promise<T> {
  return $axios.request({
    url: '/xai/plugin/create/stream',
    method: 'POST',
    params,
    isJSON: true,
  });
}
