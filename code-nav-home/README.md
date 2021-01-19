# 编程导航主页

[在线访问](https://home.code-nav.cn)

极简的浏览器主页，支持万能搜索，提升效率，还可以定制壁纸和主页站点。

## 项目展示

透明主页

![透明主页](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-home.png)

白底主页

![白底主页](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-home-white.png)

万能搜索

<img src="https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-home-search.png" width="700" />

万能搜索结果页

![万能搜索结果页](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-home-searchAll.png)

切换壁纸

![切换壁纸](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-home-covers.png)

随机壁纸

![随机壁纸](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-home-cover-random.png)

动态壁纸

![动态壁纸](https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/code-nav-home-cover.png)

## 已有功能

1. 切换搜索
2. 万能搜索
3. 切换壁纸
4. 动态壁纸
5. 随机壁纸
6. 透明模式

## 快速开始

**请保证 Node.js 版本 > 10** ⚠️

1. 下载项目到本地

   ```bash
   git clone https://github.com/liyupi/code-nav.git
   ```

2. 进入目录，安装依赖

   ```bash
   cd code-nav-home
   npm install
   ```

3. 本地启动项目

   ```bash
   npm run start
   ```
   
4. 打包构建

   ```bash
   npm run build
   ```

   会生成 dist 目录，可以通过 [serve 工具](https://www.npmjs.com/package/serve) 本地启动 server 快速浏览。

5. 部署

   利用腾讯云静态站点托管：可以直接将 `dist` 目录发布到 [静态站点托管](https://cloud.tencent.com/document/product/876/46900) 中，有 CDN 支持

   ```bash
   tcb hosting deploy . -e envId
   ```

## 技术选型

### 前端

基于 [React-Static](https://github.com/react-static/react-static) 静态站点生成框架开发

1. React + React-Static 
2. [Ant Design](https://ant.design/index-cn) 组件库 + [Ant Design Pro 高级组件](https://procomponents.ant.design/components)
3. ESLint 检查
4. 随机壁纸使用搏天 API 接口 + JsonBird 代理跨域
5. 使用 iframe 实现壁纸切换和万能搜索

### 后端

后端使用 [腾讯云云开发](https://cloud.tencent.com/product/tcb)，全量上云，充分利用了腾讯云提供的云计算能力。

1. 静态网站托管：CDN 全站加速，一键部署

