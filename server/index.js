const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'spider',
  port: 3306
})
conn.connect()

const app = express()

app.use('/', express.static('public'))
app.use(bodyParser.json())

// 设置所有路由无限制访问，不需要跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  next();
})

/**
 * 客户端拉取应用
 */
app.get('/apps', async (req, res) => {
  const result = await conn.promise().query(`SELECT * FROM apps'`)
  res.send(result)
})

/**
 * 客户端提交应用
 */
app.post('/apps', async (req, res) => {
  const data = req.body
  const result = await conn.promise().query(`SELECT * FROM apps WHERE localId='${data.localId}'`)
  if (result[0].length === 0) {
    const r = await conn.promise().query(`INSERT INTO apps SET ?`, req.body)
    res.send(r)
  } else {
    const r = await conn.promise().query(`UPDATE apps SET ? WHERE localId='${data.localId}'`, data)
    res.send(r)
  }
})

//端口：3000
app.listen(3000, function() {
  console.log("server starts at http://127.0.0.1:3000");
})
