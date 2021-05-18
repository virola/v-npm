<template>
  <el-input :size="size" class="cent-input" v-model="data" :maxlength="maxlength" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" @input="handleInput" @change="handleChange">
    <slot name="prefix" slot="prefix"></slot>
    <slot name="suffix" slot="suffix"></slot>
    <slot name="prepend" slot="prepend"></slot>
    <slot name="append" slot="append"></slot>
  </el-input>
</template>

<script>
/**
 * 以分为单位的金额转换输入框，
 * 即： 显示以元为单位，输入和输出以分为单位
 */
export default {
  name: 'cent-input',
  props: [ 'value', 'placeholder', 'disabled', 'readonly', 'immediate', 'size', 'maxlength'],
  data () {
    return {
      data: null
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        // console.log(val)
        if (val != null) {
          this.data = (val / 100).toFixed(2)
        } else {
          this.data = ''
        }

      }
    }
  },
  methods: {
    getValue() {
      return parseInt(this.data * 10 * 10)
    },
    handleInput(val) {
      if (this.immediate) {
        this.$emit('input', this.getValue())
      }
    },
    handleChange(val) {
      this.$emit('input', this.getValue())
      this.$emit('change', this.getValue())
    }
  }
}
</script>

<style lang="scss" scoped>
// .cent-input {
// }
</style>
