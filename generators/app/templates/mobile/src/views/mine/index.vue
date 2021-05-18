<template>
  <div class="bg-f">
    <div class="user-card ss-p">
      <img :src="userInfo.weixinPictureUrl ? getImgUrl(userInfo.weixinPictureUrl) : `${$baseUrl}img/avatar.png`" class="user-avatar ss-mr-15">
      <div class="user-text">
        <div class="user-name ss-pb-10">{{userInfo.name}}</div>
        <div>{{userInfo.hospitalName}}</div>
      </div>
    </div>
    <div class="ss-mt">
      <van-cell is-link to="/setting">
        <div class="flex flex-l-c" slot="title">
          <span class="ss-ml-10">设置</span>
        </div>
      </van-cell>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // userInfo: {
      //   headImg: '',
      //   name: 'Virola'
      // }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.app.userInfo
    }
  }
}
</script>

<style lang="less" scoped>
.user-card {
  display: flex;
  align-items: center;
  padding: 20px;
}
.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.user-text {
  font-size: 13px;
}
.user-name {
  font-size: 18px;
  font-weight: bold;
}
.icon-mine {
  width: 25px;
  height: 25px;
}
.flex-l-c {
  align-items: center;
}
</style>
