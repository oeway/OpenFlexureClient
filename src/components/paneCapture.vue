<template>
  <div id="paneCapture">

    <div>
      <label class="uk-form-label" for="form-stacked-text">Filename</label>
      <input v-model="filename" class="uk-input uk-width-1-1 uk-form-small" name="inputFilename" placeholder="Leave blank for default">
    </div>

    <p uk-tooltip="title: Capture will be removed automatically; delay: 500"><label><input v-model="temporary" class="uk-checkbox" type="checkbox"> Temporary</label></p>

    <hr>

    <div class="uk-child-width-1-2" uk-grid>
      <p><label><input v-model="fullResolution" class="uk-checkbox" type="checkbox"> Full resolution</label></p>
      <p><label><input v-model="storeBayer" class="uk-checkbox" type="checkbox"> Store raw data</label></p>
    </div>

    <hr>

    <p><label><input v-model="resizeCapture" class="uk-checkbox" type="checkbox"> Resize capture</label></p>

    <div class="uk-child-width-1-2" uk-grid>
      <div>
        <input v-bind:class="resizeClass" v-model="resizeDims[0]" class="uk-input uk-form-width-medium uk-form-small" type="number" name="inputResizeW">
      </div>
      <div>
        <input v-bind:class="resizeClass" v-model="resizeDims[1]" class="uk-input uk-form-width-medium uk-form-small" type="number" name="inputResizeH">
      </div>
    </div>

    <ul uk-accordion="multiple: true">
      <li>
        <a class="uk-accordion-title" href="#">Notes</a>
        <div class="uk-accordion-content">
          <div class="uk-margin-small">
            <textarea v-model="captureNotes" class="uk-textarea" rows="5" placeholder="Capture notes"></textarea>
          </div>
        </div>
      </li>

      <li>
        <a class="uk-accordion-title" href="#">Metadata</a>
        <div class="uk-accordion-content">

          <form @submit.prevent="handleMetadataSubmit">
            <div class="uk-margin-small uk-grid-small" uk-grid>
              <div class="uk-margin-remove-top uk-width-2-5"><input v-model="newMetadata.key" class="uk-input uk-form-width-small uk-form-small" type="text" name="flavor" placeholder="Key"></div>
              <div class="uk-margin-remove-top uk-width-2-5"><input v-model="newMetadata.value" class="uk-input uk-form-width-small uk-form-small" type="text" name="flavor" placeholder="Value"></div>
              <div class="uk-margin-remove-top uk-width-1-5"><button class="uk-button uk-button-default uk-form-small uk-float-right" uk-icon="plus"></button></div>
            </div>
          </form>

          <div v-for="(value, key) in customMetadata" :key="key" class="uk-width-1-1 uk-margin-small uk-margin-remove-left uk-margin-remove-right" uk-grid>
            <div class="uk-margin-remove-top uk-padding-remove uk-width-expand"><b>{{ key }}: </b>{{ value }}</div>
            <div class="uk-margin-remove-top uk-padding-remove uk-width-auto">
              <a href="#" v-on:click="delMetadataKey(key)" class="uk-icon-link" uk-icon="trash"></a>
            </div>
          </div>

        </div>
      </li>

      <li>
        <a class="uk-accordion-title" href="#">Tags</a>
        <div class="uk-accordion-content">

          <form @submit.prevent="handleTagSubmit">
            <div class="uk-margin-small uk-grid-small" uk-grid>
              <div class="uk-margin-remove-top uk-width-4-5"><input v-model="newTag" class="uk-input uk-form-width-small uk-form-small" type="text" name="flavor" placeholder="Tag"></div>
              <div class="uk-margin-remove-top uk-width-1-5"><button class="uk-button uk-button-default uk-form-small uk-float-right" uk-icon="plus"></button></div>
            </div>
          </form>

          <span v-for="tag in tags" :key="tag" v-on:click="delTag(tag)" class="uk-label uk-margin-small-right deletable-label"> {{ tag }} </span>

        </div>
      </li>

    </ul>

    <hr>

    <ul uk-accordion="multiple: true">
      <li>
        <a class="uk-accordion-title" href="#">Stack and Scan</a>
        <div v-if="isScanning" class="uk-accordion-content">
          <div class="uk-text-center uk-container" >
            <div class="center-spinner" uk-spinner></div>
          </div>
        </div>
        <div v-else class="uk-accordion-content">

          <div class="uk-margin">
            <label><input v-model="scanCapture" class="uk-checkbox" type="checkbox"> Scan capture</label>
          </div>

          <div v-bind:class="{ 'uk-disabled': !scanCapture }" > 

            <div class="uk-grid-small uk-child-width-1-3" uk-grid>
              <div>
                <label class="uk-form-label" for="form-stacked-text">x step-size</label>
                <div class="uk-form-controls">
                  <input v-model="scanStepSize.x" class="uk-input uk-form-small" type="number" name="inputPositionX">
                </div>
              </div>

              <div>
                <label class="uk-form-label" for="form-stacked-text">y step-size</label>
                <div class="uk-form-controls">
                  <input v-model="scanStepSize.y" class="uk-input uk-form-small" type="number" name="inputPositionY">
                </div>
              </div>

              <div>
                <label class="uk-form-label" for="form-stacked-text">z step-size</label>
                <div class="uk-form-controls">
                  <input v-model="scanStepSize.z" class="uk-input uk-form-small" type="number" name="inputPositionZx">
                </div>
              </div>
            </div>

            <div class="uk-grid-small uk-child-width-1-3" uk-grid>
              <div>
                <label class="uk-form-label" for="form-stacked-text">x steps</label>
                <div class="uk-form-controls">
                  <input v-model="scanSteps.x" class="uk-input uk-form-small" type="number" name="inputPositionX">
                </div>
              </div>

              <div>
                <label class="uk-form-label" for="form-stacked-text">y steps</label>
                <div class="uk-form-controls">
                  <input v-model="scanSteps.y" class="uk-input uk-form-small" type="number" name="inputPositionY">
                </div>
              </div>

              <div>
                <label class="uk-form-label" for="form-stacked-text">z steps</label>
                <div class="uk-form-controls">
                  <input v-model="scanSteps.z" class="uk-input uk-form-small" type="number" name="inputPositionZx">
                </div>
              </div>
            </div>

            <div class="uk-margin-small uk-margin-remove-bottom">
              <label class="uk-form-label" for="form-stacked-text">Autofocus</label>
              <select v-model="scanDeltaZ" class="uk-select">
                <option>Off</option>
                <option>Coarse</option>
                <option>Medium</option>
                <option>Fine</option>
              </select>
            </div>

            <div class="uk-margin-small uk-margin-remove-bottom">
              <label class="uk-form-label" for="form-stacked-text">Scan Style</label>
              <select v-model="scanStyle" class="uk-select">
                <option>Raster</option>
                <option>Snake</option>
              </select>
            </div>

          </div>

        </div>
      </li>
    </ul>

    <button v-if="scanCapture" v-on:click="handleScan()" v-bind:class="{ 'uk-disabled': isScanning }" class="uk-button uk-button-primary uk-form-small uk-margin uk-float-right uk-width-1-1">Start Scan</button>
    <button v-else v-on:click="handleCapture()" class="uk-button uk-button-primary uk-form-small uk-margin uk-float-right uk-width-1-1">Capture</button>

  </div>
