<template>
  <div id="panelDisplay" class="uk-flex uk-flex-column uk-margin-remove uk-padding-remove uk-height-1-1">
    <ul class="uk-flex-none uk-flex-center uk-margin-remove-bottom uk-text-center" uk-tab>
      <li><a href="#" uk-switcher-item="preview" uk-icon="play-circle" uk-tooltip="Live"></a></li>
      <li v-bind:class="disableIfDisconnected"><a href="#" uk-switcher-item="gallery" uk-icon="image" uk-tooltip="Captures"></a></li>
    </ul>
    <ul class="uk-switcher uk-flex uk-flex-1">
      <li class="uk-height-1-1 uk-width-1-1 "><streamDisplay/></li>
      <li v-if="$store.getters.ready" class="uk-height-1-1 uk-width-1-1 "><galleryDisplay/></li>
    </ul>
  </div>
</template>

<script>
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
