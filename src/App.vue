<template>
  <div id="app" v-bind:class="handleTheme">

    <!-- Grid managing whole app -->
    <div uk-grid class="uk-height-1-1 uk-margin-remove uk-padding-remove" margin=0>
      <panelLeft/>
      <panelRight/>
    </div>

  </div>
</template>

<script>
// Import axios for HTTP requests
import axios from 'axios'

// Import components
import panelLeft from './components/panelLeft.vue'
import panelRight from './components/panelRight.vue'

// Export main app
export default {
  name: 'app',

  components: {
    panelRight,
    panelLeft
  },

  data: function () {
    return {}  
  },

  created: function () {
    window.addEventListener('beforeunload', this.handleExit)
  },

  methods: {
    handleExit: function(event) {
      console.log("Triggered beforeunload")
      this.$root.$emit('globalTogglePreview', false)
    }
  },

  computed: {
    handleTheme: function () {
      return {
        'uk-light': this.$store.state.globalSettings.darkMode,
        'uk-background-secondary': this.$store.state.globalSettings.darkMode
      }
    }
  }

}
</script>

<style lang="less">
// Basic UIkit CSS
@import "../node_modules/uikit/src/less/uikit.less";
// Custom UIkit CSS modifications
@import "./assets/less/theme.less";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  height: 100%
}

body, html {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
}

.uk-disabled {
  pointer-events: none;
  opacity: 0.4;
}

</style>
