<template>
  <div class="error-404">
    <h5 class="m-text-center">404...页面找不到了</h5>
    <p class="text-primary" @click="$router.back()">点击此处返回上一页</p>
  </div>
</template>

<script>
export default {

}
</script>
<style lang="less" scoped>
.error-404 {
  padding: 50px;
  text-align: center;
  font-size: 16px;

  h5 {
    font-size: 16px;
  }
}
</style>
