<template>
  <div class="details-page">
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
        <el-form label-width="100px">
          <el-form-item label="内容页链接">
            <el-select v-model="contentForm.url" size="mini">
              <el-option v-for="(v, i) in url" :key="i" :label="v" :value="v"></el-option>
            </el-select>
            <el-button type="primary" @click="openInBrowser" size="mini">从浏览器打开</el-button>
          </el-form-item>
          <el-form-item label="字段配置">
            <el-row  v-for="(v, i) in contentForm.paramsInput" :key="i">
              <el-col :span="6">
                <el-input v-model="v.name" placeholder="请输入参数名称" size="mini"></el-input>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="6">
                <el-input v-model="v.param" placeholder="请输入参数选择器" size="mini"></el-input>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="6">
                <el-input v-model="v.value" placeholder="获取值" size="mini"></el-input>
              </el-col>
              <el-col :span="3" class="close-btn">
                <el-button type="danger" @click="deleteParam(v)" icon="el-icon-close" circle size="mini"></el-button>
              </el-col>
            </el-row>
            <el-button type="primary" @click="addParam" size="mini">添加参数</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="start" size="mini" v-if="!startStatus">测试数据获取</el-button>
            <el-button type="danger" @click="stop" size="mini" v-else>结束</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="gotoHome" size="mini">返回首页</el-button>
          </el-form-item>
        </el-form>
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
  name: 'DetailsPage',
  components: { SystemInformation },
  data () {
    return {
      url: [],
      logs: [],
      startStatus: false,
      contentForm: {
        url: '',
        paramsInput: [{
          name: '',
          param: '',
          value: ''
        }]
      }
    }
  },
  mounted () {
    if (this.$store.state.siteObj) {
      const arr = Object.keys(this.$store.state.siteObj)
      arr.forEach(v => {
        this.url = [...this.url, ...this.$store.state.siteObj[v]]
      })
      if (this.url.length > 50) {
        this.url.length = 50
      }
    }
  },
  methods: {
    async start () {
      if (this.contentForm.url === '') {
        remote.dialog.showMessageBox({
          type: 'info',
          title: '提示',
          message: '请选择链接',
          buttons: ['ok']
        })
        return
      }
      if (this.contentForm.paramsInput.length === 0) {
        remote.dialog.showMessageBox({
          type: 'info',
          title: '提示',
          message: '请配置参数',
          buttons: ['ok']
        })
        return
      }
      this.startStatus = true
      browser = await puppeteer.launch({
        headless: true
      })
      this.writeLog('browser init')
      page = await browser.newPage()
      this.writeLog('open new page')
      try {
        await page.goto(this.contentForm.url)
        this.writeLog(`go to ${this.contentForm.url}`)
        let house = {}
        this.contentForm.paramsInput.length > 0 && this.contentForm.paramsInput.forEach(async v => {
          house[v.name] = await page.$eval(v.param, a => a.innerHTML)
          v.value = house[v.name]
          this.writeLog(`${v.name}: ${house[v.name]}`)
        })
        this.startStatus = false
        browser.close()
        this.writeLog('结束, 关闭浏览器')
        page = null
        browser = null
      } catch (e) {
        this.writeLog(e)
      }
    },
    stop () {
      browser.close()
      this.writeLog('结束, 关闭浏览器')
      page = null
      browser = null
      this.startStatus = false
    },
    addParam () {
      this.contentForm.paramsInput.push({
        name: '',
        param: ''
      })
    },
    openInBrowser () {
      if (this.contentForm.url === '') {
        remote.dialog.showMessageBox({
          type: 'info',
          title: '提示',
          message: '请选择链接',
          buttons: ['ok']
        })
        return
      }
      let win = new BrowserWindow({ width: 800, height: 600, show: false })
      win.on('closed', function () {
        win = null
      })
      win.loadURL(this.contentForm.url)
      win.show()
    },
    deleteParam (v) {

    },
    gotoHome () {
      // this.$router.push('/')
      this.$router.back()
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
      this.logs.push(v)
    }
  }
}
</script>
<style lang="scss" scoped>
main {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
.line,
.close-btn {
  text-align: center;
}
</style>
