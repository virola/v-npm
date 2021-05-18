<template>
  <div id="app">
    <router-view/>
    <lg-preview></lg-preview>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import '~@/assets/style/public-class.scss';
</style>
