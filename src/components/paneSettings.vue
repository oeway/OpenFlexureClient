<template>
  <div id="paneSettings">
    
    <ul uk-accordion="multiple: true">
      <li>
        <a class="uk-accordion-title" href="#">App settings</a>
        <div class="uk-accordion-content"><appSettings/></div>
      </li>

      <li v-if="$store.getters.ready">
        <a class="uk-accordion-title" href="#">Microscope settings</a>
        <div class="uk-accordion-content"><microscopeSettings/></div>
      </li>

    </ul>

  </div>
</template>

<script>
import appSettings from './paneSettingsComponents/appSettings.vue'
import microscopeSettings from './paneSettingsComponents/microscopeSettings.vue'

// Export main app
export default {
  name: 'paneSettings',

  components: {
    appSettings,
    microscopeSettings
  }

}
</script>

<style lang="less">
</style>
