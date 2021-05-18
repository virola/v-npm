import axios from 'axios'
import { Loading } from 'element-ui'
import store from '@/store'
import $api from '@/api'

function getSuffix(filename) {
  let suffix = ''
  if (filename) {
    let pos = filename.lastIndexOf('.')
    if (pos != -1) {
      suffix = filename.substring(pos)
    }
  }
  return suffix
}

//获取Oss上传policy
function getOssPolicy(dir) {
  return new Promise((resolve, reject) => {
    $api.getOssPolicy({
      dir,
    }).then(function(res) {
      resolve(res)
    })
    .catch(err => {
      reject(err)
    })
  })
}

/**
 * 设置请求参数，同时处理图片压缩
 * @param {Object} params OSS上传参数
 * @param {*} file 上传文件
 */
function doData(params, file) {
  //图片压缩处理
  return new Promise((resolve, reject) => {
    let formData = new FormData()
    let timestamp = new Date().getTime()
    let suffix = getSuffix(file.name).toLowerCase()
    let random = (Math.random() * 100000000).toFixed(0)
    let gObjectName = timestamp + random + suffix

    // 文件名字，可设置路径
    formData.append('key', params.dir + '/' + gObjectName)
    // policy规定了请求的表单域的合法性
    formData.append('policy', params.policy)
    // Bucket 拥有者的Access Key Id
    formData.append('OSSAccessKeyId', params.accessid)
    // 让服务端返回200,不然，默认会返回204
    formData.append('success_action_status', '200')
    // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
    //formData.append('callback', params.callback);
    formData.append('signature', params.signature)
    // 需要上传的文件filer
    formData.append('Filename', params.dir + '/' + gObjectName)
    formData.append('name', gObjectName)

    formData.append('file', file, gObjectName)
    resolve(formData)
  })
}

/**
 * 开始上传
 * @param {String} url 上传oss的图片名（即地址）
 * @param {FormData} formData 上传的参数
 */
function doUpLoad(url, formData) {
  return axios({
    url: url,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * OSS图片上传
 * @param {Array} files 要上传的文件
 * @param {String} dir 要上传的目录
 * @param {Function} callback(ossFileName, fileName) 每个文件上传成功后回调，参数为 (oss文件名, 原文件名)
 */
const upload = async (files, dir, callback) => {
  const succFiles = []
  const resp = await getOssPolicy(`${process.env.VUE_APP_IMG_DIR || ''}${dir}`)
  if (resp.code == 200) {
    const params = resp.data
    const instance = Loading.service({
      lock: true,
      text: '正在上传图片',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.6)'
    })

    for (let i = 0; i < files.length; i++) {
      let formData = await doData(params, files[i])
      let ossResp = await doUpLoad(params.host, formData)
      if (ossResp && ossResp.status == '200') {
        console.log(ossResp.status)
        // 上传成功
        succFiles.push(formData.get('key'))
        callback(formData.get('key'), files[i].name)
      }
    }

    instance.close()
  } else {
    // 令牌失效，重新登录
    if (resp.errorCode == '1003') {
      store.dispatch('d2admin/account/logout')
    }
    console.log('获取Oss上传policy不成功！')
  }
  return succFiles
}

/**
 *  Bucket名称：goalnurse
 *
 *  Bucket 域名：goalnurse.oss-cn-shenzhen.aliyuncs.com
 *
 * 存放目录分类
  - 患者检查图片和治疗图片：hospital
  - 宣教的导图、专家头像：  education
  - 项目表 科室封面图：     project
  - 滚动BANNER图：         banner
  - 认证注册图：            register / authentication
  - 上门护理图：            nurse
  - 护理图片图：            education
  - 问卷相关的：           questionnaire
  - 课题库：               topic
  - 聊天互动    interaction
  - 爱心商城、爱心公益    heart
  - 护理图谱             knowledge
  - 语音                voice
  - 视频                video(小程序--操作视频）
  - 头像                 user
*/
export default {
  upload
}
