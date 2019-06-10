<template>
  <div id="app" v-bind:class="handleTheme">

    <div uk-grid class="uk-height-1-1 uk-margin-remove uk-padding-remove" margin=0>

      <div id="panelLeft" class="uk-margin-remove uk-padding-remove uk-height-1-1" uk-grid>

        <div class="uk-padding-remove uk-height-1-1 uk-width-auto@m">
          <div id="component-switcher-left" class="uk-flex uk-flex-column uk-height-1-1">
            <a href="#" @click="setTab('connect')" uk-icon="server" uk-tooltip="pos: right; title: Connect"></a>
            <a href="#" @click="setTab('navigate')" v-bind:class="{'uk-disabled': !this.$store.getters.ready}" uk-icon="location" uk-tooltip="pos: right; title: Navigate"></a>
            <a href="#" @click="setTab('capture')" v-bind:class="{'uk-disabled': !this.$store.getters.ready}" uk-icon="camera" uk-tooltip="pos: right; title: Capture"></a>
            <a href="#" @click="setTab('settings')" uk-icon="cog" uk-tooltip="pos: right; title: Settings"></a>
          </div>
        </div>

        <div v-if="showControlBar" class="uk-padding-remove uk-height-1-1 uk-width-expand@m">
          <div id="component-tab-left" class="uk-padding-small uk-flex uk-flex-1 panel-content">
            <div v-if="currentTab=='connect'" class="uk-width-expand"><paneConnect/></div>
            <div v-if="currentTab=='navigate'" class="uk-width-expand"><paneNavigate/></div>
            <div v-if="currentTab=='capture'" class="uk-width-expand"><paneCapture/></div>
            <div v-if="currentTab=='settings'" class="uk-width-expand"><paneSettings/></div>
          </div>
        </div>

      </div>

      <div id="panelDisplay" class="uk-flex uk-flex-column uk-margin-remove uk-padding-remove uk-width-expand uk-height-1-1">
        <ul class="uk-flex-none uk-flex-center uk-margin-remove-bottom uk-text-center" uk-tab="swiping: false">
          <li><a href="#" uk-switcher-item="preview">Live</a></li>
          <li v-bind:class="{'uk-disabled': !this.$store.getters.ready}"><a href="#" uk-switcher-item="gallery">Gallery</a></li>
        </ul>
        <ul class="uk-switcher uk-flex uk-flex-1">
          <li class="uk-height-1-1 uk-width-1-1 clickableTab" id="streamDisplayTab"><streamDisplay/></li>
          <li class="uk-height-1-1 uk-width-1-1 uk-overflow-auto" id="galleryDisplayTab"><galleryDisplay/></li>
        </ul>
      </div>

    </div>

  </div>
</template>

<script>
// Import axios for HTTP requests
import axios from 'axios'
// Import basic UIkit
import UIkit from 'uikit';

// Import components
import paneConnect from './components/paneConnect.vue'
import paneNavigate from './components/paneNavigate.vue'
import paneCapture from './components/paneCapture.vue'
import panePlugins from './components/panePlugins.vue'
import paneSettings from './components/paneSettings.vue'
// Import components
import streamDisplay from './components/paneDisplayComponents/streamDisplay.vue'
import galleryDisplay from './components/paneDisplayComponents/galleryDisplay.vue'

// Export main app
export default {
  name: 'app',

  components: {
    streamDisplay,
    galleryDisplay,
    paneConnect,
    paneNavigate,
    paneCapture,
    panePlugins,
    paneSettings
  },

  data: function () {
    return {
      currentTab: 'connect',
      showControlBar: true,
      window: {
        width: 0,
        height: 0
      }
    }  
  },

  created: function () {
    var context = this

    window.addEventListener('resize', this.handleResize)
    this.handleResize();

    window.addEventListener('beforeunload', this.handleExit)
  },

  mounted() {
    // Attach methods to UIkit events for tab switching
    var context = this;
    // Gallery tab
    UIkit.util.on('#galleryDisplayTab', 'shown', function(event, area) {
      console.log("Gallery tab entered")
      if (context.$store.state.globalSettings.trackWindow == true) {
        context.$root.$emit('globalTogglePreview', false)
      }
      context.$root.$emit('globalUpdateCaptureList');
    });

    // Stream tab
    UIkit.util.on('#streamDisplayTab', 'shown', function(event, area) {
      console.log("Stream tab entered")
      UIkit.update()
      if (context.$store.state.globalSettings.trackWindow == true) {
        context.$root.$emit('globalTogglePreview', true)
      }
    });

  },

  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    setTab: function(tabName) {
      if (this.currentTab == tabName) {
        this.showControlBar = !this.showControlBar
      }
      else {
        this.showControlBar = true
        this.currentTab = tabName
      }
    },

    handleResize: function(event) {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },

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
    },
    disableIfDisconnected: function () {
      return {
        'uk-disabled': !this.$store.getters.ready
      }
    },
    onMobile: function () {
      return (this.window.width <= 800) ? true : false 
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

.uk-light .uk-icon-button {
  background-color: rgb(52, 52, 52);
}
.uk-light .uk-icon-button:hover, .uk-light .uk-icon-button:focus {
  background-color: rgb(70, 70, 70);
}

.uk-light .uk-card-default {
  background: #222
}

.uk-disabled {
    pointer-events: none;
    opacity: 0.5;
}

.uk-tab {
    padding-left: 0;
}
.panel-content {
  width: 300px;
  overflow: auto;
}

#panelLeft {
  border-width: 0 1px 0 0;
  border-style: solid;
  border-color: rgba(180, 180, 180, 0.25)
}

#component-switcher-left a{
  padding: 10px 20px;
}

#component-switcher-left{
  background-color: rgba(180, 180, 180, 0.1);
}

</style>
