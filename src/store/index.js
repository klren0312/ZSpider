import Vue from 'vue'
import Vuex from 'vuex'
import { ruleDb, globalDb } from '@/dataStore'

Vue.use(Vuex)

const state = {
  /* eslint-disable */
  ServerUrl: 'http://localhost:1200',
  WSUrl: 'ws://localhost:1200/exchange',
  /* eslint-enable */
  chromePath: '',
  rule: {
    mainUrl: '',
    page: 0,
    linkRule: ''
  },
  contentParams: [],
  logCtrl: false
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
