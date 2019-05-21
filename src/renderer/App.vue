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
  computed: mapState({
    ctrl: state => state.logCtrl
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
