import store from './store'
import EventBus from './utils/EventBus'
let socket = null
let interval = null
function wsConnect () {
  socket = new WebSocket(`${store.state.WSUrl}`)
  socket.onopen = () => {
    console.log('socket 连接成功')
    interval = setInterval(() => {
      socket.send(JSON.stringify({
        type: 'heart',
        msg: 'ping'
      }))
    }, 3000)
    socket.onmessage = msg => {
      const data = JSON.parse(msg.data)
      if (data.type === 'heart') {
        EventBus.$emit('online', true)
      }
    }
  }

  socket.onclose = () => {
    EventBus.$emit('online', false)
    socket && socket.close()
    interval && clearInterval(interval)
    reConnect()
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
