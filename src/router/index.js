import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: require('@/views/homePage/index').default,
    },
    {
      path: '/ruleSetting',
      name: 'RuleSetting',
      component: require('@/views/ruleSetting/index').default,
    },
    {
      path: '/codeRule',
      name: 'CodeRule',
      component: require('@/views/codeRule/index').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})
