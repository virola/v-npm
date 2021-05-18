<template>
  <div class="app-empty">
    <img class="app-empty-img" :src="`${$baseUrl}img/nothing.png`">
    <p class="app-empty-text text-info">{{text}}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '暂无内容'
    }
  }
}
</script>

<style lang="less" scoped>
.app-empty {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.app-empty-img {
  width: 150px;
  height: 150px;
}
.app-empty-text {
  font-size: 15px;
}
</style>
