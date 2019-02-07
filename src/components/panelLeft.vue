<template>
  <div id="panelLeft">
    <ul class="uk-flex-center" uk-tab>
      <li><a href="#" uk-switcher-item="connect" uk-icon="server" uk-tooltip="Connect"></a></li>
      <li><a href="#" uk-switcher-item="navigate" uk-icon="location" uk-tooltip="Navigate"></a></li>
      <li><a href="#" uk-switcher-item="capture" uk-icon="camera" uk-tooltip="Capture"></a></li>
      <li><a href="#" uk-switcher-item="plugins" uk-icon="git-fork" uk-tooltip="Plugins"></a></li>
      <li><a href="#" uk-switcher-item="settings" uk-icon="settings" uk-tooltip="Configure"></a></li>
    </ul>
    <ul class="uk-switcher uk-margin">
      <li><paneConnect/></li>
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
  width: 300px;
  height:100%;
  padding: 0 20px 0 20px;
  background-color: #fafafa
}
.uk-tab {
    padding-left: 0;
}
</style>
