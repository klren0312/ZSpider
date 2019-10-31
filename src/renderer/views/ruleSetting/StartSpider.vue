<template>
  <div id="wrapper">
    <div class="filter">
      <el-form :inline="true">
        <el-form-item label="主网址:">
          <div>{{config.mainUrl}}</div>
        </el-form-item>
        <el-form-item label="总页数:">
          <div>{{config.page}}</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="start" v-if="!isStart">开始采集</el-button>
          <el-button type="danger" size="mini" @click="end" v-else>停止采集</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="config.params" border height="400px">
      <el-table-column label="参数名" prop="name"></el-table-column>
      <el-table-column label="参数" prop="param"></el-table-column>
      <el-table-column label="参数参考值" prop="value"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import db from '@/dataStore'
export default {
  name: 'StartSpider',
  data () {
    return {
      isStart: false,
      config: {}
    }
  },
  mounted () {
    this.getConfig()
  },
  methods: {
    goToHome () {
      this.$router.push('/')
    },
    goBack () {
      this.$router.back()
    },
    start () {
      this.isStart = true
      this.goToSpider()
    },
    end () {
      this.isStart = false
    },
    getConfig () {
      this.config = db.get('config').value()
    }
  }
}
</script>

