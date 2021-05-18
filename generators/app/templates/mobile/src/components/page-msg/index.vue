<template>
  <div class="app-msg">
    <img class="app-msg-img" :src="`${$baseUrl}img/${icon}.png`">
    <h2 class="app-msg-title">{{title}}</h2>
    <p class="app-msg-text">{{text}}</p>
    <div class="app-msg-btn" v-if="btnText">
      <div class="btn-inner">
        <van-button class="btn" type="primary" block @click="$emit('click')">{{btnText}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>
