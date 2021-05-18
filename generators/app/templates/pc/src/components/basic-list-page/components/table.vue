<template>
  <el-table class="ui-table" v-loading="tableLoading" :data="tableData" stripe border>
    <el-table-column type="expand" v-if="tableExpand">
      <template slot-scope="props">
        <slot name="table-expand" :data="props.row"></slot>
      </template>
    </el-table-column>
    <el-table-column label="序号" width="50" v-if="!noSerialNumber">
      <template slot-scope="scope">
        {{ (pageNumber - 1) * pageSize + scope.$index + 1 }}
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
          <template v-if="item.formatter == 'currency'">
            <span>{{ scope.row[item.prop] | currency }}</span>
            <!-- <span v-else>免费</span> -->
          </template>
          <!-- 默认显示 -->
          <span v-if="!item.formatter" :class="(item.styles && item.styles[scope.row[item.prop]]) || ''">{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </template>
    <el-table-column v-if="tableOpts" label="操作" :width="tableOptsWidth" :fixed="optsFixed">
      <template slot-scope="scope">
        <slot name="table-opts" :data="scope.row"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  // [ 'tableLoading', 'tableData', 'tableExpand', 'tableProps', 'tableOptsWidth', 'optsFixed' ]
  props: {
    tableLoading: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableProps: {
      type: Array,
      default: () => []
    },
    tableExpand: {
      type: Boolean,
      default: false
    },
    tableOpts: {
      type: Boolean,
      default: false
    },
    tableOptsWidth: {
      type: Number
    },
    optsFixed: {
      type: Boolean,
      default: false
    },
    noSerialNumber: {
      type: Boolean,
      default: false
    },
    pageNumber: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
  }
}
</script>

<style lang="scss" scoped></style>
