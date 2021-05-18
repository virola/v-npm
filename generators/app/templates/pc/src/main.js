// Vue
import Vue from 'vue'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
import filters from '@/plugin/filters'
// store
import store from '@/store/index'
import vuePicturePreview from '@/components/vue-picture-preview'

// 菜单和路由设置
import router from './router'
import { frameInRoutes } from '@/router/routes'

// 接口挂载
import $api from './api'

// 数据mock server
import { makeServer } from './mock/server'
if (process.env.NODE_ENV === 'development') {
  makeServer()
}

// 核心插件
Vue.use(d2Admin)
Vue.use(filters)
Vue.use(vuePicturePreview)

Vue.prototype.$api = $api

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
  },
  mounted() {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')

    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  }
}).$mount('#app')
