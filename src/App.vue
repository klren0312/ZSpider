<template>
  <div id="app" :class="isLight ? '' : 'black'">
    <div class="frame-header-block">
      <div class="frame-header">
        <div class="frame-title">
          ZSpider (<span
            class="online-status"
            :class="online ? 'online' : 'outline'"
            >{{ online ? '已连接' : '未连接' }}</span
          >)
        </div>
        <div class="tips" v-if="this.$route.name === 'RuleSetting'">
          每个页面都必须进行测试, 才会保存配置
        </div>
        <div class="frame-ctrl-group">
          <ctrl-btn-group></ctrl-btn-group>
        </div>
      </div>
    </div>
    <div class="total-header-block">
      <div class="total-header">
        <system-info></system-info>
        <div class="theme-btn">
          <el-button
            @click="isLight = !isLight"
            size="mini"
            v-if="isLight"
            icon="el-icon-sunny"
            circle
          ></el-button>
          <el-button
            @click="isLight = !isLight"
            size="mini"
            v-else
            icon="el-icon-moon"
            circle
          ></el-button>
        </div>
      </div>
    </div>
    <div class="content" :class="ctrl ? 'small' : ''">
      <router-view></router-view>
    </div>
    <system-log></system-log>
  </div>
</template>

<script>
import SystemLog from './components/SystemLog/index.vue'
import SystemInfo from './components/SystemInfo/index.vue'
import CtrlBtnGroup from './components/CtrlBtnGroup/index.vue'
import { mapState } from 'vuex'
import { globalDb } from '@/dataStore'
import EventBus from '@/utils/EventBus'
const { shell } = require('electron')

export default {
  name: 'ZSpider',
  components: {
    SystemLog,
    SystemInfo,
    CtrlBtnGroup,
  },
  data() {
    return {
      isLight: true,
      online: false,
    }
  },
  mounted() {
    if (process.env.NODE_ENV !== 'development') {
      if (!globalDb.get('hasTips').value()) {
        this.showInstallInfo()
      }
    }
    EventBus.$on('online', (msg) => {
      this.online = msg
    })
  },
  computed: mapState({
    ctrl: (state) => state.logCtrl,
    chromePath: (state) => state.chromePath,
  }),
  methods: {
    showInstallInfo() {
      this.$confirm('请确定您已安装Chrome?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      })
        .then(() => {
          globalDb.set('hasTips', true).write()
        })
        .catch(() => {
          shell.openExternal('https://www.google.cn/chrome/')
        })
    },
  },
}
</script>
<style lang="scss">
@import './assets/black.scss';
/* CSS */
body {
  padding: 0;
  margin: 0;
  font-family: 'PingFang SC', 'Lantinghei SC', 'Lucida Grande',
    '\5FAE\8F6F\96C5\9ED1', 'Microsoft YaHei', FreeSans, 'WenQuanYi Micro Hei',
    'Hiragino Sans GB', 'Hiragino Sans GB W3', SimSun, sans-serif, tahoma, arial;
  border: 1px solid #323232;
  box-sizing: border-box;
  background: #fff;
  .frame-header-block {
    height: 30px;
    .frame-header {
      position: fixed;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 30px;
      background-color: #323232;
      -webkit-app-region: drag;
    }
    .frame-title,
    .tips {
      padding-left: 20px;
      font-size: 14px;
      color: #fff;
    }
    .online-status {
      position: relative;
      padding-left: 15px;
      font-size: 12px;
      &::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 5px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #52c41a;
      }
      &.outline {
        &::before {
          background: #f5222d;
        }
      }
    }
  }
  .total-header-block {
    height: 52px;
    .total-header {
      position: fixed;
      left: 0;
      width: 100%;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      background: #f5f5f5;
      border-left: 1px solid #323232;
      border-right: 1px solid #323232;
      box-sizing: border-box;
      z-index: 1;
    }
  }
  .theme-btn {
    text-align: right;
  }
  .content {
    height: calc(100vh - 104px);
    overflow-y: auto;
    transition: height 0.2s cubic-bezier(0.35, 0.9, 0.62, 1.22);
    // &.small {
    //   height: calc(100vh - 30px - 220px);
    // }
  }
  #wrapper {
    min-height: calc(100vh - 145px);
    padding: 20px 20px;
  }
}
</style>
