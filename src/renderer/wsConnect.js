import store from './store'
import EventBus from './utils/EventBus'
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
      msg: 'ping'
    }))
    interval = setInterval(() => {
      socket.send(JSON.stringify({
        type: 'heart',
        msg: 'ping'
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
