const menus = [
  {
    title: '首页',
    icon: 'home',
    path: '/index'
  },
  {
    title: '自定义页面',
    icon: 'list-alt',
    roles: [ 'admin' ],
    children: [
      { path: '/page1', title: '页面一' },
      { path: '/page2', title: '页面二' },
    ]
  },
]

// 菜单 侧边栏
export default menus
