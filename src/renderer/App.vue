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
    // this.$nextTick(_ => {
    //   if (!db.get('config.hasTips').value()) {
    //   }
    // })
    this.$confirm('请确定您已安装Chrome?', '提示', {
      confirmButtonText: '我安装了',
      cancelButtonText: '我没安装',
      closeOnPressEscape: false,
      distinguishCancelAndClose: true,
      type: 'warning'
    }).then(() => {
      db.set('config.hasTips', true).write()
      // shell.showItemInFolder(this.chromePath)
    }).catch(() => {
      let win = new BrowserWindow({ width: 800, height: 600, show: false })
      win.on('closed', function () {
        win = null
      })
      win.loadURL(`https://www.google.cn/chrome/`)
      win.show()
    })
  },
  computed: mapState({
    ctrl: state => state.logCtrl,
    chromePath: state => state.chromePath
  })
}
</script>
<style lang="scss">
@import './assets/black.scss';
/* CSS */
body {
  padding: 0;
  margin: 0;
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
