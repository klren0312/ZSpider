<template>
  <div id="app" :class="isLight ? '' : 'black'">
    <div class="frame-header-block">
      <div class="frame-header">
        <div class="frame-title">
          治采天机-ZSpider
          <!-- (<span
            @click="doLogin"
            class="online-status"
            :class="online ? 'online' : 'outline'"
            >Github{{ online ? '已登录' : '未登录' }}</span
          >) -->
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
            :icon="isLight ? 'el-icon-sunny' : 'el-icon-moon'"
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
    height: calc(100vh - 205px);
    overflow-y: auto;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }

  .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    .el-dialog__title {
      color: #fff;
      font-size: 16px;
      line-height: normal;
    }
    .el-dialog__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 13px;
      background: #0042a2;
      color: #fff;
    }
    .el-dialog__headerbtn {
      position: static;
      .el-dialog__close {
        color: #fff;
      }
    }
    .el-dialog__body {
      flex: 1;
      overflow: auto;
    }
  }
  // 滚动条样式
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 7px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 12px;
  }

  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;
    background-color: #dcdee2;
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 2px;
    //      background: #F8F8F9;
    background: transparent;
  }
}
</style>
