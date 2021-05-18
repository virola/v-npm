import store from '@/store'
import axios from 'axios'
import { Message, Loading } from 'element-ui'
import util from '@/libs/util'


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
  }
}


// 记录和显示错误
function errorLog (error) {
  // 添加到日志
  store.dispatch('d2admin/log/push', {
    message: '数据请求异常',
    type: 'danger',
    meta: {
      error
    }
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
    // 显示提示
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
  }

}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: window.VUE_APP_API,
  timeout: 60 * 1000 // 请求超时时间
})

// loading实例
const loadingInstance = {
  // 当前ajax请求数
  connection: 0,
  // ui loading实例
  instance: null
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    const token = util.cookies.get('token')
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    if (token) {
      config.headers['Authorization'] = token
    }

    // ajax loading统一处理
    if (config.method.toLowerCase() !== 'get') {
      loadingInstance.instance = Loading.service({
        lock: true,
        text: '正在请求数据',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.6)'
      })
      loadingInstance.connection++
      config._showLoading = true
    }

    // IE浏览器请求缓存问题
    if (util.isBrowserIE()) {
      if (config.params) {
        config.params._t = Date.now()
      } else {
        config.params = {
          _t: Date.now()
        }
      }
    }

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
        loadingInstance.instance.close()
      }
    }
    validateStatus(response)
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 这个状态码是和后端约定的
    const { code } = dataAxios
    // 根据 errorCode 进行判断
    if (code === undefined) {
      // 如果没有 success 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
      return dataAxios
    } else {
      // 有 errorCode 代表这是一个后端接口 可以进行进一步的判断
      if (code == 200) {
        return dataAxios
      } else {
        if (code == '401') {
          // 令牌失效
          store.dispatch('d2admin/account/logout')
          Message({
            message: '登录失效，请重新登录系统',
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
        } else {
          // // 显示提示
          Message({
            message: dataAxios.msg,
            type: 'warning',
            duration: 5 * 1000,
            showClose: true
          })
        }

        return dataAxios
      }
    }
  },
  error => {
    if (error.response) {
      validateStatus(error.response)
    } else if (error.request) {
      Message({
        message: '网络请求错误',
        type: 'error',
        showClose: true
      })
    } else {
      console.log(error)
      Message({
        message: '未知错误',
        type: 'error',
        showClose: true
      })
    }

    // loading处理
    loadingInstance.connection--
    if (loadingInstance.connection <= 0) {
      loadingInstance.connection = 0
      loadingInstance.instance && loadingInstance.instance.close()
    }
    // errorLog(error)
    return {
      data: {}
    }
  }
)

export default service
