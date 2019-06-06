<template>
<div id="microscopeSettings">
  <form @submit.prevent="applyConfigRequest">
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

    <button type="submit" class="uk-button uk-button-primary uk-form-small uk-float-right uk-margin-small uk-width-1-1">Apply Settings</button>

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
      microscopeName: this.$store.state.apiConfig.name,
      stageBacklash: this.$store.state.apiConfig.stage_settings.backlash
    }
  },

  methods: {
    updateInputValues: function () {
      this.microscopeName = this.$store.state.apiConfig.name;
      this.stageBacklash = this.$store.state.apiConfig.stage_settings.backlash
    },

    applyConfigRequest: function() {
      var payload = {
        stage_settings: {}
      }

      if (this.microscopeName != this.$store.state.apiConfig.name) {
        payload.name = this.microscopeName
      };

      if (this.stageBacklash != this.$store.state.apiConfig.stage_settings.backlash) {
        payload.stage_settings.backlash = this.stageBacklash
      }

      console.log(payload)

      // Send request to update config
      axios.post(this.configApiUri, payload)
        .then(response => { 
          this.$store.dispatch('updateConfig');
          this.updateInputValues
          this.modalNotify("Microscope config applied.")
        })
        .catch(error => {
          this.modalError(error) // Let mixin handle error
        })
    }

  },

  computed: {
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
