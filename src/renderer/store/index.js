import Vue from 'vue'
import Vuex from 'vuex'
import db from '@/dataStore'

Vue.use(Vuex)

const state = {
  siteObj: {}, // 爬取的内容页链接对象
  rule: {
    mainUrl: '',
    page: 0
  },
  contentParams: [],
  logCtrl: false
}

const mutations = {
  SET_SITE (state, siteObj) {
    state.siteObj = siteObj
  },
  SET_RULE (state, rule) {
    state.rule = rule
  },
  SET_PARAM (state, params) {
    state.contentParams = params
  },
  CTRL_LOG (store, ctrl) {
    state.logCtrl = ctrl
  }
}

const actions = {
  SET_SITE (store, siteObj) {
    db.set('config.siteObj', siteObj).write()
    store.commit('SET_SITE', siteObj)
  },
  SET_RULE (store, rule) {
    db.set('config.mainUrl', rule.mainUrl).write()
    db.set('config.page', rule.page).write()
    store.commit('SET_RULE', rule)
  },
  SET_PARAM (store, params) {
    db.set('config.params', params).write()
    store.commit('SET_PARAM', params)
  },
  CTRL_LOG (store, ctrl) {
    store.commit('CTRL_LOG', ctrl)
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
