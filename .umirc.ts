import { defineConfig } from '@umijs/max';

export default defineConfig({
  base: '/',
  publicPath: '/',
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  hash: true,
  layout: {
    title: 'XAI',
  },
  esbuildMinifyIIFE: true,
  routes: [
    {
      path: '/login',
      title: '登录',
      layout: false,
      component: '@/pages/login',
    },
    {
      path: '/role',
      title: '角色',
      layout: false,
      component: '@/pages/login/role',
    },
    {
      path: '/cardRegistry',
      title: '数据大屏',
      layout: false,
      component: '@/pages/cardRegistry',
    },
    {
      path: '/',
      title: 'xxx管理系统',
      component: '@/components/Layout',
      layout: false,
      routes: [
        {
          path: '/userManage',
          title: '用户管理',
          component: '@/pages/userManage',
        },
        {
          path: '/dataBoard',
          title: '数据大屏',
          layout: false,
          component: '@/pages/dataBoard',
        },
        {
          path: '/pageIndex',
          title: '首页',
          component: '@/pages/pageIndex',
        },
        {
          path: '/orgManage',
          title: '企业管理',
          component: '@/pages/orgManage',
        },
        {
          path: '/qrcodeManage',
          title: '二维码管理',
          component: '@/pages/qrcodeManage',
        },
        {
          path: '/deptManage',
          title: '部门管理',
          component: '@/pages/deptManage',
        },
        {
          path: '/cardManage',
          title: '测试片管理',
          component: '@/pages/cardManage',
        },
        {
          path: '/roleManage',
          title: '角色管理',
          component: '@/pages/roleManage',
        },
        {
          path: '/sampleManage',
          title: '采样管理',
          layout: false,
          component: '@/pages/sampleManage',
        },
        {
          path: '/userAdmin',
          title: '在线用户管理',
          component: '@/pages/userAdmin',
        },
      ],
    },
    {
      component: '@/pages/404',
    },
  ],
  cssLoaderModules: {
    exportLocalsConvention: 'camelCase',
  },
  favicons: ['./favicon.ico'],
  npmClient: 'npm',
  proxy: {
    '/api/': {
      target: 'http://120.55.61.17:8999/',
      onProxyReq(req) {
        if (
          req.path.includes('/chat/stream') ||
          req.path.includes('/create/stream')
        ) {
          req.removeHeader('Content-Encoding');
        }
      },
      onProxyRes(proxyRes, req, res) {
        if (
          req.path.includes('/chat/stream') ||
          req.path.includes('/create/stream')
        ) {
          res.setHeader('Content-Encoding', '123123');
        }
      },
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
});
