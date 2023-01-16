<template>
  <el-container is-vertical class="rule-setting">
    <el-header>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="appName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-container>
      <el-aside width="160px">
        <el-menu
          :default-active="currentSelect"
          @select="(name) => (currentSelect = name)"
        >
          <el-menu-item
            v-for="item in menuList"
            :index="item.name"
            :key="item.id"
          >
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <LandingPage v-show="currentSelect === '内容页获取'" />
        <DetailsPage v-show="currentSelect === '数据抓取参数'" />
        <DataPublish v-show="currentSelect === '数据发布'" />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import LandingPage from './LandingPage.vue'
import DetailsPage from './DetailsPage.vue'
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
    DataPublish,
  },
  data() {
    return {
      currentSelect: '内容页获取',
      menuList: [
        {
          id: 0,
          name: '内容页获取',
        },
        {
          id: 1,
          name: '数据抓取参数',
        },
        {
          id: 2,
          name: '数据发布',
        },
      ],
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
}
.el-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
