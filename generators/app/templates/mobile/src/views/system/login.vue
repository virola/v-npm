<template>
  <div class="ss-p-15">
    <div class="logo ss-m ss-text-center">
      <h2>系统登录</h2>
      <img class="logo-img" :src="`${$baseUrl}img/logo_text.png`">
    </div>
    <div class="login-form">
      <van-field
        v-model="form.userName"
        required
        clearable
        placeholder="请输入用户名"
      />

      <van-field
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        required
      />
      <div class="ss-mt login-btn">
        <van-button class="bold" block type="primary" @click="login">立即登录</van-button>
      </div>
    </div>

  </div>
</template>

<script>
import db from '@/libs/db'
import md5 from 'md5'

export default {
  name: 'login',
  data () {
    return {
      form: {
        userName: '',
        password: '',
      },
      // showType: '医院',
      showPicker: false,
      // columns: [ '护联体', '医院' ]
    }
  },
  mounted () {
    this.form.userName = db.get('login-userName')
    this.form.password = db.get('login-password')
    // this.showType = db.get('login-type')
    // 如果来自微信小程序内嵌
    if (db.get('from') == 'weapp' && window.wx) {
      this.$toast('已退出登录')
      wx.miniProgram.reLaunch({
        url: '/pages/login/login'
      })
    }
  },
  methods: {
    async login () {
      if (!this.form.userName) {
        return this.$toast('请输入登录名')
      }
      if (!this.form.password) {
        return this.$toast('请输入密码')
      }

      const form = {
        userName: this.form.userName,
        password: md5(this.form.password).toUpperCase(),
      }

      const res = await this.$api.login(form)
      if (res.success) {
        this.$toast('登录成功')
        // 更新用户信息
        this.$store.commit('app/setUserInfo', res.data)
        db.set('token', res.msg)

        // 保存用户名密码
        db.set('login-userName', this.form.userName)
        db.set('login-password', this.form.password)
        // db.set('login-type', this.showType)

        // 重定向对象不存在则返回顶层路径
        this.$router.replace(this.$route.query.redirect || '/')
      } else {
        this.$toast(res.msg)
      }
    },
  }
}
</script>

<style lang="less">
.login-form {
  .van-field {
    background: #f6f8ff;
    margin-bottom: 24px;
    padding: 10px 20px;
    border-radius: 4px;

    &::after {
      border: none;
    }
  }
}
</style>
<style lang="less" scoped>
.logo {
  h2 {
    font-size: 18px;
    margin-bottom: 66px;
    font-weight: 400;
  }
}
.logo-img {
  // width: 146px;
  height: 60px;
}
.login-form {
  margin: 60px 0 50px;
  padding: 0 15px;
}
.login-btn {
  margin-top: 50px;
}
</style>
