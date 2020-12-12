import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { Button, Form, FormItem, Input, InputNumber, Select, Option, Dialog, Row, Col, Icon, Tooltip, Table, TableColumn, Progress, Autocomplete, Tag, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
import getChrome from './chromePath'
import socket from './wsConnect'

[Button, Form, FormItem, Input, InputNumber, Select, Option, Dialog, Row, Col, Icon, Tooltip, Table, TableColumn, Progress, Autocomplete, Tag, Dropdown, DropdownMenu, DropdownItem].forEach(v => {
  Vue.use(v)
})

Vue.prototype.$store = store
Vue.prototype.$socket = socket

Vue.config.productionTip = false

// electron 关闭开发工具, 防止白屏
// https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/322
if (process.env.IS_ELECTRON) {
  Vue.config.devtools = false
}

store.dispatch('SET_CHROME', getChrome())

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
