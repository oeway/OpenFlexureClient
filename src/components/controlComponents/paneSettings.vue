<template>
  <div id="paneSettings">
    
    <appSettings/>

    <ul uk-accordion="multiple: true">
      <li>
        <a class="uk-accordion-title" href="#">Stream settings</a>
        <div class="uk-accordion-content"><streamSettings/></div>
      </li>

      <li v-if="$store.getters.ready">
        <a class="uk-accordion-title" href="#">Camera settings</a>
        <div class="uk-accordion-content"><cameraSettings/></div>
      </li>
      
      <li v-if="$store.getters.ready">
        <a class="uk-accordion-title" href="#">Microscope settings</a>
        <div class="uk-accordion-content"><microscopeSettings/></div>
      </li>

    </ul>

  </div>
</template>

<script>
import streamSettings from './settingsComponents/streamSettings.vue'
import microscopeSettings from './settingsComponents/microscopeSettings.vue'
import cameraSettings from './settingsComponents/cameraSettings.vue'
import appSettings from './settingsComponents/appSettings.vue'

// Export main app
export default {
  name: 'paneSettings',

  components: {
    streamSettings,
    cameraSettings,
    microscopeSettings,
    appSettings
  }

}
</script>

<style lang="less">
</style>
