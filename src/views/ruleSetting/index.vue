<template>
  <div class="rule-setting">
    <div class="rule-header-block">
      <div class="rule-header">
        <div class="steps">
          <div class="step" :class="{ active: step }" @click="step = 1">
            获取内容页
          </div>
          <div class="step" :class="{ active: step > 1 }" @click="step = 2">
            配置数据参数
          </div>
          <div class="step" :class="{ active: step > 2 }" @click="step = 3">
            开始爬取
          </div>
          <div class="step" :class="{ active: step > 3 }" @click="step = 4">
            数据发布
          </div>
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
      <data-publish v-if="step === 4"></data-publish>
    </div>
  </div>
</template>
<script>
import LandingPage from './LandingPage.vue'
import DetailsPage from './DetailsPage.vue'
import StartSpider from './StartSpider.vue'
import DataPublish from './DataPublish.vue'
import EventBus from '@/utils/EventBus'
import { editAppById, addApp } from '@/service/global.service'
import {
  clearRule,
  getConfig,
  getContentUrls,
  getPublishConfig,
} from '@/service/rule.service'

export default {
  name: 'RuleSetting',
  components: {
    LandingPage,
    DetailsPage,
    StartSpider,
    DataPublish,
  },
  data() {
    return {
      step: 1,
      appName: '',
      id: '',
      isEdit: false,
    }
  },
  mounted() {
    // eslint-disable-next-line no-prototype-builtins
    if (this.$route.query.hasOwnProperty('id')) {
      this.appName = this.$route.query.appName
      this.id = this.$route.query.id
      this.isEdit = true
    }
    EventBus.$on('toStep', (step) => {
      this.step = step
    })
  },
  methods: {
    save() {
      if (!this.appName) {
        this.$alert('请输入应用名称', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      if (this.isEdit) {
        // 编辑
        editAppById(this.id, {
          appName: this.appName,
          ruleConfig: JSON.stringify({
            config: getConfig(),
            contentUrls: getContentUrls(),
            publishConfig: getPublishConfig(),
          }),
          type: 'rule',
        })
      } else {
        // 创建
        addApp({
          appName: this.appName,
          ruleConfig: JSON.stringify({
            config: getConfig(),
            contentUrls: getContentUrls(),
            publishConfig: getPublishConfig(),
          }),
          type: 'rule',
        })
      }
      this.clear()
    },
    cancel() {
      this.$confirm('确定要离开?离开后数据将不会保存', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      })
        .then(() => {
          this.clear()
        })
        .catch(() => {})
    },
    clear() {
      clearRule()
      this.isEdit = false
      this.$router.push('/')
    },
  },
}
</script>
<style lang="scss">
.rule-setting {
  height: 100%;
  .rule-header-block {
    padding-top: 10px;
    height: 40px;
  }
  .rule-header {
    width: 100%;
    position: fixed;
    left: 0;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-left: 1px solid #323232;
    border-right: 1px solid #323232;
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
    transition: height 0.2s cubic-bezier(0.35, 0.9, 0.62, 1.22);
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
