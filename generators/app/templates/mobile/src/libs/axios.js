import axios from 'axios'
import { Toast } from 'vant'
import db from '@/libs/db'
import store from '@/store'

const baseURL = process.env.VUE_APP_API

/**
 * 验证返回状态码
 * @param {*} response 响应头
 */
function validateStatus(response) {
  switch (response.status) {
    case 400: response.message = '请求参数错误'; break
    case 401: response.message = '未授权，请登录'; break
    case 403: response.message = '拒绝访问'; break
    case 404: response.message = `请求地址出错: ${response.config.url}`; break
    case 408: response.message = '请求超时'; break
    case 500: response.message = '服务器内部错误'; break
    case 501: response.message = '服务未实现'; break
    case 502: response.message = '网关错误'; break
    case 503: response.message = '服务不可用'; break
    case 504: response.message = '网关超时'; break
    case 505: response.message = 'HTTP版本不受支持'; break
    default: break
  }
  if (response.status < 200 || response.status >= 300) {
    errorLog(response)
    // if (db.get('from') == 'weapp' && window.wx) {
    //   // 在小程序里遇到服务器错误直接退出登录
    //   store.dispatch('app/logout')
    // }
  }
}

// 记录和显示错误
function errorLog (error) {
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    // console.log(error.message)
    console.log(error)
  }
  // 显示提示
  Toast.fail({
    message: error.message
  })
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL,
  // 请求超时时间
  timeout: 60 * 1000,
  // withCredentials: true
})

// loading实例
const loadingInstance = {
  // 当前ajax请求数
  connection: 0,
  // toast实例
  toast: null
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    const token = db.get('token')
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['access_token'] = token

    // ajax loading统一处理
    const tConfig = {
      duration: 0,
      message: '加载中...',
    }
    if (config.method.toLowerCase() !== 'get') {
      tConfig.forbidClick = true
    }
    loadingInstance.connection++
    if (!loadingInstance.toast) {
      loadingInstance.toast = Toast.loading(tConfig)
    }
    config._showLoading = true

    return config
  },
  error => {
    return {
      data: {},
      msg: error.message
    }
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // loading处理
    if (response.config._showLoading) {
      loadingInstance.connection--
      if (loadingInstance.connection <= 0) {
        loadingInstance.connection = 0
        loadingInstance.toast && loadingInstance.toast.clear()
        loadingInstance.toast = null
      }
    }
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // validateStatus(dataAxios)
    // 这个状态码是和后端约定的
    const { errorCode, success } = dataAxios
    if (success) {
      return dataAxios
    } else {
      if (errorCode == '1003') {
        // 令牌失效
        store.dispatch('app/logout')
      }
      Toast.fail({
        message: dataAxios.msg
      })

      return dataAxios
    }
  },
  error => {
    // loading处理
    loadingInstance.connection--
    if (loadingInstance.connection <= 0) {
      loadingInstance.connection = 0
      loadingInstance.toast && loadingInstance.toast.clear()
      loadingInstance.toast = null
    }
    if (error.response) {
      const data = error.response.data
      validateStatus(error.response)

      if (data && data.status > 0) {
        return {
          success: false,
          msg: data.message || data.msg,
          data: data
        }
      }
    } else if (error.request) {
      Toast.fail({
        message: '网络请求错误',
        duration: 5 * 1000
      })
    } else {
      console.log(error)
      Toast.fail({
        message: '未知错误',
        duration: 5 * 1000
      })
    }
    return {
      success: false,
      msg: '未知错误，请稍候再试',
      data: {}
    }
  }
)

// for test
// service.get('http://localhost:3000/error/502')

export default service
