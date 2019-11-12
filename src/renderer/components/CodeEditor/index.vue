<template>
  <div>正在研发 <router-link to="/">点击返回</router-link></div>
</template>
<script>
export default {
  name: 'CodeEditor',
  data () {
    return {
      code: 'const noop = () => {}',
      options: {}
    }
  }
}
</script>
<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 800px;
}  
</style>
