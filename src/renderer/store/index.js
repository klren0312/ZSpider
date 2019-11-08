import Vue from 'vue'
import Vuex from 'vuex'
import { ruleDb, globalDb } from '@/dataStore'

Vue.use(Vuex)

const state = {
  /* eslint-disable */
  ServerUrl: 'http://localhost:3000',
  WSUrl: 'ws://localhost:3000/exchange',
  /* eslint-enable */
  chromePath: '',
  rule: {
    mainUrl: '',
    page: 0,
    linkRule: ''
  },
  contentParams: [],
  logCtrl: false,
  logs: []
}

const mutations = {
  SET_RULE (state, rule) {
    state.rule = rule
  },
  SET_PARAM (state, params) {
    state.contentParams = JSON.parse(JSON.stringify(params))
  },
  CTRL_LOG (state, ctrl) {
    state.logCtrl = ctrl
  },
  SAVE_LOGS (state, logs) {
    let arr = JSON.parse(JSON.stringify(state.logs))
    // 移除超出的消息
    while (arr.length >= 30) arr.pop()
    arr.unshift(logs)
    state.logs = arr
  },
  POP_LOGS (state) {
    let arr = JSON.parse(JSON.stringify(state.logs))
    arr.pop()
    state.logs = arr
  },
  SET_CHROME (state, chromePath) {
    state.chromePath = chromePath
  }
}

const actions = {
  SET_RULE ({ commit }, rule) {
    ruleDb.set('config.mainUrl', rule.mainUrl).write()
    ruleDb.set('config.page', rule.page).write()
    ruleDb.set('config.linkRule', rule.linkRule).write()
    commit('SET_RULE', rule)
  },
  SET_PARAM ({ commit }, params) {
    ruleDb.set('config.params', params).write()
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
  },
  SET_CHROME ({ commit }, chromePath) {
    globalDb.set('chromePath', chromePath).write()
    commit('SET_CHROME', chromePath)
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
