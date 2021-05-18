<template>
  <d2-container>
    <div slot="header">通用搜索+表格显示组件示例</div>
    <basic-list-page
      ref="listPage"
      :tableOpts="true"
      :formProps="formProps"
      :tableProps="tableProps"
      :api="api"
      :exportApi="exportApi"
      btnReset
    >
      <template slot="buttons">
        <el-button size="small" type="primary" @click="goCreate">新建</el-button>
      </template>
      <template slot="table-opts" slot-scope="{ data }">
        <el-button type="text" @click="goView(data)">查看</el-button>
      </template>
    </basic-list-page>
  </d2-container>
</template>

<script>
export default {
  name: 'page1',
  data () {
    return {
      api: '',
      exportApi: '',
      formProps: [
        {
          label: '姓名',
          model: 'name'
        }
      ],
      tableProps: [
        {
          label: '姓名',
          prop: 'name'
        }
      ]
    }
  },
  methods: {
    goCreate () {},
    goView (item) {
      console.log(item)
    }
  }
}
</script>

<style scoped>

</style>
