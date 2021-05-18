<template>
  <div>
    <van-nav-bar
      fixed
      v-show="showTopBar"
      :title="navTitle"
      left-text=""
      right-text=""
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div :class="{'app-nav-p-top': showTopBar}">
      <transition :name="transitionActive ? 'fade-transverse' : ''">
        <div>
          <keep-alive>
            <!-- 需要缓存的视图组件 -->
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <!-- 不需要缓存的视图组件 -->
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </transition>
    </div>

    <!-- <div class="app-nav-bottom" v-show="showNav">
      <div class="app-nav-item" :class="{'app-nav-item-active': navActive(item)}" v-for="(item, index) in navs" :key="index" @click="handleNavClick(item)">
        <div class="app-nav-icon">
          <img :src="`${$baseUrl}icon/${navActive(item) ? item.iconActive : item.icon}`" class="app-nav-icon-img">
        </div>
        <span class="app-nav-text">{{item.text}}</span>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'nav-layout',
  data () {
    return {
      // 开启动画显示
      transitionActive: false,
      navs: [
        {
          icon: 'a.png',
          iconActive: 'a_on.png',
          text: '首页',
          url: '/home'
        },
        {
          icon: 'd.png',
          iconActive: 'd_on.png',
          text: '我的',
          url: '/mine'
        }
      ]
    }
  },
  computed: {
    showTopBar () {
      return this.$store.state.app.showNav && !this.$route.meta.showNav
    },
    showNav () {
      return this.$store.state.app.showNav && this.$route.meta.showNav
    },
    navTitle () {
      return this.$route.meta.title
    }
  },
  methods: {
    handleNavClick (nav) {
      this.$router.push(nav.url)
    },
    navActive(nav) {
      return this.$route.path == nav.url
    },
    // 顶部导航条
    onClickLeft () {
      this.$router.back()
    },
    onClickRight () {}
  }
}
</script>

<style lang="less" scoped>

</style>
