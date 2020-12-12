<template>
  <div class="system-info">
    <div class="items">
      <div class="item mem-item">
        <div class="name">内存:</div>
        <div class="value">{{ usemem | byteFormat }} / {{ totalmem | byteFormat }}</div>
        <el-progress :text-inside="false" :stroke-width="10" :percentage="percentage" color="#f56c6c"></el-progress>
      </div>
      <div class="item sys-item">
        <div class="name">系统:</div>
        <div class="value">{{ platform }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      platform: require('os').platform(),
      totalmem: require('os').totalmem(),
      freemem: require('os').freemem()
    }
  },
  computed: {
    usemem: function () {
      return this.totalmem - this.freemem
    },
    percentage: function () {
      return parseInt(this.usemem * 100 / this.totalmem)
    }
  },
  filters: {
    byteFormat: function (size) {
      if (typeof size !== 'number') {
        throw new Error('size must be number')
      }
      if (size === 0) {
        return '0 Byte'
      }
      var unit = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB']
      var pos = 0
      while (size >= 1024) {
        size /= 1024
        ++pos
      }
      return size.toFixed(2) + unit[pos]
    }
  },
  mounted () {
    setTimeout(() => this.refreshMem(), 5000)
  },
  methods: {
    refreshMem () {
      this.totalmem = require('os').totalmem()
      this.freemem = require('os').freemem()
      setTimeout(() => this.refreshMem(), 5000)
    }
  }
}
</script>

<style lang="scss">
.system-info {
  .items {
    width: 664px;
    display: flex;
    align-items: center;
    margin-top: 8px;
  }

  .item {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    &.mem-item {
      justify-content: space-around;
    }
  }
  .item .el-progress {
    width: 50%;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }
}
</style>
