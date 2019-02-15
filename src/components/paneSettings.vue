<template>
  <div id="paneSettings">
    <h3>Settings</h3>

    <div class="uk-child-width-1-2" uk-grid>
      <p><label><input v-model="disableStream" class="uk-checkbox" type="checkbox"> Disable stream</label></p>
      <p><label class="uk-disabled"><input v-model="autoGpuPreview" class="uk-checkbox" type="checkbox"> GPU preview</label></p>
    </div>

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
