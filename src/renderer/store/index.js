import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  siteObj: {}
}

const mutations = {
  SET_SITE (state, siteObj) {
    state.siteObj = siteObj
  }
}

const actions = {
  SET_SITE (store, siteObj) {
    store.commit('SET_SITE', siteObj)
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
