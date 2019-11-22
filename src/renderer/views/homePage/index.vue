<template>
  <div class="home-page">
    <div class="filter">
      <el-dropdown split-button type="primary" size="mini" trigger="click" @command="handleCreate">
        新建应用
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="rule">规则应用</el-dropdown-item>
          <el-dropdown-item command="code">代码应用</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="mini" type="primary" @click="importApp">导入应用</el-button>
      <el-button size="mini" type="success" @click="getRemoteApp" :loading="remoteLoading">拉取远程应用</el-button>
    </div>
    <div class="card-container">
      <div class="card-block" v-for="v in appList" :key="v.id">
        <div class="card-item">
          <div class="subscript" v-if="v.hasOwnProperty('localId')">远程</div>
          <div class="card-header">
            <el-dropdown size="mini" trigger="click" @command="handleCtrl($event, v)">
              <button class="ctrl-btn">•••</button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="delete">删除</el-dropdown-item>
                <el-dropdown-item command="upload">上传</el-dropdown-item>
                <el-dropdown-item command="export">导出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="card-content" @click="toDetails(v)" :title="v.appName">
            <div class="card-icon" :class="v.type === 'rule' ? 'rule-icon' : ''"></div>
            <div class="card-title">{{v.appName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getApps, getAppById, editAppById, addApp, uploadApp, getRemoteApp, deleteApp } from '@/service/global.service'
import { clearRule, addRule } from '@/service/rule.service'
import { clearData } from '@/service/data.service'
const { remote } = require('electron')
const fs = require('fs')

export default {
  name: 'HomePage',
  data () {
    return {
      appList: [],
      remoteLoading: false
    }
  },
  mounted () {
    this.getAppList()
  },
  methods: {
    getAppList () {
      this.appList = getApps()
    },
    handleCtrl ($event, app) {
      if ($event === 'delete') {
        this.deleteApp(app.id)
      } else if ($event === 'upload') {
        uploadApp(app).then(res => {
          remote.dialog.showMessageBox({
            type: 'info',
            title: '上传结果',
            message: res.message,
            buttons: ['ok']
          })
        })
      } else if ($event === 'export') {
        const details = getAppById(app.id)
        const path = remote.dialog.showSaveDialog({
          title: '选择保存路径',
          filters: [{
            name: 'zpk文件',
            extensions: ['zpk']
          }],
          properties: {
            openFile: true,
            openDirectory: false,
            multiSelections: false
          }
        })
        if (path) {
          fs.writeFile(`${path}`, JSON.stringify({
            ruleConfig: details.ruleConfig,
            type: app.type
          }), () => {
            remote.dialog.showMessageBox({
              type: 'info',
              title: '导出结果',
              message: `导出成功, 路径: ${path}`,
              buttons: ['ok']
            })
          })
        }
      }
    },
    /**
     * 新建触发
     */
    handleCreate (command) {
      clearRule()
      clearData()
      if (command === 'rule') {
        this.$router.push('/ruleSetting')
      } else {
        this.$router.push('/codeRule')
      }
    },
    /**
     * 拉取远程应用
     */
    getRemoteApp () {
      this.remoteLoading = false
      remote.dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: '拉取远程应用, 若与本地相同, 将覆盖本地应用, 是否继续?',
        buttons: ['ok', 'no']
      }, index => {
        if (index === 0) {
          getRemoteApp()
            .then(res => {
              res.data.forEach(v => {
                const localApp = getAppById(v.localId)
                if (localApp) {
                  const remoteApp = JSON.parse(JSON.stringify(v))
                  remoteApp.id = remoteApp.localId
                  editAppById(v.localId, remoteApp)
                } else {
                  const remoteApp = JSON.parse(JSON.stringify(v))
                  remoteApp.id = remoteApp.localId
                  addApp(remoteApp)
                  this.getAppList()
                }
              })
              this.remoteLoading = false
            })
            .catch(e => {
              this.remoteLoading = false
            })
        } else {
        }
      })
    },
    importApp () {
      const filePath = remote.dialog.showOpenDialog({
        title: '选择zpk文件',
        filters: [{
          name: 'zpk文件',
          extensions: ['zpk']
        }]
      })
      if (filePath) {
        /* eslint-disable */
        fs.readFile(filePath[0], 'utf8', (e, res) => {
          if (e) throw e
          const data = JSON.parse(res)
          addApp({
            appName: filePath[0].match(/([^\.\/\\]+)\.([a-z]+)$/i)[1],
            ruleConfig: data.ruleConfig,
            type: data.type
          })
          this.getAppList()
        })
        /* eslint-enable */
      }
    },
    deleteApp (id) {
      remote.dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: '确定要删除该应用?',
        buttons: ['ok', 'no']
      }, index => {
        if (index === 0) {
          deleteApp(id)
          this.getAppList()
        } else {
        }
      })
    },
    toDetails (data) {
      if (data.type === 'rule') {
        const details = getAppById(data.id)
        if (details) {
          const obj = JSON.parse(details.ruleConfig)
          addRule(obj)
          clearData()
          this.$nextTick(_ => {
            this.$router.push(`/ruleSetting?id=${details.id}&appName=${details.appName}`)
          })
        }
      } else {
        this.$router.push(`/codeRule?id=${data.id}&appName=${data.appName}`)
      }
    }
  }
}
</script>
<style lang="scss">
.home-page {
  padding: 20px;
  box-sizing: border-box;
}
.card-container {
  padding: 20px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .card-block {
    width: 15%;
    .card-item {
      position: relative;
      width: 150px;
      height: 150px;
      margin-bottom: 20px;
      border: 1px solid #f5f5f5;
      background: #fff;
      overflow: hidden;
      &:hover {
        border: 0;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      .subscript {
        position: absolute;
        top: 18px;
        left: -71px;
        height: 20px;
        width: 200px;
        text-align: center;
        font-size: 14px;
        background: linear-gradient(to right, #d38312, #f30092);
        color: #fff;
        transform: rotate(-45deg);
      }
    }
    .card-header {
      padding: 0 5px;
      height: 20%;
      text-align: right;
      .ctrl-btn {
        border: 0;
        background: transparent;
        color: #323232;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        &:hover {
          color: #000;
        }
      }
    }
    .card-content {
      padding: 0 20px;
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      cursor: pointer;
    }
    .card-title {
      width: 132px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }
    .card-icon {
      width: 36px;
      height: 36px;
      background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik0yODcgNjJoNTMwLjM1N2M0NSAwIDgwLjM1NyAzNS4zNTcgODAuMzU3IDgwLjM1N3YzMDUuMzU3SDE1OC40M1YxOTAuNTcxQzE1OC40MjkgMTE5Ljg1NyAyMTYuMjg2IDYyIDI4NyA2MnoiIGZpbGw9IiNCNUY1RUMiLz48cGF0aCBkPSJNNjQ3IDYySDIzOC43ODZjLTQ1IDAtODAuMzU3IDM1LjM1Ny04MC4zNTcgODAuMzU3djczOS4yODZjMCA0NSAzNS4zNTcgODAuMzU3IDgwLjM1NyA4MC4zNTdoNTc1LjM1N2M0NSAwIDgwLjM1Ny0zNS4zNTcgODAuMzU3LTgwLjM1N1YzMDkuNUw2NDcgNjJ6IiBmaWxsPSIjMzZDRkM5Ii8+PHBhdGggZD0iTTY1MC4yMTQgNjJ2MTg2LjQyOWMwIDMyLjE0MiAyNS43MTUgNjEuMDcxIDYxLjA3MiA2MS4wNzFoMTg2LjQyOEw2NTAuMjE0IDYyeiIgZmlsbD0iIzA4OTc5QyIvPjxwYXRoIGQ9Ik0yODcgNDE1LjU3MWE0OC4yMTQgNDguMjE0IDAgMSAwIDk2LjQyOSAwIDQ4LjIxNCA0OC4yMTQgMCAxIDAtOTYuNDI5IDB6TTUxMiAzODMuNDI5aDE5Mi44NTdjMTkuMjg2IDAgMzIuMTQzIDEyLjg1NyAzMi4xNDMgMzIuMTQycy0xMi44NTcgMzIuMTQzLTMyLjE0MyAzMi4xNDNINTEyYy0xOS4yODYgMC0zMi4xNDMtMTIuODU3LTMyLjE0My0zMi4xNDNTNDkyLjcxNCAzODMuNDMgNTEyIDM4My40M3ptMCAxNjAuNzE0aDE5Mi44NTdDNzI0LjE0MyA1NDQuMTQzIDczNyA1NTcgNzM3IDU3Ni4yODZzLTEyLjg1NyAzMi4xNDMtMzIuMTQzIDMyLjE0M0g1MTJjLTE5LjI4NiAwLTMyLjE0My0xMi44NTgtMzIuMTQzLTMyLjE0M3MxMi44NTctMzIuMTQzIDMyLjE0My0zMi4xNDN6bTAgMTYwLjcxNGgxOTIuODU3QzcyNC4xNDMgNzA0Ljg1NyA3MzcgNzE3LjcxNCA3MzcgNzM3cy0xMi44NTcgMzIuMTQzLTMyLjE0MyAzMi4xNDNINTEyYy0xOS4yODYgMC0zMi4xNDMtMTIuODU3LTMyLjE0My0zMi4xNDNzMTIuODU3LTMyLjE0MyAzMi4xNDMtMzIuMTQzek0yODcgNTc2LjI4NmE0OC4yMTQgNDguMjE0IDAgMSAwIDk2LjQyOSAwIDQ4LjIxNCA0OC4yMTQgMCAxIDAtOTYuNDI5IDB6TTI4NyA3MzdhNDguMjE0IDQ4LjIxNCAwIDEgMCA5Ni40MjkgMEE0OC4yMTQgNDguMjE0IDAgMSAwIDI4NyA3Mzd6IiBmaWxsPSIjQjVGNUVDIi8+PC9zdmc+);
      background-position: center;
      background-repeat: no-repeat;
      &.rule-icon {
        background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik0xNTQuNjg3IDMyOC40MjhsLTEuMjg3LjY0NHYzNjQuODlMNTExLjIxIDg4Mi4yVjUwNi4zN2wtMzU2LjUyNC0xNzcuOTR6IiBmaWxsPSIjRkZGIi8+PHBhdGggZD0iTTg2OC4zOCAzMjguNzVMNTExLjIxIDE0MC44MzQgMTY4LjUyMyAzMjEuMDI4bC0xMy44MzYgNy40TDUxMS4yMSA1MDYuMzdsNC4xODQtMS45MyAzNTMuOTUtMTc1LjA0NXYtLjMyMmwtLjk2NS0uMzIyek01MTUuMzk1IDUwNC40MzhsLTQuMTg0IDEuOTMxIDQuMTg0LTEuOTN6IiBmaWxsPSIjOTFENUZGIi8+PHBhdGggZD0iTTkzOS44MTQgMjk0LjMyYTU5Ljg1IDU5Ljg1IDAgMCAwLTI1LjQyLTI2LjcwN0w1MzguNTYxIDY4Ljc1N2E1OC44ODUgNTguODg1IDAgMCAwLTU0LjcwMSAwbC0zNzUuNTEgMTk3LjU3YTU4LjI0MSA1OC4yNDEgMCAwIDAtMTUuNDQ1IDEzLjgzNSA2NC4zNTUgNjQuMzU1IDAgMCAwLTkuNjUzIDEyLjU1IDU5Ljg1IDU5Ljg1IDAgMCAwLTYuNDM2IDI1Ljc0MXYzODYuMTI4YTU5LjIwNiA1OS4yMDYgMCAwIDAgMzIuMTc4IDUyLjEyOGwzNzUuNTEgMTk3LjU2OEE1OS4yMDYgNTkuMjA2IDAgMCAwIDUxMS4yMSA5NjJoNC41MDVhNTYuMzEgNTYuMzEgMCAwIDAgMjIuODQ2LTYuMTE0bDM3NS41MS0xOTcuNTY5YTU5LjIwNiA1OS4yMDYgMCAwIDAgMzIuMTc3LTUyLjEyN1YzMTguNDUzYTU2LjYzMiA1Ni42MzIgMCAwIDAtNi40MzUtMjQuMTMzem0tNzAuNDY5IDM1LjA3NGwtMzUzLjk1IDE3NS4wNDQtNC4xODQgMi4yNTNWODgyLjJMMTUzLjA3OCA2OTMuOTYyVjMyOS4wNzJsMTMuODM2LTcuNCAzNDQuMjk3LTE4MC44MzhMODY4LjM4IDMyOC43NXoiIGZpbGw9IiM0MEE5RkYiLz48L3N2Zz4=);
      }
    }

  }
}
</style>
