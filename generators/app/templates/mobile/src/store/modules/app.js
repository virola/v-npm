import db from '@/libs/db'
import router from '@/router'
import * as $api from '@/api/index'

/**
 * APP 全局变量存储
 */
export default {
  namespaced: true,
  state: {
    // 全局loading状态
    loading: false,
    // 显示底部导航条
    showNav: true,
    // 用户信息
    userInfo: db.get('userInfo') || {},
    // 公用数据
    globalData: {},
  },
  getters: {
    userInfo: state => state.userInfo,
    globalData: state => state.globalData,
  },
  mutations: {
    /**
     * 设置全局loading状态
     * @param {*} state
     * @param {*} status
     */
    setLoading (state, status) {
      state.loading = status
    },

    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
      db.set('userInfo', userInfo)
    },

    // 一些全局公用变量
    setGlobal (state, { key, value }) {
      state.globalData[key] = value
    },

    setShowNav (state, value) {
      state.showNav = value
    },

    // setOrgInfo(state, info) {
    //   state.orgInfo = info
    //   db.set('orgInfo', info)
    // }
  },
  actions: {
    /**
     * 显示版本信息
     */
    versionShow () {
      console.log('GoalNurse', `v${process.env.VUE_APP_VERSION}`)
    },

    /**
     * 退出登录
     */
    logout ({ commit, dispatch }) {
      db.remove('token')
      commit('setUserInfo', {})
      // 跳转路由
      router.push({
        name: 'login'
      })
    },

    /**
     * 加载用户信息
     * @param {*} param0
     */
    loadUserInfo ({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        if (!state.userInfo || !state.userInfo.id) {
          const res = await $api.getUserInfo()
          if (res.success) {
            commit('setUserInfo', res.data)
            resolve(res.data)
          } else {
            reject(res)
          }
        } else {
          resolve(state.userInfo)
        }
      })
    },
  }
}
