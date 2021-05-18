<template>
  <d2-container class="page">
    index, {{ role }}
  </d2-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapState('d2admin/user', [ 'role' ])
  }
}
</script>

<style lang="scss" scoped>

</style>
