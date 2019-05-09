import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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
    apiState: {},
    globalSettings: {
      disableStream: false,
      autoGpuPreview: false,
      trackWindow: true
    }
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
    },
    changeSetting(state, [key, value]) {
      state.globalSettings[key] = value;
    }
  },

  actions: {
    firstConnect(context) {
      // Reset the state when reconnecting starts
      context.dispatch('resetState')
      // Mark as loading
      context.dispatch('waitingState')

      var sendRequest = function(resolve, reject) {
        // Do requests
        context.dispatch('updateConfig')
        .then (() => {
          context.dispatch('updateState')
        })
        .then (() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      }
      return new Promise(sendRequest)
    },

    updateConfig(context, uri=`${context.getters.uri}/config`) {
      context.dispatch('waitingState')
  
      var sendRequest = function(resolve, reject) {
        axios.get(uri)
        .then(response => { 
          context.commit('commitConfig', response.data)
          context.dispatch('connectedState')
          resolve()
        })
        .catch(error => {
          reject(new Error(error))
        })
      }
      return new Promise(sendRequest)
    },

    updateState(context, uri=`${context.getters.uri}/state`) {
      context.dispatch('waitingState')
  
      var sendRequest = function(resolve, reject) {
        axios.get(uri)
        .then(response => { 
          context.commit('commitState', response.data)
          context.dispatch('connectedState')
          resolve()
        })
        .catch(error => {
          reject(new Error(error))
        })
      }
      return new Promise(sendRequest)
    },

    pollTask(context, [taskId, timeout, interval]) {
      var endTime = Number(new Date()) + (timeout*1000 || 30000);
      interval = interval*1000 || 500;

      var checkCondition = function(resolve, reject) {
        // If the condition is met, we're done! 
        axios.get(`${context.getters.uri}/task/${taskId}`)
        .then(response => { 
          console.log(response.data.status)
          var result = response.data.status
          // If the task ends with success
          if(result == 'success') {
              resolve(response.data.return)
          }
          // If task ends with an error
          else if (result == 'error') {
            reject(new Error(response.data.return))
          }
          // If the condition isn't met but the timeout hasn't elapsed, go again
          else if (Number(new Date()) < endTime) {
              setTimeout(checkCondition, interval, resolve, reject)
          }
          // Didn't match and too much time, reject!
          else {
            reject(new Error('Polling timed out'))
          }
        })

      };

      return new Promise(checkCondition);
      
    },

    resetState(context) {
      context.commit('changeWaiting', false)
      context.commit('changeAvailable', true)
      context.commit('commitError', null)
      context.commit('commitConfig', {})
      context.commit('commitState', {})
    },

    waitingState(context) {
      context.commit('changeWaiting', true)
    },

    connectedState(context) {
      context.commit('changeWaiting', false)
      context.commit('changeAvailable', true)
    },

    errorState(context, msg) {
      context.commit('changeWaiting', false)
      context.commit('changeAvailable', false)
      context.commit('commitError', msg)
      // TODO: Re-implement error notifications as mixins
    }
  },

  getters: {
    uri: state => `http://${state.host}:${state.port}/api/${state.apiVer}`,
    ready: state => ((Object.keys(state.apiConfig).length !== 0) && (Object.keys(state.apiState).length !== 0))
  }

})
