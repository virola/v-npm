<template>
  <video-player class="vjs-custom-skin"
                ref="videoPlayer"
                :options="playerOptions"
                :playsinline="playInline"
                customEventName="customstatechangedeventname"
                @play="onPlayerPlay($event)"
                @pause="onPlayerPause($event)"
                @ended="onPlayerEnded($event)"
                @waiting="onPlayerWaiting($event)"
                @playing="onPlayerPlaying($event)"
                @loadeddata="onPlayerLoadeddata($event)"
                @timeupdate="onPlayerTimeupdate($event)"
                @canplay="onPlayerCanplay($event)"
                @canplaythrough="onPlayerCanplaythrough($event)"
                @statechanged="playerStateChanged($event)"
                @ready="playerReadied">
  </video-player>
</template>

<script>

import 'video.js/dist/video-js.css'
import videojs, { videoPlayer } from 'vue-video-player'
/**
 * 中文语言
 */
videojs.videojs.addLanguage('zh-CN', {
 'Play': '播放',
 'Pause': '暂停',
 'Current Time': '当前时间',
 'Duration': '时长',
 'Remaining Time': '剩余时间',
 'Stream Type': '媒体流类型',
 'LIVE': '直播',
 'Loaded': '加载完毕',
 'Progress': '进度',
 'Fullscreen': '全屏',
 'Non-Fullscreen': '退出全屏',
 'Mute': '静音',
 'Unmute': '取消静音',
 'Playback Rate': '播放速度',
 'Subtitles': '字幕',
 'subtitles off': '关闭字幕',
 'Captions': '内嵌字幕',
 'captions off': '关闭内嵌字幕',
 'Chapters': '节目段落',
 'Close Modal Dialog': '关闭弹窗',
 'Descriptions': '描述',
 'descriptions off': '关闭描述',
 'Audio Track': '音轨',
 'You aborted the media playback': '视频播放被终止',
 'A network error caused the media download to fail part-way.': '网络错误导致视频下载中途失败。',
 'The media could not be loaded, either because the server or network failed or because the format is not supported.': '视频因格式不支持或者服务器或网络的问题无法加载。',
 'The media playback was aborted due to a corruption problem or because the media used features your browser did not support.': '由于视频文件损坏或是该视频使用了你的浏览器不支持的功能，播放终止。',
 'No compatible source was found for this media.': '无法找到此视频兼容的源。',
 'The media is encrypted and we do not have the keys to decrypt it.': '视频已加密，无法解密。',
 'Play Video': '播放视频',
 'Close': '关闭',
 'Modal Window': '弹窗',
 'This is a modal window': '这是一个弹窗',
 'This modal can be closed by pressing the Escape key or activating the close button.': '可以按ESC按键或启用关闭按钮来关闭此弹窗。',
 ', opens captions settings dialog': ', 开启标题设置弹窗',
 ', opens subtitles settings dialog': ', 开启字幕设置弹窗',
 ', opens descriptions settings dialog': ', 开启描述设置弹窗',
 ', selected': ', 选择',
 'captions settings': '字幕设定',
 'Audio Player': '音频播放器',
 'Video Player': '视频播放器',
 'Replay': '重播',
 'Progress Bar': '进度小节',
 'Volume Level': '音量',
 'subtitles settings': '字幕设定',
 'descriptions settings': '描述设定',
 'Text': '文字',
 'White': '白',
 'Black': '黑',
 'Red': '红',
 'Green': '绿',
 'Blue': '蓝',
 'Yellow': '黄',
 'Magenta': '紫红',
 'Cyan': '青',
 'Background': '背景',
 'Window': '视窗',
 'Transparent': '透明',
 'Semi-Transparent': '半透明',
 'Opaque': '不透明',
 'Font Size': '字体尺寸',
 'Text Edge Style': '字体边缘样式',
 'None': '无',
 'Raised': '浮雕',
 'Depressed': '压低',
 'Uniform': '均匀',
 'Dropshadow': '下阴影',
 'Font Family': '字体库',
 'Proportional Sans-Serif': '比例无细体',
 'Monospace Sans-Serif': '单间隔无细体',
 'Proportional Serif': '比例细体',
 'Monospace Serif': '单间隔细体',
 'Casual': '舒适',
 'Script': '手写体',
 'Small Caps': '小型大写字体',
 'Reset': '重启',
 'restore all settings to the default values': '恢复全部设定至预设值',
 'Done': '完成',
 'Caption Settings Dialog': '字幕设定视窗',
 'Beginning of dialog window. Escape will cancel and close the window.': '开始对话视窗。离开会取消及关闭视窗',
 'End of dialog window.': '结束对话视窗'
});


