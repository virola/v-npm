// 解决promise的兼容性问题
import 'es6-promise/auto'
import 'lib-flexible'
import 'flex.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './registerServiceWorker'
import setup from './libs/install'
import db from './libs/db'
import util from './libs/util'

// sentry 错误监控
import sentry from './libs/sentry'

// 数据mock server
import { makeServer } from './mock/server'
if (process.env.NODE_ENV === 'development') {
  makeServer()
}

Vue.use(sentry)

// 接受外部传入的值
const token = util.getURLQuery('token')
const showNav = util.getURLQuery('showNav')

if (showNav) {
  db.set('showNav', showNav)
}
if (token) {
  // 如果token发生变化，那么必须要刷新页面删除token才行
  // 缓存中用户信息需要清除
  const originToken = db.get('token')
  db.set('token', token)
  if (originToken && token !== originToken) {
    db.remove('userInfo')
    store.commit('app/setUserInfo', {})
    // token发生变化，重新加载用户和机构数据
    store.dispatch('app/loadUserInfo').then(() => {})
  }
}

// UI插件、过滤器载入
Vue.use(setup)

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    let isShowNav = true
    // 如果设定要显示nav
    if (showNav) {
      isShowNav = true
    }
    if (db.get('token')) {
      this.$store.dispatch('app/loadUserInfo').then(() => {})
    }
    this.$store.commit('app/setShowNav', isShowNav)
  },
  mounted () {
    // console.log(this.$baseUrl)
  }
}).$mount('#app')
