<template>
  <div id="app" v-bind:class="handleTheme">

    <!-- Grid managing whole app -->
    <div uk-grid class="uk-height-1-1 uk-margin-remove uk-padding-remove" margin=0>
      <panelLeft/>
      <panelRight/>
    </div>

  </div>
</template>

<script>
// Import axios for HTTP requests
import axios from 'axios'

// Import components
import panelLeft from './components/panelLeft.vue'
import panelRight from './components/panelRight.vue'


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

// Export main app
export default {
  name: 'app',

  components: {
    panelRight,
    panelLeft
  },

  data: function () {
    return {}
  },

  created: function () {
    this.$store = store;
    window.addEventListener('beforeunload', this.handleExit)
  },

  methods: {
    handleExit: function(event) {
      console.log("Triggered beforeunload")
      this.$root.$emit('globalTogglePreview', false)
    }
  },

  computed: {
    handleTheme: function () {
      return {
        'uk-light': this.$store.state.globalSettings.darkMode,
        'uk-background-secondary': this.$store.state.globalSettings.darkMode
      }
    }
  }

}
</script>

<style lang="less">
// Basic UIkit CSS
@import "../node_modules/uikit/src/less/uikit.less";
// Custom UIkit CSS modifications
@import "./assets/less/theme.less";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  height: 100%
}

body, html {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
}

.uk-disabled {
  pointer-events: none;
  opacity: 0.4;
}

</style>
