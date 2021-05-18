import dayjs from 'dayjs'
import ajax from '@/libs/axios'

/**
 * 导出module
 */
const util = {}

/**
 * 图片地址补全
 * ps. OSS处理参数 ?x-oss-process=image/resize,h_100,w_100
 */
util.getImgUrl = (value, defineUrl = '') => {
  let rsurl = ''
  if (!value || value === 'null' || value === 'undefined') {
    // 默认图片填充
    rsurl = defineUrl || `${process.env.BASE_URL}img/no_pic.png`
  } else {
    if (value.toString().indexOf('http') === 0) {
      rsurl = value
    } else {
      rsurl = process.env.VUE_APP_IMG_BASE + '/' + value
    }
  }
  return rsurl
}

util.getURLQuery = function (key) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == key) {
      return pair[1]
    }
  }
  return false
}

/**
 * 身份证号脱敏
 * @param {*} id
 */
const encryptIdNo = (id) => {
  if (!id || id.length < 8) {
    return id
  }
  const regex = /^(\d{4})\d+(\d{4})$/
  const pass = new Array(id.length - 8).fill('*').join('')
  if (regex.test(id)) {
    id = id.replace(regex, '$1' + pass + '$2')
  }
  return id
}

util.encryptIdNo = encryptIdNo

/**
 * 将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *
 * eg:
 * dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss.S') ==> 2006-07-02 08:09:04.423
 * dateFormat(new Date(), 'YYYY-MM-DD E HH:mm:ss') ==> 2009-03-10 二 20:09:04
 * dateFormat(new Date(), 'YYYY-MM-DD EE HH:mm:ss') ==> 2009-03-10 周二 08:09:04
 * dateFormat(new Date(), 'YYYY-MM-DD EEE HH:mm:ss') ==> 2009-03-10 星期二 08:09:04
 * dateFormat(new Date(), 'YYYY-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
 */
function dateFormat(datetime, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!datetime) {
    return ''
  }
  const tmpDate = dayjs(datetime).toDate()
  const o = {
    'M+': tmpDate.getMonth() + 1, //月份
    'D+': tmpDate.getDate(), //日
    'h+': tmpDate.getHours() % 12 == 0 ? 12 : tmpDate.getHours() % 12, //小时
    'H+': tmpDate.getHours(), //小时
    'm+': tmpDate.getMinutes(), //分
    's+': tmpDate.getSeconds(), //秒
    'q+': Math.floor((tmpDate.getMonth() + 3) / 3), //季度
    S: tmpDate.getMilliseconds() //毫秒
  }
  const week = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六'
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (tmpDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[tmpDate.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return fmt
}

util.dateFormat = dateFormat

util.validPhone = function (val) {
  if (!val) {
    return false
  }
  return /^1\d{10}$/.test(val)
}

/**
 * 金额格式化
 * @param {*} value
 * @param {*} prefix
 * @param {*} nums
 * @returns
 */
util.currency = function (value, prefix = '¥', nums = 2) {
  value = +value || 0
  return prefix + (value / 100).toFixed(nums)
}

// 判断微信浏览器
function isWeiXin() {
  const ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

// 缓存
let shareConfig = null
function setShareConfig(v) {
  shareConfig = v
}

/**
 * 微信分享
 * @param {*} title
 * @param {*} desc
 * @param {*} imgUrl
 * @param {*} path
 * @param {*} query
 */
util.weixinShare = async (title, desc, imgUrl, link) => {
  if (isWeiXin()) {
    let url = location.href.split('#')[0]
    if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
      if (!shareConfig) {
        setShareConfig(url)
      }
      url = shareConfig
    }
    await ajax
      .get('/patientUser/getShareMap', { params: { url } })
      .then((res) => {
        let data = res.data
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
          openTagList: ['wx-open-launch-weapp']
        })
        title = title || '这个院外护理平台很实用，能直接联系到护士，分享给你'
        desc = desc || '"壁虎健康"全国院外延续护理平台，你的随身护理专家！'
        imgUrl = imgUrl || 'https://image.bihuyihu.com/other/bihuyihu_logo.png'
        wx.ready(function () {
          wx.updateAppMessageShareData({
            title, // 分享标题
            desc, // 分享描述
            imgUrl, // 分享图标
            link
          })
          wx.updateTimelineShareData({
            title, // 分享标题
            imgUrl, // 分享图标
            link
          })
        })
      })
      .catch(() => {})
  } else {
    console.log('not weixin', {title, desc, imgUrl, link})
  }
}

export default util
