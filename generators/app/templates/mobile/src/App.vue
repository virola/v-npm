<template>
  <div id="app" class="solid-maxwidth" :class="bodyClass">
    <router-view />
    <div class="app-loading" v-show="showLoading">
      <van-loading :color="color" />
      <span class="link">加载中</span>
    </div>
    <div class="mask" @click="hideTip" v-if="showGuideTip">
      <img class="share-tip">
    </div>
  </div>
</template>

<script>
// import dayjs from 'dayjs'
// import db from '@/libs/db'
// import util from '@/libs/util'

export default {
  name: 'App',
  data () {
    return {
      color: '#30d9bb',
      showGuideTip: false
    }
  },
  computed: {
    showLoading () {
      return this.$store.state['app/loading']
    },
    bodyClass() {
      return this.$route.meta.bodyClass || ''
    }
  },
  created () {
    // const appShowTip = parseInt(util.getURLQuery('showTip'))
    // const showTime = parseInt(db.get('showGuideTime'))
    // if (!appShowTip && showTime && dayjs(showTime).isAfter(dayjs().startOf('d'))) {
    //   this.showGuideTip = false
    // } else {
    //   this.showGuideTip = true
    // }
    // db.set('showGuideTime', Date.now())
  },
  methods: {
    hideTip() {
      this.showGuideTip = false
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/style/app.less';
</style>
