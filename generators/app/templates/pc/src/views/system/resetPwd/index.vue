<template>
  <div class="page-password">
    <div class="page-password--layer">
      <div class="page-password--content" flex="dir:top main:justify cross:center box:justify">
        <div class="page-password--content-header" flex="main:justify cross:center">
          <h2>{{appName}}</h2>
          <router-link class="back-link" to="/login">返回首页</router-link>
        </div>
        <div class="main-box" flex="dir:top main:center cross:center">
          <el-card shadow="never">
            <h3 class="header">重置密码</h3>
            <div class="steps">
              <el-steps :active="activeStep" finish-status="success" align-center>
                <el-step title="通过手机号重置"></el-step>
                <el-step title="重置成功"></el-step>
              </el-steps>
            </div>

            <div class="form" v-if="activeStep === 0">
              <el-form ref="form" label-position="top" :rules="rulesTel" :model="form" size="default">
                <el-form-item prop="telephone">
                  <el-input type="tel" name="telephone" v-model="form.telephone" placeholder="手机号" maxlength="11" @blur="validate">
                    <i slot="prepend" class="fa fa-mobile" style="font-size: 20px"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="imageVerifiCode" v-if="codeId">
                  <el-input v-model="form.imageVerifiCode" name="p-code" placeholder="验证码" maxlength="4">
                    <i slot="prepend" class="fa fa-picture-o"></i>
                    <div class="code-img" slot="append" @click="getCodeId" style="width: 60px">
                      <img :src="imgCodeUrl">
                    </div>
                  </el-input>
                </el-form-item>
                <el-form-item prop="mcode">
                  <el-input type="mcode" name="mcode" v-model="form.mcode" placeholder="短信验证码" maxlength="8">
                    <i slot="prepend" class="fa fa-envelope-o"></i>
                    <el-button slot="append" @click="getSMSCode" :disabled="sentTime > 0">{{sentTime > 0 ? `${sentTime}s后重新获取` : '获取验证码'}}</el-button>
                  </el-input>
                </el-form-item>
                <el-form-item prop="newPwd">
                  <el-input type="password" v-model="form.newPwd" placeholder="请输入新的登录密码">
                    <i slot="prepend" class="fa fa-lock"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="newPwdConfirm">
                  <el-input type="password" v-model="form.newPwdConfirm" placeholder="请再次输入登录密码">
                    <i slot="prepend" class="fa fa-lock"></i>
                  </el-input>
                </el-form-item>
                <el-button size="default" @click="submit" type="primary" class="button-submit">下一步</el-button>
              </el-form>
            </div>
            <!-- <div class="form" v-if="activeStep === 1">
              <el-form ref="form" label-position="top" :rules="rulesPwd" :model="form" size="default">
                <el-form-item prop="newPwd">
                  <el-input type="password" v-model="form.newPwd" placeholder="请输入新的登录密码">
                    <i slot="prepend" class="fa fa-lock"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="newPwdConfirm">
                  <el-input type="password" v-model="form.newPwdConfirm" placeholder="请再次输入登录密码">
                    <i slot="prepend" class="fa fa-lock"></i>
                  </el-input>
                </el-form-item>
                <el-button size="default" @click="submit" type="primary" class="button-submit">下一步</el-button>
              </el-form>
            </div> -->
            <div class="form form-success" v-if="activeStep === 1">
              <div class="success-mark">
                <d2-icon class="mark" name="check-circle"></d2-icon>
              </div>
              <h3>密码重置成功</h3>
              <p>请妥善保管您的账户信息</p>
              <el-button class="relogin-btn" type="primary" plain @click="$router.push('/login')">重新登录</el-button>
            </div>
          </el-card>

        </div>

        <div class="page-password--content-footer">
          <p class="page-password--content-footer-copyright">
            湖南格尔智慧科技有限公司版权所有Copyright<d2-icon name="copyright"/>2014-2019 AII Right Reserved.
          </p>
          <p class="page-password--content-footer-options">
            温馨提示：请使用<a target="_blank" :href="chromeUrl">Google（谷歌）浏览器</a>打开
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import qs from 'query-string'
import { mapState } from 'vuex'
// import { SendSMSCode, ResetPwdByMobile, getImgCode } from '@/api/modules/system'

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.newPwdConfirm !== '') {
          this.$refs.form.validateField('newPwdConfirm')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      chromeUrl: 'http://web.bihuyihu.com/download/chrome32.zip',
      activeStep: 0,
      // 验证手机号表单
      form: {
        telephone: '',
        mcode: '',
        newPwd: '',
        newPwdConfirm: '',
        imageVerifiCode: ''
      },
      // 校验
      rulesTel: {
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        mcode: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' }
        ],
        newPwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPwdConfirm: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      sentTime: 0,
      // 图形验证码
      imgCodeUrl: '',
      codeId: ''
    }
  },
  computed: {
    ...mapState('d2admin', {
      appName: state => state.releases.appName
    })
  },
  mounted () {
    this.initChromeUrl()
  },
  methods: {
    initChromeUrl () {
      const agent = navigator.userAgent.toLowerCase()
      if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
        this.chromeUrl = 'http://web.bihuyihu.com/download/chrome64.zip'
      }
    },
    getCodeId () {
      this.codeId = Date.now() + '_' + Math.round(Math.random() * 1000)
      // this.imgCodeUrl = getImgCode({ codeId: this.codeId })
      // console.log(this.codeId)
    },

    // 验证手机号
    validate () {
      const tel = this.form.telephone
      if (tel && /1\d{10}/.test(tel)) {
        this.getCodeId()
      } else {
        this.$message.warning('请填写正确的手机号码')
      }
    },

    // 获取验证码
    async getSMSCode () {
      const tel = this.form.telephone
      if (tel && tel.toString().length === 11) {
        if (!this.form.imageVerifiCode) {
          return this.$message.warning('请填写图片验证码')
        }
        // const res = await SendSMSCode(`telephone=${tel}&imageVerifiCode=${this.form.imageVerifiCode}&codeId=${this.codeId}`)
        // if (res.success) {
        //   this.startCount()
        // } else {
        //   this.$message.warning(res.msg || '网络错误')
        //   this.getCodeId()
        // }
      } else {
        this.$message.warning('请填写正确的手机号码')
      }
    },

    startCount () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.sentTime = 60
      this.timerId = setInterval(() => {
        this.sentTime--
        if (this.sentTime === 0) {
          clearInterval(this.timerId)
        }
      }, 1000)
    },

    // 提交新密码
    submit () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const data = {
            telephone: this.form.telephone,
            verifiCode: this.form.mcode,
            newPassword: md5(this.form.newPwd.trim()).toUpperCase()
          }
          // const res = await ResetPwdByMobile(qs.stringify(data))
          // if (res.success) {
          //   this.activeStep = 1
          // } else {
          //   this.$message.warning(res.msg)
          // }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-password {
  // @extend %unable-select;
  $backgroundColor: #F0F2F5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-password--layer {
    @extend %full;
    overflow: auto;
  }
  .page-password--layer-area {
    overflow: hidden;
  }

  &--content {
    height: 100%;
    min-height: 500px;
  }
  &--content-header {
    padding: 1em 0;
    width: 90%;

    &-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
      span {
        color: $color-text-sub;
      }
    }
  }
  // footer
  &--content-footer {
    padding: 1em 0;
    &-options {
      padding: 0;
      margin: 0;
      margin-bottom: 10px;
      font-size: 12px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
    &-copyright {
      padding: 10px 0;
      margin: 0;
      font-size: 12px;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
  }

  .main-box {
    margin: 50px auto;
    height: auto;

    h3 {
      text-align: center;
      margin-bottom: 50px;
    }

    .form {
      width: 300px;
      margin: 30px auto;
    }
    .button-submit {
      width: 100%;
      margin-bottom: 30px;
    }

    .form-success {
      text-align: center;

      h3 {
        margin-bottom: 0;
      }

      .mark {
        color: $color-success;
        font-size: 100px;
      }
      .relogin-btn {
        width: 160px;
        margin-bottom: 50px;
      }
    }
  }

  .steps {
    width: 600px;
    max-width: 100%;
  }
  .back-link {
    color: $color-primary;
  }
}
</style>
