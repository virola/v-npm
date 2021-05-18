import util from '@/libs/util'

/**
 * 导出excel/下载文件方法
 * @param {String} url 接口URL
 * @param {Object} query 参数query
 */
const download = (url, query) => {
  window.open(getQueryUrl(url, query))
}

export const getQueryUrl = (url, query) => {
  const token = util.cookies.get('token')
  // 兼容一下
  let queryStr = ''
  if (query) {
    // 兼容一下本来就是string类型的时候
    if (typeof query === 'string') {
      queryStr = query
    } else {
      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          const element = query[key]
          if (element) {
            queryStr += '&' + key + '=' + encodeURIComponent(element)
          }
        }
      }
    }
    if (url.indexOf('/') == 0) {
      url = url.substring(1)
    }
  }
  return `${VUE_APP_API}/${url}?${queryStr}` + (token ? `&access_token=${token}` : '')
}

/**
 * 输出实际接口地址
 * @param {String} value 接口地址
 */
export const getBaseUrl = value => {
  const token = util.cookies.get('token')
  let tokenStr = `access_token=${token}`
  if (value.indexOf('?') > -1) {
    tokenStr = '&' + tokenStr
  } else {
    tokenStr = '?' + tokenStr
  }
  return `${VUE_APP_API}${value}${tokenStr}`
}

export default download
