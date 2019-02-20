<template>
<div id="microscopeSettings">
  <form @submit.prevent="applyConfigRequest">
    <h4>Camera</h4>
    <div class="uk-text-center uk-container" v-if="isCalibrating">
      <div class="center-spinner" uk-spinner></div>
    </div>
    <div v-else>
      <button type="button" v-on:click="recalibrateConfirm()" class="uk-button uk-button-default uk-form-small uk-float-right uk-margin-small uk-width-1-1">Auto-Calibrate</button>
    </div>

    <h4>Stage</h4>

    <label class="uk-form-label" for="form-stacked-text">Backlash compensation</label>
    <div class="uk-grid-small uk-child-width-1-3" uk-grid>
      <div>
        <label class="uk-form-label" for="form-stacked-text">x</label>
        <div class="uk-form-controls">
          <input v-model="stageBacklash.x" class="uk-input uk-form-small" type="number">
        </div>
      </div>

      <div>
        <label class="uk-form-label" for="form-stacked-text">y</label>
        <div class="uk-form-controls">
          <input v-model="stageBacklash.y" class="uk-input uk-form-small" type="number">
        </div>
      </div>

      <div>
        <label class="uk-form-label" for="form-stacked-text">z</label>
        <div class="uk-form-controls">
          <input v-model="stageBacklash.z" class="uk-input uk-form-small" type="number">
        </div>
      </div>
    </div>

    <h4>Microscope</h4>

    <div>
      <label class="uk-form-label" for="form-stacked-text">Microscope name</label>
      <input v-model="microscopeName" class="uk-input uk-width-1-1 uk-form-small" name="inputFilename" placeholder="Leave blank for default">
    </div>

    <button type="submit" class="uk-button uk-button-default uk-form-small uk-float-right uk-margin-small uk-width-1-1">Apply Settings</button>

  </form>

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
      stageBacklash: this.$store.state.apiConfig.backlash,
      isCalibrating: false
    }
  },

  methods: {
    updateInputValues: function () {
      this.microscopeName = this.$store.state.apiConfig.name;
      this.stageBacklash = this.$store.state.apiConfig.backlash
    },

    recalibrateConfirm: function() {
      var self = this;
      UIkit.modal.confirm('Start recalibration? This may take a while, and the microscope will be locked during this time.').then(function() {
        self.recalibrateRequest()
      }, function () {
        console.log('Rejected.')
      });
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
            UIkit.notification({message: "Finished recalibration.", status: 'success'})
          })
          .catch(error => {
            self.isCalibrating = false
            UIkit.notification({message: `<span uk-icon=\'icon: warning\'></span> ${error}`, status: 'danger'})
          })
        })
        .catch(error => {
          this.$store.dispatch('handleHTTPError', error);  // Let store handle error
        })
    },

    applyConfigRequest: function() {
      var payload = {}

      if (this.microscopeName != this.$store.state.apiConfig.name) {
        payload.name = this.microscopeName
      };

      if (this.stageBacklash != this.$store.state.apiConfig.backlash) {
        payload.backlash = this.stageBacklash
      }

      // Send move request
      axios.post(this.configApiUri, payload)
        .then(response => { 
          this.$store.dispatch('updateConfig');
          this.updateInputValues
          UIkit.notification({message: "Microscope config applied.", status: 'success'})
        })
        .catch(error => {
          this.$store.dispatch('handleHTTPError', error);  // Let store handle error
        })
    }

  },

  computed: {
    recalibrateApiUri: function () {
      return this.$store.getters.uri + "/plugin/default/camera_calibration/recalibrate"
    },
    configApiUri: function () {
      return this.$store.getters.uri + "/config"
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
