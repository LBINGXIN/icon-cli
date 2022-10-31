# @lbingxin/icon-cli

一款增加摸鱼时间的神器，自动从 iconfont 下载图标，并自动发布为 npm 包

## 使用方式

### 安装

#### npm

```
npm i @lbingxin/icon-cli -g
```

#### npm

```
yarn add @lbingxin/icon-cli -g
```

### 具体使用

#### 查看版本号

```
icon-cli -v
```

#### 更新图标并发布 npm 包

```
icon-cli update <user_name> <password> <project_id>

// eg: icon-cli update 183**9032 123456 3726883
```

| 属性       | 说明                   | 默认值 |
| ---------- | ---------------------- | ------ |
| user_name  | iconfont 账号名        | -      |
| password   | iconfont 密码          | -      |
| project_id | iconfont 对应仓库的 id | -      |

![对应仓库](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d90226c67f5409eb0713dfb9824db70~tplv-k3u1fbpfcp-watermark.image?)
