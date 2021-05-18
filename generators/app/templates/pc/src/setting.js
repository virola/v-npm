
const setting = {
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: {
    search: {
      open: 's',
      close: 'esc'
    }
  },
  // 侧边栏默认折叠状态
  menu: {
    asideCollapse: false
  },
  // 在读取持久化数据失败时默认页面
  page: {
    opened: [
      {
        name: 'index',
        fullPath: '/index',
        meta: {
          title: '首页',
          auth: false
        }
      }
    ]
  },
  // 菜单搜索
  search: {
    enable: false
  },
  // 注册的主题
  theme: {
    list: [
      {
        title: '经典',
        name: 'd2',
        preview: 'image/theme/d2/preview@2x.png'
      },
      {
        title: '简约线条',
        name: 'line',
        backgroundImage: 'image/theme/line/bg.jpg',
        preview: 'image/theme/line/preview@2x.png'
      },
      {
        title: '深色',
        name: 'dark',
        preview: 'image/theme/dark/preview@2x.png'
      },
      {
        title: '紫罗兰',
        name: 'violet',
        preview: 'image/theme/violet/preview@2x.png'
      },
      {
        title: '流星',
        name: 'star',
        backgroundImage: 'image/theme/star/bg.jpg',
        preview: 'image/theme/star/preview@2x.png'
      },
      {
        title: '深蓝',
        name: 'tomorrow-night-blue',
        preview: 'image/theme/tomorrow-night-blue/preview@2x.png'
      }
    ]
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  },

  // 角色映射信息配置
  role: {
    // 自上而下权限优先级
    list: [
      {
        name: '系统管理员',
        id: 'admin'
      },
      {
        name: '普通成员',
        id: 'member'
      }
    ],
    // 数据库角色对应ID映射
    map: {
      'admin': 'admin',
      'member': 'member'
    },
  },

  // 默认头像
  DEFAULT_AVATAR: `${process.env.BASE_URL}image/init_header.png`,
}


export default setting
