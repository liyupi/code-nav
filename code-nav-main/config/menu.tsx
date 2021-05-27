import {MenuDataItem} from "@ant-design/pro-layout";
import * as React from "react";
import {
  FieldBinaryOutlined,
  ContainerOutlined,
} from '@ant-design/icons';

/**
 * 菜单项
 */
export default [
  {
    path: "/resources/tutorial",
    name: "找教程",
    icon: <ContainerOutlined />,
  },
  {
    path: "/resources/basic",
    name: "必修基础",
    icon: <FieldBinaryOutlined />,
    children: [
      {
        path: "/resources/algorithm",
        name: "算法数据结构"
      },
      {
        path: "/resources/system",
        name: "计算机系统"
      },
    ]
  },
] as MenuDataItem[];
