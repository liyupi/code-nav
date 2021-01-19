---
toc: menu
order: 1
---

# 编程导航主站

[在线访问](https://www.code-nav.cn)

最专业灵活的编程导航站点，帮助大家发现优质编程学习资源。

可以检索自己需要的资源、分享好资源、评价资源。好的资源会被更多人发现，共同感受技术带来的美好。

本项目是『 编程导航 』网站的开源版本，使用这套代码，你也能轻松开发多端适配网站！

## 项目展示

推荐资源

![推荐资源](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-recommend.png)

资源大全

![资源大全](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-resources.png)

收藏夹

![收藏夹](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-favour.png)

资源详情

![资源详情](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-detail.png)

评论区

![评论区](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-comment.png)

## 已有功能

1. 优质资源推荐
2. 资源全局搜索
3. 资源添加
4. 资源详情及相似推荐
5. 个人主页、兴趣设置
6. 喜欢、分享、浏览量统计
7. 生成定制主页
8. 评论区

## 快速开始

**请保证 Node.js 版本 > 10** ⚠️

1. 下载项目到本地

   ```bash
   git clone https://github.com/liyupi/code-nav.git
   ```

2. 进入目录，安装依赖

   ```bash
   cd code-nav-main
   npm install
   ```

3. 本地启动项目

   ```bash
   npm run start
   ```

4. 点击右下角 `Umi UI` 按钮，可快速新建页面，海量模板供选择。

   如果模板图标无法加载，请在本地配置 hosts：`151.101.64.133 raw.githubusercontent.com`

   **新建页面后，如果要在菜单列表中显示，要在 `config/menu.tsx` 中添加配置。**

5. 打包构建

   ```bash
   npm run build
   ```

   会生成 dist 目录，可以通过 [serve 工具 ](https://www.npmjs.com/package/serve)本地启动 server 快速浏览。

6. 部署

   提供多种部署方式：

   1. 容器（推荐）：项目已提供 `Dockerfile` 可以轻松构建 `Docker` 镜像，并将容器部署在[云托管服务](https://cloud.tencent.com/document/product/876/46901)中，实现动态扩缩容。
   2. 目录：直接将 `dist` 目录放到 `Nginx` 等 web 服务器上，配置 `nginx.conf` 即可。
   3. 静态站点托管：可以直接将 `dist` 目录发布到[静态站点托管](https://cloud.tencent.com/document/product/876/46900)中，有 CDN 支持


## 技术选型

### 前端

前端使用 [Ant Design Pro V4](https://pro.ant.design/docs/getting-started-cn/) 后台管理模板，提升了百倍开发效率，**但是也踩了不少坑**~

1. [Umi](https://umijs.org/zh-CN) + React 前端框架
2. [Ant Design](https://ant.design/index-cn) 组件库 + [Ant Design Pro 高级组件](https://procomponents.ant.design/components)
3. [Dva](https://dvajs.com/) 数据状态管理
4. [Less](http://lesscss.cn/) CSS 预处理语言
5. TypeScript 静态类型检查


### 后端

后端使用 [腾讯云云开发](https://cloud.tencent.com/product/tcb)，全量上云，充分利用了腾讯云提供的云计算能力。

1. 云数据库：配合 SDK 使用，无需编写重复的增删改查，提高开发效率，自动备份
2. 云存储：配合 SDK 使用，易接入
3. 云函数：开发复杂的函数，Serverless 架构，无需自行管理，可开放 Http 访问服务
4. 云托管：容器技术，弹性伸缩、动态扩缩容
5. 腾讯云 CMS 开箱即用的后台管理


## 目录结构

```
.
├── Dockerfile 容器构建文件
├── Dockerfile.build 容器构建文件（包含 npm 打包流程）
├── README.md 项目说明
├── cloudbaserc.json 腾讯云云开发文件，需要用 tcb 根据自己的环境生成
├── cloudfunctions 后端云函数
│   └── helloworld
├── config 配置
│   ├── config.ts 全局配置
│   ├── defaultSettings.ts 框架默认设置
│   ├── menu.tsx 菜单列表
│   ├── proxy.ts 代理
│   └── routes.ts 定义路由
├── docker 容器所需配置文件
│   └── nginx.conf 服务器配置
├── jsconfig.json 编译配置
├── mock 假数据
│   ├── forms.ts
│   ├── resources.ts
│   ├── tags.ts
│   └── user.ts
├── package.json 包管理文件
├── public 公共目录
│   └── logo.png
├── src 前端项目主目录
│   ├── assets 资源文件
│   ├── cardList.less 卡片样式
│   ├── components 组件
│   ├── constant 常量
│   ├── global.less 全局样式
│   ├── global.tsx 全局入口
│   ├── layouts 布局
│   ├── manifest.json
│   ├── models 数据模型
│   ├── pages 页面
│   ├── service-worker.js 缓存
│   ├── services 业务请求
│   ├── tcb.js 腾讯云云开发 SDK
│   ├── typings.d.ts 类型定义
│   └── utils 工具
└── tsconfig.json
```


## 测试

1. 前端使用 “伪 Mock 数据” 测试，如果使用 `UMI UI` 新建页面，框架将提供真实 Mock 测试数据。
2. 如果使用腾讯云开发，可以在本地通过 `tcb` 命令测试云函数 

```bash
tcb fn run --name <functionName> --params <JSON params>
```

## 开发技巧

1. 使用全局 `LoadingLayout` 实现云开发、自动登录等前置条件加载


