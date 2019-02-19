<template>
<div id="microscopeSettings">

  <h4>Camera</h4>
  <div class="uk-text-center uk-container" v-if="isCalibrating">
    <div class="center-spinner" uk-spinner></div>
  </div>
  <div v-else>
    <button v-on:click="recalibrateRequest()" class="uk-button uk-button-default uk-form-small uk-float-right uk-margin-small uk-width-1-1">Auto-Calibrate</button>
  </div>

  <h4>Stage</h4>

  <h4>Microscope</h4>

  <div>
    <label class="uk-form-label" for="form-stacked-text">Microscope name</label>
    <input v-model="microscopeName" class="uk-input uk-width-1-1 uk-form-small" name="inputFilename" placeholder="Leave blank for default">
  </div>

  <button class="uk-button uk-button-default uk-form-small uk-float-right uk-margin-small uk-width-1-1 uk-disabled">Apply Settings</button>

</div>

</template>

<script>
import axios from 'axios'
import UIkit from 'uikit';

// Export main app
export default {
  name: 'microscopeSettings',

  data: function () {
    return {
      microscopeName: this.$store.state.apiConfig.name,
      isCalibrating: false
    }
  },

  methods: {
    updateInputValues: function () {
      this.microscopeName = this.$store.state.apiConfig.name
    },

    recalibrateRequest: function() {
      // Send move request
      axios.post(this.recalibrateApiUri)
        .then(response => { 
          console.log("Task ID: " + response.data[0].id)
          this.isCalibrating = true
          // Start the store polling TaskId for success
          self = this;
          this.$store.dispatch('pollTask', [response.data[0].id, null, null])
          .then(function() {
            self.isCalibrating = false
            UIkit.notification({message: "Finished recalibration", status: 'success'})
          })
          .catch(error => {
            self.isCalibrating = false
            UIkit.notification({message: `<span uk-icon=\'icon: warning\'></span> ${error}`, status: 'danger'})
          })
        })
        .catch(error => {
          this.$store.dispatch('handleHTTPError', error);  // Let store handle error
        })
    }
  },

  computed: {
    recalibrateApiUri: function () {
      return this.$store.getters.uri + "/plugin/default/camera_calibration/recalibrate"
    }
  }

}
</script>

<style lang="less">
.center-spinner {
  margin-left: auto;
  margin-right: auto
}
</style>
