<template>
  <div class="ss-p">
    <van-button class="width-100" type="danger" plain @click="logout">退出登录</van-button>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    logout () {
      this.$store.dispatch('app/logout')
    }
  }
}
</script>

<style lang="less" scoped>

</style>