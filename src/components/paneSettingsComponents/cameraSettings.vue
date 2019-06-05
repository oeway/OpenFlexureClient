<template>
<div id="cameraSettings">
  <form @submit.prevent="applyConfigRequest">
      <div>
        <label class="uk-form-label" for="form-stacked-text">Exposure time</label>
        <div class="uk-form-controls">
          <input v-model="displayShutterSpeed" class="uk-input uk-form-small" type="number">
        </div>
      </div>

      <div>
        <label class="uk-form-label" for="form-stacked-text">Analogue gain</label>
        <div class="uk-form-controls">
          <input v-model="displayAnalogGain" class="uk-input uk-form-small" type="number" step="0.01">
        </div>
      </div>

      <div>
        <label class="uk-form-label" for="form-stacked-text">Digital gain</label>
        <div class="uk-form-controls">
          <input v-model="displayDigitalGain" class="uk-input uk-form-small" type="number" step="0.01">
        </div>
      </div>

    <button type="submit" class="uk-button uk-button-primary uk-form-small uk-float-right uk-margin-small uk-width-1-1">Apply Settings</button>
    
    <div class="uk-text-center uk-container" v-if="isCalibrating">
      <div class="center-spinner" uk-spinner></div>
    </div>
    <div v-else>
      <button type="button" v-on:click="recalibrateConfirm()" class="uk-button uk-button-default uk-form-small uk-float-right uk-margin-small uk-width-1-1">Auto-Calibrate</button>
    </div>


  </form>

</div>

</template>

<script>
import axios from 'axios'

// Export main app
export default {
  name: 'microscopeSettings',

  data: function () {
    return {
      shutterSpeed: this.$store.state.apiConfig.camera_settings.picamera_settings.shutter_speed,
      analogGain: this.$store.state.apiConfig.camera_settings.picamera_settings.analog_gain,
      digitalGain: this.$store.state.apiConfig.camera_settings.picamera_settings.digital_gain,
      isCalibrating: false
    }
  },

  methods: {
    updateInputValues: function () {
      this.shutterSpeed = this.$store.state.apiConfig.camera_settings.picamera_settings.shutter_speed
      this.digitalGain = this.$store.state.apiConfig.camera_settings.picamera_settings.digital_gain
      this.analogGain = this.$store.state.apiConfig.camera_settings.picamera_settings.analog_gain
    },

    applyConfigRequest: function() {
      console.log("Applying config to the microscope")
      var payload = {picamera_settings:{}}

      //if (this.shutterSpeed != this.$store.state.apiConfig.picamera_settings.shutter_speed) {
      payload.camera_settings.picamera_settings.shutter_speed = this.shutterSpeed
      payload.camera_settings.picamera_settings.analog_gain = this.analogGain
      payload.camera_settings.picamera_settings.digital_gain = this.digitalGain
      //};

      // Send request
      axios.post(this.configApiUri, payload)
        .then(response => { return new Promise(r => setTimeout(r, 500))}) // why is there no built-in for this??!
        .then(response => { 
          return this.$store.dispatch('updateConfig');
        })
        .then(this.updateInputValues)
        .then(r=>{console.log("Updated Config: ", payload.picamera_settings)})
        .catch(error => {
          this.modalError(error) // Let mixin handle error
        })
    },
    recalibrateConfirm: function() {
      var context = this
      this.modalConfirm('Start recalibration? This may take a while, and the microscope will be locked during this time.')
        .then(function() {
          context.recalibrateRequest()
        }, function () {
          console.log('Rejected recalibration.')
        })
    },
    recalibrateRequest: function() {
      // Send move request
      axios.post(this.recalibrateApiUri)
        .then(response => { 
          console.log("Task ID: " + response.data.id)
          this.isCalibrating = true
          return this.$store.dispatch('pollTask', [response.data.id, null, null])
        })
        .then(() => {
          this.modalNotify("Finished recalibration.")
          return new Promise(r => setTimeout(r, 500)) // wait 500ms before updating config, so it's fresh
        })
        .then(() => {
          return this.$store.dispatch('updateConfig');
        })
        .then(this.updateInputValues)
        .catch(error => {
          this.modalError(error) // Let mixin handle error
        })
        .finally(() => {
          this.isCalibrating = false
        })
    }

  },

  computed: {
    displayDigitalGain: function () {
      return Number(this.digitalGain).toFixed(2)
    },
    displayAnalogGain: function () {
      return Number(this.analogGain).toFixed(2)
    },
    displayShutterSpeed: function () {
      return (this.shutterSpeed != 0) ? this.shutterSpeed : "auto"
    },
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
