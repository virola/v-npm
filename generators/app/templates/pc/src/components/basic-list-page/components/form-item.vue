<template>
  <el-form-item
    size="small"
    v-if="param.type !== 'hr'"
    :label="param.label"
    :style="param.itemStyle"
    :rules="rules"
    :label-width="param.labelWidth"
    :prop="param.model"
  >
    <!-- select -->
    <el-select
      v-loading="dataloading"
      v-if="param.type == 'select'"
      v-model="model"
      :disabled="param.disabled"
      :style="param.styles"
      :filterable="param.filterable"
      @change="handleChange()"
    >
      <el-option
        v-for="(item, index) in param.datasource"
        :key="`${item.label}_${index}`"
        :label="item.label"
        :value="item.value !== undefined ? item.value : item.label"
      >
      </el-option>
    </el-select>
    <!-- multi-select -->
    <el-select
      v-loading="dataloading"
      v-if="param.type == 'multiselect'"
      v-model="model"
      :style="param.styles"
      multiple
      @change="handleChange()"
    >
      <el-option
        v-for="(item, index) in param.datasource"
        :key="`${item.label}_${index}`"
        :label="item.label"
        :value="item.value !== undefined ? item.value : item.label"
      >
      </el-option>
    </el-select>
    <!-- text -->
    <el-input
      v-if="!param.type || param.type == 'text'"
      v-model.lazy="model"
      :placeholder="param.placeholder || `请输入${param.label}`"
      :autofocus="param.autofocus"
      :style="param.styles"
      :required="param.required"
      :disabled="param.disabled"
      @change="handleChange()"
      @keyup.enter.native="handleKeyEnter()"
    >
      <template v-if="param.append" slot="append">{{ param.append }}</template>
    </el-input>
    <!-- textarea -->
    <el-input
      v-if="param.type == 'textarea'"
      v-model.lazy="model"
      :placeholder="param.placeholder"
      :style="param.styles"
      :required="param.required"
      type="textarea"
      :disabled="param.disabled"
      :autosize="{ minRows: 4, maxRows: 6 }"
      @change="handleChange()"
    ></el-input>
    <!-- radio -->
    <el-radio-group v-if="param.type == 'radio'" v-model="model" :style="param.styles" @change="handleChange()">
      <template v-for="(item, index) in param.datasource">
        <el-radio :key="`${item.label}_${index}`" :label="item.value ? item.value : item.label">{{ item.label }}</el-radio>
      </template>
      <template v-if="param.modelPlus">
        <el-radio label="其他">其他：</el-radio>
        <el-input v-model.lazy="modelOther" :disabled="model !== '其他'" style="width: 160px" @change="handleOtherChange"></el-input>
      </template>
    </el-radio-group>
    <!-- datepicker -->
    <el-date-picker
      v-if="param.type == 'date'"
      v-model="model"
      :style="param.styles"
      :required="param.required"
      :disabled="param.disabled"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="选择日期"
      @change="handleChange()"
    >
    </el-date-picker>
    <!-- dateRange -->
    <template v-if="param.type == 'dateRange'">
      <el-date-picker
        v-model="model"
        type="daterange"
        align="left"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :clearable="!param.clearOption"
        :editable="true"
        value-format="yyyy-MM-dd"
        @change="handleDateRangeChange()"
      ></el-date-picker>
      <span class="d2-ml shortcut-list" v-if="param.shortcuts">
        <el-button plain class="shortcut-item" v-for="(item, index) in param.shortcuts" :key="index" @click="changeShortCut(item)">{{
          shortcutsConfig[item].label
        }}</el-button>
      </span>
    </template>

    <!-- numberRange -->
    <template v-if="param.type === 'numberRange'">
      <number-range
        v-model="model"
        :autofocus="param.autofocus"
        :styles="param.styles"
        :required="param.required"
        :disabled="param.disabled"
        @change="handleNumberRangeChange"
      ></number-range>
    </template>

    <!-- append -->
    <slot name="append"></slot>
  </el-form-item>
</template>

<script>
import dayjs from 'dayjs'
import NumberRange from './number-range'

/**
 * 参数type类型有： select, multi-select, text, textarea, radio, datepicker, dateRange
 * 其中 select, multi-select, radio 需要 datasource (label, value)作为数据源
 */
export default {
  props: {
    param: Object,
    rules: Array,
    data: {}
  },
  components: {
    NumberRange
  },
  data() {
    return {
      dataloading: false,
      model: null,
      // 其他的值
      modelOther: null,
      // 数字范围
      modelStart: null,
      modelEnd: null,
      // 日期快捷方式
      shortcutsConfig: {
        today: {
          label: '今天',
          range: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
        },
        yesterday: {
          label: '昨天',
          range: [
            dayjs()
              .add(-1, 'd')
              .format('YYYY-MM-DD'),
            dayjs()
              .add(-1, 'd')
              .format('YYYY-MM-DD')
          ]
        },
        '7days': {
          label: '近7天',
          range: [
            dayjs()
              .add(-7, 'd')
              .format('YYYY-MM-DD'),
            dayjs()
              .add(-1, 'd')
              .format('YYYY-MM-DD')
          ]
        },
        '30days': {
          label: '近30天',
          range: [
            dayjs()
              .add(-30, 'd')
              .format('YYYY-MM-DD'),
            dayjs()
              .add(-1, 'd')
              .format('YYYY-MM-DD')
          ]
        }
      },
    }
  },
  created() {
    this.initData()
  },
  watch: {
    data: 'initData'
  },
  methods: {
    handleKeyEnter() {
      this.$emit('keyenter', this.param.model, this.model)
    },
    // 普通的model change
    handleChange() {
      this.$emit('change', this.param.model, this.model)
    },
    handleOtherChange() {
      this.$emit('otherChange', this.param.model, this.modelOther)
    },
    // daterange控件change事件
    handleDateRangeChange() {
      this.$emit('change', this.param.model, this.model)
      if (this.param.modelStart && this.param.modelEnd) {
        if (this.model) {
          this.$emit('change', this.param.modelStart, this.model[0])
          this.$emit('change', this.param.modelEnd, this.model[1])
        } else {
          this.$emit('change', this.param.modelStart, '')
          this.$emit('change', this.param.modelEnd, '')
        }
      } else {
        // this.$emit('change', this.param.model, this.model)
      }
    },
    // numberRange控件的change事件
    handleNumberRangeChange(vals) {
      this.modelStart = vals[0] || null
      this.modelEnd = vals[1] || null
      this.$emit('change', this.param.model, this.model)
      if (this.param.modelStart || this.param.modelEnd) {
        this.$emit('change', this.param.modelStart, this.modelStart)
        this.$emit('change', this.param.modelEnd, this.modelEnd)
      }
    },
    async initData() {
      this.model = this.data
      if (this.param.fix === 'number' && this.data) {
        this.model = +this.data
      }
      // 过滤掉datasource中的"其他"
      const datasource = this.param.datasource
      if (Object.prototype.toString.call(datasource) === '[object Array]' && this.param.modelPlus) {
        this.param.datasource = datasource.filter(item => {
          return item.label !== '其他'
        })
      } else if (typeof datasource == 'function') {
        this.dataloading = true
        this.param.datasource = await datasource()
        this.dataloading = false
      }
    },
    // 快捷方式切换
    changeShortCut(key) {
      const range = this.shortcutsConfig[key].range
      this.model = [...range]
      this.handleDateRangeChange()
    },
  }
}
</script>
