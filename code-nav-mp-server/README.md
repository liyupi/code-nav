# 微信公众号服务端

对接编程导航公众号，提供获取动态码、关注回复、动态菜单等功能。

## 项目展示

<img src="https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/assets/login.jpeg" width="450"/>

## 已有功能

1. 关注后回复消息
2. 收到消息后回复消息
3. 点击菜单获取动态码

## 快速开始

1. 下载项目
2. 使用 IDEA 打开项目，修改 `resources/application` 文件的公众号配置，进入公众号后台获取：

    ```properties
    wx.mp.appId=
    wx.mp.secret=
    wx.mp.token=
    wx.mp.aesKey=
    ```

3. 使用 `spring-boot:build-image` 构建，在 target 目录下能看到生成的 jar 包
4. 可以在服务器启动 jar 包，或直接用 Dockerfile 构建镜像部署在容器中（推荐腾讯云云托管）

## 技术选型

1. [WxJava](https://github.com/Wechat-Group/WxJava) 微信公众号后台开发类库
2. SpringBoot
3. Maven 包管理
4. 腾讯云开发云函数 + 云托管
5. Logback 日志
