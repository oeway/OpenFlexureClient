<template>
  <div id="panelLeft" class="uk-flex uk-flex-column uk-margin-remove uk-padding-remove uk-height-1-1">
    <ul class="uk-flex-none uk-flex-center uk-margin-remove-top uk-margin-remove-bottom" uk-tab="swiping: false">
      <li><a href="#" uk-switcher-item="connect" uk-icon="server" uk-tooltip="pos: bottom; title: Connect"></a></li>
      <li v-bind:class="disableIfDisconnected"><a href="#" uk-switcher-item="navigate" uk-icon="location" uk-tooltip="pos: bottom; title: Navigate"></a></li>
      <li v-bind:class="disableIfDisconnected"><a href="#" uk-switcher-item="capture" uk-icon="camera" uk-tooltip="pos: bottom; title: Capture"></a></li>
      <li v-bind:class="disableIfDisconnected"><a href="#" uk-switcher-item="plugins" uk-icon="git-fork" uk-tooltip="pos: bottom; title: Plugins"></a></li>
      <li><a href="#" uk-switcher-item="settings" uk-icon="settings" uk-tooltip="pos: bottom; title: Settings"></a></li>
    </ul>
    <ul class="uk-switcher uk-padding-small uk-flex uk-flex-1 panel-content">
      <li class="uk-width-expand"><paneConnect/></li>
      <li class="uk-width-expand"><div v-if="$store.getters.ready"><paneNavigate/></div></li>
      <li class="uk-width-expand"><div v-if="$store.getters.ready"><paneCapture/></div></li>
      <li class="uk-width-expand"><div v-if="$store.getters.ready"><panePlugins/></div></li>
      <li class="uk-width-expand"><paneSettings/></li>
    </ul>
  </div>
</template>

<script>
// Import components
import paneConnect from './paneConnect.vue'
import paneNavigate from './paneNavigate.vue'
import paneCapture from './paneCapture.vue'
import panePlugins from './panePlugins.vue'
import paneSettings from './paneSettings.vue'

// Export main app
export default {
  name: 'panelLeft',

  components: {
    paneConnect,
    paneNavigate,
    paneCapture,
    panePlugins,
    paneSettings
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

<style lang="less">
.uk-tab {
    padding-left: 0;
}
.panel-content {
  width: 300px;
  overflow: auto;
}
</style>
