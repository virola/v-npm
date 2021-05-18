<template>
  <div class="app-b-btn-page">
    <div class="ss-p-15">
      <div class="card ss-p" v-for="(item, index) in list" :key="index" flex="cross:center main:justify" @click="goDetail(item)">
        <div>
          <h3 class="font-15 ss-mb-10">{{item.name}}</h3>
          <div>{{ item.activityTime | dateformat('YYYY-MM-DD') }}</div>
        </div>
        <div class="text-primary op-link" flex="main:right cross:center">
          <span class="ss-mr-5">详情</span>
          <van-icon name="arrow"></van-icon>
        </div>
      </div>
      <page-empty v-if="!list.length" text="暂无活动内容"></page-empty>
    </div>
    <div class="app-bottom-btn">
      <div class="ss-p-15">
        <van-button block type="primary" @click="goAdd">创建活动</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import PageEmpty from '@/components/page-empty'

export default {
  name: 'act-list',
  components: {
    PageEmpty
  },
  data() {
    return {
      list: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await this.$api.getActList({
        pageSize: 999,
        pageNumber: 1
      })
      if (res.success) {
        this.list = res.data.dataList
      }
    },
    goDetail(item) {
      console.log(item)
      this.$router.push({
        path: '/act-detail',
        query: {
          id: item.id
        }
      })
    },
    goAdd () {
      this.$router.push('/act-add')
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 15px;
}
.op-link {
  width: 70px;
}
</style>
