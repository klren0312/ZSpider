import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/views/LandingPage').default
    },
    {
      path: '/details',
      name: 'detailsPage',
      component: require('@/views/DetailsPage').default
    },
    {
      path: '/start',
      name: 'startSpider',
      component: require('@/views/StartSpider').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
