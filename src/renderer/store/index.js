import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  siteObj: {},
  rule: {
    mainUrl: '',
    page: 0
  },
  contentParams: []
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
  }
}

const actions = {
  SET_SITE (store, siteObj) {
    store.commit('SET_SITE', siteObj)
  },
  SET_RULE (store, rule) {
    store.commit('SET_RULE', rule)
  },
  SET_PARAM (store, params) {
    store.commit('SET_PARAM', params)
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
