<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <system-information></system-information>
        <div class="run-logs">
          <h3>运行日志</h3>
          <div class="log-list" ref="logList">
            <p class="log-line" v-for="(v, i) in logs" :key="i">{{v}}</p>
          </div>
        </div>
      </div>

      <div class="right-side">
        <el-form label-width="80px">
          <el-form-item label="页面地址">
            <el-input type="text" v-model="mainUrl"  size="mini"/>
            <el-button type="primary" @click="openInBrowser" size="mini">从浏览器打开</el-button>
          </el-form-item>
          <el-form-item label="选择器">
            <el-input v-model="linkRule" size="mini"/>
          </el-form-item>
          <el-form-item label="爬取页数">
            <el-input-number v-model="pages" size="mini"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="start" size="mini" v-if="!startStatus">开始</el-button>
            <el-button type="danger" @click="stop" size="mini" v-else>结束</el-button>
            <el-button :disabled="JSON.stringify(treeObj) === '{}'" @click="seeTree" size="mini">查看数据</el-button>
            <el-tooltip class="item" effect="dark" content="等产生详情页链接后才能进行配置" placement="bottom">
              <el-button  type="primary" plain :disabled="JSON.stringify(treeObj) === '{}'" @click="gotoDetails" size="mini">配置详情页</el-button>
            </el-tooltip>
            <el-button  type="primary" plain @click="gotoDetails" size="mini">配置详情页</el-button>
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
import SystemInformation from '@/components/LandingPage/SystemInformation'
const puppeteer = require('puppeteer')
const { remote } = require('electron')
const BrowserWindow = require('electron').remote.BrowserWindow

let browser = null
let page = null
export default {
  name: 'landing-page',
  components: { SystemInformation },
  data () {
    return {
      dataDialog: false,
      mainUrl: 'http://hf.rent.house365.com/district/',
      urlArr: [],
      linkRule: '#JS_listPag > dd > div.info > h3 > a',
      pages: 140,
      logs: [],
      treeObj: {},
      treeTitleArr: [],
      startStatus: false
    }
  },
  methods: {
    gotoDetails () {
      this.$store.dispatch('SET_SITE', this.treeObj)
      this.$store.dispatch('SET_RULE', {
        mainUrl: this.mainUrl,
        page: this.pages
      })
      this.$router.push('/details')
    },
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
    async start () {
      this.startStatus = true
      this.treeObj = {}
      browser = await puppeteer.launch({
        headless: true
      })
      this.writeLog('browser init')
      page = await browser.newPage()
      this.writeLog('open new page')
      this.gotoMain()
    },
    async gotoMain () {
      if (this.mainUrl === '') return
      try {
        await page.goto(this.mainUrl)
      } catch (e) {
        this.writeLog(e)
      }
      this.writeLog(`go to ${this.mainUrl}`)
      this.writeLog(`use css selector ${this.linkRule}`)
      let theUrls = await page.$$eval(this.linkRule, (a) => {
        return a.map(v => {
          return v.href
        })
      })
      this.treeObj[this.mainUrl] = theUrls
      this.writeLog(theUrls.join('\n'))
      if (this.pages < 2) return
      for (let i = 2; i < this.pages; i++) {
        const pageUrl = `${this.mainUrl}dl_p${i}.html`
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
        this.writeLog(urls.join('\n'))
      }

      browser.close()
      this.writeLog('结束, 关闭浏览器')
      page = null
      browser = null
      this.startStatus = false
    },
    /**
     * 打印日志
     */
    writeLog (v) {
      if (this.logs.length > 30) {
        this.logs.shift()
      }
      const el = this.$refs.logList
      el.scrollTop = el.scrollHeight
      this.logs.push(`${new Date().toLocaleString()}: ${v}`)
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
      let win = new BrowserWindow({ width: 800, height: 600, show: false })
      win.on('closed', function () {
        win = null
      })
      win.loadURL(this.mainUrl)
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

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    min-height: 100vh;
    padding: 60px 80px;
    width: 100vw;
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

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .run-logs {
    margin-top: 20px;
  }
  .log-list {
    max-height: 150px;
    padding-top: 10px;
    overflow-y: auto;
    list-style-type: none;
    background: #323232;
    .log-line {
      margin-bottom: 0;
      padding-left: 20px;
      color: antiquewhite;
    }
  }

  .result-list {
    max-height: 250px;
    overflow: auto;
  }
</style>
