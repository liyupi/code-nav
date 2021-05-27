---
toc: menu
---

# 编程导航文档

[在线访问](https://doc.code-nav.cn)

编程导航项目的使用指南和详细介绍。

## 项目展示

文档主页

![编程导航文档主页](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-doc.png)

阅读文档

![阅读文档](https://qiniuyun.code-nav.cn/%E9%98%85%E8%AF%BB%E6%96%87%E6%A1%A3.png)


## 快速开始

**请保证 Node.js 版本 > 10** ⚠️

1. 下载项目到本地

   ```bash
   git clone https://github.com/liyupi/code-nav.git
   ```

2. 进入目录，安装依赖

   ```bash
   cd code-nav-doc
   npm install
   ```

3. 本地启动项目

   ```bash
   npm run start
   ```
   
4. 打包构建

   ```bash
   npm run docs:build
   ```

   会生成 `docs-dist` 目录，可以通过 [serve 工具](https://www.npmjs.com/package/serve) 本地启动 server 快速浏览。

5. 部署

   利用腾讯云静态站点托管：可以直接将 `docs-dist` 目录发布到 [静态站点托管](https://cloud.tencent.com/document/product/876/46900) 中，有 CDN 支持

   ```bash
   tcb hosting deploy . -e envId
   ```

## 技术选型

### 前端

基于 [dumi](https://d.umijs.org/zh-CN) 文档生成工具

### 后端

1. [腾讯云云存储](https://cloud.tencent.com/document/product/876/19352) 存放图片，CDN 加速
2. [Vercel](https://vercel.com/) 部署静态文档网站

