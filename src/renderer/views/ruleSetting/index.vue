<template>
  <div class="rule-setting">
    <div class="rule-header-block">
      <div class="rule-header">
        <div class="steps">
          <div class="step" :class="{active: step}" @click="step = 1">获取内容页</div>
          <div class="step" :class="{active: step > 1}" @click="step = 2">配置数据参数</div>
          <div class="step" :class="{active: step > 2}" @click="step = 3">开始爬取</div>
          <div class="step" :class="{active: step > 3}" @click="step = 4">数据发布</div>
        </div>
        <el-form :inline="true">
          <el-form-item>
            <el-input size="mini" v-model="appName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="save">保存</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
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
import EventBus from '@/utils/EventBus'
import { globalDb, ruleDb } from '@/dataStore'
const { remote } = require('electron')
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
      step: 1,
      appName: '',
      id: '',
      isEdit: false
    }
  },
  mounted () {
    if (this.$route.query.hasOwnProperty('id')) {
      this.appName = this.$route.query.appName
      this.id = this.$route.query.id
      this.isEdit = true
    }
    EventBus.$on('toStep', step => {
      this.step = step
    })
  },
  methods: {
    save () {
      if (!this.appName) {
        remote.dialog.showMessageBox({
          type: 'error',
          title: '错误',
          message: '请输入应用名称',
          buttons: ['ok']
        })
        return
      }
      const collection = globalDb.defaults({ apps: [] }).get('apps')
      if (this.isEdit) { // 编辑
        collection
          .find({ id: this.id })
          .assign({
            appName: this.appName,
            ruleConfig: JSON.stringify({
              config: ruleDb.get('config').value(),
              contentUrls: ruleDb.get('contentUrls').value(),
              publishConfig: ruleDb.get('publishConfig').value()
            })
          })
          .write()
      } else { // 创建
        collection
          .insert({
            appName: this.appName,
            ruleConfig: JSON.stringify({
              config: ruleDb.get('config').value(),
              contentUrls: ruleDb.get('contentUrls').value(),
              publishConfig: ruleDb.get('publishConfig').value()
            })
          })
          .write()
      }
      this.isEdit = false
      this.$router.push('/')
    },
    cancel () {
      remote.dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: '确定要离开?离开后数据将不会保存',
        buttons: ['ok', 'no']
      }, index => {
        if (index === 0) {
          ruleDb.set('config', {}).write()
          ruleDb.set('contentUrls', {}).write()
          ruleDb.set('publishConfig', []).write()
          this.isEdit = false
          this.$router.push('/')
        } else {
        }
      })
    }
  }
}
</script>
<style lang="scss">
.rule-setting {
  height:100%;
  .rule-header-block {
    height: 40px;
  }
  .rule-header {
    width: 100%;
    position: fixed;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    z-index: 1;
    .tips {
      margin-right: 20px;
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
  }
  .setting-content {
    overflow-y: auto;
    height: calc(100vh - 145px);
    transition: height .2s cubic-bezier(0.35, 0.9, 0.62, 1.22);;
    &.small {
      height: calc(100vh - 313px);
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
  .el-form--inline .el-form-item {
    margin-bottom: 0;
  }
}
</style>
