import request from '@/plugin/axios'
import { getQueryUrl } from '@/plugin/download'
// import qs from 'query-string'

/**
 * 图形验证码地址
 * @param {*} params 需要前端生成唯一的 codeId
 */
export const getImgCode = (params) => {
  return getQueryUrl('/imageVerifiCode/getImageCode', params)
}

/**
 * 用户登录
 * @param {*} data
 */
export function AccountLogin (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

/**
 * 查登录信息
 * @returns
 */
export const getLoginInfo = () => {
  return request({
    url: '/getInfo'
  })
}

/**
 * 阿里云oss授权
 * @param {*} params
 * @returns
 */
export const getOssPolicy = params => {
  return request({
    url: '/system/information/getOssPolicy',
    params
  })
}
