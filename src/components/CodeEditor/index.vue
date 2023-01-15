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
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editor: null,
      code: '',
    }
  },
  model: {
    prop: 'initData',
    event: 'change',
  },
  mounted() {
    this.code = this.initData
    this.editor = monaco.editor.create(this.$refs.editor, {
      value: this.code,
      language: 'javascript',
      theme: 'vs',
      readOnly: this.readOnly,
    })
    this.editor.onDidChangeModelContent(() => {
      const content = this.editor.getValue()
      this.$emit('change', content)
    })
  },
  methods: {
    addText(text) {
      var position = this.editor.getPosition()
      this.editor.executeEdits('', [
        {
          range: new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
          text: text,
          forceMoveMarkers: true,
        },
      ])
    },
  },
  beforeDestroy() {
    this.editor && this.editor.dispose()
  },
  watch: {
    initData() {
      if (this.initData !== this.code) {
        this.code = this.initData
        this.editor.setValue(this.initData)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 100%;
}
</style>
