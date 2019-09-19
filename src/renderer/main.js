import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import db from './dataStore'
import { Button, Form, FormItem, Input, InputNumber, Select, Option, Dialog, Row, Col, Icon, Tooltip, Table, TableColumn, MessageBox, Progress } from 'element-ui'
import getChrome from './chromePath'

[Button, Form, FormItem, Input, InputNumber, Select, Option, Dialog, Row, Col, Icon, Tooltip, Table, TableColumn, MessageBox, Progress].forEach(v => {
  Vue.use(v)
})
Vue.prototype.$confirm = MessageBox.confirm

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$store = store
Vue.prototype.$db = db
Vue.config.productionTip = false

store.dispatch('SET_CHROME', getChrome())

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
