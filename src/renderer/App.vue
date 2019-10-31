<template>
  <div id="app" :class="isLight ? '' : 'black'">
    <div class="theme-btn">
      <el-button @click="isLight = !isLight" size="mini" v-if="isLight" icon="el-icon-sunny" circle></el-button>
      <el-button @click="isLight = !isLight" size="mini" v-else icon="el-icon-moon" circle></el-button>
    </div>
    <div class="content" :class="ctrl ? 'small' : ''">
      <router-view></router-view>
    </div>
    <div class="log-content">
      <system-log></system-log>
    </div>
  </div>
</template>

<script>
import SystemLog from './components/SystemLog/index.vue'
import { mapState } from 'vuex'
import db from '@/dataStore'
const {
  remote
} = require('electron')
const BrowserWindow = require('electron').remote.BrowserWindow
// const { shell } = require('electron')

export default {
  name: 'spider-test',
  components: {
    SystemLog
  },
  data () {
    return {
      isLight: true
    }
  },
  mounted () {
    if (process.env.NODE_ENV !== 'development') {
      this.showInstallInfo()
    }
  },
  computed: mapState({
    ctrl: state => state.logCtrl,
    chromePath: state => state.chromePath
  }),
  methods: {
    showInstallInfo () {
      remote.dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: '请确定您已安装Chrome?',
        buttons: ['ok', 'no']
      }, index => {
        if (index === 0) {
          db.set('config.hasTips', true).write()
        } else {
          let win = new BrowserWindow({ width: 800, height: 600, show: false })
          win.on('closed', function () {
            win = null
          })
          win.loadURL(`https://www.google.cn/chrome/`)
          win.show()
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import './assets/black.scss';
/* CSS */
body {
  padding: 0;
  margin: 0;
  font-family: "PingFang SC", "Lantinghei SC", "Lucida Grande", "\5FAE\8F6F\96C5\9ED1", "Microsoft YaHei", FreeSans, "WenQuanYi Micro Hei", "Hiragino Sans GB", "Hiragino Sans GB W3", SimSun, sans-serif, tahoma, arial;
  .theme-btn {
    text-align: right;
  }
  .content {
    height: calc(100vh - 50px);
    overflow-y: auto;
    transition: height .2s cubic-bezier(0.35, 0.9, 0.62, 1.22);;
    &.small {
      height: calc(100vh - 30px - 220px);
    }
  }
  #wrapper {
    min-height: 100vh;
    padding: 20px 20px;
  }
}
</style>
