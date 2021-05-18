# PC端通用管理系统

>> 使用[D2Admin](https://github.com/d2-projects/d2-admin) 简化版起始模板。

目前集成功能包括：

1.组件集成：

- 基础搜索+表格显示页面组件 `basic-list-page`
- 快捷选项+日期时间段选择的通用组件 `shortcut-datepicker`
- 用户以元为单位输入，组件以分为单位格式化的输入框组件 `cent-input`
- echarts插件默认已集成，注册组件名为 `v-charts`
- `image-oss` 组件支持批量上传图片至阿里云oss，需要后端请求 policy 的接口支持
- 表格导出导入处理组件： `@d2-projects/vue-table-export` 和 `@d2-projects/vue-table-import`

以上组件如不需要可卸载。

2.业务集成：

- 所有业务接口集中到 `@/api` 目录管理，并自动挂载至 `Vue` 原型链，组件中可直接通过 `this.$api.[接口名]` 进行调用。
- 角色权限控制到菜单过滤，在 `store -- account` 模块的 `getLoginInfo` 方法中根据业务需求设定对应的角色。
- 一些业务常用的 `filters` 和 `原型链方法` 已经挂载，详见 `plugin/d2admin/index.js` 和 `plugin/filters/index.js`

3.mock server集成

- 使用[miragejs](https://miragejs.com/) 用来mock前端接口请求，`main.js` 中指定仅在开发环境下调用。


## 启动开发

```
# 安装依赖
yarn install

# 启动server
yarn start
```

## 部署

```
yarn run build
```
