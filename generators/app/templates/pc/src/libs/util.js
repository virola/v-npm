import dayjs from 'dayjs'
import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'

const util = {
  cookies,
  db,
  log
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function(titleText) {
  const processTitle = window.VUE_APP_NAME || '院外延续护理云平台'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function(url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val
}

/**
 * 获取时间段的时间对象
 * @param {String} type 时间类型，可选值有：
 *  today / yesterday / week 本周 / lastWeek 上周 / month 本月 / lastMonth 上月 / year 本年
 *
 * 注意： 输出的数组对象是 dayjs 对象，需要手动转换成日期对象，使用 toDate() 方法
 */
util.getTimeDistance = type => {
  const now = new Date()
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)

  const oneDay = 1000 * 60 * 60 * 24
  const yesterday = now.getTime() - oneDay

  if (type === 'today') {
    return [dayjs(now), dayjs(now.getTime() + (oneDay - 1000))]
  }

  if (type === 'yesterday') {
    return [dayjs(yesterday), dayjs(now.getTime() - 1000)]
  }

  // 本周
  if (type === 'week' || type === 'lastWeek') {
    let day = now.getDay()

    if (day === 0) {
      day = 6
    } else {
      day -= 1
    }

    let beginTime = now.getTime() - day * oneDay

    // 上周，往前推7天
    if (type === 'lastWeek') {
      beginTime -= 7 * oneDay
    }

    return [dayjs(beginTime), dayjs(beginTime + (7 * oneDay - 1000))]
  }

  //近7天
  if (type === 'last7day') {
    let beginTime = now.getTime() - 7 * oneDay
    return [dayjs(beginTime), dayjs(now.getTime() - 1000)]
  }

  //近15天
  if (type === 'last15day') {
    let beginTime = now.getTime() - 15 * oneDay
    return [dayjs(beginTime), dayjs(now.getTime() - 1000)]
  }

  //近30天
  if (type === 'last30day') {
    let beginTime = now.getTime() - 30 * oneDay
    return [dayjs(beginTime), dayjs(now.getTime() - 1000)]
  }

  // 本月
  if (type === 'month') {
    const year = now.getFullYear()
    const month = now.getMonth()
    const nextDate = dayjs(now).add(1, 'months')
    const nextYear = nextDate.year()
    const nextMonth = nextDate.month()

    return [dayjs(`${year}-${fixedZero(month + 1)}-01 00:00:00`), dayjs(dayjs(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)]
  }

  // 上月
  if (type === 'lastMonth') {
    const lastDate = dayjs().add(-1, 'months')
    const year = lastDate.year()
    const month = lastDate.month()
    const nextYear = now.getFullYear()
    const nextMonth = now.getMonth()

    return [dayjs(`${year}-${fixedZero(month + 1)}-01 00:00:00`), dayjs(dayjs(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)]
  }

  const year = now.getFullYear()
  return [dayjs(`${year}-01-01 00:00:00`), dayjs(`${year}-12-31 23:59:59`)]
}

/**
* 身份证号脱敏
* @param {*} id
*/
const encryptIdNo = (id) => {
  if (!id || id.length < 8) {
    return id
  }
  const regex = /^(\d{4})\d+(\d{4}|\d{3}[Xx])$/
  const pass = new Array(id.length - 8).fill('*').join('')
  if (regex.test(id)) {
    id = id.replace(regex, '$1' + pass + '$2')
  }
  return id
}

util.encryptIdNo = encryptIdNo


/**
 * 判断浏览器是否IE浏览器
 *
 * @returns {Boolean}
 */
 util.isBrowserIE = function () {
  const userAgent = window.navigator.userAgent;
  if (userAgent.indexOf('NET') != -1 && userAgent.indexOf('rv') != -1) {
    return true
  }
  return false
}

/**
 * 腾讯地图转百度地图坐标
 */
util.qqMap2BMap = (lng, lat) => {
  const xPi = (3.14159265358979324 * 3000.0) / 180.0
  const x = lng
  const y = lat
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xPi)
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xPi)
  const lngs = z * Math.cos(theta) + 0.0065
  const lats = z * Math.sin(theta) + 0.006
  return {
    lng: lngs,
    lat: lats
  }
}

/**
 * 补全图片地址，基于OSS域名
 */
util.getImgUrl = (value, defineUrl = '') => {
  let result = ''
  if (!value || value === 'null' || value === 'undefined') {
    result = defineUrl
  } else {
    if (value.toString().indexOf('http') === 0) {
      result = value
    } else {
      result = process.env.VUE_APP_IMG_BASE + '/' + value
    }
  }
  return result
}

/**
 * 地域编码
 * @param {*} value
 * @param {*} length
 */
util.fixLocationCode = (value, length = 15) => {
  if (!value) {
    return ''
  }
  if (value.toString().length && value.toString().length < 15) {
    return value + Array(length - value.toString().length).fill(0).join('')
  }
  return value
}

/**
 * 字符截断
 * @param {String} value
 * @param {Number} length
 * @returns {String}
 */
util.getStrLength = function(value, length = 0) {
  if (value && length && value.length > length) {
    return `${value.substring(0, length)}...`
  }
  return value
}

export default util
