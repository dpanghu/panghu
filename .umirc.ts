import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'XAI',
  },
  routes: [
    {
      path: '/',
      layout: false,
      component: '@/pages/404',
    },
    {
      path: '/createAiModule',
      layout: false,
      component: '@/pages/AiModule/createAiModule',
    },
    {
      path: '/aiJobHunt',
      component: '@/pages/AiJobHunt',
      layout: false,
      routes: [
        {
          path: '/aiJobHunt',
          component: '@/pages/AiJobHunt/Home',
          title: 'XAI | ai求职',
        },
        {
          path: '/aiJobHunt/aiList',
          component: '@/pages/AiJobHunt/AiList',
          exact: true,
          title: 'XAI | ai列表',
        },
        {
          path: '/aiJobHunt/resume/:id',
          component: '@/pages/AiJobHunt/Resume',
          exact: true,
          title: 'XAI | ai简历',
        },
        {
          path: '/aiJobHunt/interview/:id',
          component: '@/pages/AiJobHunt/Interview',
          exact: true,
          title: 'XAI | ai面试',
        },
        {
          component: '@/pages/404',
        },
      ],
    },
    {
      component: '@/pages/404',
    },
  ],
  cssLoaderModules: {
    // 配置驼峰式使用
    exportLocalsConvention: 'camelCase',
  },
  favicons: ['./favicon.ico'],
  npmClient: 'npm',
  proxy: {
    '/api/': {
      target: 'https://tapi.seentao.com/',
      onProxyReq: function (req) {
        if (
          req.path.includes('/chat/stream') ||
          req.path.includes('/create/stream')
        ) {
          req.removeHeader('Content-Encoding');
        }
      },
      onProxyRes: function (proxyRes, req, res) {
        if (
          req.path.includes('/chat/stream') ||
          req.path.includes('/create/stream')
        ) {
          res.setHeader('Content-Encoding', '123123');
        }
      },
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
