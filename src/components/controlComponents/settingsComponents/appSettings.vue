<template>
<div id="appSettings">

  <p><label><input v-model="darkMode" class="uk-checkbox" type="checkbox"> Enable dark theme</label></p>

</div>
</template>

<script>

// Export main app
export default {
  name: 'appSettings',

  data: function () {
    return {}
  },

  mounted() {
    // Try loading settings from localStorage. If null, don't change.
    this.darkMode = this.getLocalStorageObj('darkMode') || this.darkMode
  },

  watch: {
    darkMode(newdarkMode) {
      console.log("Saving darkmode setting")
      this.setLocalStorageObj('darkMode', this.darkMode)
    }
  },

  computed: {
    darkMode: {
      get() {
        return this.$store.state.globalSettings.darkMode;
      },
      set(value) {
        this.$store.commit("changeSetting", ['darkMode', value]);
      }
    }
  }

}
</script>

<style lang="less">
</style>
