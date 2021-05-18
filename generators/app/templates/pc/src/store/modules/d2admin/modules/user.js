import setting from '@/setting'
import menuAside from '@/menu/aside'
import util from '@/libs/util.js'

/**
 * 过滤权限菜单
 * @param {Array} menuList
 * @param {Array} authRole
 * @param {String} code 管理地域编码
 */
function filterAuth (menuList, authRole, code) {
  const result = []
  menuList.forEach(menu => {
    if (menu.roles && menu.roles.length) {
      const hasRole = menu.roles.some(r => r == authRole)
      if (hasRole) {
        // console.log(menu.code, menu.title, code)
        // 市级管理权限才显示菜单
        if (code && menu.code && code == setting.role.code[menu.code]) {
          result.push({ ...menu })
        }
        if (!code || !menu.code) {
          result.push({ ...menu })
        }
      }
    } else {
      result.push({ ...menu })
    }
  })
  // 避免修改元数据
  result.forEach(menu => {
    if (menu.children) {
      menu.children = filterAuth([ ...menu.children ], authRole, code)
    }
  })
  return result
}

export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {},
    // 用户角色
    role: util.cookies.get('role') || 'member'
  },
  getters: {
    role(state) {
      return state.role
    }
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} state vuex state
     * @param {*} info info
     */
    set ({ state, dispatch }, info) {
      return new Promise(async resolve => {
        // store 赋值
        state.info = info
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'user.info',
          value: info,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },

    /**
     * 设置部分用户参数数据
     * @param {Object} state vuex state
     * @param {*} info
     */
    setAttrs ({ state, dispatch }, info) {
      return new Promise(async resolve => {
        // store 赋值
        for (const key in info) {
          if (info.hasOwnProperty(key)) {
            state.info[key] = info[key]
          }
        }

        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'user.info',
          value: state.info,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },

    setRole ({ state, dispatch }, roleList) {
      return new Promise(async resolve => {
        const roles = roleList.sort((former, later) => {
          const index1 = setting.role.list.findIndex(item => item.id === former)
          const index2 = setting.role.list.findIndex(item => item.id === later)
          return index1 < index2
        })
        // 默认角色 member
        const role = roles.length && roles[0] || 'member'
        // store 赋值
        state.role = role
        // cookie 存一个
        util.cookies.set('role', role)
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'user.role',
          value: role,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} state vuex state
     */
    load ({ state, dispatch, commit }) {
      return new Promise(async resolve => {
        // store 赋值
        state.info = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'user.info',
          defaultValue: {},
          user: true
        }, { root: true })

        state.role = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'user.role',
          defaultValue: 'member',
          user: true
        }, { root: true })

        if (state.role) {
          const code = util.fixLocationCode(state.info.locationCode)
          console.log(code)
          // 设置侧边栏菜单
          commit('d2admin/menu/asideSet', filterAuth([ ...menuAside ], state.role, code), { root: true })
        }

        // end
        resolve()
      })
    }
  }
}
