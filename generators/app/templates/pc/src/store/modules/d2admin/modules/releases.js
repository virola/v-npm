// import util from '@/libs/util.js'

export default {
  namespaced: true,

  // 这里存放和发版相关的部分配置数据
  state: {
    // 产品名称
    appName: window.VUE_APP_NAME || '格尔护士 · 院外延续护理云平台',
    // 产品LOGO
    logo: `${process.env.BASE_URL}image/logo@2x.png`
  },
  mutations: {
    /**
     * @description 显示版本信息
     * @param {Object} state vuex state
     */
    versionShow() {
    }
  }
}
