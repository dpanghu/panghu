// 运行时配置
import { history } from '@umijs/max';
import { getConvertParamId } from './services/aiJobHunt';
import { getQueryParam } from './utils/utils';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState() {
  // 解决页面刷新 重复请求 会话
  // history.location.state = null;
  // 处理 sessionStorage
  // const { search } = history.location;
  // const sessionStorageQs = window.sessionStorage.getItem('qs');
  // if (search && search.startsWith('?qs=')) {
  //   const queryParams = await getQueryParam();
  //   const paramId = await getConvertParamId(queryParams);
  //   window.sessionStorage.setItem(
  //     'queryParams',
  //     JSON.stringify({ ...queryParams, paramId }),
  //   );
  //   window.sessionStorage.setItem('qs', search.slice(4));
  //   return {};
  // } else {
  //   if (!sessionStorageQs) {
  //     console.error('访问新道AI时，Url缺少qs相关信息');
  //     // 首次进入时 不携带qs 重定向到 错误页
  //     history.push('/');
  //   }
  //   return {};
  // }
}
