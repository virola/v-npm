<template>
  <div class="img-upload-box">
    <ul class="el-upload-list el-upload-list--picture-card">
      <li class="el-upload-list__item is-ready" :style="styles" v-for="(item, index) in imgList" :key="index">
        <div>
          <img :src="getImgUrl(item)" alt="" class="el-upload-list__item-thumbnail" />
          <span class="el-upload-list__item-actions"
            ><span class="el-upload-list__item-delete" v-preview="getImgUrl(item)"><i class="el-icon-zoom-in"></i></span
          ><span class="el-upload-list__item-delete" @click="delItem(index)"><i class="el-icon-delete"></i></span
          ></span>
        </div>
      </li>
    </ul>
    <div class="d2-ml d2-mt" v-if="changeBtn == 'string' && !multiple && imgList.length"><el-button size="mini" plain @click="triggerInput">{{changeBtnText}}</el-button></div>
    <div class="img-upload" v-show="!imgList.length || changeBtn == 'button'" :style="styles" @click="triggerInput">
      <i class="el-icon-plus"></i>
    </div>
    <input
      ref="input"
      type="file"
      name="file"
      class="el-upload__input"
      :multiple="multiple"
      accept="image/jpeg,image/jpg,image/gif,image/png"
      @change="triggerUpload"
    />
  </div>
</template>

<script>
import imageOss from '../image-oss'

/**
 * 通用图片上传控件
 * 可指定单图or多图
 */
export default {
  props: {
    // 要上传至OSS目录名
    dirName: {
      type: String,
      default: 'corp'
    },
    /**
     * 是否多图上传模式
     */
    multiple: {
      type: Boolean,
      default: false
    },

    size: {
      type: Number,
      default: 140
    },

    disabled: {
      type: Boolean
    },
    changeBtn: {
      type: String,
      default: 'button'
    },
    changeBtnText: {
      type: String,
      default: '点击更换'
    },
    value: {
      type: String
    }
  },
  data () {
    return {
      imgList: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          this.imgList = this.multiple ? val : [ val ]
        }
      }
    }
  },
  computed: {
    styles() {
      return {
        width: this.size + 'px',
        height: this.size + 'px'
      }
    }
  },
  methods: {
    // 触发点击
    triggerInput() {
      if (this.disabled) {
        return false
      }
      this.$refs.input.click()
    },
    // 触发上传
    triggerUpload(e) {
      if (this.disabled) {
        return false
      }
      const files = e.currentTarget.files
      if (!files || !files.length) {
        return
      }
      imageOss.upload(files, this.dirName, async (ossimgurl, fileLocalName) => {
        console.log('success', ossimgurl)
        if (this.multiple) {
          this.imgList.push(ossimgurl)
        } else {
          this.imgList = [ ossimgurl ]
        }

        // this.$forceUpdate()
        this.$emit('input', this.getValue())
      })
    },
    // 删除图片
    delItem(index) {
      if (this.disabled) {
        return false
      }
      this.imgList.splice(index, 1)
      this.$emit('input', this.getValue())
    },
    getValue() {
      let single = this.imgList.length && this.imgList[0] || null
      return this.multiple ? this.imgList : single
    }
  }
}
</script>

<style lang="scss" scoped>
.img-upload-box {
  display: flex;
  flex-wrap: wrap;
}
.img-upload {
  background-color: #fbfdff;
  border: 1px dashed $color-info;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
  }

  i {
    font-size: 28px;
    color: $color-info;
  }
}
.el-upload__input {
  visibility: hidden;
}
</style>
