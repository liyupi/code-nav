export default [
  {
    path: '/',
    component: '../layouts/LoadingLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: './user/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/recommend',
          },
          {
            name: '个人中心',
            path: '/account',
            component: '../pages/AccountCenter',
            authority: ['user', 'admin'],
            routes: [
              {
                path: '/account',
                redirect: '/account/info',
              },
              {
                name: '个人资料',
                path: '/account/info',
                component: './AccountCenter/MyInfo',
              },
              {
                name: '我的收藏',
                path: '/account/like',
                component: './AccountCenter/MyLikeResources',
              },
              {
                name: '推荐记录',
                path: '/account/recommend',
                component: './AccountCenter/MyAddResources',
              },
              {
                name: '消息通知',
                path: '/account/message',
                component: './AccountCenter/MyMessages',
              },
            ],
          },
          {
            name: '优选资源',
            icon: 'like',
            path: '/recommend',
            component: './Recommend',
          },
          {
            name: '资源大全',
            path: '/resources',
            component: './Resources',
            authority: ['user', 'admin'],
          },
          {
            name: '资源专栏',
            path: '/resources/:category',
            component: './Resources',
            authority: ['user', 'admin'],
          },
          {
            name: '资源详情',
            path: '/rd',
            component: './ResourceDetail',
            hideInMenu: true,
          },
          {
            name: '我要推荐',
            path: '/addResource',
            component: './AddResource',
            authority: ['user', 'admin'],
            hideInMenu: true,
          },
          {
            name: '激励榜',
            path: '/ranking',
            component: './Ranking',
          },
          {
            name: '找伙伴',
            path: '/friend',
            component: './Friend',
            authority: ['user', 'admin'],
          },
          {
            name: '推荐成功',
            path: '/addSucceed',
            component: './AddSucceed',
            authority: ['user', 'admin'],
            hideInMenu: true,
          },
          {
            name: '审核资源',
            path: '/review/resource',
            component: './ReviewCenter/ReviewResource',
            authority: ['admin'],
          },
          {
            name: '审核评论',
            path: '/review/comment',
            component: './ReviewCenter/ReviewComment',
            authority: ['admin'],
          },
          {
            name: '审核举报',
            path: '/review/report',
            component: './ReviewCenter/ReviewReport',
            authority: ['admin'],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
