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
  /* CSS */
body {
  .black {
    background: rgb(37, 37, 38);
    color: rgb(204, 204, 204);
  }
  .theme-btn {
    text-align: right;
  }
}
</style>
