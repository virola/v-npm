<template>
  <common-chart :option="option" :loading="loading" :noData="noData"></common-chart>
</template>

<script>
import CommonChart from '@/components/vue-echarts/common-chart'

export default {
  props: ['data', 'loading'],
  components: {
    CommonChart
  },
  data() {
    return {
      noData: false,
      option: {
        grid: {
          containLabel: true,
          top: 60,
          left: 40,
          right: 40,
          bottom: 40
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          show: true,
          left: '50px',
          top: 0
        },
        dataset: {
          dimensions: ['date', 'reserveNum', 'pipeNum'],
          source: []
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '访问量/PV',
            type: 'line',
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          },
          {
            name: '访问人数/UV',
            type: 'line',
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
        ]
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(vals) {
        this.getOption()
      }
    }
  },
  methods: {
    getOption() {
      if (this.data && this.data.length) {
        this.option.dataset.source = [...this.data]
        this.noData = false
      } else {
        this.noData = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
