<template>
  <div id="wrapper">
    <div class="config-container">
      <div class="config-title">
        <div>规则配置详情</div>
        <div class="ctrl-block">
          <el-progress class="spider-progress" :width="30" :stroke-width="2" type="circle" :percentage="spiderProgress"></el-progress>
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
          <el-table-column min-width="100" label="参数名" prop="name"></el-table-column>
          <el-table-column min-width="280" label="参数" prop="param"></el-table-column>
          <!-- <el-table-column label="参数参考值" prop="value"></el-table-column> -->
        </el-table>
      </template>
    </div>
    <div class="result-container">
      <el-table :data="resultTable" border height="500px">
        <el-table-column
          min-width="200px"
          v-for="(v, i) in tableParams"
          :key="i"
          :label="v.note ? v.note : v.name"
          :prop="v.name"
        ></el-table-column>
        <el-table-column width="200px" label="链接" prop="sourceUrl" fixed="right">
          <template slot-scope="scope">
            <span>{{scope.row.sourceUrl}}</span>
            <el-button type="text" @click="copy(scope.row.sourceUrl)">复制</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import EventBus from '@/utils/EventBus'
  import { getConfig } from '@/service/rule.service'
  import { clearData, addData } from '@/service/data.service'
  const puppeteer = require('puppeteer-core')
  const { remote } = require('electron')

  let browser = null
  let page = null

  export default {
    name: 'StartSpider',
    data () {
      return {
        isStart: false,
        config: {},
        urls: [],
        showConfig: true,
        resultTable: [],
        spiderProgress: 0,
        tableParams: []
      }
    },
    computed: mapState({
      chromePath: state => state.chromePath
    }),
    mounted () {
      this.getConfig()
    },
    methods: {
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
       * 复制
       */
      copy (str) {
        const el = document.createElement('textarea')
        el.value = str
        el.setAttribute('readonly', '')
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        document.body.appendChild(el)
        const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        if (selected) {
          document.getSelection().removeAllRanges()
          document.getSelection().addRange(selected)
        }
        remote.dialog.showMessageBox({
          type: 'info',
          title: '提示',
          message: '复制成功',
          buttons: ['ok']
        })
      },
      /**
       * 获取规则配置
       */
      getConfig () {
        this.config = getConfig()
        this.tableParams = this.config.params
      },
      async goToSpider () {
        if (!this.config.mainUrl || !this.config.linkRule) {
          remote.dialog.showMessageBox({
            type: 'error',
            title: '错误',
            message: '请先测试获取内容页',
            buttons: ['ok']
          })
          EventBus.$emit('toStep', 1)
          return
        }
        if (!this.config.params) {
          remote.dialog.showMessageBox({
            type: 'error',
            title: '错误',
            message: '请先配置内容页参数',
            buttons: ['ok']
          })
          EventBus.$emit('toStep', 2)
          return
        }
        // 启动前清空历史采集数据
        clearData()
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
        // 获取内容页链接
        for (let i = 1; i <= parseInt(this.config.page); i++) {
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
        for (let i = 0, len = this.urls.length; i < len; i++) {
          try {
            this.spiderProgress = parseInt((((i + 1) / len) * 100).toFixed(2))
            await page.goto(this.urls[i])
            this.writeLog(`go to ${this.urls[i]}`)
            let arr = this.config.params
            let house = await page.evaluate((arr) => {
              let obj = {}
              arr.length > 0 && arr.forEach(v => {
                try {
                  if (v.attr) {
                    obj[v.name] = (document.querySelector(v.param).getAttribute(v.attr))
                  } else {
                    obj[v.name] = (document.querySelector(v.param).innerHTML).trim().replace(/\s/g, '').replace(/<\/?.+?\/?>/g, '')
                  }
                  v.value = obj[v.name]
                } catch (error) {}
                // that.writeLog(`${v.name}: ${obj[v.name]}`)
              })
              return obj
            }, arr)
            house['sourceUrl'] = this.urls[i]
            house['id'] = i
            this.config.params.forEach(v => {
              v.value = house[v.name]
            })
            this.writeLog(`${JSON.stringify(house)}`)
            this.resultTable.push(house)
            if (this.resultTable.length > 50) {
              this.resultTable.shift()
            }
            addData(house)
          } catch (e) {
            this.writeLog('采集报错: ' + e)
            if (e.indexOf('Most likely the page has been closed') !== -1 || e.indexOf('Navigation failed because browser has disconnected') !== -1) {
              break
            }
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
        EventBus.$emit('logs', `${new Date().toLocaleString()}: ${v}`)
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
      .ctrl-block {
        width: 200px;
        display: flex;
        align-items: center;
      }
      .spider-progress {
        margin-right: 20px;
      }
    }
  }
</style>