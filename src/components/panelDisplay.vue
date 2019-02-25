<template>
  <div id="panelDisplay" class="uk-flex uk-flex-column uk-margin-remove uk-padding-remove uk-height-1-1">
    <ul class="uk-flex-none uk-flex-center uk-margin-remove-bottom uk-text-center" uk-tab="swiping: false">
      <li><a href="#" uk-switcher-item="preview" uk-icon="play-circle" uk-tooltip="Live"></a></li>
      <li v-bind:class="disableIfDisconnected"><a href="#" uk-switcher-item="gallery" uk-icon="image" uk-tooltip="Captures"></a></li>
    </ul>
    <ul class="uk-switcher uk-flex uk-flex-1">
      <li class="uk-height-1-1 uk-width-1-1 clickableTab" id="streamDisplayTab"><streamDisplay/></li>
      <li class="uk-height-1-1 uk-width-1-1 uk-overflow-auto" id="galleryDisplayTab"><galleryDisplay/></li>
    </ul>
  </div>
</template>

<script>
import UIkit from 'uikit';

// Import components
import streamDisplay from './paneDisplayComponents/streamDisplay.vue'
import galleryDisplay from './paneDisplayComponents/galleryDisplay.vue'

// Export main app
export default {
  name: 'panelDisplay',

  components: {
    streamDisplay,
    galleryDisplay
  },

  mounted() {
    // Attach methods to UIkit events for tab switching
    var self=this;
    // Gallery tab
    UIkit.util.on('#galleryDisplayTab', 'shown', function(event, area) {
      console.log("Gallery tab entered")
      if (self.$store.state.settings.trackWindow == true) {
        self.$root.$emit('globalTogglePreview', false)
      }
      self.$root.$emit('globalUpdateCaptureList');
    });

    // Stream tab
    UIkit.util.on('#streamDisplayTab', 'shown', function(event, area) {
      console.log("Stream tab entered")
      UIkit.update()
      if (self.$store.state.settings.trackWindow == true) {
        self.$root.$emit('globalTogglePreview', true)
      }
    });

  },


  computed: {
    disableIfDisconnected: function () {
      return {
        'uk-disabled': !this.$store.getters.ready
      }
    }
  }

}
</script>

<style scoped lang="less">

</style>
