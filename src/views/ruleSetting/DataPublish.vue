<template>
  <main class="data-publish">
    <div class="filter">
      <el-button type="primary" size="mini" @click="createDialog=true" icon="el-icon-plus">新建发布</el-button>
      <el-button type="success" size="mini" @click="exportExcel" icon="el-icon-download">导出EXCEL</el-button>
      <el-button type="success" size="mini" @click="exportJSON" icon="el-icon-download">导出JSON</el-button>
      <div class="data-total">当前数据总数: <strong>{{datas.length}}</strong>条</div>
    </div>
    <el-table
      border
      :data="publishData"
      style="width: 100%">
      <el-table-column
        label="ID"
        type="index"
        width="40px">
      </el-table-column>
      <el-table-column
        label="发布名称"
        prop="name"
        show-overflow-tooltip
        width="130px">
      </el-table-column>
      <el-table-column
        label="数据库地址"
        prop="host">
      </el-table-column>
      <el-table-column
        label="端口"
        prop="port">
      </el-table-column>
      <el-table-column
        label="用户名"
        prop="user">
      </el-table-column>
      <el-table-column
        label="密码"
        prop="password"
        width="80px">
        <template>
          <div>******</div>
        </template>
      </el-table-column>
      <el-table-column
        label="数据库"
        prop="database">
      </el-table-column>
      <el-table-column
        label="数据表"
        prop="table">
      </el-table-column>
      <el-table-column
        label="发布结果">
        <template slot-scope="scope">
          <div>
            <el-tag effect="dark" type="success">{{scope.row.success}}</el-tag>
            <el-tag effect="dark" type="danger">{{scope.row.fail}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="300px">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
          <el-button @click="publish(scope.row)" type="success" size="mini">发布</el-button>
          <el-button @click="clear(scope.row)" type="warning" size="mini">清空表</el-button>
          <el-button @click="deletePublish(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建/编辑弹框 -->
    <el-dialog
      :title="isEdit ? '编辑发布' : '新建发布'"
      :visible.sync="createDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="60%">
      <div class="tips">测试数据库连接后, 才能{{isEdit ? "编辑" : "创建"}}发布</div>
      <el-form class="form-block" label-width="100px" ref="publishForm" :model="form" :rules="formRules">
        <div class="left-form">
          <el-form-item label="发布名称:" prop="name">
            <el-input v-model="form.name" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="数据库地址:" prop="host">
            <el-input v-model="form.host" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="端口:" prop="port">
            <el-input-number v-model="form.port" controls-position="right"  size="mini"></el-input-number>
          </el-form-item>
          <el-form-item label="用户名:" prop="user">
            <el-input v-model="form.user" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input v-model="form.password" type="password" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="数据库:" prop="database">
            <el-input v-model="form.database" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="数据表:" prop="table">
            <el-input v-model="form.table" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button plain size="small" @click="testConnect(form)">测试连接</el-button>
          </el-form-item>
        </div>
        <div class="right-form">
          <el-form-item v-for="(v, i) in form.params" :key="i" :label="`${v.name}:`">
            <el-select v-model="v.dbParam">
              <el-option v-for="v in dbParams" :key="v" :value="v"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialog = false, isEdit = false" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small" :disabled="!isTest">确 定</el-button>
      </span>
    </el-dialog>
  </main>
</template>
<script>
import { getConfig, getPublishConfig, addPublish, editPublishById, deletePublish } from '@/service/rule.service'
import { getDatas } from '@/service/data.service'
const mysql = require('mysql2')
const { remote } = require('electron')
const fs = require('fs')

export default {
  name: 'DataPublish',
  data () {
    return {
      publishData: [],
      form: {
        name: '',
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: '',
        table: '',
        params: ''
      },
      formRules: {
        host: [{ required: true, message: '请填写数据库地址', trigger: 'blur' }],
        port: [{ required: true, message: '请填写数据库端口', trigger: 'blur' }],
        user: [{ required: true, message: '请填写数据库用户名', trigger: 'blur' }],
        database: [{ required: true, message: '请填写数据库名称', trigger: 'blur' }],
        table: [{ required: true, message: '请填写数据库表名', trigger: 'blur' }]
      },
      createDialog: false,
      isTest: false,
      dbParams: [],
      publishStatus: false,
      isEdit: false,
      datas: []
    }
  },
  mounted () {
    this.getPublish()
    this.getParams()
    this.datas = getDatas()
  },
  methods: {
    /**
     * 获取发布配置
     */
    getPublish () {
      const arr = getPublishConfig()
      this.publishData = JSON.parse(JSON.stringify(arr))
    },
    /**
     * 获取参数
     */
    getParams () {
      this.form.params = getConfig().params
      this.form.params && this.form.params.forEach(v => {
        v.dbParam = ''
      })
    },
    /**
     * 测试数据库连接
     */
    testConnect (form) {
      this.$refs.publishForm.validate(async (valid) => {
        if (valid) {
          try {
            const conn = await mysql.createConnectionPromise({
              host: form.host,
              port: form.port,
              user: form.user,
              password: form.password,
              database: form.database
            })
            if (conn.connection.authorized) {
              remote.dialog.showMessageBox({
                type: 'info',
                title: '成功',
                message: '数据库连接成功!',
                buttons: ['ok']
              })
            } else {
              return false
            }
            this.isTest = true
            conn.query(`select column_name,column_comment,data_type from information_schema.columns where table_name='${form.table}'`, (e, r) => {
              if (e) throw e
              this.dbParams = r.map(v => v.column_name)
              this.form.params.forEach(v => {
                if (this.dbParams.indexOf(v.name) !== -1) {
                  v.dbParam = v.name
                }
              })
            })
            conn.end()
          } catch (error) {
            remote.dialog.showMessageBox({
              type: 'error',
              title: '错误',
              message: error.message,
              buttons: ['ok']
            })
          }
        }
      })
    },
    /**
     * 编辑发布
     */
    edit (row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.isEdit = true
      this.createDialog = true
    },
    /**
     * 保存发布
     */
    save () {
      if (!this.form.name && !this.isEdit) {
        this.form.name = this.generateGuid()
      }
      this.$refs.publishForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.form.fail = 0
            this.form.success = 0
            const obj = JSON.parse(JSON.stringify(this.form))
            delete obj.id
            editPublishById(this.form.id, obj)
            this.isEdit = false
          } else {
            this.form.fail = 0
            this.form.success = 0
            addPublish(this.form)
          }
          this.createDialog = false
          this.getPublish()
        }
      })
    },
    /**
     * 生成guid
     */
    generateGuid () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    /**
     * 删除发布
     */
    deletePublish (row) {
      remote.dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: '确定要删除该发布配置?',
        buttons: ['ok', 'no']
      }, index => {
        if (index === 0) {
          deletePublish(row.id)
          this.getPublish()
        } else {
        }
      })
    },
    /**
     * 发布数据
     */
    async publish (row) {
      this.publishStatus = true
      try {
        const conn = await mysql.createConnectionPromise({
          host: row.host,
          port: row.port,
          user: row.user,
          password: row.password,
          database: row.database
        })
        for (let i = 0, len = this.datas.length; i < len; i++) {
          const d = this.datas[i]
          try {
            await conn.query(`INSERT INTO ${row.table} SET ?`, d)
            row.success++
          } catch (error) {
            console.error(error)
            row.fail++
          }
        }
        conn.end()
      } catch (error) {
        remote.dialog.showMessageBox({
          type: 'error',
          title: '错误',
          message: error.message,
          buttons: ['ok']
        })
      }
      this.publishStatus = false
      editPublishById(row.id, { fail: row.fail, success: row.success })
    },
    /**
     * 清空表
     */
    async clear (row) {
      try {
        const conn = await mysql.createConnectionPromise({
          host: row.host,
          port: row.port,
          user: row.user,
          password: row.password,
          database: row.database
        })
        await conn.query(`truncate table ${row.table}`)
        conn.end()
        remote.dialog.showMessageBox({
          type: 'info',
          title: '提示',
          message: `已清空数据表(${row.table})`,
          buttons: ['ok']
        })
      } catch (error) {
        remote.dialog.showMessageBox({
          type: 'error',
          title: '错误',
          message: error.message,
          buttons: ['ok']
        })
      }
    },
    /**
     * 导出excel
     */
    exportExcel () {
      // const headers = getConfig().params
      // if (Array.isArray(headers) && headers.length) {
      //   this.datas = getDatas()
      //   const styles = {
      //     headerDark: {
      //       fill: {
      //         fgColor: {
      //           rgb: 'FF000000'
      //         }
      //       },
      //       font: {
      //         color: {
      //           rgb: 'FFFFFFFF'
      //         },
      //         sz: 14,
      //         bold: true,
      //         underline: true
      //       }
      //     }
      //   }
      //   const tHeader = {}
      //   headers.forEach(v => {
      //     tHeader[v.name] = {
      //       displayName: v.note,
      //       headerStyle: styles.headerDark
      //     }
      //   })
      //   const report = excel.buildExport([{
      //     name: 'datas',
      //     heading: [],
      //     data: this.datas,
      //     specification: tHeader
      //   }])
      //   const path = remote.dialog.showSaveDialog({
      //     title: '选择保存路径',
      //     filters: [{
      //       name: 'xlsx文件',
      //       extensions: ['xlsx']
      //     }],
      //     properties: {
      //       openFile: true,
      //       openDirectory: false,
      //       multiSelections: false
      //     }
      //   })
      //   if (path) {
      //     fs.writeFile(`${path}`, report, () => {
      //       remote.dialog.showMessageBox({
      //         type: 'info',
      //         title: '导出结果',
      //         message: `导出成功, 路径: ${path}`,
      //         buttons: ['ok']
      //       })
      //     })
      //   }
      // } else {
      //   remote.dialog.showMessageBox({
      //     type: 'error',
      //     title: '错误',
      //     message: '请对应用进行配置',
      //     buttons: ['ok']
      //   })
      // }
    },
    /**
     * 导出JSON
     */
    exportJSON () {
      this.datas = getDatas()
      const path = remote.dialog.showSaveDialog({
        title: '选择保存路径',
        filters: [{
          name: 'JSON文件',
          extensions: ['json']
        }],
        properties: {
          openFile: true,
          openDirectory: false,
          multiSelections: false
        }
      })
      if (path) {
        fs.writeFile(`${path}`, JSON.stringify(this.datas), () => {
          remote.dialog.showMessageBox({
            type: 'info',
            title: '导出结果',
            message: `导出成功, 路径: ${path}`,
            buttons: ['ok']
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
main {
  flex-direction: column;
  padding: 20px 20px 0;
  .filter {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .data-total {
      margin-left: 20px;
      font-size: 14px;
    }
  }
  .tips {
    font-size: 14px;
    color: rgb(175, 175, 175);
    padding: 10px;
  }
  .form-block {
    display: flex;
  }
}
</style>
