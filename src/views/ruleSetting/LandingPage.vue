<template>
  <div id="wrapper" class="landing-page">
    <el-form label-position="top">
      <el-form-item label="页面地址">
        <div class="input-block">
          <el-input
            ref="MainUrlInput"
            class="input"
            type="text"
            v-model="mainUrl"
            clearable
          />
          <el-button
            type="text"
            @click="insert('input', 'MainUrlInput', '[分页位置]')"
          >
            [分页位置]
          </el-button>
          <el-button
            type="primary"
            @click="openSource"
            :loading="openSourceLoading"
          >
            查看页面源代码
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="内容页链接CSS选择器">
        <div class="input-block">
          <el-input class="input" v-model="linkRule" />
          <el-button class="selector-btn" type="primary" @click="getSelector">
            点击获取
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="爬取页数">
        <el-input-number v-model="page" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="start" v-if="!startStatus">
          开始测试
        </el-button>
        <el-button type="danger" @click="stop" v-else> 结束测试 </el-button>
        <el-button
          :disabled="JSON.stringify(treeObj) === '{}'"
          @click="seeTree"
        >
          查看数据
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="查看数据" :visible.sync="dataDialog" width="700px">
      <el-button circle icon="el-icon-refresh" @click="refreshData"></el-button>
      <div class="result-list">
        <details v-for="(v, i) in treeTitleArr" :key="i">
          <summary>{{ v }}</summary>
          <ul class="result-list-ul">
            <li class="result-list-li" v-for="(u, i) in treeObj[v]" :key="i">
              {{ u }}
            </li>
          </ul>
        </details>
      </div>
    </el-dialog>
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
import insertText from '@/utils/InsertText'
import { getConfig, setContentUrls } from '@/service/rule.service'
import rp from 'request-promise'
import puppeteer from 'puppeteer-core'
import CodeEditor from '@/components/CodeEditor/index.vue'
import { ipcRenderer } from 'electron'

let browser = null
let page = null
export default {
  name: 'landing-page',
  components: {
    CodeEditor,
  },
  data() {
    return {
      dataDialog: false,
      mainUrl: 'http://hf.rent.house365.com/district/dl_p[分页位置].html',
      urlArr: [],
      linkRule: '#JS_listPag > dd > div.info > h3 > a',
      page: 20,
      treeObj: {},
      treeTitleArr: [],
      startStatus: false,
      sourceDialog: false,
      openSourceLoading: false,
      pageSource: '',
    }
  },
  computed: mapState({
    chromePath: (state) => state.chromePath,
  }),
  mounted() {
    this.initData()
  },
  beforeDestroy() {
    ipcRenderer.removeListener('domSelectorData', this.setSelector)
  },
  methods: {
    /**
     * 打开选择器窗口
     */
    getSelector() {
      if (!this.mainUrl) {
        this.$alert('请输入主页面网址', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      const url = this.mainUrl.replace(/\[分页位置\]/g, 1)
      ipcRenderer.send('openReviewPage', url)
      ipcRenderer.on('domSelectorData', this.setSelector)
    },
    setSelector(e, data) {
      this.linkRule = data
    },
    /**
     * 初始化数据
     */
    initData() {
      const config = getConfig()
      if (config) {
        this.mainUrl = config.mainUrl ? config.mainUrl : ''
        this.page = config.page ? config.page : 0
        this.linkRule = config.linkRule ? config.linkRule : ''
      }
    },
    /**
     * 往指定的input中光标位置插入指定值
     */
    insert(type, el, text) {
      const dom = this.$refs[el]
      insertText(dom.$refs[type], text)
    },
    /**
     * 前往详情页
     */
    refreshData() {
      this.treeTitleArr = Object.keys(this.treeObj)
    },
    stop() {
      browser.close()
      this.writeLog('结束, 关闭浏览器')
      page = null
      browser = null
      this.startStatus = false
    },
    /**
     * 开始爬
     */
    async start() {
      if (!this.mainUrl) {
        this.$alert('请输入主页面网址', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      this.$store.dispatch('SET_RULE', {
        mainUrl: this.mainUrl,
        page: this.page,
        linkRule: this.linkRule,
      })
      this.startStatus = true
      this.treeObj = {}
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
      this.gotoMain()
    },
    /**
     * 前往主页面
     */
    async gotoMain() {
      if (!this.mainUrl) {
        this.$alert('请输入主页面网址', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      let spiderPage = this.page
      if (this.page > 5) {
        spiderPage = 5
      }
      for (let i = 1; i <= spiderPage; i++) {
        const pageUrl = this.mainUrl.replace(/\[分页位置\]/g, i)
        this.writeLog(`go to ${pageUrl}`)
        try {
          await page.goto(pageUrl)
        } catch (e) {
          this.writeLog(e)
        }
        const urls = await page.$$eval(this.linkRule, (a) =>
          a.map((v) => {
            return v.href
          })
        )
        this.treeObj[pageUrl] = urls
        this.saveContentUrls(this.treeObj)
        this.writeLog(urls.join('\n'))
      }
      browser.close()
      this.writeLog('测试采集, 最多采集五个')
      this.writeLog('结束, 关闭浏览器')
      page = null
      browser = null
      this.startStatus = false
    },
    /**
     * 存储内容页链接
     */
    saveContentUrls(obj) {
      const arr = Object.keys(obj)
      let urls = []
      arr.forEach((v) => {
        urls = [...urls, ...obj[v]]
      })
      if (urls.length > 50) {
        urls.length = 50
      }
      setContentUrls(urls)
      EventBus.$emit('SITES', urls)
    },
    /**
     * 打印日志
     */
    writeLog(v) {
      EventBus.$emit('logs', `${new Date().toLocaleString()}: ${v}`)
    },
    seeTree() {
      if (JSON.stringify(this.treeObj) === '{}') {
        this.$confirm('暂无数据, 是否开始采集?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
        })
          .then(() => {
            this.start()
          })
          .catch(() => {})
        return
      }
      this.treeTitleArr = Object.keys(this.treeObj)
      this.$nextTick(() => {
        this.dataDialog = true
      })
    },
    async openSource() {
      if (!this.mainUrl) {
        this.$alert('请输入主页面网址', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      this.openSourceLoading = true
      const url = this.mainUrl.replace(/\[分页位置\]/g, 1)
      this.pageSource = await rp({ uri: url })
      this.sourceDialog = true
      this.openSourceLoading = false
    },
  },
}
</script>

<style lang="scss">
.landing-page {
  .result-list {
    max-height: 250px;
    overflow: auto;
    &-ul {
      padding: 0;
      margin: 0;
      list-style-type: none;
    }
    &-li {
      padding-left: 20px;
    }
  }
  .input-block {
    .input {
      width: 400px;
    }
  }
  .el-input__inner {
    font-size: 14px;
    letter-spacing: 1px;
    font-weight: bold;
  }
  .source-code-block {
    height: 500px;
  }
  .selector-btn {
    margin-left: 10px;
  }
}
</style>
