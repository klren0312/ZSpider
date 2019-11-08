import store from './store'
import EventBus from './utils/EventBus'

let socket = new WebSocket(`${store.state.WSUrl}`)
let restartNum = 0

socket.onopen = () => {
  restartNum = 0
  console.log('socket 连接成功')
  setInterval(() => {
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
  if (restartNum < 50) {
    restartNum++
    socket = new WebSocket(`${store.state.WSUrl}`)
  } else {
    socket = null
  }
}

socket.onerror = () => {
  EventBus.$emit('online', false)
  if (restartNum < 50) {
    restartNum++
    socket = new WebSocket(`${store.state.WSUrl}`)
  } else {
    socket = null
  }
}

export default socket
