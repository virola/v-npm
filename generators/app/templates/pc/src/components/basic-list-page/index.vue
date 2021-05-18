<template>
  <div class="common-list-page">
    <div class="search-box" v-if="!noSearch">
      <el-form :inline="true" size="small" @submit.native.prevent>
        <!-- template -->
        <template v-for="(param, index) in formProps">
          <form-item
            class="basic-form-item"
            :key="param.model + '_' + index"
            :data="searchForm[param.model]"
            :rules="[]"
            :param="param"
            @change="handleFormChange"
            @keyenter="searchData"
          ></form-item>
        </template>
        <!-- template end -->
        <el-form-item>
          <el-button type="primary" size="small" @click="searchData">{{searchBtnText}}</el-button>
          <el-button v-if="btnReset" size="small" plain @click="resetForm">重置</el-button>
          <el-button v-if="exportBtn" size="small" @click="exportExcel">导出</el-button>
        </el-form-item>
        <el-form-item class="d2-ml">
          <slot name="buttons"></slot>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <slot name="table" :list="tableData" :loading="tableLoading">
        <el-table class="ui-table" v-loading="tableLoading" :data="tableData" stripe border>
          <el-table-column type="expand" v-if="tableExpand">
            <template slot-scope="props">
              <slot name="table-expand" :data="props.row"></slot>
            </template>
          </el-table-column>
          <el-table-column label="序号" width="50" v-if="!noSerialNumber">
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <template v-for="(item, index) in tableProps">
            <el-table-column :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed" :key="index">
              <template slot-scope="scope">
                <!-- dataset的固定格式 -->
                <span v-if="item.formatter == 'dataset'" :class="(item.styles && item.styles[scope.row[item.prop]]) || ''">{{
                  item.dataset[scope.row[item.prop]]
                }}</span>
                <span v-if="item.formatter == 'date' && scope.row[item.prop]">{{ scope.row[item.prop] | dateformat('YYYY-MM-DD') }}</span>
                <span v-if="item.formatter == 'datetime' && scope.row[item.prop]">{{ scope.row[item.prop] | dateformat }}</span>
                <span v-if="item.formatter == 'datetimehh' && scope.row[item.prop]"
                  >{{ scope.row[item.prop] | dateformat('YYYY-MM-DD HH') }}时</span
                >
                <span v-if="item.formatter == 'function'">{{ item.func(scope.row) }}</span>
                <div v-if="item.formatter == 'html'" v-html="item.func(scope.row)"></div>
                <template v-if="item.formatter == 'button'">
                  <el-button type="text" @click="item.func(scope.row)">{{ item.button(scope.row) }}</el-button>
                </template>
                <template v-if="item.formatter == 'link'">
                  <span class="link" @click="item.func(scope.row)">{{ item.button(scope.row) }}</span>
                </template>
                <template v-if="item.formatter == 'currency'">
                  <span>{{ scope.row[item.prop] | currency }}</span>
                  <!-- <span v-else>免费</span> -->
                </template>
                <!-- 默认显示 -->
                <span v-if="!item.formatter" :class="(item.styles && item.styles[scope.row[item.prop]]) || ''">{{
                  scope.row[item.prop]
                }}</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column v-if="tableOpts" label="操作" :width="tableOptsWidth" :fixed="optsFixed">
            <template slot-scope="scope">
              <slot name="table-opts" :data="scope.row"></slot>
            </template>
          </el-table-column>
        </el-table>
      </slot>
    </div>
    <div class="pagination-box">
      <div class="pagination-info"></div>
      <div flex="main:justify cross:center">
        <div class="text-normal d2-mt-10 d2-mb-10">共{{ totalRecord }}条记录</div>
        <el-pagination
          v-if="!noPager"
          class="pagination"
          background
          layout="prev, pager, next"
          :page-count="totalPage"
          :current-page="pageNum"
          @current-change="changePage"
        ></el-pagination>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import FormItem from './components/form-item'
import { listToTable } from './components/excel.conf'

