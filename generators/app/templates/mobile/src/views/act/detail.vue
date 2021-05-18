<template>
  <div class="ss-pt-15">
    <div class="info-block bg-f ss-p-15">
      <div class="info-item" flex>
        <div class="info-item-label">活动名称</div>
        <div class="info-item-content">{{info.name}}</div>
      </div>
      <div class="info-item" flex>
        <div class="info-item-label">活动时间</div>
        <div class="info-item-content">{{info.activityTime |dateformat('YYYY-MM-DD')}}</div>
      </div>
      <div class="info-item" flex>
        <div class="info-item-label">活动类型</div>
        <div class="info-item-content">{{typeMap[info.type]}}</div>
      </div>
      <div class="info-item" flex>
        <div class="info-item-label">活动地点</div>
        <div class="info-item-content">{{info.address}}</div>
      </div>
      <div class="info-item" flex>
        <div class="info-item-label">活动简介</div>
        <div class="info-item-content">{{info.descr}}</div>
      </div>
      <div class="info-item" flex>
        <div class="info-item-label">签到表</div>
        <div class="info-item-content">
          <div class="img-list" v-if="info.sign">
            <div class="img-item" v-for="(img, index) in imagesSign" :key="index">
              <div class="img-box" @click="preview(index)"><img :src="getImgUrl(img)" alt=""></div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-item" flex>
        <div class="info-item-label">照片</div>
        <div class="info-item-content">
          <div class="img-list" v-if="info.images">
            <div class="img-item" v-for="(img, index) in imagesImg" :key="index">
              <div class="img-box" @click="preview2(index)"><img :src="getImgUrl(img)" alt=""></div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-item" flex>
        <div class="info-item-label">视频</div>
        <div class="info-item-content">
          <div class="video-box" v-if="info.videos">
            <video v-if="video.id" class="video" controls
              webkit-playsinline="true"
              x-webkit-airplay="true"
              playsinline="true"
              x5-video-player-type="h5"
              x5-video-orientation="h5"
              x5-video-player-fullscreen="true"
              preload="auto"
              :poster="video.coverUrl"
              :src="video.playUrl"></video>
          </div>
        </div>
      </div>
    </div>
    <div class="ss-p-15 page-btn">
      <van-button block type="primary" @click="$router.back()">返 回</van-button>
    </div>
    <van-image-preview v-model="showSign" :images="imagesSign" :startPosition="indexSign">
    </van-image-preview>
    <van-image-preview v-model="showImg" :images="imagesImg" :startPosition="indexImg">
    </van-image-preview>
  </div>
</template>

<script>
import setting from '@/setting'

export default {
  name: 'act-detail',
  data () {
    return {
      typeMap: setting.act.type.map,
      id: null,
      info: {},
      // preview
      showSign: false,
      indexSign: 1,
      imagesSign: [],
      showImg: false,
      indexImg: 1,
      imagesImg: [],
      // video
      video: {},
      // videoUrl: ''
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getInfo()
  },
  methods: {
    async getInfo() {
      if (!this.id) {
        return false
      }
      this.imagesSign = []
      this.imagesImg = []
      const res = await this.$api.getActInfo(this.id)
      if (res.success) {
        this.info = res.data
        if (res.data.sign) {
          this.imagesSign.push(...res.data.sign.split(';').map(item => this.getImgUrl(item)))
        }
        if (res.data.images) {
          this.imagesImg.push(...res.data.images.split(';').map(item => this.getImgUrl(item)))
        }
        if (res.data.videos) {
          try {
            let video = JSON.parse(res.data.videos)
            this.getVideoInfo(video.id)
          } catch (e) {}
        }
      }
    },
    async getVideoInfo(id) {
      if (!id) {
        return false
      }
      this.video = {}
      const res = await this.$api.getVideo(id)
      if (res.success) {
        this.video = res.data
      }
    },
    preview (index) {
      this.showSign = true
      this.indexSign = index
    },
    preview2 (index) {
      this.indexImg = index
      this.showImg = true
    }
  }
}
</script>

<style lang="less" scoped>
// 信息展示样式
.info-item {
  display: flex;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }

  .info-item-label {
    color: @color-info;
    flex: 1;
  }
  .info-item-content {
    margin-left: 15px;
    flex: 2;
  }
}

@label-width: 70px;
.info-item {
  .info-item-label {
    width: @label-width;
    flex: 0 0 @label-width;
  }
}

.video-box {
  padding-right: 10px;
}
.video {
  width: 100%;
  height: 160px;
  object-fit: fill;
}
</style>
