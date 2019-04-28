<template>
  <div>
    <div class="filter">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="goToHome">返回首页</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="goToHome">返回首页</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'StartSpider',
  data () {
    return {}
  },
  computed: mapState({
    params: state => state.contentParams,
    mainUrl: state => state.rule.mainUrl,
    page: state => state.rule.page
  }),
  mounted () {
    console.log(this.params, this.mainUrl, this.page)
  }
}
</script>