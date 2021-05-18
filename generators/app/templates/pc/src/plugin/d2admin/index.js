// Element
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/fixed/element-variables.scss'

// flex 布局库
import 'flex.css'
// 组件
import '@/components'
// svg 图标
import '@/assets/svg-icons'

// 表格导出
import pluginExport from '@d2-projects/vue-table-export'
import pluginImport from '@d2-projects/vue-table-import'

// 功能插件
import pluginError from '@/plugin/error'
import pluginLog from '@/plugin/log'
import pluginOpen from '@/plugin/open'

// 自定义组件
import BasicListPage from '@/components/basic-list-page'
import CentInput from '@/components/cent-input'
import ShortcutDatepicker from '@/components/shortcut-datepicker'

// 图表组件
import echarts from '../echarts'

// OSS图片上传
import imageOss from '@/components/image-oss'

export default {
  async install (Vue, options) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.BASE_URL
    // 当前版本
    Vue.prototype.$version = process.env.VUE_APP_VERSION
    // 构建时间
    Vue.prototype.$buildTime = process.env.VUE_APP_BUILD_TIME

    // 文件上传至OSS地址
    Vue.prototype.uploadOss = async function (files) {
      const list = await imageOss.upload(files, 'test', function (url) {
        console.log(url)
      })
      return list
    }

    // Element
    Vue.use(ElementUI, {
      // size: 'small'
    })
    // 插件
    Vue.use(pluginError)
    Vue.use(pluginLog)
    Vue.use(pluginOpen)
    // 表格导入导出
    Vue.use(pluginExport)
    Vue.use(pluginImport)
    Vue.use(echarts)

    // 自定义组件
    Vue.component('BasicListPage', BasicListPage)
    Vue.component('CentInput', CentInput)
    Vue.component('ShortcutDatepicker', ShortcutDatepicker)
  }
}
