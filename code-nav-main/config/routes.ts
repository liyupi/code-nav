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
            name: '我的主页',
            path: '/home',
            component: './AccountCenter',
            authority: ['user', 'admin'],
          },
          {
            name: '优选资源',
            icon: 'like',
            path: '/recommend',
            component: './Recommend',
          },
          {
            name: '资源',
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
            name: '推荐成功',
            path: '/addSucceed',
            component: './AddSucceed',
            authority: ['user', 'admin'],
            hideInMenu: true,
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
