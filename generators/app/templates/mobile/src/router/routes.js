import Layout from '@/layout/nav-layout'

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: {
      name: 'home'
    },
    component: Layout,
    children: [
      // 首页
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页',
          auth: true,
          showNav: true,
          bodyClass: 'bg-f',
          keepAlive: true
        },
        component: require('@/views/home/index').default
      },
      {
        path: '/act-list',
        name: 'act-list',
        meta: {
          title: '活动管理',
          auth: true,
        },
        component: require('@/views/act/list').default
      },
      {
        path: '/act-add',
        name: 'act-add',
        meta: {
          title: '创建活动',
          auth: true,
        },
        component: require('@/views/act/add').default
      },
      {
        path: '/act-edit',
        name: 'act-edit',
        meta: {
          title: '编辑活动',
          auth: true,
        },
        component: require('@/views/act/add').default
      },
      {
        path: '/act-detail',
        name: 'act-detail',
        meta: {
          title: '活动详情',
          auth: true,
        },
        component: require('@/views/act/detail').default
      },

      {
        path: '/mine/index',
        name: 'mine-index',
        meta: {
          title: '我的',
          auth: true,
          showNav: true,
        },
        component: require('@/views/mine/index').default
      },
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    meta: {
      bodyClass: 'bg-f'
    },
    component: require('@/views/system/login').default
  },
  {
    path: '/reset-pwd',
    name: 'reset-pwd',
    component: require('@/views/system/reset-pwd').default
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: require('@/views/system/error/404').default
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
