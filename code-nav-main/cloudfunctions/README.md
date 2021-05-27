# 编程导航后端 - 云函数

> 请先阅读 [云函数文档](https://docs.cloudbase.net/cloud-function/introduce.html) 以了解云函数

## 已有函数

- 添加消息
- 添加分享数
- 生成定制主页信息
- 更新定制主页
- 获取简略用户信息
- 获取所有标签信息
- 获取完整用户信息（管理员或当前用户）
- 收藏资源
- 更新资源
- 浏览资源
- 更新用户兴趣
- 获取我的消息列表
- 获取推荐资源列表
- 获取用户排名列表
- 用户登录
- 审核评论
- 审核资源
- 刷新资源指定字段（单次调用）
- 根据 json 批量添加资源（单次调用）
- 根据获取动态码（仅限小程序调用）

## 开发 SDK

> 请阅读：[一站式后端服务文档](https://docs.cloudbase.net/api-reference/server/node-sdk/functions.html)

## 用命令行操作云函数

> 请阅读：[云开发 CLI 工具文档](https://docs.cloudbase.net/cli-v1/intro.html)

本地测试

```bash
tcb fn run --name <functionName> --params "{\"userId\": 1}"
```

更新函数代码

```bash
tcb fn code update <functionName> --dir <functionPath>
```

部署

```bash
tcb fn deploy <functionName> --dir <functionPath>
```

