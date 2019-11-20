<template>
  <div id="wrapper">
    <main>
      <div class="right-side">
        <el-form label-width="80px">
          <el-form-item label="页面地址">
            <div class="main-url">
              <el-input ref="MainUrlInput" class="main-url-input" type="text" v-model="mainUrl"  size="mini" clearable/>
              <el-button type="text" size="mini" @click="insert('input', 'MainUrlInput', '[分页位置]')">[分页位置]</el-button>
            </div>
            <el-button type="primary" @click="openInBrowser" size="mini">从浏览器打开</el-button>
          </el-form-item>
          <el-form-item label="选择器">
            <el-input v-model="linkRule" size="mini"/>
          </el-form-item>
          <el-form-item label="爬取页数">
            <el-input-number v-model="page" size="mini"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="start" size="mini" v-if="!startStatus">开始测试</el-button>
            <el-button type="danger" @click="stop" size="mini" v-else>结束测试</el-button>
            <el-button :disabled="JSON.stringify(treeObj) === '{}'" @click="seeTree" size="mini">查看数据</el-button>
            <!-- <el-tooltip class="item" effect="dark" content="等产生详情页链接后才能进行配置" placement="bottom">
              <el-button  type="primary" plain :disabled="JSON.stringify(treeObj) === '{}'" @click="gotoDetails" size="mini">配置详情页</el-button>
            </el-tooltip> -->
            <!-- <el-button  type="primary" plain @click="gotoDetails" size="mini">配置详情页</el-button> -->
          </el-form-item>
        </el-form>
        <el-dialog
          title="查看数据"
          :visible.sync="dataDialog"
          width="700px">
          <el-button circle icon="el-icon-refresh" @click="refreshData"></el-button>
          <div class="result-list">
            <details v-for="(v, i) in treeTitleArr" :key="i">
              <summary>{{v}}</summary>
              <ul>
                <li v-for="(u, i) in treeObj[v]" :key="i">{{u}}</li>
              </ul>
            </details>
          </div>
        </el-dialog>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EventBus from '@/utils/EventBus'
import insertText from '@/utils/InsertText'
import { getConfig, setContentUrls } from '@/service/rule.service'
const puppeteer = require('puppeteer-core')
const { remote } = require('electron')
const BrowserWindow = require('electron').remote.BrowserWindow

let browser = null
let page = null
export default {
  name: 'landing-page',
  data () {
    return {
      dataDialog: false,
      mainUrl: 'http://hf.rent.house365.com/district/dl_p[分页位置].html',
      urlArr: [],
      linkRule: '#JS_listPag > dd > div.info > h3 > a',
      page: 20,
      treeObj: {},
      treeTitleArr: [],
      startStatus: false
    }
  },
  computed: mapState({
    chromePath: state => state.chromePath
  }),
  mounted () {
    this.initData()
  },
  methods: {
    /**
     * 初始化数据
     */
    initData () {
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
    insert (type, el, text) {
      const dom = this.$refs[el]
      insertText(dom.$refs[type], text)
    },
    /**
     * 前往详情页
     */
    refreshData () {
      this.treeTitleArr = Object.keys(this.treeObj)
    },
    stop () {
      browser.close()
      this.writeLog('结束, 关闭浏览器')
      page = null
      browser = null
      this.startStatus = false
    },
    /**
     * 开始爬
     */
    async start () {
      if (!this.mainUrl) {
        remote.dialog.showMessageBox({
          type: 'error',
          title: '错误',
          message: '请输入主页面网址',
          buttons: ['ok']
        })
        return
      }
      this.$store.dispatch('SET_RULE', {
        mainUrl: this.mainUrl,
        page: this.page,
        linkRule: this.linkRule
      })
      this.startStatus = true
      this.treeObj = {}
      this.$store.dispatch('CTRL_LOG', true)
      browser = await puppeteer.launch({
        headless: true,
        executablePath: this.chromePath,
        args: [ // 禁用一些功能
          '--no-sandbox', // 沙盒模式
          '--disable-setuid-sandbox', // uid沙盒
          '--disable-dev-shm-usage', // 创建临时文件共享内存
          '--disable-accelerated-2d-canvas', // canvas渲染
          '--disable-gpu' // GPU硬件加速
        ],
        ignoreDefaultArgs: ['--enable-automation']
      })
      this.writeLog('browser init')
      page = await browser.newPage()
      this.writeLog('open new page')
      this.gotoMain()
    },
    /**
     * 前往主页面
     */
    async gotoMain () {
      if (!this.mainUrl) {
        remote.dialog.showMessageBox({
          type: 'error',
          title: '错误',
          message: '请输入主页面网址',
          buttons: ['ok']
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
        let urls = await page.$$eval(this.linkRule, a =>
          a.map(v => {
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
    saveContentUrls (obj) {
      const arr = Object.keys(obj)
      let urls = []
      arr.forEach(v => {
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
    writeLog (v) {
      EventBus.$emit('logs', `${new Date().toLocaleString()}: ${v}`)
    },
    seeTree () {
      if (JSON.stringify(this.treeObj) === '{}') {
        remote.dialog.showMessageBox({
          type: 'info',
          title: '提示',
          message: '暂无数据, 是否开始采集?',
          buttons: ['ok', 'no']
        }, index => {
          if (!index) {
            this.start()
          }
        })
        return
      }
      this.treeTitleArr = Object.keys(this.treeObj)
      this.$nextTick(_ => {
        this.dataDialog = true
      })
    },
    openInBrowser () {
      if (!this.mainUrl) {
        remote.dialog.showMessageBox({
          type: 'error',
          title: '错误',
          message: '请输入主页面网址',
          buttons: ['ok']
        })
        return
      }
      let win = new BrowserWindow({ width: 800, height: 600, show: false, frame: true })
      win.on('closed', function () {
        win = null
      })
      win.loadURL(this.mainUrl.replace(/\[分页位置\]/g, 1))
      win.show()
    }
  }
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
    li {
      padding-left: 20px;
    }
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .right-side {
    width: 78%;
  }

  .result-list {
    max-height: 250px;
    overflow: auto;
  }
  .main-url {
    .main-url-input {
      width: 500px;
    }
  }
  .el-input__inner {
    font-size: 14px;
    letter-spacing: 1px;
    font-weight: bold;
  }
</style>
