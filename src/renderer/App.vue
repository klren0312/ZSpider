<template>
  <div id="app" :class="isLight ? '' : 'black'">
    <div class="theme-btn">
      <el-button @click="isLight = !isLight" size="mini" v-if="isLight" icon="el-icon-sunny" circle></el-button>
      <el-button @click="isLight = !isLight" size="mini" v-else icon="el-icon-moon" circle></el-button>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'spider-test',
    data () {
      return {
        isLight: true
      }
    }
  }
</script>

<style lang="scss">
@import './assets/black.scss';
/* CSS */
body {
  .theme-btn {
    text-align: right;
  }
}
</style>