export default {
  props: {
    sources: [ Array, String ],
    poster: {
      type: String,
      default: ''
    },
    autoplay: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    videoPlayer
  },
  data() {
    const baseUrl = this.$baseUrl
    return {
      playInline: false,
      playerOptions: {
        // videojs options
        fluid: true,
        autoplay: false, // 自动播放
        controls: true, // 是否显示控制栏
        // 默认静音
        // muted: true,
        language: 'zh-CN',
        sources: [],
        poster: baseUrl + 'image/video_default_cover.jpg'
      }
    }
  },
  watch: {
    sources: {
      immediate: true,
      handler (val) {
        if (val) {
          this.playerOptions.sources = val
        }
      }
    },
    poster: {
      immediate: true,
      handler (val) {
        if (val) {
          this.playerOptions.poster = val
        }
      }
    },
    autoplay: {
      handler (val) {
        this.playerOptions.autoplay = !!val
      }
    }
  },
  mounted() {
    // console.log('this is current player instance object', this.player)
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    /**
     * 暴露方法，停止播放
     */
    stop () {
      this.player.pause()
    },
    // listen event
    onPlayerPlay (player) {
      this.$emit('play')
      // console.log('player play!', player)
    },
    onPlayerPause (player) {
      // console.log('player pause!', player)
    },
    // 播放结束
    onPlayerEnded (player) {
      this.$emit('play-end')
    },
    onPlayerWaiting (player) {
      // console.log('waiting...', player)
    },
    onPlayerPlaying (player) {
      // console.log('playing...', player)
    },
    onPlayerTimeupdate (player) {
      // console.log('onPlayerTimeupdate', player)
    },
    onPlayerLoadeddata (player) {
      // console.log('loaded!', player)
    },
    // 可以播放了
    onPlayerCanplay (player) {
      // console.log('onPlayerCanplay', player)
    },
    // 无缓冲直接播放
    onPlayerCanplaythrough (player) {
      // console.log('onPlayerCanplaythrough', player)
      // this.$emit('ready', player)
    },

    // or listen state event
    playerStateChanged (playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied (player) {
      // console.log('the player is readied', player)
      this.$emit('ready', player)
      // you can use it to do something...
      // player.[methods]
    }
  }
}
</script>

<style lang="scss">
.vjs-custom-skin {
  touch-action: none;
  // width: 100%;
}
.vjs-custom-skin > .video-js {
  width: 100%;
  font-family: "PingFang SC","Helvetica Neue","Hiragino Sans GB","Segoe UI","Microsoft YaHei","微软雅黑",sans-serif;
}

.vjs-custom-skin > .video-js .vjs-menu-button-inline.vjs-slider-active,.vjs-custom-skin > .video-js .vjs-menu-button-inline:focus,.vjs-custom-skin > .video-js .vjs-menu-button-inline:hover,.video-js.vjs-no-flex .vjs-menu-button-inline {
  width: 10em
}

.vjs-custom-skin > .video-js .vjs-controls-disabled .vjs-big-play-button {
  display: none!important
}

.vjs-custom-skin > .video-js .vjs-control {
  width: 3em
}

.vjs-custom-skin > .video-js .vjs-control.vjs-live-control{
  width: auto;
  padding-left: .5em;
  letter-spacing: .1em;
}

.vjs-custom-skin > .video-js .vjs-menu-button-inline:before {
  width: 1.5em
}

.vjs-menu-button-inline .vjs-menu {
  left: 3em
}

.vjs-paused.vjs-has-started.vjs-custom-skin > .video-js .vjs-big-play-button,.video-js.vjs-ended .vjs-big-play-button,.video-js.vjs-paused .vjs-big-play-button {
  display: block
}

.vjs-custom-skin > .video-js .vjs-load-progress div,.vjs-seeking .vjs-big-play-button,.vjs-waiting .vjs-big-play-button {
  display: none!important
}

.vjs-custom-skin > .video-js .vjs-mouse-display:after,.vjs-custom-skin > .video-js .vjs-play-progress:after {
  padding: 0 .4em .3em
}

.video-js.vjs-ended .vjs-loading-spinner {
  display: none;
}

.video-js.vjs-ended .vjs-big-play-button {
  display: block !important;
}

.video-js.vjs-ended .vjs-big-play-button,.video-js.vjs-paused .vjs-big-play-button,.vjs-paused.vjs-has-started.vjs-custom-skin > .video-js .vjs-big-play-button {
  display: block
}

.vjs-custom-skin > .video-js .vjs-big-play-button {
  top: 50%;
  left: 50%;
  margin-left: -1.5em;
  margin-top: -1em
}

.vjs-custom-skin > .video-js .vjs-big-play-button {
  background-color: rgba(0,0,0,0.45);
  font-size: 3.5em;
   /*border-radius: 50%;*/
  height: 2em !important;
  line-height: 2em !important;
  margin-top: -1em !important
}

.video-js:hover .vjs-big-play-button,.vjs-custom-skin > .video-js .vjs-big-play-button:focus,.vjs-custom-skin > .video-js .vjs-big-play-button:active {
  background-color: rgba(36,131,213,0.9)
}

.vjs-custom-skin > .video-js .vjs-loading-spinner {
  border-color: rgba(36,131,213,0.8)
}

.vjs-custom-skin > .video-js .vjs-control-bar2 {
  background-color: #000000
}

.vjs-custom-skin > .video-js .vjs-control-bar {
   /*background-color: rgba(0,0,0,0.3) !important;*/
  color: #ffffff;
  font-size: 14px
}

.vjs-custom-skin > .video-js .vjs-play-progress,.vjs-custom-skin > .video-js  .vjs-volume-level {
  background-color: #2483d5
}

.vjs-custom-skin > .video-js .vjs-play-progress:before {
  top: -0.3em;
}

.vjs-custom-skin > .video-js .vjs-progress-control:hover .vjs-progress-holder {
  font-size: 1.3em;
}

.vjs-menu-button-popup.vjs-volume-menu-button-vertical .vjs-menu {
  left: 0em;
}

.vjs-custom-skin > .video-js .vjs-menu li {
  padding: 0;
  line-height: 2em;
  font-size: 1.1em;
  font-family: "PingFang SC","Helvetica Neue","Hiragino Sans GB","Segoe UI","Microsoft YaHei","微软雅黑",sans-serif;
}

.vjs-custom-skin > .video-js .vjs-time-tooltip,
.vjs-custom-skin > .video-js .vjs-mouse-display:after,
.vjs-custom-skin > .video-js .vjs-play-progress:after {
  border-radius: 0;
  font-size: 1em;
  padding: 0;
  width: 3em;
  height: 1.5em;
  line-height: 1.5em;
  top: -3em;
}

.vjs-custom-skin > .video-js .vjs-menu-button-popup .vjs-menu {
  width: 5em;
  left: -1em;
}

.vjs-custom-skin > .video-js .vjs-menu-button-popup.vjs-volume-menu-button-vertical .vjs-menu {
  left: 0;
}

 /*排序顺序*/
.vjs-custom-skin > .video-js .vjs-control-bar .vjs-play-control {
  order: 0;
}

.vjs-custom-skin > .video-js .vjs-control-bar .vjs-time-control {
  min-width: 1em;
  padding: 0;
  margin: 0 .1em;
  text-align: center;
  display: block;
  order: 1;
}

.vjs-custom-skin > .video-js .vjs-control-bar .vjs-playback-rate .vjs-playback-rate-value{
  font-size: 1.2em;
  line-height: 2.4;
}

.vjs-custom-skin > .video-js .vjs-progress-control.vjs-control {
  order: 2;
}

.vjs-custom-skin > .video-js .vjs-control-bar .vjs-volume-menu-button {
  order: 3;
}

.vjs-custom-skin > .video-js .vjs-control-bar .vjs-resolution-button {
  order: 4;
}

.vjs-custom-skin > .video-js .vjs-control-bar .vjs-resolution-button .vjs-resolution-button-label {
  display: block;
  line-height: 3em;
}

.vjs-custom-skin > .video-js .vjs-control-bar .vjs-playback-rate {
  order: 5;
}

.vjs-custom-skin > .video-js .vjs-control-bar .vjs-fullscreen-control {
  order: 6;
}
</style>
