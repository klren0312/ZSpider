<template>
  <main class="data-publish">
    <div class="filter">
      <el-button icon="el-icon-plus" type="primary" size="medium" @click="createDialog=true">新建发布</el-button>
    </div>
    <el-table
      border
      :data="publishData"
      style="width: 100%">
      <el-table-column
        label="ID"
        prop="id"
        show-overflow-tooltip
        width="80px">
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
        prop="password">
        <template slot-scope="scope">
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
        width="250px">
        <template slot-scope="scope">
          <el-button @click="publish(scope.row)" type="primary" size="mini">发布</el-button>
          <el-button @click="clear(scope.row)" type="primary" size="mini">清空表</el-button>
          <el-button @click="deletePublish(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建弹框 -->
    <el-dialog
      title="新建发布"
      :visible.sync="createDialog"
      width="45%">
      <div class="tips">测试数据库连接后, 才能创建发布</div>
      <el-form label-width="100px" ref="publishForm" :model="form" :rules="formRules">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small" :disabled="!isTest">确 定</el-button>
      </span>
    </el-dialog>
  </main>
</template>
<script>
import { ruleDb, dataDb } from '@/dataStore'
const mysql = require('mysql2')
const { remote } = require('electron')
const collection = ruleDb.get('publishConfig')
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
        table: ''
      },
      formRules: {
        host: [{ required: true, message: '请填写数据库地址', trigger: 'blur' }],
        port: [{ required: true, message: '请填写数据库端口', trigger: 'blur' }],
        user: [{ required: true, message: '请填写数据库用户名', trigger: 'blur' }],
        database: [{ required: true, message: '请填写数据库名称', trigger: 'blur' }],
        table: [{ required: true, message: '请填写数据库表名', trigger: 'blur' }]
      },
      createDialog: false,
      isTest: false
    }
  },
  mounted () {
    this.getPublish()
  },
  methods: {
    /**
     * 获取发布配置
     */
    getPublish () {
      const arr = ruleDb.get('publishConfig').value()
      this.publishData = JSON.parse(JSON.stringify(arr))
    },
    /**
     * 测试数据库连接
     */
    testConnect (form) {
      this.$refs['publishForm'].validate(async (valid) => {
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
            }
            this.isTest = true
            conn.end()
          } catch (error) {
            remote.dialog.showMessageBox({
              type: 'error',
              title: '错误',
              message: '数据库连接失败:' + error,
              buttons: ['ok']
            })
          }
        }
      })
    },
    /**
     * 保存发布
     */
    save () {
      if (!this.form.name) {
        this.form.name = this.generateGuid()
      }
      this.$refs['publishForm'].validate((valid) => {
        if (valid) {
          this.form.fail = 0
          this.form.success = 0
          collection
            .insert({ ...this.form })
            .write()
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
        let v = c === 'x' ? r : (r & 0x3 | 0x8)
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
          collection
            .remove({ id: row.id })
            .write()
          this.getPublish()
        } else {
        }
      })
    },
    /**
     * 发布数据
     */
    async publish (row) {
      const conn = await mysql.createConnectionPromise({
        host: row.host,
        port: row.port,
        user: row.user,
        password: row.password,
        database: row.database
      })
      const datas = dataDb.get('data').value()
      for (let i = 0, len = datas.length; i < len; i++) {
        const d = datas[i]
        try {
          await conn.query(`INSERT INTO ${row.table} SET ?`, d)
          row.success++
        } catch (error) {
          row.fail++
        }
      }
      conn.end()
      collection
        .find({id: row.id})
        .assign({fail: row.fail, success: row.success})
        .write()
    },
    /**
     * 清空表
     */
    async clear (row) {
      const conn = await mysql.createConnectionPromise({
        host: row.host,
        port: row.port,
        user: row.user,
        password: row.password,
        database: row.database
      })
      try {
        await conn.query(`truncate table ${row.table}`)
      } catch (error) {
      }
      conn.end()
      remote.dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: `已清空数据表(${row.table})`,
        buttons: ['ok']
      })
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
  }
  .tips {
    font-size: 14px;
    color: rgb(175, 175, 175);
    padding: 10px;
  }
}
</style>
