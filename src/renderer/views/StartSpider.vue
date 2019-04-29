<template>
  <div id="wrapper">
    <div class="filter">
      <el-form :inline="true">
        <el-form-item label="主网址:">
          <div>{{mainUrl}}</div>
        </el-form-item>
        <el-form-item label="总页数:">
          <div>{{page}}</div>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="goToHome">返回首页</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="goBack">返回上一页</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="start">开始采集</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="params">
      <el-table-column label="参数名" prop="name"></el-table-column>
      <el-table-column label="参数" prop="param"></el-table-column>
      <el-table-column label="参数参考值" prop="value"></el-table-column>
    </el-table>
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
  },
  methods: {
    goToHome () {
      this.$router.push('/')
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>
<style lang="scss" scoped>
#wrapper {
  background:
    radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, .9) 100%
    );
  min-height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}
</style>

