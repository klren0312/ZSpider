window.ipcRenderer = require('electron').ipcRenderer
window.onload = () => {
  msgToast('请点击选择, 选择后自行关闭窗口!')
  const chobitsu = require('z-chobitsu')
  chobitsu.setOnMessage((message) => {
    message = JSON.parse(message)
    if (message.method === 'Overlay.inspectNodeRequested') {
      let nodeId = null
      if (message.params.nodeId) {
        nodeId = message.params.nodeId
      } else if (message.params.backendNodeId) {
        nodeId = message.params.backendNodeId
        message.params.nodeId = message.params.backendNodeId
      }
      const dom = chobitsu.domain('DOM').getNodeByNodeId(nodeId)
      const selector = chobitsu
        .domain('CSS')
        .getCssSelectorForNode(message.params)
      console.log(dom)
      console.log(selector)
      window.ipcRenderer.send('domSelectorData', selector)
      msgToast('ok, 已自动填入主窗口')
    }
  })
  chobitsu.domain('Overlay').enable()
  chobitsu.domain('Overlay').setInspectMode({
    highlightConfig: {
      showInfo: false,
      contentColor: 'rgba(111, 168, 220, .66)',
      paddingColor: 'rgba(147, 196, 125, .55)',
      borderColor: 'rgba(255, 229, 153, .66)',
      marginColor: 'rgba(246, 178, 107, .66)',
    },
  })
}

// 弹框事件
function msgToast(msg, duration) {
  if (!msg) {
    return
  }
  const current = document.querySelector('.fanyi-toast')
  if (current) {
    document.body.removeChild(current)
  }
  duration = isNaN(duration) ? 3000 : duration
  const m = document.createElement('div')
  m.className = 'fanyi-toast'
  m.setAttribute('data-nofanyi', '')
  m.innerHTML = msg
  m.style.cssText =
    'font-size: 18px;color: #f56c6c;font-weight: bold;background-color: #fef0f0;border-color: #fde2e2;padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;top: 10%;left: 50%;min-width: 150px;text-align: center;z-index: 99999'
  document.body.appendChild(m)
  setTimeout(function () {
    const d = 0.5
    m.style.opacity = '0'
    setTimeout(function () {
      document.body.removeChild(m)
    }, d * 1000)
  }, duration)
}
