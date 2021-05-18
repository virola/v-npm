import * as $api from '@/api'

/**
 * AliyunUpload 视频上传组件
 */
const videoUploader = {
  // 上传中
  isUploading: false,
  uploader: null
}

/**
 * 初始化一个视频上传控件。
 * @param {*} authInfo 接口返回的授权数据
 * @param {*} config 配置参数对象。 具体参数如下：
 * @param config.onProgress 上传时的处理函数
 * @param config.onDone 上传完成时的处理函数
 * @param config.onFail 上传失败时的处理函数
 * @param {*} setTarget 'videoId' / 'audioId'
 *
 * 返回 AliyunUpload.Vod 对象实例
 */
const init = (authInfo, config = {
  // 默认上传视频时刷新id，音频配置 audioId
  onProgress: (uploadInfo, totalSize, loadedPercent) => {},
  onDone: (uploadInfo) => {},
  onFail: (uploadInfo, code = '', message = '') => {
    console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
  }
}, setTarget = 'videoId') => {
  const uploader = new AliyunUpload.Vod({
    // 阿里帐号
    userId: '1631762351973668',
    // 文件上传失败
    'onUploadFailed' (uploadInfo, code, message) {
      config.onFail(uploadInfo, code, message)
    },
    // 单个文件上传完成
    'onUploadSucceed' (uploadInfo) {},
    // 文件上传进度
    'onUploadProgress' (uploadInfo, totalSize, loadedPercent) {
      config.onProgress(uploadInfo, totalSize, loadedPercent)
    },
    // STS临时账号会过期，过期时触发函数
    'onUploadTokenExpired' (uploadInfo) {
      console.log('onUploadTokenExpired')
    },
    onUploadCanceled (uploadInfo) {
      console.log('onUploadCanceled:file:' + uploadInfo.file.name)
    },
    // 开始上传
    'onUploadstarted' (uploadInfo) {
      if (!uploadInfo[setTarget]) {
        // 上传
        const targetId = authInfo[setTarget]
        // console.log(authInfo, setTarget, targetId)
        uploader.setUploadAuthAndAddress(uploadInfo, authInfo.uploadAuth, authInfo.uploadAddress, targetId)
      } else {
        //如果videoId有值，根据videoId刷新上传凭证
        //实际环境中调用点播的刷新上传凭证接口，获取凭证
        //https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
        //获取上传凭证后，调用setUploadAuthAndAddress
        uploader.setUploadAuthAndAddress(uploadInfo, authInfo.uploadAuth, authInfo.uploadAddress)
      }
    },
    // 全部文件上传结束
    'onUploadEnd' (uploadInfo) {
      config.onDone(uploadInfo)
    }

  })
  return uploader
}

/**
 * 获取视频上传凭证
 * @param {*} data
 */
const getAuth = (data) => {
  return $api.getVideoUploadAuth(data)
}

/**
 * 开始上传视频
 * @param {*} file
 * @param {*} config
 */
const start = (file, config) => {
  return new Promise(async (resolve, reject) => {
    videoUploader.isUploading = true
    const form = {
      title: file.name,
      fileName: file.name,
      description: '格尔护士护理视频'
    }
    const res = await getAuth(form)
    if (res.success) {
      const videoId = res.data.videoId
      const uploader = init(res.data, {
        onProgress: (info, totalSize, loadedPercent) => {
          // console.log(Math.floor(loadedPercent * 100))
          if (config.onProgress) {
            config.onProgress({ info, totalSize, loadedPercent })
          }
        },
        onDone: (info) => {
          resolve({
            info,
            form,
            videoId
          })
        }
      })
      uploader.addFile(file, null, null, null, '{"Vod":{"StorageLocation":"","UserData":{"IsShowWaterMark":"false","Priority":"7"}}}')
      uploader.startUpload()

      // 存起来？
      videoUploader.uploader = uploader
    } else {
      reject(res.msg)
    }
  })
}

videoUploader.getAuth = getAuth
videoUploader.init = init
videoUploader.start = start

export default videoUploader
