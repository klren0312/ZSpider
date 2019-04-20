import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import { Button, Form, FormItem, Input, InputNumber, Select, Option, Dialog, Row, Col, Icon, Tooltip } from 'element-ui'

[Button, Form, FormItem, Input, InputNumber, Select, Option, Dialog, Row, Col, Icon, Tooltip].forEach(v => {
  Vue.use(v)
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$store = store
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
