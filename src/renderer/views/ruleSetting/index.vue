<template>
  <div class="rule-setting">
    <div class="header">
      <div class="steps">
        <div class="step" :class="{active: step}" @click="step = 1"><span><em></em></span>1、获取内容页</div>
        <div class="step" :class="{active: step > 1}" @click="step = 2"><span><em></em></span>2、配置数据参数</div>
        <div class="step" :class="{active: step > 2}" @click="step = 3">3、开始爬取</div>
        <div class="step" :class="{active: step > 3}" @click="step = 4">4、数据发布</div>
      </div>
      <div class="tips">每个页面都必须进行测试, 才会保存配置</div>
      <!-- <el-form :inline="true">
        <el-form-item label="任务规则名:">
          <el-input size="mini" v-model="jobName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini">保存</el-button>
        </el-form-item>
      </el-form> -->
    </div>
    <div class="setting-content">
      <landing-page v-show="step === 1"></landing-page>
      <details-page v-show="step === 2"></details-page>
      <start-spider v-show="step === 3"></start-spider>
      <data-publish v-show="step === 4"></data-publish>
    </div>
  </div>
</template>
<script>
import LandingPage from './LandingPage.vue'
import DetailsPage from './DetailsPage.vue'
import StartSpider from './StartSpider.vue'
import DataPublish from './DataPublish.vue'
export default {
  name: 'RuleSetting',
  components: {
    LandingPage,
    DetailsPage,
    StartSpider,
    DataPublish
  },
  data () {
    return {
      step: 4,
      jobName: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.rule-setting {
  height:100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tips {
      margin-right: 20px;
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
  }
  .setting-content {
    overflow-y: auto;
    height: calc(100vh - 50px - 63px);
    transition: height .2s cubic-bezier(0.35, 0.9, 0.62, 1.22);;
    &.small {
      height: calc(100vh - 30px - 63px - 220px);
    }
  }
  .steps {
    width: 600px;
    /*margin: 0 auto 20px;*/
    // margin-bottom: 20px;
    overflow: hidden;
    display: block;
    .step {
      float: left;
      width: 150px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      border: 1px solid #fff;
      border-right: none;
      position: relative;
      background-color: #aaa;
      cursor: pointer;
      color: #fff;
      &.active {
        color: #fff;
        background-color: #573eb1;
      }
    }
  }
}
</style>
