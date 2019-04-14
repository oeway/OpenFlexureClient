<template>
  <div id="app">
    <div uk-grid class="uk-height-1-1 uk-margin-remove uk-padding-remove" margin=0>
      <div id="sidebar-container" v-bind:class="responsivePanelLeft" class="uk-padding-remove uk-first-column uk-inline uk-height-1-1">
        <div id="overlay-toggle">
          <a href="" class="uk-icon-button uk-box-shadow-small uk-box-shadow-hover-medium action-btn-outline" uk-icon="menu" uk-toggle="target: #left-panel-container; animation: uk-animation-slide-left-small, uk-animation-slide-left-small" ></a>
        </div>
        <div id="left-panel-container" class="uk-padding-remove uk-card uk-card-default uk-width-auto uk-height-1-1">
          <panelLeft/>
        </div>
      </div>
      <div id="main-panel-container" class="uk-padding-remove uk-height-1-1 uk-width-expand">
        <panelDisplay/>
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
import panelDisplay from './components/panelDisplay.vue'

// Export main app
export default {
  name: 'app',

  components: {
    panelLeft,
    panelDisplay
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
    var context = this

    function handleSidebarEvent(context, event){
      if (event.target.id == 'left-panel-container') {
        console.log("Sidebar hidden")
        context.$root.$emit('globalResizePreview')
      }
    }

    UIkit.util.on(document, 'hidden', '#left-panel-container', function (e) {
      handleSidebarEvent(context, e)
    })
    UIkit.util.on(document, 'shown', '#left-panel-container', function (e) {
      handleSidebarEvent(context, e)
    })

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

.overlay-panel {
  position: fixed;
  z-index: 99;
}

#overlay-toggle {
    width: 0px;
    height: 30px;
    z-index: 999;
    position: absolute;
    right: -20px;
    top: 24px;
}

.action-btn-outline {
  border: 1px solid lightgray;
}

.uk-disabled {
    pointer-events: none;
    opacity: 0.5;
}

</style>
