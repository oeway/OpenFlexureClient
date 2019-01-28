import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    host: '',
    connected: '',
    available: ''
  },

  mutations: {
    changeHost(state, host) {
      state.host = host
    },
    changeConnected(state, connected) {
      state.connected = connected
    },
    changeAvailable(state, available) {
      state.available = available
    }
  },

  getters: {
    host: state => state.host,
    connected: state => state.connected,
    available: state => state.available
  },

  actions: {
  }

})
