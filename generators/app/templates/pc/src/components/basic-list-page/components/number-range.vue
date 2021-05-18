<template>
  <div class="number-range">
    <el-input v-model.number="modelStart" :autofocus="autofocus" :style="styles" :required="required" :disabled="disabled" @change="handleChange" @keyup.enter.native="handleKeyEnter()"></el-input>
    —
    <el-input v-model.number="modelEnd" :autofocus="autofocus" :style="styles" :required="required" :disabled="disabled" @change="handleChange" @keyup.enter.native="handleKeyEnter()"></el-input>
  </div>
</template>

<script>
export default {
  name: 'number-range',
  props: ['value', 'immediate', 'styles', 'required', 'autofocus', 'append', 'disabled' ],
  data () {
    return {
      data: null,
      modelStart: null,
      modelEnd: null
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val && val.length) {
          this.modelStart = val[0] || null
          this.modelEnd = val[1] || null
        } else {
          this.modelStart = null
          this.modelEnd = null
        }

      }
    }
  },
  methods: {
    getValue() {
      return [ this.modelStart, this.modelEnd ]
    },
    handleInput(val) {
      if (this.immediate) {
        this.$emit('input', this.getValue())
      }
    },
    handleChange(val) {
      this.$emit('input', this.getValue())
      this.$emit('change', this.getValue())
    },
    handleKeyEnter () {
      this.$emit('keyenter', this.getValue())
    },
  }
}
</script>

<style lang="scss" scoped>
.number-range {
  display: inline-block;
}
</style>
