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
          <el-button type="primary" size="mini" @click="startSpider" v-if="!isStart">开始采集</el-button>
          <el-button type="danger" size="mini" @click="endSpider" v-else>停止采集</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="params" border height="400px">
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
    return {
      isStart: false
    }
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
    },
    startSpider () {
      this.isStart = true
    },
    endSpider () {
      this.isStart = false
    }
  }
}
</script>

