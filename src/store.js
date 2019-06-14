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
    apiPlugins: [],
    globalSettings: {
      disableStream: false,
      autoGpuPreview: false,
      trackWindow: true,
      darkMode: false
    }
  },

  mutations: {
    changeHost(state, [host, port, apiVer='v1']) {
      state.host = host;
      state.port = port;
      state.apiVer = apiVer;
    },
    changeWaiting(state, waiting) {
      state.waiting = waiting
    },
    commitConfig(state, configData) {
      state.apiConfig = configData;
    },
    commitState(state, stateData) {
      state.apiState = stateData;
    },
    commitPlugins(state, pluginData) {
      state.apiPlugins = pluginData;
    },
    changeSetting(state, [key, value]) {
      state.globalSettings[key] = value;
    },
    resetState(state) {
      state.waiting = false
      state.available = true
      state.error = null
      state.apiConfig = {}
      state.apiState = {}
      state.apiPlugins = []
    },
    setConnected(state) {
      state.waiting = false
      state.available = true
    },
    setError(state, msg) {
      state.waiting = false
      state.available = false
      state.error = msg
    }
  },

  actions: {
    firstConnect(context) {
      // Reset the state when reconnecting starts
      context.commit('resetState')
      // Mark as loading
      context.commit('changeWaiting', true)

      var sendRequest = function(resolve, reject) {
        // Do requests
        context.dispatch('updateConfig')
        .then (() => {
          context.dispatch('updateState')
        })
        .then (() => {
          context.dispatch('updatePlugins')
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
      context.commit('changeWaiting', true)
  
      var sendRequest = function(resolve, reject) {
        axios.get(uri)
        .then(response => { 
          context.commit('commitConfig', response.data)
          context.commit('setConnected')
          resolve()
        })
        .catch(error => {
          reject(new Error(error))
        })
      }
      return new Promise(sendRequest)
    },

    updateState(context, uri=`${context.getters.uri}/state`) {
      context.commit('changeWaiting', true)
  
      var sendRequest = function(resolve, reject) {
        axios.get(uri)
        .then(response => { 
          context.commit('commitState', response.data)
          context.commit('setConnected')
          resolve()
        })
        .catch(error => {
          reject(new Error(error))
        })
      }
      return new Promise(sendRequest)
    },

    updatePlugins(context, uri=`${context.getters.uri}/plugin`) {
      context.commit('changeWaiting', true)
  
      var sendRequest = function(resolve, reject) {
        axios.get(uri)
        .then(response => { 
          console.log("PLUGINS")
          console.log(response.data)
          context.commit('commitPlugins', response.data)
          context.commit('setConnected')
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
      
    }
  },

  getters: {
    uri: state => `http://${state.host}:${state.port}/api/${state.apiVer}`,
    ready: state => ((Object.keys(state.apiConfig).length !== 0) && (Object.keys(state.apiState).length !== 0))
  }

})
