// v-charts
// import VCharts from 'v-charts'

// import '@vue/composition-api'
import * as echarts from 'echarts/core'
// 手动引入 ECharts 各模块来减小打包体积
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart, LineChart } from 'echarts/charts'
import { GridComponent, DatasetComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
// 图表库
import ECharts from 'vue-echarts'

export default {
  install (Vue) {
    // v-charts 和最新echarts 5.x 版本不匹配，已弃用，换成 vue-echarts
    // Vue.use(VCharts)
    // 图表库按需引入
    echarts.use([CanvasRenderer, DatasetComponent, GridComponent, BarChart, LineChart, PieChart, TitleComponent, TooltipComponent, LegendComponent])
    // 全局注册组件（也可以使用局部注册）
    Vue.component('v-chart', ECharts)
  }
}
