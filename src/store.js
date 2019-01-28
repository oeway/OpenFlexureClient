import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    host: '',
    port: 5000,
    apiVer: 'v1',
    connected: false,
    available: true,
    waiting: false,
    error: '',
    apiConfig: {}
  },

  mutations: {
    changeHost(state, host, port=5000, apiVer='v1') {
      state.host = host;
      state.port = port;
      state.apiVer = apiVer;
    },
    changeConnected(state, connected) {
      state.connected = connected
    },
    changeAvailable(state, available) {
      state.available = available
    },
    changeWaiting(state, waiting) {
      state.waiting = waiting
    },
    commitError(state, errorString) {
      state.error = errorString;
    },
    commitConfig(state, configData) {
      state.apiConfig = configData;
    }
  },

  actions: {
    updateConfig(context, uri=`${context.getters.uri}/config`) {
      // Reset the state when reconnecting starts
      context.dispatch('resetState');
      // Mark as loading
      context.commit('changeWaiting', true);
      // Do GET request
      axios.get(uri)
      .then((response)  =>  {
        context.commit('changeWaiting', false);
        context.commit('changeConnected', true);
        context.commit('changeAvailable', true);
        context.commit('commitError', '');
        context.commit('commitConfig', response.data);
      }, (error)  =>  {
        context.commit('changeWaiting', false);
        context.commit('commitError', error.message);
        context.commit('changeConnected', false);
        context.commit('changeAvailable', false);
      })
    },
    resetState(context) {
      context.commit('changeWaiting', false);
      context.commit('changeConnected', false);
      context.commit('changeAvailable', true);
      context.commit('commitError', '');
    }
  },

  getters: {
    uri: state => `http://${state.host}:${state.port}/api/${state.apiVer}`
  }

})
