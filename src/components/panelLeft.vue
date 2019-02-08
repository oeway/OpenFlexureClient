<template>
  <div id="panelLeft" class="uk-flex uk-flex-column uk-margin-remove uk-padding-remove uk-height-1-1">
    <div class="uk-flex-none uk-card-header">
      <h3 class="uk-card-title uk-align-center"><b>OpenFlexure</b> Microscope</h3>
    </div>
    <ul class="uk-flex-none uk-flex-center uk-margin-remove-top uk-margin-remove-bottom" uk-tab="swiping: false">
      <li><a href="#" uk-switcher-item="connect" uk-icon="server" uk-tooltip="Connect"></a></li>
      <li><a href="#" uk-switcher-item="navigate" uk-icon="location" uk-tooltip="Navigate"></a></li>
      <li><a href="#" uk-switcher-item="capture" uk-icon="camera" uk-tooltip="Capture"></a></li>
      <li><a href="#" uk-switcher-item="plugins" uk-icon="git-fork" uk-tooltip="Plugins"></a></li>
      <li><a href="#" uk-switcher-item="settings" uk-icon="settings" uk-tooltip="Configure"></a></li>
    </ul>
    <ul class="uk-switcher uk-padding-small uk-flex uk-flex-1 panel-content">
      <li class="uk-width-expand"><paneConnect/></li>
    </ul>
  </div>
</template>

<script>
// Import components
import paneConnect from './paneConnect.vue'

// Export main app
export default {
  name: 'panelLeft',
  components: {
    paneConnect,
  }
}
</script>

<style lang="less">
#panelLeft {
  
}
.uk-tab {
    padding-left: 0;
}
.panel-content {
  width: 300px;
  overflow: auto;
}
</style>
