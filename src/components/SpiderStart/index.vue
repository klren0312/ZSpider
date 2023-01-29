<template>
  <div></div>
</template>
<script>
import { mapState } from 'vuex'
import EventBus from '@/utils/EventBus'
import { clearData, addData } from '@/service/data.service'
const puppeteer = require('puppeteer-core')
let browser = null
let page = null
export default {
  name: 'SpiderStart',
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          config: {},
          contentUrls: [],
          publishConfig: {},
        }
      },
    },
  },
  data() {
    return {
      startStatus: false,
      showConfig: true,
      resultTable: [],
      spiderProgress: 0,
      tableParams: [],
    }
  },
  computed: mapState({
    chromePath: (state) => state.chromePath,
  }),
  methods: {
    /**
     * 复制
     */
    copy(str) {
      const el = document.createElement('textarea')
      el.value = str
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
      }
      this.$alert('复制成功', '提示', {
        confirmButtonText: '确定',
        callback: () => {},
      })
    },
    async doStart() {
      if (
        !this.spiderConfig.config.mainUrl ||
        !this.spiderConfig.config.linkRule ||
        !this.spiderConfig.config.params
      ) {
        this.$message.error('内容页参数未配置')
        return
      }
      // 启动前清空历史采集数据
      clearData()
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
      this.writeLog('初始化完成')
      page = await browser.newPage()
      // 获取内容页链接
      this.writeLog('内容页链接采集开始')
      for (let i = 1; i <= parseInt(this.spiderConfig.config.page); i++) {
        const pageUrl = this.spiderConfig.config.mainUrl.replace(
          /\[分页位置\]/g,
          i
        )
        try {
          await page.goto(pageUrl)
        } catch (e) {
          this.writeLog(e)
        }
        const urls = await page.$$eval(this.spiderConfig.config.linkRule, (a) =>
          a.map((v) => {
            return v.href
          })
        )
        this.spiderConfig.contentUrls.push(...urls)
        this.writeLog(urls.join('\n'))
      }
      this.writeLog('内容页链接采集结束')
      this.writeLog('内容页采集开始')
      for (
        let i = 0, len = this.spiderConfig.contentUrls.length;
        i < len;
        i++
      ) {
        try {
          this.spiderProgress = parseInt((((i + 1) / len) * 100).toFixed(2))
          await page.goto(this.spiderConfig.contentUrls[i])
          this.writeLog(`go to ${this.spiderConfig.contentUrls[i]}`)
          const arr = this.spiderConfig.config.params
          const resData = await page.evaluate((arr) => {
            const obj = {}
            arr.length > 0 &&
              arr.forEach((v) => {
                try {
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
                } catch (error) {
                  console.error(error)
                }
                // that.writeLog(`${v.name}: ${obj[v.name]}`)
              })
            return obj
          }, arr)
          resData.sourceUrl = this.spiderConfig.contentUrls[i]
          resData.id = i
          this.spiderConfig.config.params.forEach((v) => {
            v.value = resData[v.name]
          })
          this.writeLog(`${JSON.stringify(resData)}`)
          this.resultTable.push(resData)
          if (this.resultTable.length > 50) {
            this.resultTable.shift()
          }
          addData(resData)
        } catch (e) {
          this.writeLog('采集报错: ' + e)
          if (
            e.indexOf('Most likely the page has been closed') !== -1 ||
            e.indexOf('Navigation failed because browser has disconnected') !==
              -1
          ) {
            break
          }
        }
      }
      this.writeLog('内容页采集结束')
      this.isStart = false
      browser.close()
      page = null
      browser = null
    },
    /**
     * 打印日志
     */
    writeLog(v) {
      EventBus.$emit('logs', `${new Date().toLocaleString()}: ${v}`)
    },
  },
  watch: {
    config: {
      handler: function (nv) {
        this.spiderConfig = nv
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
