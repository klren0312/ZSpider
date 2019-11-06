<template>
  <div class="run-logs">
    <div class="ctrl-btn" @click="ctrlLog">
      <i class="el-icon-arrow-down" v-if="ctrl"></i>
      <i class="el-icon-arrow-up" v-else></i>
    </div>
    <div class="log-list" :class="ctrl ? '' : 'close'" ref="logList">
      <p class="log-line" v-for="(v, i) in logs" :key="i">{{v}}</p>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'SystemLog',
  computed: mapState({
    ctrl: state => state.logCtrl,
    logs: state => state.logs
  }),
  methods: {
    ctrlLog () {
      this.$store.dispatch('CTRL_LOG', !this.ctrl)
    }
  }
}
</script>
<style lang="scss" scoped>
.run-logs {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 5;
  .ctrl-btn {
    border: 1px solid #dfdfdf;
    text-align: center;
    cursor: pointer;
    background: #fff;
    &:hover {
      background: #dfdfdf
    }
  }
}
.log-list {
  height: 200px;
  overflow-y: auto;
  list-style-type: none;
  background: #323232;
  transition: height .2s cubic-bezier(0.35, 0.9, 0.62, 1.22);;
  &.close {
    height: 0;
  }
  .log-line {
    margin-bottom: 0;
    padding-left: 20px;
    color: antiquewhite;
  }
}
</style>
