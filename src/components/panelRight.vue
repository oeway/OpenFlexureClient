<template>
  <!-- Tabbed panel for gallery and live views -->
  <div id="panel-right" class="uk-flex uk-flex-column uk-margin-remove uk-padding-remove uk-width-expand uk-height-1-1">
    <ul class="uk-flex-none uk-flex-center uk-margin-remove-bottom uk-text-center" uk-tab="swiping: false">
        <li><a href="#" uk-switcher-item="preview">Live</a></li>
        <li v-bind:class="{'uk-disabled': !this.$store.getters.ready}"><a href="#" uk-switcher-item="gallery">Gallery</a></li>
    </ul>
    <ul class="uk-switcher uk-flex uk-flex-1">
        <li class="uk-height-1-1 uk-width-1-1 clickableTab" id="streamDisplayTab"><streamDisplay/></li>
        <li class="uk-height-1-1 uk-width-1-1 uk-overflow-auto" id="galleryDisplayTab"><galleryDisplay/></li>
    </ul>
  </div>
</template>

<script>
// Import axios for HTTP requests
import axios from 'axios'
// Import basic UIkit
import UIkit from 'uikit';

// Import components
import streamDisplay from './viewComponents/streamDisplay.vue'
import galleryDisplay from './viewComponents/galleryDisplay.vue'

// Export main app
export default {
  name: 'panelRight',

  components: {
    streamDisplay,
    galleryDisplay,
  },

  mounted() {
    // Attach methods to UIkit events for tab switching
    var context = this;
    // Gallery tab
    UIkit.util.on('#galleryDisplayTab', 'shown', function(event, area) {
      console.log("Gallery tab entered")
      if (context.$store.state.globalSettings.trackWindow == true) {
        context.$root.$emit('globalTogglePreview', false)
      }
      context.$root.$emit('globalUpdateCaptureList');
    });

    // Stream tab
    UIkit.util.on('#streamDisplayTab', 'shown', function(event, area) {
      console.log("Stream tab entered")
      UIkit.update()
      if (context.$store.state.globalSettings.trackWindow == true) {
        context.$root.$emit('globalTogglePreview', true)
      }
    });

  }

}
</script>

<style scoped lang="less">

.uk-tab {
  padding-left: 0;
}

</style>
