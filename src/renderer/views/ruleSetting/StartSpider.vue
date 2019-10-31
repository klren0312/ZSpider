<template>
  <div id="wrapper">
    <div class="config-container">
      <div class="config-title">
        <div>规则配置详情</div>
        <div>
          <el-button type="primary" size="mini" @click="start" v-if="!isStart">开始采集</el-button>
          <el-button type="danger" size="mini" @click="end" v-else>停止采集</el-button>
          <el-button v-if="!showConfig" type="text" @click="showConfig=true">展开</el-button>
          <el-button v-else type="text" @click="showConfig=false">收起</el-button>
        </div>
      </div>
      <template v-if="showConfig">
        <div class="filter">
          <el-form :inline="true">
            <el-form-item label="主网址:">
              <div>{{config.mainUrl}}</div>
            </el-form-item>
            <el-form-item label="总页数:">
              <div>{{config.page}}</div>
            </el-form-item>
            <el-form-item label="内容页获取规则:">
              <div>{{config.linkRule}}</div>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="config.params" border height="400px">
          <el-table-column label="参数名" prop="name"></el-table-column>
          <el-table-column label="参数" prop="param"></el-table-column>
          <el-table-column label="参数参考值" prop="value"></el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>
<script>
  import db from '@/dataStore'
  import {
    mapActions
  } from 'vuex'
  const puppeteer = require('puppeteer')

  let browser = null
  let page = null

  export default {
    name: 'StartSpider',
    data () {
      return {
        isStart: false,
        config: {},
        urls: [],
        showConfig: true
      }
    },
    mounted () {
      this.getConfig()
    },
    methods: {
      ...mapActions({
        pushLogs: 'SAVE_LOGS'
      }),
      goToHome () {
        this.$router.push('/')
      },
      goBack () {
        this.$router.back()
      },
      start () {
        this.isStart = true
        this.goToSpider()
      },
      end () {
        this.isStart = false
        browser.close()
      },
      /**
       * 获取规则配置
       */
      getConfig () {
        this.config = db.get('config').value()
      },
      async goToSpider () {
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
          ]
        })
        this.writeLog('browser init')
        page = await browser.newPage()
        this.writeLog('open new page')
        // 获取内容页链接
        for (let i = 1; i < parseInt(this.config.page); i++) {
          const pageUrl = this.config.mainUrl.replace(/\[分页位置\]/g, i)
          this.writeLog(`go to ${pageUrl}`)
          try {
            await page.goto(pageUrl)
          } catch (e) {
            this.writeLog(e)
          }
          let urls = await page.$$eval(this.config.linkRule, a =>
            a.map(v => {
              return v.href
            })
          )
          this.urls.push(...urls)
          this.writeLog(urls.join('\n'))
        }
        this.writeLog('内容页链接采集结束')
        this.writeLog('下面开始内容页采集')
        console.log(this.urls)
        for (let i = 0, len = this.urls.length; i < len; i++) {
          try {
            await page.goto(this.urls[i])
            this.writeLog(`go to ${this.urls[i]}`)
            let arr = this.config.params
            let house = await page.evaluate((arr) => {
              let obj = {}
              arr.length > 0 && arr.forEach(v => {
                if (v.attr) {
                  obj[v.name] = (document.querySelector(v.param).getAttribute(v.attr))
                } else {
                  obj[v.name] = (document.querySelector(v.param).innerHTML).trim().replace(/\s/g, '').replace(/<\/?.+?\/?>/g, '')
                }
                v.value = obj[v.name]
                // that.writeLog(`${v.name}: ${obj[v.name]}`)
              })
              return obj
            }, arr)
            this.config.params.forEach(v => {
              v.value = house[v.name]
              this.writeLog(`${v.name}: ${house[v.name]}`)
            })
          } catch (e) {
            this.writeLog(e)
          }
        }
        this.isStart = false
        browser.close()
        this.writeLog('结束, 关闭浏览器')
        page = null
        browser = null
      },
      /**
       * 打印日志
       */
      writeLog (v) {
        this.pushLogs(`${new Date().toLocaleString()}: ${v}`)
      }
    }
  }
</script>
<style lang="scss">
  .config-container {
    .config-title {
      padding: 0 20px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
    }
  }
</style>