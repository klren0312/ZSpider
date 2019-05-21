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
  logCtrl: false,
  logs: []
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
  CTRL_LOG (state, ctrl) {
    state.logCtrl = ctrl
  },
  SAVE_LOGS (state, logs) {
    state.logs.unshift(logs)
  },
  POP_LOGS (state) {
    state.logs.pop()
  }
}

const actions = {
  SET_SITE ({ commit }, siteObj) {
    db.set('config.siteObj', siteObj).write()
    commit('SET_SITE', siteObj)
  },
  SET_RULE ({ commit }, rule) {
    db.set('config.mainUrl', rule.mainUrl).write()
    db.set('config.page', rule.page).write()
    commit('SET_RULE', rule)
  },
  SET_PARAM ({ commit }, params) {
    db.set('config.params', params).write()
    commit('SET_PARAM', params)
  },
  CTRL_LOG ({ commit }, ctrl) {
    commit('CTRL_LOG', ctrl)
  },
  SAVE_LOGS ({ commit }, logs) {
    commit('SAVE_LOGS', logs)
  },
  POP_LOGS ({ commit }) {
    commit('POP_LOGS')
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
