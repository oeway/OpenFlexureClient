<template>
  <div id="paneCapture">

    <div>
      <label class="uk-form-label" for="form-stacked-text">Filename</label>
      <input v-model="filename" class="uk-input uk-width-1-1 uk-form-small" name="inputFilename" placeholder="Leave blank for default">
    </div>

    <label><input v-model="temporary" class="uk-checkbox" type="checkbox"> Temporary</label>
    <label><input v-model="fullResolution" class="uk-checkbox" type="checkbox"> Full resolution</label>
    <label><input v-model="storeBayer" class="uk-checkbox" type="checkbox"> Store raw data</label>

    <label><input v-model="resizeCapture" class="uk-checkbox" type="checkbox"> Resize capture</label>

    <div class="uk-child-width-1-2" uk-grid>

      <div>
        <input v-model="resizeDims[0]" class="uk-input uk-form-width-medium uk-form-small" type="number" name="inputResizeW">
      </div>

      <div>
        <input v-model="resizeDims[1]" class="uk-input uk-form-width-medium uk-form-small" type="number" name="inputResizeH">
      </div>

    </div>

  </div>
</template>

<script>

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
      resizeDims: [640, 480]
    }
  },

}
</script>
