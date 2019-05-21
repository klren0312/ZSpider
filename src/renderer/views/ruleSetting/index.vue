<template>
  <div class="rule-setting">
    <div class="header">
      <div class="steps">
        <div class="step" :class="{active: step}" @click="step = 1"><span><em></em></span>1、获取内容页</div>
        <div class="step" :class="{active: step > 1}" @click="step = 2"><span><em></em></span>2、配置数据参数</div>
        <div class="step" :class="{active: step > 2}" @click="step = 3"><span><em></em></span>3、确认规则</div>
        <div class="step" :class="{active: step === 4}" @click="step = 4">4、其他设置</div>
      </div>
      <el-form :inline="true">
        <el-form-item label="任务规则名:">
          <el-input size="mini" v-model="JobName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RuleSetting',
  data () {
    return {
      step: 1
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
  }
  .steps {
    width: 600px;
    /*margin: 0 auto 20px;*/
    margin-bottom: 20px;
    overflow: hidden;
    display: block;
    .step {
      float: left;
      width: 130px;
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
        span {
          em {
            border-color:transparent transparent transparent #573eb1;
          }
        }
      }
      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:last-child {
        border-right: 1px solid #fff;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      span {
        width: 0;
        height: 0;
        display: block;
        border-width:20px 0 19px 15px;
        border-style:solid;
        border-color:transparent transparent transparent #fff;
        position:absolute;
        right: -15px;
        z-index: 4;
        /*overflow: hidden;*/
        em {
          width: 0;
          height: 0;
          display: block;
          border-width:20px 0 19px 15px;
          border-style:solid;
          border-color:transparent transparent transparent #aaa;
          position:absolute;
          right: 1px;
          z-index: 4;
          top: -20px;
        }
      }
    }
  }
}
</style>
