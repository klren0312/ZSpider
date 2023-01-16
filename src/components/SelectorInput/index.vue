<template>
  <el-input v-model="inputValue" placeholder="CSS选择器">
    <el-button
      slot="append"
      icon="el-icon-thumb"
      @click="getSelector"
    ></el-button>
  </el-input>
</template>
<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'SelectorInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    contentUrl: {
      type: String,
      default: '',
    },
  },
  computed: {
    inputValue: {
      get: function () {
        return this.value
      },
      set: function (v) {
        this.$emit('update', v)
      },
    },
  },
  model: {
    prop: 'value',
    event: 'update',
  },
  methods: {
    /**
     * 打开选择器窗口
     */
    getSelector() {
      if (!this.contentUrl) {
        this.$alert('请选择内容页链接', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      const url = this.inputValue.replace(/\[分页位置\]/g, 1)
      ipcRenderer.send('openReviewPage', url)
      ipcRenderer.on('domSelectorData', this.setSelector)

      this.$once('hook:beforeDestroy', () => {
        ipcRenderer.removeListener('domSelectorData', this.setSelector)
      })
    },
    setSelector(e, data) {
      this.inputValue = data
    },
  },
}
</script>
