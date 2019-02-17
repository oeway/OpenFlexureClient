<template>
  <div id="paneSettings">
    
    <ul uk-accordion="multiple: true">
      <li>
        <a class="uk-accordion-title" href="#">App settings</a>
        <div class="uk-accordion-content">

          <div class="uk-child-width-1-2" uk-grid>
            <p><label><input v-model="disableStream" class="uk-checkbox" type="checkbox"> Disable stream</label></p>
            <p><label class="uk-disabled"><input v-model="autoGpuPreview" class="uk-checkbox" type="checkbox"> GPU preview</label></p>
          </div>
        </div>
      </li>

      <li>
        <a class="uk-accordion-title" href="#">Microscope settings</a>
        <div class="uk-accordion-content">
          <div class="uk-placeholder uk-text-center">Microscope config coming soon...</div>
      </li>

    </ul>

  </div>
</template>

<script>

// Export main app
export default {
  name: 'paneSettings',

  computed: {
    disableStream: {
      get() {
        return this.$store.state.settings.disableStream;
      },
      set(value) {
        this.$store.commit("changeSetting", ['disableStream', value]);
      }
    },
    autoGpuPreview: {
      get() {
        return this.$store.state.settings.autoGpuPreview;
      },
      set(value) {
        this.$store.commit("changeSetting", ['autoGpuPreview', value]);
      }
    }
  }

}
</script>

<style lang="less">
</style>
