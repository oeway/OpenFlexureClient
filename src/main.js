import Vue from 'vue'
import App from './App.vue'
import store from './store'

import UIkit from 'uikit';

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    modalConfirm: function(modalText) {
      var self = this;

      // Stop GPU preview to show modal
      self.$root.$emit('globalTogglePreview', false)
  
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
          if (self.$store.state.settings.autoGpuPreview) {
            console.log("Re-enabling preview")
            self.$root.$emit('globalTogglePreview', true)
          }
        })
      }
      return new Promise(showModal)
    }
  }
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
