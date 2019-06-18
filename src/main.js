import Vue from 'vue'
import App from './App.vue'
import store from './store'

import UIkit from 'uikit';

// Import MD icons
import 'material-design-icons/iconfont/material-icons.css'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    modalConfirm: function(modalText) {
      var context = this

      // Stop GPU preview to show modal
      context.$root.$emit('globalTogglePreview', false)
  
      var showModal = function(resolve, reject) {
        UIkit.modal.confirm(modalText)
        .then(function() {
          resolve()
        }, function () {
          reject()
        })
        .finally(function() {
          // Reenable the GPU preview, if it was active before the modal
          console.log("Re-enabling GPU preview")
          if (context.$store.state.globalSettings.autoGpuPreview) {
            console.log("Re-enabling preview")
            context.$root.$emit('globalTogglePreview', true)
          }
        })
      }
      return new Promise(showModal)
    },

    modalNotify: function(message, status = 'success') {
      UIkit.notification({message: message, status: status})
    },

    modalDialog: function(title, message) {
      UIkit.modal.dialog(`
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
          <h2 class="uk-modal-title">${title}</h2>
        </div>
        <div class="uk-modal-body">
          <p>${message}</p>
        </div>
      `);
    },

    modalError: function(error) {
      console.log(error)
      var errormsg = ''

      // If a response was obtained
      if (error.response) {
        // If the response is a nicely formatted JSON response from the server
        if (error.response.data.message) {
          errormsg = `${error.response.status}: ${error.response.data.message}`
          console.log(errormsg)
        }
        // If the response is just some generic error response
        else {
          errormsg = `${error.response.status}: ${error.response.data}`
          console.log(errormsg)
        }
      // If the error occured during the request
      } else if (error.request) {
        errormsg = `${error.message}`
        console.log(errormsg)
      // Everything else
      } else {
        errormsg = `${error.message}`
        console.log(errormsg)
      }
      this.$store.commit('setError', errormsg);
      UIkit.notification({message: `${errormsg}`, status: 'danger'})
    },

    getLocalStorageObj: function(keyName) {
      if (localStorage.getItem(keyName)) {
        try {
          return JSON.parse(localStorage.getItem(keyName))
        } catch(e) {
          console.log("Malformed entry. Removing from localStorage")
          localStorage.removeItem(keyName)
          return null
        }
      }
    },

    setLocalStorageObj: function(keyName, object) {
      const parsed = JSON.stringify(object)
      localStorage.setItem(keyName, parsed);
    }

  }
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
