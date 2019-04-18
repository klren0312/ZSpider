<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <system-information></system-information>
      </div>

      <div class="right-side">
        <input type="text" v-model="mainUrl">
        <input type="text" v-model="linkRule">
        <input type="text" v-model="selectAttr">
        <button @click="start">start</button>
        <button @click="seeTree">see details</button>
        <div class="log-list">
          <p class="log-line" v-for="(v, i) in logs" :key="i">{{v}}</p>
        </div>
        <div class="result-list">
          <details v-for="(v, i) in treeTitleArr" :key="i">
            <summary>{{v}}</summary>
            <ul>
              <li v-for="(u, i) in treeObj[v]" :key="i">{{u}}</li>
            </ul>
          </details>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SystemInformation from './LandingPage/SystemInformation'
const puppeteer = require('puppeteer')
const { remote } = require('electron')
let browser = null
let page = null
export default {
  name: 'landing-page',
  components: { SystemInformation },
  data () {
    return {
      mainUrl: 'http://hf.rent.house365.com/district/',
      urlArr: [],
      linkRule: '#JS_listPag > dd > div.info > h3 > a',
      selectAttr: 'href',
      logs: [],
      treeObj: {},
      treeTitleArr: []
    }
  },
  methods: {
    async start () {
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
      for (let i = 2; i < 140; i++) {
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
    },
    /**
     * 打印日志
     */
    writeLog (v) {
      if (this.logs.length > 30) {
        this.logs.shift()
      }
      this.logs.push(v)
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
