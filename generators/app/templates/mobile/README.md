# 通用H5移动端页面

- Vue + Vue Router + Vuex
- UI框架： vant-ui
- ajax插件： axios
- CSS预处理器： less

Mock数据集成：

- 使用[miragejs](https://miragejs.com/) 用来mock前端接口请求，`main.js` 中指定仅在开发环境下调用。


## 项目开发配置
```
yarn install
```

### 启动开发server
```
yarn start
```

### 打包构建
```
yarn run build
```

### 自定义项目配置文件 `vue.config.js`
See [Configuration Reference](https://cli.vuejs.org/config/).

## 项目说明

```
[root]
|-- public/  # index.html 入口网页等静态资源存放目录
|-- src/     # 源代码目录
|   |-- api/        # 后端接口存放目录
|   |-- assets/     # less样式文件目录
|   |-- components/ # 公共组件目录（目前只用到了评估表组件）
|   |-- layout/     # 统一框架组件（标题+导航页面展示框架）
|   |-- libs/       # 公共库目录，如 axios、数据存储、插件统一安装文件等
|   |-- router/     # 统一路由目录
|   |-- store/      # vuex公共存储处理
|   |-- views/      # 页面视图组件目录
|   |
|   |-- App.vue     # Vue主容器
|   |-- main.js     # 项目主入口
|   |-- setting.js  # 项目通用配置文件
|
```

### 公共样式变量

公共的样式变量存放在这个文件中： `~@/assets/style/public.less`
在视图组件的样式里可以直接使用。例如：
```
.custom-style {
  color: @color-primary;  // 输出 #30d9bb
}
```

### 业务处理说明

本网页支持独立访问，有单独的登录页面，也支持小程序嵌入h5的方式访问。使用小程序访问时，需要将登录后的 `token` 作为 URL query 参数，初次加载时会自动拉取对应的登录信息（见 `main.js` 中处理）。

### postcss 移动端 UI 自适应的处理方案

1. 安装依赖

```
yarn add postcss-pxtorem lib-flexible
```

2. 入口文件引入 `lib-flexible`
```js
// main.js 引入
import 'lib-flexible'
```

3. postcss.config.js 配置
```js
module.exports = {
  plugins: {
    // to edit target browsers: use "browserslist" field in package.json
    autoprefixer: {},
    // 配置ui框架的尺寸
    'postcss-pxtorem': {
      rootValue: 37.5, // 这里是数字是按照设计图的尺寸来的，例如设计图尺寸是750的，那这里的值就是750/10
      propList: ['*'],
      selectorBlackList: ['van', 'solid'] // 因为vant-ui 用的rem的尺寸是375的，所以这里要把他过滤掉。
    }
  }
}
```

