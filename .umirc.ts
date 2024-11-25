import { defineConfig } from '@umijs/max';

export default defineConfig({
  base: '/bus_xai_web/',
  publicPath: '/bus_xai_web/',
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
      path: '/',
      layout: false,
      component: '@/pages/404',
      redirect: '/aiJobHunt',
    },
    {
      path: '/createAiModule',
      layout: false,
      component: '@/pages/AiModule/createAiModule',
    },
    {
      path: '/AiScene',
      layout: false,
      component: '@/pages/AiModule/AiScene',
    },
    {
      path: '/AiPlanList',
      layout: false,
      component: '@/pages/AiModule/AiPlanList',
    },
    {
      path: '/AiPlanLists',
      layout: false,
      component: '@/pages/AiModule/AiPlanLists',
    },
    {
      path: '/AiPlan',
      layout: false,
      component: '@/pages/AiModule/AiPlan',
    },
    {
      path: '/AiPlanPeople',
      layout: false,
      component: '@/pages/AiModule/AiPlanPeople',
    },
    {
      path: '/AiScene',
      layout: false,
      component: '@/pages/AiModule/AiScene',
    },
    {
      path: '/AiScenes',
      layout: false,
      component: '@/pages/AiModule/AiList',
    },
    {
      path: '/AiSceneImg',
      layout: false,
      component: '@/pages/AiModule/AiSceneImg',
    },
    {
      path: '/OCR',
      layout: false,
      component: '@/pages/AiOCR',
    },
    {
      path: '/aiJobHunt/AiSurveyQuestionnaire',
      component: '@/pages/AiJobHunt/AiSurveyQuestionnaire',
      title: 'XAI | ai调查问卷',
      layout: false,
    },
    {
      path: '/FVR',
      layout: false,
      component: '@/pages/AiFVR',
    },
    {
      path: '/LPR',
      layout: false,
      component: '@/pages/AiLPR',
    },
    {
      path: '/OR',
      layout: false,
      component: '@/pages/AiOR',
    },
    {
      path: '/aiJobHunt/AiList',
      component: '@/pages/AiJobHunt/AiList',
      title: 'XAI | ai列表',
      layout: false,
    },
    {
      path: '/documentSummary',
      component: '@/pages/DocumentSummary',
      title: 'AI文档总结',
      layout: false,
    },
    {
      path: '/documentQA',
      component: '@/pages/DocumentQA',
      title: 'AI文档问答',
      layout: false,
    },
    // ai情感分析
    {
      path: '/sentimentAnalysis',
      component: '@/pages/SentimentAnalysis',
      title: 'AI情感分析',
      layout: false,
    },
    {
      path: '/wenshengVoice',
      component: '@/pages/WenshengVoice',
      title: 'AI文生语音',
      layout: false,
    },
    {
      path: '/presetData',
      component: '@/pages/PresetData',
      title: '预置数据',
      layout: false,
    },
    {
      path: '/aiAtlas',
      component: '@/pages/AiAtlas',
      title: 'AI图谱生成',   
      layout: false,
    },
    {
      path: '/dataVisualization',
      component: '@/pages/DataVisualization',
      title: 'AI数据可视化',
      layout: false,
      routes: [
        {
          path: '/dataVisualization/upload',
          component: '@/pages/DataVisualization/Upload',
          exact: true,
          title: 'AI数据可视化',
        },
        {
          path: '/dataVisualization/detail/:id',
          exact: true,
          component: '@/pages/DataVisualization/Detail',
          title: 'AI数据可视化',
        },
      ],
    },
    {
      path: '/IntelligentAssistant',
      component: '@/pages/IntelligentAssistant',
      layout: false,
      routes: [
        {
          path: '/IntelligentAssistant/application',
          component: '@/pages/IntelligentAssistant/application',
          title: '团队管理',
        },
        {
          path: '/IntelligentAssistant/teamManage',
          component: '@/pages/IntelligentAssistant/teamManage',
          title: '应用管理',
        },
        {
          path: '/IntelligentAssistant/knowledge',
          component: '@/pages/IntelligentAssistant/knowledge',
          title: '知识库',
        },
        {
          path: '/IntelligentAssistant/statistic',
          component: '@/pages/IntelligentAssistant/statistic',
          title: '数据统计',
        },
        // {
        //   path: '/aiJobHunt/resume/:id',
        //   component: '@/pages/AiJobHunt/Resume',
        //   exact: true,
        //   title: 'XAI | ai简历',
        // },
        // {
        //   path: '/aiJobHunt/interview/:paramId/:themeId',
        //   component: '@/pages/AiJobHunt/Interview',
        //   exact: true,
        //   title: 'XAI | ai面试',
        // },
        // {
        //   component: '@/pages/404',
        // },
      ],
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
          path: '/aiJobHunt/resume/:id',
          component: '@/pages/AiJobHunt/Resume',
          exact: true,
          title: 'XAI | ai简历',
        },
        {
          path: '/aiJobHunt/interview/:paramId/:themeId',
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
      target: 'https://api.seentao.com/',
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
