import dayjs from 'dayjs'
import util from '@/libs/util'

export default {
  async install(Vue, options) {
    const dateformat = function(value, formatString = 'YYYY-MM-DD HH:mm:ss') {
      if (!value) {
        return ''
      }
      return dayjs(value).format(formatString) // value可以是普通日期 2017-07-23
    }

    // 身份证脱敏
    Vue.filter('encryptIdNo', util.encryptIdNo)
    Vue.prototype.encryptIdNo = util.encryptIdNo

    // 时间格式过滤器
    Vue.filter('dateformat', dateformat)
    Vue.prototype.dateformat = dateformat

    // 根据生日计算年龄
    Vue.filter('age', value => {
      if (!value) {
        return ''
      }

      return dayjs().year() - dayjs(value).year()
    })

    // 货币转换（分转换为元）
    Vue.filter('currency', function(value, prefix = '¥') {
      value = +value || 0
      return prefix + (value / 100).toFixed(2)
    })

    // 数字千分位显示
    Vue.filter('numberFormat', (value = 0, float = 0) => {
      if (typeof value === 'string') {
        return value
      }
      let num = value.toFixed(float).toString()
      const regex = /(-?\d+)(\d{3})/

      while (regex.test(num)) {
        num = num.replace(regex, '$1,$2')
      }
      return num
    })

    // 手机号脱敏
    Vue.filter('mobileEncrypt', (value = '') => {
      if (!value) {
        return ''
      }
      let tel = value.toString()
      if (tel.length !== 11) {
        return ''
      }
      const regex = /(-?\d{3})\d{4}(\d{4})/
      if (regex.test(tel)) {
        tel = tel.replace(regex, '$1****$2')
      }
      return tel
    })

    /**
     * 通用表单检测
     */
    Vue.prototype.checkFormFields = function(form = {}, rules = []) {
      const fail = rules.some(rule => {
        const field = form[rule.prop]
        if (field == null || field === '') {
          this.$message({
            showClose: true,
            message: rule.msg,
            type: 'warning'
          })
          // 结果漏了哎
          return true
        }
        return false
      })
      return !fail
    }

    // 日期处理函数
    /**
     * 获取当日起始时间戳
     */
    Vue.prototype.getStartOfDay = function(datetime) {
      let date = new Date(datetime)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)

      return date.getTime()
    }

    /**
     * 获取当日终止时间戳
     */
    Vue.prototype.getEndOfDay = function(datetime) {
      let date = new Date(datetime)
      date.setHours(24)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)

      return date.getTime() - 1
    }

    // 打开新窗口
    Vue.prototype.$windowOpen = function(path) {
      const href = window.location.href.split('#')[0]
      const url = `${href}#${path}`
      window.open(url)
    }

    /**
     * 验证角色权限
     *
     * @param {Array} roles 要验证的角色列表
     * @return {Boolean} 是否有权限
     */
    Vue.prototype.checkRoles = function(roles) {
      const role = this.$store.state.d2admin.user.role
      if (roles && roles.length && roles.indexOf(role) > -1) {
        return true
      }
      return false
    }

    /**
     * 文字按长度截断
     */
    Vue.prototype.getStrLength = function(value, length = 0) {
      if (value && length && value.length > length) {
        return `${value.substring(0, length)}...`
      }
      return value
    }

    // 图片地址
    Vue.filter('getImgUrl', util.getImgUrl)
    Vue.prototype.getImgUrl = util.getImgUrl
  }
}
