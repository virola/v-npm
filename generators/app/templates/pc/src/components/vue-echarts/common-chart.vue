<template>
  <div class="chart-block" flex="box:mean cross:center">
    <v-chart v-if="!noData" ref="chart" :style="{ height: '100%' }" :option="option" :loading="loading" :loading-options="loadingOptions" autoresize></v-chart>
    <div v-if="noData" class="full-width d2-text-center text-info">暂无数据</div>
  </div>
</template>

<script>
import { loadingOptions } from '@/components/vue-echarts/constant'

export default {
  props: ['option', 'loading', 'noData'],
  data() {
    return {
      loadingOptions,
    }
  },
}
</script>

<style lang="scss" scoped>
.chart-block {
  position: relative;
}
</style>
