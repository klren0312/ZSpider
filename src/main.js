import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/elementUI'
import getChrome from './chromePath'

Vue.prototype.$store = store

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
  render: (h) => h(App),
}).$mount('#app')
