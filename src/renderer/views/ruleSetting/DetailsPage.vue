<template>
  <div class="details-page">
    <main>
      <div>
        <el-form label-width="100px">
          <el-form-item label="内容页链接">
            <el-autocomplete
              size="mini"
              class="content-select"
              v-model="contentForm.url"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容页链接"
            ></el-autocomplete>
            <el-button type="primary" @click="openInBrowser" size="mini">从浏览器打开</el-button>
          </el-form-item>
          <el-form-item label="字段配置" >
            <el-button type="primary" @click="addParam" size="mini">添加参数</el-button>
            <el-button type="danger" @click="contentForm.paramsInput = []" size="mini">清空参数</el-button>
            <div class="params-list">
              <el-row v-for="(v, i) in contentForm.paramsInput" :key="i">
                <el-col :span="4">
                  <el-input v-model="v.name" placeholder="请输入参数名称" size="mini"></el-input>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="4">
                  <el-input v-model="v.param" placeholder="请输入参数选择器" size="mini"></el-input>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="4">
                  <el-input v-model="v.attr" placeholder="请输入属性名, 不使用则不填" size="mini"></el-input>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="3">
                  <el-input v-model="v.note" placeholder="请输入备注" size="mini"></el-input>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="3">
                  <el-input v-model="v.value" placeholder="获取值" size="mini"></el-input>
                </el-col>
                <el-col :span="1" class="close-btn">
                  <el-button type="danger" @click="deleteParam(v)" icon="el-icon-close" circle size="mini"></el-button>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="start" size="mini" v-if="!startStatus">测试数据获取</el-button>
            <el-button type="danger" @click="stop" size="mini" v-else>结束</el-button>
            <!-- <el-button type="success" @click="startAll" size="mini" :disabled="startStatus">进入采集准备</el-button>
            <el-button type="warning" @click="gotoHome" size="mini" :disabled="startStatus">返回首页</el-button> -->
          </el-form-item>
          <el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </main>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import EventBus from '@/utils/EventBus'
  import { dataDb, ruleDb } from '@/dataStore'
  const puppeteer = require('puppeteer-core')
  const {
    remote
  } = require('electron')
  const BrowserWindow = require('electron').remote.BrowserWindow
  let browser = null
  let page = null

  export default {
    name: 'DetailsPage',
    data () {
      return {
        url: [],
        logs: [],
        startStatus: false,
        contentForm: {
          url: '',
          /* eslint-disable */
          paramsInput: [
            {
              name: 'title',
              param: '.detailHead > .detailHead__title.fl.clearfix > p',
              attr: '',
              note: '标题',
              value: ''
            },
            {
              name: 'phone',
              param: '.infoDetail.fr > div.adviser > div.clearfix.btnBar > div',
              attr: 'telno',
              note: '电话',
              value: ''
            },
            {
              name: 'name',
              param: '.infoDetail.fr > div.adviser > div.clearfix.adviserPs > div.fl > div > div.adviserName.fl',
              attr: '',
              note: '姓名',
              value: ''
            },
            {
              name: 'price',
              param: '.infoDetail.fr > div.infoDetail__title',
              attr: '',
              note: '价格',
              value: ''
            },
            {
              name: 'size',
              param: '.infoDetail.fr > .infoDetail__content > div:nth-child(2) > div:nth-child(1)',
              attr: '',
              note: '面积',
              value: ''
            },
            {
              name: 'decoration',
              param: '.infoDetail.fr > div.infoDetail__content > div:nth-child(1) > div:nth-child(2)',
              attr: '',
              note: '装修',
              value: ''
            },
            {
              name: 'floor',
              param: '.infoDetail.fr > div.infoDetail__content > div:nth-child(2) > div:nth-child(2)',
              attr: '',
              note: '楼层',
              value: ''
            },
            {
              name: 'location',
              param: '.infoDetail.fr > div.infoDetail__content > div:nth-child(6) > div',
              attr: '',
              note: '地址',
              value: ''
            },
            {
              name: 'community',
              param: '.infoDetail.fr > div.infoDetail__content > div:nth-child(5) > div > a.infoDetail__item__local.line1',
              attr: '',
              note: '小区',
              value: ''
            },
            {
              name: 'time',
              param: '.infoDetail.fr > div.infoDetail__content > div:nth-child(7) > div',
              attr: '',
              note: '时间',
              value: ''
            },
            {
              name: 'propertyCosts',
              param: '.infoDetail.fr > div.infoDetail__content > div:nth-child(3) > div:nth-child(2)',
              attr: '',
              note: '物业费',
              value: ''
            },
            {
              name: 'description',
              param: '.detail__mainCotetn.clearfix > div.detail__mainCotetnL.fl > div.detail__mainCotetn__intro',
              attr: '',
              note: '装修',
              value: ''
            }
          ]
          /* eslint-enable */
        }
      }
    },
    computed: mapState({
      chromePath: state => state.chromePath
    }),
    mounted () {
      EventBus.$on('SITES', sites => {
        this.url = sites
        if (this.url.length > 50) {
          this.url.length = 50
        }
      })
      this.initData()
    },
    methods: {
      initData () {
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
      querySearch (queryString, cb) {
        const urls = JSON.parse(JSON.stringify(this.url))
        let formatArr = []
        urls.forEach(v => {
          formatArr.push({
            value: v
          })
        })
        // console.log(formatArr)
        cb(formatArr)
      },
      async start () {
        if (!this.contentForm.url) {
          remote.dialog.showMessageBox({
            type: 'error',
            title: '错误',
            message: '请选择链接',
            buttons: ['ok']
          })
          return
        }
        if (this.contentForm.paramsInput.length === 0) {
          remote.dialog.showMessageBox({
            type: 'error',
            title: '错误',
            message: '请配置参数',
            buttons: ['ok']
          })
          return
        }
        this.$store.dispatch('SET_PARAM', this.contentForm.paramsInput)
        this.startStatus = true
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
        try {
          await page.goto(this.contentForm.url)
          this.writeLog(`go to ${this.contentForm.url}`)
          let arr = this.contentForm.paramsInput
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
          this.contentForm.paramsInput.forEach(v => {
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
            type: 'error',
            title: '错误',
            message: '请选择链接',
            buttons: ['ok']
          })
          return
        }
        let win = new BrowserWindow({
          width: 800,
          height: 600,
          show: false,
          frame: true
        })
        win.on('closed', function () {
          win = null
        })
        win.loadURL(this.contentForm.url)
        win.show()
      },
      deleteParam (v) {
        // console.log(this.contentForm.paramsInput.findIndex(u => JSON.stringify(u) === JSON.stringify(v)))
        this.contentForm.paramsInput.splice(this.contentForm.paramsInput.findIndex(u => JSON.stringify(u) === JSON.stringify(v)), 1)
      },
      gotoHome () {
        this.$router.push('/')
      },
      startAll () {
        this.$store.dispatch('SET_PARAM', this.contentForm.paramsInput)
        this.$router.push('/start')
      },
      /**
       * 打印日志
       */
      writeLog (v) {
        EventBus.$emit('logs', `${new Date().toLocaleString()}: ${v}`)
      }
    },
    watch: {
      'contentForm.paramsInput' () {
        this.$store.dispatch('SET_PARAM', this.contentForm.paramsInput)
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

  .params-list {
    height: 400px;
    overflow-y: auto;
  }

  .line,
  .close-btn {
    text-align: center;
  }

  .content-select {
    width: 500px;
  }
</style>