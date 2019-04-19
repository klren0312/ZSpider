<template>
  <div>
    <h3 class="title">系统信息</h3>
    <div class="items">
      <div class="item">
        <div class="name">内存占用:</div>
        <div class="value">{{ usemem | byteFormat }} / {{ totalmem | byteFormat }}</div>
      </div>
      <div class="item">
        <div class="name">系统平台:</div>
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

<style scoped>
  /* .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  } */

  .items { margin-top: 8px; }

  .item {
    display: flex;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>
