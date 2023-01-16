<template>
  <div id="wrapper" class="details-page">
    <el-form label-position="top">
      <el-form-item label="内容页链接">
        <el-autocomplete
          class="content-select"
          v-model="contentForm.url"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容页链接"
        ></el-autocomplete>
        <el-button
          type="primary"
          @click="openSource"
          :loading="openSourceLoading"
        >
          查看源代码
        </el-button>
      </el-form-item>
      <el-form-item label="字段配置">
        <el-button type="primary" @click="addParam"> 添加参数 </el-button>
        <el-button type="danger" @click="contentForm.paramsInput = []">
          清空参数
        </el-button>
        <el-button type="primary" @click="start" v-if="!startStatus">
          测试数据获取
        </el-button>
        <el-button type="danger" @click="stop" v-else> 结束 </el-button>
        <div class="params-list">
          <el-row
            :gutter="10"
            v-for="(v, i) in contentForm.paramsInput"
            :key="i"
          >
            <el-col :span="4">
              <el-input v-model="v.name" placeholder="参数名称"></el-input>
            </el-col>
            <el-col :span="5">
              <selector-input
                v-model="v.param"
                :contentUrl="contentForm.url"
              ></selector-input>
            </el-col>
            <el-col :span="5">
              <el-input
                v-model="v.attr"
                placeholder="属性名, 不使用则不填"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model="v.note" placeholder="备注"></el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model="v.value" placeholder="值" readonly></el-input>
            </el-col>
            <el-col :span="1" class="close-btn">
              <el-button
                type="danger"
                @click="deleteParam(v)"
                icon="el-icon-close"
                circle
              ></el-button>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      title="查看页面源代码（Ctrl+F搜索, 查看想爬取内容是否存在）"
      :visible.sync="sourceDialog"
      width="700px"
    >
      <div class="source-code-block">
        <code-editor
          ref="codeEditor"
          v-model="pageSource"
          :readOnly="true"
        ></code-editor>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import EventBus from '@/utils/EventBus'
import { dataDb, ruleDb } from '@/dataStore'
import { shell } from 'electron'
import puppeteer from 'puppeteer-core'
import CodeEditor from '@/components/CodeEditor/index.vue'
import SelectorInput from '@/components/SelectorInput'
import rp from 'request-promise'

let browser = null
let page = null

export default {
  name: 'DetailsPage',
  components: {
    CodeEditor,
    SelectorInput,
  },
  data() {
    return {
      sourceDialog: false,
      openSourceLoading: false,
      pageSource: '',
      url: [],
      logs: [],
      startStatus: false,
      contentForm: {
        url: '',
        paramsInput: [],
      },
    }
  },
  computed: mapState({
    chromePath: (state) => state.chromePath,
  }),
  mounted() {
    EventBus.$on('SITES', (sites) => {
      this.url = sites
      if (this.url.length > 50) {
        this.url.length = 50
      }
    })
    this.initData()
  },
  methods: {
    initData() {
      this.url = ruleDb.get('contentUrls').value()
      const params = ruleDb.get('config.params').value()
      if (params) {
        this.contentForm.paramsInput = params
      } else {
        this.contentForm.paramsInput = []
      }
    },
    /**
     * 链接可输入, 可选择
     */
    querySearch(queryString, cb) {
      const urls = JSON.parse(JSON.stringify(this.url))
      const formatArr = []
      urls.forEach((v) => {
        formatArr.push({
          value: v,
        })
      })
      // console.log(formatArr)
      cb(formatArr)
    },
    async start() {
      if (!this.contentForm.url) {
        this.$alert('请选择链接', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      if (this.contentForm.paramsInput.length === 0) {
        this.$alert('请配置参数', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      this.$store.dispatch('SET_PARAM', this.contentForm.paramsInput)
      this.startStatus = true
      this.$store.dispatch('CTRL_LOG', true)
      browser = await puppeteer.launch({
        headless: true,
        executablePath: this.chromePath,
        args: [
          // 禁用一些功能
          '--no-sandbox', // 沙盒模式
          '--disable-setuid-sandbox', // uid沙盒
          '--disable-dev-shm-usage', // 创建临时文件共享内存
          '--disable-accelerated-2d-canvas', // canvas渲染
          '--disable-gpu', // GPU硬件加速
        ],
        ignoreDefaultArgs: ['--enable-automation'],
      })
      this.writeLog('browser init')
      page = await browser.newPage()
      this.writeLog('open new page')
      try {
        await page.goto(this.contentForm.url)
        this.writeLog(`go to ${this.contentForm.url}`)
        const arr = this.contentForm.paramsInput
        const house = await page.evaluate((arr) => {
          const obj = {}
          arr.length > 0 &&
            arr.forEach((v) => {
              if (v.attr) {
                obj[v.name] = document
                  .querySelector(v.param)
                  .getAttribute(v.attr)
              } else {
                obj[v.name] = document
                  .querySelector(v.param)
                  .innerHTML.trim()
                  .replace(/\s/g, '')
                  .replace(/<\/?.+?\/?>/g, '')
              }
              v.value = obj[v.name]
              // that.writeLog(`${v.name}: ${obj[v.name]}`)
            })
          return obj
        }, arr)
        this.contentForm.paramsInput.forEach((v) => {
          v.value = house[v.name]
        })
        this.writeLog(`${JSON.stringify(house)}`)
        this.startStatus = false
        browser.close()
        this.writeLog('结束, 关闭浏览器')
        page = null
        browser = null
        dataDb.set('data', [house]).write()
      } catch (e) {
        this.writeLog('采集报错: ' + e)
        browser.close()
        this.writeLog('结束, 关闭浏览器')
      }
    },
    stop() {
      browser.close()
      this.writeLog('结束, 关闭浏览器')
      page = null
      browser = null
      this.startStatus = false
    },
    addParam() {
      this.contentForm.paramsInput.push({
        name: '',
        param: '',
      })
    },
    openInBrowser() {
      if (this.contentForm.url === '') {
        this.$alert('请选择链接', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      shell.openExternal(this.contentForm.url)
    },
    deleteParam(v) {
      // console.log(this.contentForm.paramsInput.findIndex(u => JSON.stringify(u) === JSON.stringify(v)))
      this.contentForm.paramsInput.splice(
        this.contentForm.paramsInput.findIndex(
          (u) => JSON.stringify(u) === JSON.stringify(v)
        ),
        1
      )
    },
    gotoHome() {
      this.$router.push('/')
    },
    startAll() {
      this.$store.dispatch('SET_PARAM', this.contentForm.paramsInput)
      this.$router.push('/start')
    },
    /**
     * 打印日志
     */
    writeLog(v) {
      EventBus.$emit('logs', `${new Date().toLocaleString()}: ${v}`)
    },
    async openSource() {
      if (!this.contentForm.url) {
        this.$alert('请输入主页面网址', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      this.openSourceLoading = true
      const url = this.contentForm.url.replace(/\[分页位置\]/g, 1)
      this.pageSource = await rp({ uri: url })
      this.sourceDialog = true
      this.openSourceLoading = false
    },
  },
  watch: {
    'contentForm.paramsInput'() {
      this.$store.dispatch('SET_PARAM', this.contentForm.paramsInput)
    },
  },
}
</script>
<style lang="scss" scoped>
.params-list {
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.line,
.close-btn {
  text-align: center;
}

.content-select {
  width: 500px;
}
</style>
