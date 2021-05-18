<template>
<div class="shortcut-datepicker-options">
  <b class="shortcut" v-for="(item, index) in shortcuts" :key="index" :class="{active: curActive == item}" @click="changeShortCut(item)">{{SHORTCUTS[item]}}</b>
  <el-date-picker class="datepicker" unlink-panels v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" :editable="false" value-format="yyyy-MM-dd" @change="handleChange"></el-date-picker>
</div>
</template>

<script>
import dayjs from 'dayjs'
import util from '@/libs/util.js'
import {
  mapState
} from 'vuex'

export default {
  props: {
    value: [ Array, String ],
    showShortcuts: {
      type: [ Array ],
      default () {
        return ['lastWeek', 'week', 'lastMonth', 'month']
      }
    },
    // 截止到昨天的日期
    utilYesterday: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const TODAY = dayjs()
    const MIN_DATE = dayjs().add('-90', 'd').startOf('d')

    const SHORTCUTS = {
      today: '今天',
      yesterday: '昨天',
      lastWeek: '上周',
      week: '本周',
      lastMonth: '上月',
      month: '本月',
      year: '本年',
      last7day: '近7天',
      last15day: '近15天',
      last30day: '近30天',
    }
    return {
      dateRange: [],
      curActive: '',
      SHORTCUTS,
      // 限制的日期范围
      TODAY,
      MIN_DATE
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info']),
    shortcuts () {
      return this.utilYesterday ? this.showShortcuts.filter(item => item !== 'today') : this.showShortcuts
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.dateRange = val
      }
    }
  },
  methods: {
    changeShortCut (type) {
      const yesterday = util.getTimeDistance('yesterday')[0]
      const distance = util.getTimeDistance(type)
      if (this.utilYesterday) {
        if (distance[1].isAfter(yesterday)) {
          distance[1] = yesterday
        }
      }

      // 格式化成日期文字
      this.dateRange = [
        distance[0].format('YYYY-MM-DD'),
        distance[1].format('YYYY-MM-DD')
      ]

      this.curActive = type
      this.$emit('input', [...this.dateRange])
      this.$emit('change', [...this.dateRange])
    },

    handleChange (dates) {
      this.curActive = ''
      // console.log(dates)
      // 这里要根据用户权限限制组件的日期可选范围
      if (this.info.projectId !== 1) {
        // 限制最大可查询90天以内的数据
        let startDate = dayjs(dates[0])
        let endDate = dayjs(dates[1])
        let change = false

        if (startDate.isBefore(this.MIN_DATE)) {
          startDate = this.MIN_DATE
          change = true
        }
        if (startDate.isAfter(this.TODAY)) {
          startDate = this.TODAY
          change = true
        }

        if (endDate.isBefore(this.MIN_DATE)) {
          endDate = this.MIN_DATE
          change = true
        }
        if (endDate.isAfter(this.TODAY)) {
          endDate = this.TODAY
          change = true
        }

        if (change) {
          this.$message.warning('只能查询最近90天以内的数据')
          this.dateRange = [
            startDate.format('YYYY-MM-DD'),
            endDate.format('YYYY-MM-DD')
          ]
        }
      }
      // 使用input可以触发父组件的v-model双向语法糖
      this.$emit('input', [...this.dateRange])
      this.$emit('change', [...this.dateRange])
    }
  }
}
</script>

<style lang="scss" scoped>
.shortcut-datepicker-options {

  .shortcut {
    display: inline-block;
    margin-right: 15px;
    margin-bottom: 10px;
    color: #999;
    font-weight: 400;
    cursor: pointer;
  }

  .active {
    color: $color-primary;
    font-weight: 600;
  }

  .datepicker {
    width: 260px;
  }
}
</style>
