import Vue from 'vue'
import Vuex from 'vuex'
import { ruleDb } from '@/dataStore'

Vue.use(Vuex)

const state = {
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
  SAVE_LOGS (state, logs) {
    setTimeout(() => {
      // 移除超出的消息
      while (state.logs >= 30) state.logs.shift()
      state.commit('SAVE_LOGS', logs)
    }, 1000)
  },
  POP_LOGS ({ commit }) {
    commit('POP_LOGS')
  },
  SET_CHROME ({ commit }, chromePath) {
    ruleDb.set('config.chromePath', chromePath).write()
    commit('SET_CHROME', chromePath)
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
