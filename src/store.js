import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import UIkit from 'uikit';

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
    apiConfig: {},
    apiState: {}
  },

  mutations: {
    changeHost(state, [host, port, apiVer='v1']) {
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
    },
    commitState(state, stateData) {
      state.apiState = stateData;
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
      .then(response => { 
        context.commit('changeWaiting', false);
        context.commit('changeConnected', true);
        context.commit('changeAvailable', true);
        context.commit('commitError', '');
        context.commit('commitConfig', response.data);
      })
      .catch(error => {
        var errormsg = '';
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errormsg = `${error.response.status}: ${error.response.data}`
          console.log(errormsg)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          errormsg = `${error.message}`
          console.log(errormsg)
        } else {
          // Something happened in setting up the request that triggered an Error
          errormsg = `${error.message}`
          console.log(errormsg)
        }
        // Update store state for a major connection error
        context.dispatch('errorState', errormsg);
        // Show a notification
        UIkit.notification({message: `<span uk-icon=\'icon: warning\'></span> ${errormsg}`, status: 'danger'})
      })
    },

    updateState(context, uri=`${context.getters.uri}/state`) {
      axios.get(uri)
      .then(response => { 
        context.commit('commitError', '');
        context.commit('commitState', response.data);
      })
      .catch(error => {
        var errormsg = '';
        if (error.response) {
          errormsg = `${error.response.status}: ${error.response.data}`
          console.log(errormsg)
        } else if (error.request) {
          errormsg = `${error.message}`
          console.log(errormsg)
        } else {
          errormsg = `${error.message}`
          console.log(errormsg)
        }
        context.dispatch('errorState', errormsg);
      })
    },

    resetState(context) {
      context.commit('changeWaiting', false);
      context.commit('changeConnected', false);
      context.commit('changeAvailable', true);
      context.commit('commitError', '');
    },
    errorState(context, msg) {
      context.commit('changeWaiting', false);
      context.commit('changeConnected', false);
      context.commit('changeAvailable', false);
      context.commit('commitError', msg);
    }
  },

  getters: {
    uri: state => `http://${state.host}:${state.port}/api/${state.apiVer}`
  }

})
