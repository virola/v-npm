<template>
  <div class="ss-pb">
    <div class="home-bg">
      <img class="bg" :src="`${$baseUrl}img/home_bg.png`" alt="背景图" />
      <div class="slogan text-f">Believe in good things</div>
      <div class="banner-text">
        <div class="banner-inner">
          <div class="ss-mb">账户余额（元）</div>
          <div class="ss-mb" flex="main:justify cross:center">
            <strong>{{ homeInfo.balance | currency('') }}</strong>
            <van-button class="withdraw-btn" type="primary" plain :disabled="homeInfo.balance == 0" @click="goWithdraw">提 现</van-button>
          </div>
          <div flex="cross:center" @click="goTradeDetail"><span class="ss-mr-5">余额明细</span><van-icon name="play" /></div>
        </div>
      </div>
    </div>
    <div class="home-icons" flex="cross:center box:mean">
      <div class="icon-item" flex="cross:center" @click="toAuth">
        <img :src="`${$baseUrl}img/icon_auth.png`" alt="认证" />
        <div class="ss-ml-10">
          <strong>实名认证</strong>
          <div class="icon-text ss-mt-10" :class="{ 'text-info': homeInfo.trueStatus, 'text-primary': !homeInfo.trueStatus }">
            {{ homeInfo.trueStatus ? '已认证' : '未认证 >' }}
          </div>
        </div>
      </div>
      <div class="icon-item" flex="cross:center" @click="toBank">
        <img :src="`${$baseUrl}img/icon_bankcard.png`" alt="银行卡" />
        <div class="ss-ml-10">
          <strong>银行卡</strong>
          <div class="icon-text ss-mt-10" :class="{ 'text-info': homeInfo.bindCard, 'text-primary': !homeInfo.bindCard }">
            {{ homeInfo.bindCard ? '已绑定' : '未绑定' }} >
          </div>
        </div>
      </div>
    </div>
    <div class="home-entry">
      <div class="entry-item" v-for="(item, index) in entries" :key="index" @click="goEntry(item)">
        <img :src="`${$baseUrl}img/banner_${item.banner}.png`" :alt="item.label" />
        <div class="entry-text">
          <span class="entry-label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import db from '@/libs/db'

export default {
  name: 'home',
  components: {
  },
  data() {
    let entries = [
      {
        label: '不可点',
        banner: 'task',
        path: '/task-list'
      },
      {
        label: '活动管理',
        banner: 'act',
        path: '/act-list'
      },
      {
        label: '不可点',
        banner: 'user',
        path: '/doctor-list'
      },
      {
        label: '不可点',
        banner: 'edu',
        path: '/edu-list'
      }
    ]
    return {
      homeInfo: {
        balance: 0
      },

      entries,
      taskList: []
    }
  },
  computed: {
    ...mapGetters('app', ['userInfo'])
  },
  // created() {
  //   this.getData()
  // },
  activated () {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await this.$api.getIndexData()
      if (res.success) {
        this.homeInfo = res.data
        this.homeInfo.bindCard = res.data.bankCardList && res.data.bankCardList.length
      }
    },
    goTradeDetail() {
      // todo
      this.$toast('TODO')
    },

    // 从入口进去，默认带上当前时间戳
    goEntry(item) {
      if (item.path) {
        this.$router.push({
          path: item.path,
          query: {
            _t: Date.now()
          }
        })
      }
    },
    goWithdraw() {
      // todo
      this.$toast('TODO')
    },

    toAuth() {
      // todo
      this.$toast('TODO')
    },
    toBank() {
      // todo
      this.$toast('TODO')
    },

  }
}
</script>

<style lang="less" scoped>
.home-bg {
  position: relative;
  margin-top: -35px;
  min-height: 300px;

  .bg {
    width: 100%;
    max-width: 750px;
  }
  .slogan {
    position: absolute;
    top: 60px;
    left: 15px;
  }
  .banner-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    color: #fff;

    .banner-inner {
      margin: 100px 15px 0;
      padding: 25px 30px;
    }

    strong {
      font-size: 32px;
    }
  }
  .withdraw-btn {
    width: 80px;
    height: 36px;
    border: none;
    border-radius: 36px;
  }
}
.home-icons {
  padding: 15px;
  margin-top: 20px;
}
.icon-item {
  img {
    width: 44px;
    height: 44px;
    margin-left: 20px;
  }
  .icon-text {
    font-size: 12px;
  }
}
.home-entry {
  padding: 15px;
  display: flex;
  flex-wrap: wrap;

  .entry-item {
    width: 165px;
    margin-bottom: 15px;
    position: relative;

    &:nth-child(odd) {
      margin-right: 15px;
    }

    img {
      display: block;
      max-width: 100%;
    }

    .entry-text {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .entry-label {
      margin-right: 50px;
      font-size: 16px;
    }
  }
}
</style>
