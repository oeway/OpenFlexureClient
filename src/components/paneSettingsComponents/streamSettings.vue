<template>
<div id="appSettings">

  <p><label><input v-model="disableStream" class="uk-checkbox" type="checkbox"> Disable live stream</label></p>

  <div class="uk-child-width-1-2" uk-grid>
    <p><label v-bind:class="[{'uk-disabled': !this.$store.getters.ready}]"><input v-model="autoGpuPreview" class="uk-checkbox" type="checkbox"> GPU preview</label></p>
    <p><label v-bind:class="[{'uk-disabled': !this.$store.getters.ready}]"><input v-model="trackWindow" class="uk-checkbox" type="checkbox"> Track window</label></p>
  </div>

</div>
</template>

<script>

// Export main app
export default {
  name: 'appSettings',

  data: function () {
    return {}
  },

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
        this.$root.$emit('globalTogglePreview', value)
      }
    },

    trackWindow: {
      get() {
        return this.$store.state.settings.trackWindow;
      },
      set(value) {
        this.$store.commit("changeSetting", ['trackWindow', value]);
      }
    }
  }

}
</script>

<style lang="less">
</style>
