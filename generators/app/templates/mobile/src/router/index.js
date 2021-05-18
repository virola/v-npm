import Vue from 'vue'
import VueRouter from 'vue-router'
import db from '@/libs/db'
import store from '@/store'
// import { Toast } from 'vant'

// 路由数据
import routes from './routes'

Vue.use(VueRouter)

/**
 * 屏蔽router报错
 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes
})

/**
 * 用户过滤器
 * @param {*} userInfo
 */
function validateUser(userInfo) {
  if (userInfo && userInfo.id > 0) {
    return true
  }
  return false
}

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = db.get('token')
    const userInfo = store.state.app.userInfo
    if (token && token !== 'undefined') {
      const data = await store.dispatch('app/loadUserInfo').catch(_ => {
        return {}
      })
      if (validateUser(data)) {
        next()
      } else {
        next({
          name: 'login',
          query: {
            redirect: to.fullPath
          }
        })
      }

    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})

// 跳转后返回顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

export default router
