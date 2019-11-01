import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { Button, Form, FormItem, Input, InputNumber, Select, Option, Dialog, Row, Col, Icon, Tooltip, Table, TableColumn, Progress, Autocomplete, Tag } from 'element-ui'
import getChrome from './chromePath'

[Button, Form, FormItem, Input, InputNumber, Select, Option, Dialog, Row, Col, Icon, Tooltip, Table, TableColumn, Progress, Autocomplete, Tag].forEach(v => {
  Vue.use(v)
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$store = store
Vue.config.productionTip = false

store.dispatch('SET_CHROME', getChrome())

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
