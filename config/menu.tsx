import {MenuDataItem} from "@ant-design/pro-layout";
import * as React from "react";
import {
  HomeOutlined, AppstoreOutlined, LikeOutlined, CodeOutlined, ContainerOutlined,
} from '@ant-design/icons';

/**
 * 菜单项，可以从服务器动态拉取
 */
export default [
  {
    name: "我的主页",
    path: "/home",
    icon: <HomeOutlined />,
    authority: ['user', 'admin'],
  },
  {
    name: "优选资源",
    path: "/recommend",
    icon: <LikeOutlined />
  },
  {
    name: "资源大全",
    path: "/resources/all",
    icon: <AppstoreOutlined />
  },
  {
    path: "/resources/tutorial",
    name: "贴心教程",
    icon: <ContainerOutlined />,
    children: []
  },
  {
    path: "/resources/language",
    name: "编程语言",
    icon: <CodeOutlined />,
    children: [
      {
        path: "/resources/java",
        name: "Java"
      },
      {
        path: "/resources/python",
        name: "Python"
      },
    ]
  },
  {
    name: '我要推荐',
    path: '/addResource',
    authority: ['user', 'admin'],
    hideInMenu: true,
  },
] as MenuDataItem[];
