type ILayoutState = {
  sideMenus: any; // 侧边栏-菜单列表
  info: RecordItem; // 头部信息;
  currentMenu: number;
  noScroll: boolean;
  aiShow: boolean;
};

type ILayoutProps = any;

export { ILayoutState, ILayoutProps };
