<template>
  <div class="rule-setting">
    <el-steps :active="activeStep" align-center>
      <el-step title="获取内容页" description="通过主页面获取内容页链接"></el-step>
      <el-step title="配置数据参数" description="配置内容也数据参数"></el-step>
      <el-step title="确认规则" description="确认规则"></el-step>
    </el-steps>
  </div>
</template>
<script>
export default {
  name: 'RuleSetting',
  data () {
    return {
      activeStep: 0
    }
  }
}
</script>
<style lang="scss" scoped>
.rule-setting {
  height:100%;
}
</style>