</template>

<script>
import axios from 'axios'
import UIkit from 'uikit';

// Export main app
export default {
  name: 'paneCapture',

  data: function () {
    return {
      filename: '',
      temporary: false,
      fullResolution: false,
      storeBayer: false,
      resizeCapture: false,
      captureNotes: "",
      scanCapture: false,
      isScanning: false,
      scanDeltaZ: 'Medium',
      scanStyle: 'Raster',
      scanStepSize: {
        x: parseInt(0.8*this.$store.state.apiConfig.fov[0]), 
        y: parseInt(0.8*this.$store.state.apiConfig.fov[1]), 
        z: 50
      },
      scanSteps: {
        x: 3, 
        y: 3, 
        z: 5
      },
      resizeDims: [640, 480],
      newTag: "",
      tags: [],
      customMetadata: {
        Client: "openflexure.vue"
      },
      newMetadata: {
        key: "",
        value: ""
      }
    }
  },

  methods: {
    handleMetadataSubmit: function () {
      console.log("Adding metadata");
      this.customMetadata[this.newMetadata.key] = this.newMetadata.value
      this.newMetadata.key = "";
      this.newMetadata.value = "";
    },

    delMetadataKey: function (key) {
      this.$delete(this.customMetadata, key)
    },

    handleTagSubmit: function () {
      this.tags.push(this.newTag)
      this.newTag = "";
    },

    delTag: function (tag) {
      console.log(tag)
      var index = this.tags.indexOf(tag);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    },

    handleCapture: function() {
      var payload = this.basePayload

      // Do capture
      this.newCaptureRequest(payload)
    },

    handleScan: function() {
      var payload = this.basePayload

      // Scan params
      payload.grid = [this.scanSteps.x, this.scanSteps.y, this.scanSteps.z]
      payload.step_size = [this.scanStepSize.x, this.scanStepSize.y, this.scanStepSize.z]
      payload.style = this.scanStyle.toLowerCase()

      // Convert AF selector to dz
      var afDeltas = {
        Off: 0,
        Coarse: 100,
        Medium: 30,
        Fine: 10
      }

      payload.autofocus_dz = afDeltas[this.scanDeltaZ]

      // Do capture
      this.newScanRequest(payload)
    },

    newCaptureRequest: function(params) {
      // Send move request
      axios.post(this.captureApiUri, params)
        .then(response => { 
          this.$root.$emit('globalUpdateCaptureList')
        })
        .catch(error => {
          this.$store.dispatch('handleHTTPError', error);  // Let store handle error
        })
    },

    newScanRequest: function(params) {
      axios.post(this.scanApiUri, params)
        .then(response => { 
          console.log("Task ID: " + response.data[0].id)
          this.isScanning = true
          return this.$store.dispatch('pollTask', [response.data[0].id, 3600, 5])
        })
        .then(() => {
          UIkit.notification({message: "Finished scan.", status: 'success'})
        })
        .catch(error => {
          this.$store.dispatch('handleHTTPError', error);  // Let store handle error
        })
        .finally(() => {
          this.isScanning = false
        })
    }

  },

  computed: {
    resizeClass: function () {
      return {
        'uk-disabled': !this.resizeCapture
      }
    },
    captureApiUri: function () {
      return this.$store.getters.uri + "/camera/capture"
    },
    scanApiUri: function () {
      return this.$store.getters.uri + "/plugin/default/scan/tile"
    },
    basePayload: function () {
      var payload = {}
      
      // Filename
      if (Boolean(this.filename)) {
        payload.filename = this.filename
      }

      // Basic boolean params
      payload.temporary = this.temporary;
      payload.use_video_port = !this.fullResolution;
      payload.bayer = this.storeBayer;

      // Resizing
      if (this.resizeCapture) {
        payload.size = {
          width: this.resizeDims[0],
          height: this.resizeDims[1]
        }
      }

      // Additional metadata
      payload.metadata = this.customMetadata
      payload.tags = this.tags

      // Attach notes
      if (this.captureNotes) {
        payload.metadata['Notes'] = this.captureNotes
      }

      return payload
    }
  }

}
</script>

<style lang="less">
.deletable-label {
  cursor: pointer;
}

.deletable-label:hover {
  background-color: #f0506e;
}

</style>