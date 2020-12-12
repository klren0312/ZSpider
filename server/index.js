const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const WebSocket = require('ws')
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
// ================== API start ===================================
/**
 * 客户端拉取应用
 */
app.get('/apps', async (req, res) => {
  const result = await conn.promise().query(`SELECT * FROM apps`)
  res.send({
    code: 200,
    message: '拉取应用成功',
    data: result[0]
  })
})

/**
 * 客户端提交应用
 */
app.post('/apps', async (req, res) => {
  const data = req.body
  const result = await conn.promise().query(`SELECT * FROM apps WHERE localId='${data.localId}'`)
  if (result[0].length === 0) {
    const r = await conn.promise().query(`INSERT INTO apps SET ?`, req.body)
    res.send({
      code: 200,
      message: '提交成功',
      data: data
    })
  } else {
    const r = await conn.promise().query(`UPDATE apps SET ? WHERE localId='${data.localId}'`, data)
    res.send({
      code: 200,
      message: '更新成功',
      data: data
    })
  }
})

// ================== API end ===================================

// ================== WS start ==================================
const server = http.createServer(app)
const wss = new WebSocket.Server({ server: server, path: '/exchange' })
let online = 0
wss.on('connection', (ws, request) => {
  online++
  ws.on('message', msg => {
    const afterMsg = JSON.parse(msg)
    if (afterMsg.type === 'heart') {
      console.log(afterMsg.msg)
      ws.send(JSON.stringify({
        type: 'heart',
        msg: 'pong'
      }))
    }
  })
  ws.on('close', () => {
    online--
  })
  console.log(online)
})
// ================== WS end   ==================================

//端口：1200
server.listen(1200, function() {
  console.log("server starts at http://127.0.0.1:1200");
})
