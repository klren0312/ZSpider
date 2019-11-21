import store from './store'
import EventBus from './utils/EventBus'
import getMac from 'getmac'
import { globalDb } from './dataStore'

const originMac = globalDb.get('mac').value()
const mac = getMac()
let macChange = originMac !== mac
if (!originMac) {
  globalDb.set('mac', mac).write()
}

let socket = null
let interval = null
let reConnectNum = 0
function wsConnect () {
  socket = new WebSocket(`${store.state.WSUrl}`)
  socket.onopen = () => {
    reConnectNum = 0
    console.log('socket 连接成功')
    socket.send(JSON.stringify({
      type: 'heart',
      msg: JSON.stringify({
        originMac: originMac,
        mac: mac,
        isChange: macChange
      })
    }))
    interval = setInterval(() => {
      socket.send(JSON.stringify({
        type: 'heart',
        msg: JSON.stringify({
          originMac: originMac,
          mac: mac,
          isChange: macChange
        })
      }))
    }, 60000)
    socket.onmessage = msg => {
      const data = JSON.parse(msg.data)
      if (data.type === 'heart') {
        EventBus.$emit('online', true)
      }
    }
  }

  socket.onclose = () => {
    reConnectNum++
    EventBus.$emit('online', false)
    socket && socket.close()
    interval && clearInterval(interval)
    if (reConnectNum <= 50) {
      reConnect()
    }
  }

  socket.onerror = () => {
    EventBus.$emit('online', false)
    interval && clearInterval(interval)
  }
}

function reConnect () {
  socket && socket.close()
  wsConnect()
}

wsConnect()

export default socket
