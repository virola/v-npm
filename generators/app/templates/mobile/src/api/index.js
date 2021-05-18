import ajax from '@/libs/axios'
import qs from 'qs'

/**
 * 登录
 * @param {*} params
 */
export const login = params => ajax({
  url: '/login',
  method: 'post',
  params
})

/**
 * 根据token获取当前登录用户信息
 */
export const getUserInfo = () => ajax({
  url: '/getLoginUserInfo'
})

/**
 * 图片上传
 * @param {*} data
 * @returns url
 */
export const uploadImage = data => ajax({
  url: '/common/uploadImage',
  method: 'post',
  data
})

/**
 * 阿里云视频流处理，获取视频上传policy
 * @returns
 */
export const getVideoUploadAuth = () => ajax({
  url: '/common/getVideoPolicy'
})

/**
 * 首页数据接口
 * @returns
 */
export const getIndexData = () => ajax({
  url: '/h5_get_index_data'
})

/**
 * 提交提现
 * @param {*} data
 * @returns
 */
export const submitWithdraw = data => ajax({
  url: '/transactionDetails/withdrawal',
  method: 'post',
  params: data
})

/**
 * 活动列表
 * @param {*} params
 * @returns
 */
export const getActList = params => ajax({
  url: '/act/list',
  params
})

/**
 * 添加活动
 * @param {*} data
 * @returns
 */
export const addActInfo = data => ajax({
  url: '/act/add',
  method: 'post',
  data
})

/**
 * 活动详情
 * @param {*} id
 * @returns
 */
export const getActInfo = id => ajax({
  url: '/act/info',
  params: { id }
})
