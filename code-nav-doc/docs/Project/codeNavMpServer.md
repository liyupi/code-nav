---
toc: menu
---

# 微信公众号服务端

对接编程导航公众号，提供获取动态码、关注回复、动态菜单等功能。


## 已有功能

**关注后回复消息**

**收到消息后回复消息**

![公众号回复消息](https://qiniuyun.code-nav.cn/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%9E%E5%A4%8D%E6%B6%88%E6%81%AF.png)

**自定义菜单项**

**点击菜单获取动态码**

![](https://qiniuyun.code-nav.cn/%E5%85%AC%E4%BC%97%E5%8F%B7%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95-20210527012441318.png)





## 快速开始

1. 下载项目

2. 使用 IDEA 打开项目，修改 `resources/application` 文件的公众号配置，进入公众号后台获取：

   ```properties
   wx.mp.appId=
   wx.mp.secret=
   wx.mp.token=
   wx.mp.aesKey=
   ```

3. 使用 Maven `spring-boot:build-image` 构建，在 target 目录下能看到生成的 jar 包

4. 可以在服务器启动 jar 包，或直接用 Dockerfile 构建镜像部署在容器中（推荐腾讯云云托管）



## 技术选型

1. Java 编程语言
2. [WxJava](https://github.com/Wechat-Group/WxJava) 微信公众号后台开发类库
3. SpringBoot
4. Maven 包管理
5. 腾讯云开发云函数
6. 腾讯云开发云托管部署
7. Logback 日志
