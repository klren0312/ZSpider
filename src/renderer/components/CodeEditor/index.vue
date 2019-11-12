<template>
  <div class="editor" ref="editor"></div>
</template>
<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export default {
  name: 'CodeEditor',
  props: {
    initData: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null,
      code: ''
    }
  },
  model: {
    event: 'change'
  },
  mounted () {
    this.editor = monaco.editor.create(this.$refs.editor, {
      value: this.code,
      language: 'javascript',
      theme: 'vs'
    })
    this.editor.onDidChangeModelContent(e => {
      const content = this.editor.getValue()
      this.$emit('change', content)
    })
  },
  beforeDestroy () {
    this.editor && this.editor.dispose()
  },
  watch: {
    initData () {
      if (this.initData !== this.code) {
        this.editor.setValue(this.initData)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 100%;
}  
</style>
