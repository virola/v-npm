<template>
  <d2-container>
    <div slot="header">echarts图表示例</div>
    <el-card class="report-card" shadow="hover">
      <div slot="header" flex="main:justify cross:center">
        <h2 class="report-title">趋势统计</h2>
        <shortcut-datepicker v-model="dateRange" :showShortcuts="['week', 'lastWeek', 'month']" @change="dateChange"></shortcut-datepicker>
      </div>
      <line-chart :style="`height: 300px`" :data="lineData"></line-chart>
    </el-card>
  </d2-container>
</template>

<script>
import dayjs from 'dayjs'
import LineChart from './charts/line-chart'

function rand(val = 1000) {
  return Math.round(Math.random() * val)
}

function mockList(length = 30) {
  const list = []
  const startDate = dayjs().add(-length, 'd')
  for (let index = 0; index < length; index++) {
    const tmp = {
      date: startDate.add(index, 'd').format('YYYY-M-D'),
      reserveNum: 100 + rand(100),
      pipeNum: 100 + rand(100)
    }
    list.push(tmp)
  }
  return list
}

export default {
  name: 'page2',
  components: {
    LineChart
  },
  data () {
    return {
      dateRange: [
        dayjs().add(-6, 'd').format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ],
      lineData: [],
    }
  },
  methods: {
    getData() {
      this.lineData = mockList(20)
    },
    dateChange() {
      this.getData()
    },
  }
}
</script>

<style scoped>

</style>
