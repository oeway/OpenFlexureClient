<template>
  <div id="paneSettings">
    
    <ul uk-accordion="multiple: true">
      <li>
        <a class="uk-accordion-title" href="#">Stream settings</a>
        <div class="uk-accordion-content"><streamSettings/></div>
      </li>

      <li v-if="$store.getters.ready">
        <a class="uk-accordion-title" href="#">Microscope settings</a>
        <div class="uk-accordion-content"><microscopeSettings/></div>
      </li>

    </ul>

  </div>
</template>

<script>
import streamSettings from './paneSettingsComponents/streamSettings.vue'
import microscopeSettings from './paneSettingsComponents/microscopeSettings.vue'

// Export main app
export default {
  name: 'paneSettings',

  components: {
    streamSettings,
    microscopeSettings
  }

}
</script>

<style lang="less">
</style>
