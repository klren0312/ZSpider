window.ipcRenderer = require('electron').ipcRenderer
window.onload = () => {
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
