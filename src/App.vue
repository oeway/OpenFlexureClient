<template>
  <div id="app">
    <div v-bind:class="responsiveToggleButton" id="overlay-toggle">
      <a href="" class="uk-icon-button" uk-icon="menu" uk-toggle="target: .toggle-hidden; animation: uk-animation-slide-left-small, uk-animation-slide-left-small" ></a>
    </div>
    <div uk-grid class="uk-height-1-1" margin=0>
      <div v-bind:class="responsivePanelLeft" class="toggle-hidden uk-card uk-card-default uk-card-body uk-padding-remove-top uk-padding-remove-right uk-width-auto uk-height-1-1">
        <div class="uk-card-header">
            <h3 class="uk-card-title"><b>OpenFlexure</b> Microscope</h3>
        </div>
        <panelLeft/>
      </div>
      <div class="uk-width-expand">
        <div class="uk-card uk-card-default uk-card-body uk-height-1-1">Width: {{ window.width }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// Import axios for HTTP requests
import axios from 'axios'
// Import basic UIkit
import UIkit from 'uikit';
// Import UIkit icon set
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

// Import components
import panelLeft from './components/panelLeft.vue'

// Export main app
export default {
  name: 'app',

  components: {
    panelLeft
  },

  data: function () {
    return {
      window: {
        width: 0,
        height: 0
      }
    }  
  },

  created: function () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize();
  },

  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    handleResize: function(event) {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  },

  computed: {
    // Stylises the hostname input box based on connection status
    responsivePanelLeft: function () {
      return {
        //'uk-hidden': this.window.width<850,
        'overlay-panel': this.window.width<850
      }
    },
    responsiveToggleButton: function () {
      return {
        //'uk-hidden': this.window.width>=850,
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
  height: 100%
}

.overlay-panel {
  position: fixed;
  z-index: 99;
}

#overlay-toggle {
  width: 30px;
  height: 30px;
  position: fixed;
  right: 0;
  margin: 20px;
  z-index: 999
}

</style>
