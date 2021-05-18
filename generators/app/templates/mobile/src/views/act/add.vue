<template>
  <div class="ss-pt-15">
    <div class="bg-f act-form">
      <van-field v-model="form.name" label="活动名称" maxlength="80" placeholder="请输入活动名称" />
      <van-field
        readonly
        clickable
        name="datetimePicker"
        :value="form.activityTime"
        label="活动时间"
        placeholder="点击选择时间"
        @click="showDatePicker = true"
      />
      <van-popup v-model="showDatePicker" position="bottom">
        <van-datetime-picker type="date" v-model="currentDate" @confirm="onConfirmDate" @cancel="showDatePicker = false" />
      </van-popup>
      <!-- 活动类型 -->
      <van-field
        readonly
        clickable
        name="picker"
        :value="typeMap[form.type]"
        label="活动类型"
        placeholder="点击选择类型"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker show-toolbar :columns="typeOptions.map((item) => item.label)" @confirm="onConfirmType" @cancel="showPicker = false" />
      </van-popup>
      <van-field v-model="form.address" label="活动地点" maxlength="80" placeholder="请输入活动地点" />
      <van-field
        v-model="form.descr"
        label="活动简介"
        rows="2"
        autosize
        type="textarea"
        maxlength="1000"
        placeholder="请输入活动简介"
        show-word-limit
      />
      <van-field name="uploader" label="签到表">
        <template #input>
          <div class="full-width">
            <van-uploader :before-read="beforeRead" multiple :max-count="5" v-model="signList" />
            <div class="van-field__word-limit">{{ signList.length }}/5<span v-if="form.type == 1">（选填）</span></div>
          </div>
        </template>
      </van-field>
      <van-field name="uploader" label="照片">
        <template #input>
          <div class="full-width">
            <van-uploader :before-read="beforeRead" multiple :max-count="10" v-model="picList" />
            <div class="van-field__word-limit">{{ picList.length }}/10</div>
          </div>
        </template>
      </van-field>
      <van-field name="uploader" label="视频">
        <template #input>
          <div class="full-width">
            <van-uploader upload-icon="video" :max-count="1" :max-size="300 * 1024 * 1024" @oversize="onOversize" accept="video/*" v-model="videoData" />
            <div class="van-field__word-limit">（选填）</div>
          </div>
        </template>
      </van-field>
    </div>
    <div class="ss-p-15 page-btn">
      <van-button block type="primary" @click="submit" :disabled="isSubmit">确认创建</van-button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import setting from '@/setting'
import VideoUploader from '@/components/video-uploader'