export default {
  props: {
    searchBtnText: {
      type: String,
      default: '搜索'
    },
    formProps: {
      type: Array,
      default: () => []
    },
    tableProps: Array,
    initSearchForm: Object,
    api: [String, Function],
    exportBtn: {
      type: String,
      default: ''
    },
    // 是否有操作列
    tableOpts: {
      type: [Boolean, String],
      default: false
    },
    optsFixed: {
      type: [Boolean, String],
    },
    // 操作栏宽度
    tableOptsWidth: [String, Number],
    mockData: [Boolean, String],
    // 是否有重置按钮
    btnReset: {
      type: Boolean,
      default: false
    },
    noSearch: {
      type: Boolean,
      default: false
    },
    btnDefine: {
      default: false,
      name: String,
      func: Function
    },
    noSerialNumber: {
      type: Boolean,
      default: false
    },
    // 是否查询或翻页时改变路由参数
    routeChange: {
      type: Boolean,
      default: false
    },
    // 是否有展开行
    tableExpand: Boolean,
    pageSize: {
      type: [Number],
      default: 10
    },
    // 表格数据转换
    tableFormatter: {
      type: Function
    },
    noPager: {
      type: Boolean
    }
  },
  components: {
    FormItem
  },
  data() {
    const args = {}
    let initSearchForm = this.initSearchForm || null
    if (!initSearchForm) {
      initSearchForm = {}
      this.formProps && this.formProps.forEach(item => {
        initSearchForm[item.model] = item.initValue || ''
        if (item.type == 'dateRange' || item.type == 'ageRange') {
          if (item.initValue && item.initValue.length > 1) {
            initSearchForm[item.modelStart] = item.initValue[0]
            initSearchForm[item.modelEnd] = item.initValue[1]
          }
        }
      })
    }

    return {
      // 页面数据
      // 查询表单数据
      searchForm: { ...initSearchForm },
      resetSearchForm: { ...initSearchForm },
      // 查询参数
      args,
      // 表格参数
      tableLoading: false,
      tableData: [],
      // 分页
      pageNum: 1,
      totalPage: 1,
      totalRecord: 0
    }
  },
  mounted() {
    this.searchData()
  },
  methods: {
    handleFormChange(name, model) {
      this.searchForm[name] = model
    },

    // 查询分页数据
    searchData() {
      this.args = {}
      for (let i in this.searchForm) {
        if (this.searchForm[i] !== '') {
          if (this.searchForm[i] instanceof Array === false) {
            this.args[i] = this.searchForm[i]
          }
        }
      }
      this.pageNum = 1
      this.getList()
    },

    // 重置表单条件
    resetForm() {
      this.searchForm = { ...this.resetSearchForm }
    },

    // 翻页查询
    changePage(pageNum) {
      if (this.routeChange) {
        this.$router.push({
          query: {
            pageNum,
            ...this.args
          }
        })
      } else {
        this.pageNum = pageNum
        this.getList()
      }
    },

    getSearchQuery() {
      const requestData = {
        ...this.args
      }
      // 解决formmater的数据
      this.formProps && this.formProps.forEach(item => {
        if (item.type === 'dateRange' && item.formatter === 'timestamp') {
          // 一些需要传时间戳的参数
          if (requestData[item.modelStart]) {
            requestData[item.modelStart] = this.getStartOfDay(requestData[item.modelStart])
          }
          if (requestData[item.modelEnd]) {
            requestData[item.modelEnd] = this.getEndOfDay(requestData[item.modelEnd])
          }
        }
      })

      return requestData
    },

    // 获取列表分页数据
    async getList() {
      if (this.mockData) {
        this.mockDataList()
        return
      }
      if (!this.api) {
        console.warn('初始化组件需要设置 api 为函数')
        return false
      }
      this.tableLoading = true

      let requestFunc = null
      if (typeof this.api === 'function') {
        requestFunc = this.api
      }

      if (!requestFunc) {
        console.warn('初始化组件需要设置 api 为函数')
        return false
      }

      const requestData = this.getSearchQuery()
      const res = await requestFunc({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...requestData
      })
      this.tableLoading = false
      this.totalRecord = res.total
      this.totalPage = Math.ceil(res.total / this.pageSize)
      if (this.tableFormatter && typeof this.tableFormatter == 'function') {
        this.tableData = this.tableFormatter(res.rows)
      } else {
        this.tableData = res.rows
      }
    },

    // 模拟测试数据
    mockDataList() {
      // mock data
      const item = {}
      this.tableProps.forEach((prop, index) => {
        if (prop.formatter === 'datetime' || prop.formatter === 'date') {
          item[prop.prop] = Date.now() - Math.round(Math.random() * 10000)
        } else if (prop.formatter === 'currency') {
          item[prop.prop] = Math.round(Math.random() * 10000)
        } else if (prop.formatter === 'dataset') {
          const keys = Object.keys(prop.dataset)
          item[prop.prop] = keys[Math.floor(Math.random() * keys.length)]
        } else {
          item[prop.prop] = '数据' + index
        }
      })
      this.tableData = new Array(10).fill('0').map((it, index) => {
        return {
          id: 100 + index,
          ...item
        }
      })
    },

    // 导出excel
    async exportExcel() {
      let requestFunc = null
      if (typeof this.api === 'function') {
        requestFunc = this.api
      } else {
        console.warn('初始化组件需要设置 `api` 为函数')
        return false
      }
      let requestData = {
        ...this.args
      }

      // 解决formmater的数据
      this.formProps.forEach(item => {
        if (item.type === 'dateRange' && item.formatter === 'timestamp') {
          // 一些需要传时间戳的参数
          if (requestData[item.modelStart]) {
            requestData[item.modelStart] = this.getStartOfDay(requestData[item.modelStart])
          }
          if (requestData[item.modelEnd]) {
            requestData[item.modelEnd] = this.getEndOfDay(requestData[item.modelEnd])
          }
        }
      })

      const query = {
        ...requestData,
        pageSize: 9999,
        pageNum: 1
      }
      const exportColumns = this.tableProps

      if (!requestFunc) {
        return this.$message.warning('下载接口出错')
      }

      const loading = this.$loading({
        text: '文件下载中'
      })
      const res = await requestFunc(query)
      if (res.code == 200) {
        // 格式化导出的数据
        const data = listToTable(res.rows || [], exportColumns)
        this.$export.excel({
          columns: exportColumns,
          data,
          title: `${this.exportBtn}_${dayjs().format('YYYYMMDDHHmmss')}`,
          merges: []
        }).then(() => {
          this.$message.success('文件下载成功')
        }).catch(err => {
          console.log(err)
        })
      }

      loading.close()
    }
  }
}
</script>
<style lang="scss" scoped>
.common-list-page {
  min-height: 80vh;
}
</style>
