<template>
  <div class="code-rule-setting">
    <div class="rule-header-block">
      <div class="rule-header">
        <div class="steps">
          <el-button size="mini" type="success" @click="testCode">运行代码</el-button>
          <el-button size="mini" @click="dialogVisible = true">查看可调用接口文档</el-button>
          <el-dropdown split-button size="mini" @command="selectCode">
            插入代码段
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="1">MySQL连接</el-dropdown-item>
              <el-dropdown-item :command="2">Cheerio爬虫</el-dropdown-item>
              <el-dropdown-item :command="3">Puppeteer爬虫</el-dropdown-item>
              <el-dropdown-item :command="4">HTTP请求</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-form :inline="true">
          <el-form-item>
            <el-input size="mini" v-model="appName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="save">保存</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="setting-content">
      <code-editor ref="codeEditor" v-model="code" :initData="initCode"></code-editor>
    </div>    
    <el-dialog
      title="相关可调用文档"
      :visible.sync="dialogVisible"
      width="90%">
      <el-table :data="classData">
        <el-table-column property="name" label="类库名称"></el-table-column>
        <el-table-column property="info" label="说明"></el-table-column>
      </el-table>
      <el-table :data="funcData">
        <el-table-column property="name" label="方法名称"></el-table-column>
        <el-table-column property="info" label="说明"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { ruleDb, dataDb, globalDb } from '@/dataStore'
import CodeEditor from '@/components/CodeEditor/index.vue'
import EventBus from '@/utils/EventBus'
import { sampleDict } from './sample'
const { remote } = require('electron')
const { NodeVM } = require('vm2')

export default {
  name: 'CodeRule',
  components: {
    CodeEditor
  },
  data () {
    return {
      step: 1,
      appName: '',
      id: '',
      isEdit: false,
      code: '',
      initCode: '',
      classData: [
        { name: 'fs', info: 'NodeJS内置文件操作库' },
        { name: 'path', info: 'NodeJS内置路径操作库' },
        { name: 'reqest', info: 'HTTP请求库' },
        { name: 'request-promise', info: '基于Promise的HTTP请求库' },
        { name: 'cheerio', info: 'HTML解析库' },
        { name: 'cheerio-tableparser', info: 'HTML表格解析的Cheerio插件' },
        { name: 'mysql2', info: 'MySQL操作库' },
        { name: 'puppeteer-core', info: '操作Chrome库' },
        { name: 'electron', info: '操作Electron窗体相关API' }
      ],
      funcData: [
        { name: 'dataDb', info: '操作本地JSON数据存储, 用于本地存储数据' },
        { name: 'chromePath', info: '本地Chrome安装路径' }
      ],
      dialogVisible: false
    }
  },
  mounted () {
    if (this.$route.query.hasOwnProperty('id')) {
      this.appName = this.$route.query.appName
      this.id = this.$route.query.id
      const details = globalDb.get('apps').find({ id: this.id }).value()
      this.code = details.ruleConfig
      this.initCode = details.ruleConfig
      this.isEdit = true
    }
  },
  methods: {
    save () {
      if (!this.appName) {
        remote.dialog.showMessageBox({
          type: 'error',
          title: '错误',
          message: '请输入应用名称',
          buttons: ['ok']
        })
        return
      }
      const collection = globalDb.defaults({ apps: [] }).get('apps')
      if (this.isEdit) { // 编辑
        collection
          .find({ id: this.id })
          .assign({
            appName: this.appName,
            ruleConfig: this.code,
            type: 'code'
          })
          .write()
      } else { // 创建
        collection
          .insert({
            appName: this.appName,
            ruleConfig: this.code,
            type: 'code'
          })
          .write()
      }
      this.isEdit = false
      this.$router.push('/')
    },
    cancel () {
      remote.dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: '确定要离开?离开后数据将不会保存',
        buttons: ['ok', 'no']
      }, index => {
        if (index === 0) {
          ruleDb.set('config', {}).write()
          ruleDb.set('contentUrls', {}).write()
          ruleDb.set('publishConfig', []).write()
          this.isEdit = false
          this.$router.push('/')
        } else {
        }
      })
    },
    /**
     * 测试代码运行, 使用虚拟机
     */
    testCode () {
      if (!this.code) {
        remote.dialog.showMessageBox({
          type: 'error',
          title: '错误',
          message: '请编写代码后, 再运行',
          buttons: ['ok']
        })
        return
      }
      dataDb.set('data', []).write()
      const collection = dataDb.defaults({ data: [] }).get('data')
      this.$store.dispatch('CTRL_LOG', true)
      this.writeLog('代码开始运行...')
      setTimeout(() => {
        const vm = new NodeVM({
          console: 'redirect',
          sandbox: {
            dataDb: collection,
            chromePath: this.$store.state.chromePath
          },
          require: {
            builtin: ['fs', 'path'],
            external: {
              modules: [
                'cheerio',
                'cheerio-tableparser',
                'request-promise',
                'request',
                'mysql2',
                'puppeteer-core',
                'electron'
              ],
              transitive: true
            }
          }
        })
        vm.on('console.log', msg => {
          if (typeof msg !== 'string') {
            this.writeLog(JSON.stringify(msg))
          } else {
            this.writeLog(msg)
          }
        })
        vm.run(this.code, 'vm.js')
      }, 2000)
    },
    /**
     * 打印日志
     */
    writeLog (v) {
      EventBus.$emit('logs', `${new Date().toLocaleString()}: ${v}`)
    },
    /**
     * 插入代码
     */
    appendCode (text) {
      this.$refs.codeEditor.addText(text + '')
    },
    /**
     * 选取代码片段
     */
    selectCode (e) {
      try {
        this.appendCode(sampleDict[e])
      } catch (error) {
        this.appendCode("console.log('hello ZSpider')")
      }
    }
  }
}
</script>
<style lang="scss">
.code-rule-setting {
  height:100%;
  .rule-header-block {
    padding-top: 10px;
    height: 50px;
  }
  .rule-header {
    width: 100%;
    position: fixed;
    left: 0;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-left: 1px solid #323232;
    border-right: 1px solid #323232;
    z-index: 1;
    .tips {
      margin-right: 20px;
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
  }
  .setting-content {
    height: calc(100vh - 154px);
    padding-top: 20px;
    transition: height .2s cubic-bezier(0.35, 0.9, 0.62, 1.22);
    box-sizing: border-box;
    overflow-y: auto;
    &.small {
      height: calc(100vh - 313px);
    }
  }
  .steps {
    width: 600px;
    /*margin: 0 auto 20px;*/
    // margin-bottom: 20px;
    overflow: hidden;
    display: block;
    .step {
      float: left;
      width: 150px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      border: 1px solid #fff;
      border-right: none;
      position: relative;
      background-color: #aaa;
      cursor: pointer;
      color: #fff;
      &.active {
        color: #fff;
        background-color: #573eb1;
      }
    }
  }
  .el-form--inline .el-form-item {
    margin-bottom: 0;
  }
}
</style>
