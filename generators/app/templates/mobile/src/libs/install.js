import dayjs from 'dayjs'
import util from '@/libs/util'
import {
  Field,
  Form,
  Cell,
  CellGroup,
  Stepper,
  Button,
  Toast,
  Dialog,
  Loading,
  Popup,
  Picker,
  NavBar,
  Tab,
  Tabs,
  List,
  Icon,
  ImagePreview,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  DatetimePicker,
  Steps,
  Step,
  Skeleton,
  Tag,
  Collapse,
  CollapseItem,
  NumberKeyboard,
  Uploader,
  Sticky,
  Image,
  Overlay
} from 'vant'

// 使用本地字体文件
import 'vant/lib/icon/local.css'

import imageUploader from '@/components/image-uploader'

// 挂载api
import * as $api from '@/api'

export default {
  install(Vue, options) {
    // vant ui
    Vue.use(Field).use(Cell).use(CellGroup).use(Button).use(Toast).use(Dialog).use(Loading).use(Form)
    Vue.use(Popup).use(Picker).use(NavBar).use(Tab).use(Tabs).use(List).use(Icon).use(ImagePreview)
    Vue.use(RadioGroup).use(Radio).use(Checkbox).use(CheckboxGroup).use(DatetimePicker).use(Steps).use(Step)
    Vue.use(Skeleton).use(Tag).use(NumberKeyboard)
    Vue.use(Collapse).use(Stepper).use(Sticky)
    Vue.use(CollapseItem).use(Uploader).use(Image).use(Overlay)

    // 一些环境变量定义
    Vue.config.productionTip = false
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.BASE_URL
    // 当前版本
    Vue.prototype.$version = process.env.VUE_APP_VERSION
    // 构建时间
    Vue.prototype.$buildTime = process.env.VUE_APP_BUILD_TIME
    console.log('BuildTime', process.env.VUE_APP_BUILD_TIME)
    // 默认LOGO
    Vue.prototype.$defaultLogo = `${process.env.BASE_URL}img/icons/apple-touch-icon-60x60.png`
    Vue.prototype.$defaultImg = `${process.env.BASE_URL}img/no_pic.png`

    Vue.prototype.getImgUrl = util.getImgUrl
    Vue.prototype.encryptIdNo = util.encryptIdNo

    // 挂载api
    Vue.prototype.$api = $api

    Vue.prototype.dateformat = util.dateFormat
    Vue.prototype.currency = util.currency

    // 统一图片上传方法
    Vue.prototype.uploadImage = function (file) {
      return new Promise(async (resolve, reject) => {
        const formData = new FormData()
        formData.append('image', file)
        const res = await $api.uploadImage(formData)
        if (res.success) {
          resolve(res.data)
        } else {
          reject(res.msg || '上传图片失败')
        }
      })
    }

    // 文件上传至OSS地址
    Vue.prototype.uploadOss = async function (files) {
      const list = await imageUploader.upload(files, 'ywy', function (url) {
        console.log(url)
      })
      return list
    }

    // VUE过滤器设定
    // +=========================

    // 时间格式过滤器
    Vue.filter('dateformat', util.dateFormat)

    // 图片地址过滤，如果是http链接直接显示，如果是图片名，加上域名路径，如果是空则显示默认图片
    Vue.filter('imgUrl', util.getImgUrl)

    // 根据生日计算年龄
    Vue.filter('age', (value) => {
      if (!value) {
        return ''
      }

      return dayjs().year() - dayjs(value).year()
    })

    // 货币转换（分转换为元）
    Vue.filter('currency', util.currency)

    // 身份证脱敏
    Vue.filter('encryptIdNo', util.encryptIdNo)

    // 银行卡号
    Vue.filter('encryptBankNo', (val) => {
      if (!val) {
        return ''
      }
      const regex = /^\d+(\d{4})$/
      const pass = new Array(val.length - 4).fill('*').join('')
      if (regex.test(val)) {
        // 每4位加个空格
        val = val.replace(regex, pass + '$1').replace(/(.{4})/g, '$1 ')
      }
      return val
    })

    Vue.filter('last', (val, length = 4) => {
      if (!val || val.length <= length) {
        return val
      }
      let res = val.toString()
      return res.substring(res.length - length)
    })
  }
}