export default {
  name: 'act-add',
  data() {
    return {
      typeMap: setting.act.type.map,
      typeOptions: setting.act.type.list,
      id: null,
      currentDate: new Date(),
      form: {
        name: '',
        address: '',
        descr: '',
        activityTime: '',
        sign: '',
        type: null,
        // 最多一个视频，10张照片
        images: '',
        videos: ''
      },
      showDatePicker: false,
      showPicker: false,
      // 签到表最多上传5张照片
      signList: [],
      // 最多可上传10张照片，上传的视频大小最多为300M
      picList: [],
      videoData: [],

      isSubmit: false
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      if (!this.id) {
        return false
      }
    },
    onConfirmDate(value, index) {
      this.form.activityTime = dayjs(value).format('YYYY-MM-DD')
      this.showDatePicker = false
    },
    onConfirmType(value, index) {
      this.form.type = this.typeOptions[index].value
      this.showPicker = false
    },
    beforeRead(files) {
      const imgTypes = ['jpeg', 'jpg', 'png', 'bmp']
      let result = true
      if (files.length) {
        for (let index = 0; index < files.length; index++) {
          const file = files[index]
          if (!this.validFileType(file, imgTypes)) {
            result = false
          }
        }
      } else {
        result = this.validFileType(files, imgTypes)
      }
      return result
    },
    validFileType(file, types) {
      if (types.every((item) => file.type.indexOf(item) == -1)) {
        this.$toast('请上传正确格式的图片')
        return false
      }
      return true
    },
    async submit() {
      const rules = {
        name: '请输入活动名称',
        activityTime: '请选择活动时间',
        type: '请选择活动类型',
        address: '请输入活动地址',
        descr: '请输入活动简介',
      }
      let unpass = false
      unpass = Object.keys(rules).some((key) => {
        if (!this.form[key]) {
          this.$toast(rules[key])
          return true
        }
        return false
      })
      if (unpass) {
        return false
      }
      if (this.form.type != 1 && !this.signList.length) {
        return this.$toast('请上传签到表')
      }
      if (!this.picList.length) {
        return this.$toast('请上传照片')
      }
      // console.log('this.isSubmit', this.isSubmit)
      if (this.isSubmit) {
        return false
      }

      this.isSubmit = true
      const form = { ...this.form }

      // 开始上传照片
      if (this.signList && this.signList.length) {
        // 签到表
        const signList = await this.uploadImgs(this.signList)
        console.log(signList)
        form.sign = signList.join(';')
        if (!form.sign) {
          return this.$toast('请重新上传签到表')
        }
      }

      if (this.picList && this.picList.length) {
        // 照片
        const imageList = await this.uploadImgs(this.picList)
        console.log(imageList)
        form.images = imageList.join(';')
        if (!form.images) {
          return this.$toast('请重新上传照片')
        }
      }

      // 上传视频
      if (this.videoData && this.videoData.length) {
        const vInfo = await this.uploadVideo(this.videoData[0]).catch(() => '')
        console.log(vInfo)
        if (vInfo) {
          form.videos = JSON.stringify(vInfo)
        }
      }

      const res = await this.$api.addActInfo(form)
      if (res.success) {
        this.$toast.success({
          message: '创建成功',
          onClose: () => {
            this.$router.back()
          }
        })
      } else {
        this.isSubmit = false
      }
    },

    // 上传图片list
    uploadImgs(list = []) {
      return new Promise(async (resolve, reject) => {
        let count = 0
        const imageList = []
        list.forEach(async (item) => {
          if (item && item.file) {
            item.status = 'uploading'
            item.message = '上传中...'
            const url = await this.uploadImage(item.file).catch((_) => '')
            if (url) {
              imageList.push(url)
              item.status = 'done'
              item.message = '已上传'
            }
          }

          count++
          if (count == list.length) {
            resolve(imageList)
          }
        })
      })
    },

    onOversize(file) {
      console.log(file)
      this.$toast('文件大小不能超过 300M')
    },

    // 上传视频
    uploadVideo (file) {
      return new Promise((resolve, reject) => {
        if (!file.file) {
          return reject('没有选择文件')
        }

        file.status = 'uploading'
        file.message = '上传中...'

        this.$toast.loading('正在上传视频...')

        VideoUploader.start(file.file, {
          onProgress: ({ info, totalSize, loadedPercent }) => {
            console.log(loadedPercent)
          }
        }).then(async video => {
          // videoId
          console.log(video)
          file.status = ''
          file.message = ''

          // 保存视频id到数据库
          const res = await this.$api.saveVideo({
            videoId: video.videoId,
            size: file.file.size,
            fromYw: 1,
            // 几个必填字段
            title: `活动视频${Date.now()}`,
            description: `活动视频${this.dateformat(Date.now(), 'YYYYMMDDHHmmss')}`,
            // bindDiagnosis: 1
          })
          if (res.success) {
            // 把素材库的ID保存到视频的字段，
            // 查看的时候通过查视频详情拿到播放地址
            // this.form.video = res.data
            resolve({
              id: res.data,
              videoId: video.videoId
            })
          } else {
            reject(res.msg)
          }


          this.$toast.clear()
        }).catch(msg => {
          this.$toast.fail(msg || '上传失败')
          file.status = 'failed'
          file.message = '上传失败'
          reject('上传失败')
          this.$toast.clear()
        })

      })

    },
  }
}
</script>

<style lang="less">
.act-form {
  .van-uploader {
    margin-right: -15px;
  }
  .van-uploader__preview-image,
  .van-uploader__upload {
    width: 1.8rem;
    height: 1.8rem;
  }
}
</style>
<style lang="less" scoped></style>
