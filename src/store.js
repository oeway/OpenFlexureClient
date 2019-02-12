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
    firstConnect(context) {
      // Reset the state when reconnecting starts
      context.dispatch('resetState');
      // Mark as loading
      context.commit('changeWaiting', true);
      // Do requests
      context.dispatch('updateConfig')
      context.dispatch('updateState')
    },

    updateConfig(context, uri=`${context.getters.uri}/config`) {
      context.dispatch('waitingState')
  
      axios.get(uri)
      .then(response => { 
        context.commit('commitConfig', response.data);
        context.dispatch('connectedState')
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

    updateState(context, uri=`${context.getters.uri}/state`) {
      context.dispatch('waitingState')
  
      axios.get(uri)
      .then(response => { 
        context.commit('commitState', response.data);
        context.dispatch('connectedState')
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
      context.commit('changeAvailable', true);
      context.commit('commitError', null);
      context.commit('commitConfig', {});
      context.commit('commitState', {});
    },

    waitingState(context) {
      context.commit('changeWaiting', true);
    },

    connectedState(context) {
      context.commit('changeWaiting', false);
      context.commit('changeAvailable', true);
    },

    errorState(context, msg) {
      context.commit('changeWaiting', false);
      context.commit('changeAvailable', false);
      context.commit('commitError', msg);
      UIkit.notification({message: `<span uk-icon=\'icon: warning\'></span> ${msg}`, status: 'danger'})
    }
  },

  getters: {
    uri: state => `http://${state.host}:${state.port}/api/${state.apiVer}`,
    ready: state => ((Object.keys(state.apiConfig).length !== 0) && (Object.keys(state.apiState).length !== 0))
  }

})
