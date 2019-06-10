<template>
  <div id="panel-left" class="uk-margin-remove uk-padding-remove uk-height-1-1" uk-grid>

    <!-- Vertical tab bar -->
    <div id="switcher-left" class="uk-flex uk-flex-column uk-padding-remove uk-width-auto uk-height-1-1">
      <tabIcon id="connect" uk-icon="server" :requireConnection="false" :currentTab="currentTab" @set-tab="setTab" />
      <tabIcon id="navigate" uk-icon="location" :requireConnection="true" :currentTab="currentTab" @set-tab="setTab" />
      <tabIcon id="capture" uk-icon="camera" :requireConnection="true" :currentTab="currentTab" @set-tab="setTab" />
      <tabIcon id="settings" uk-icon="cog" :requireConnection="false" :currentTab="currentTab" @set-tab="setTab" />
    </div>

    <!-- Corresponding vertical tab content -->
    <div v-bind:hidden="!showControlBar" id="container-left" class="uk-padding-remove uk-height-1-1 uk-width-expand">
      <div id="component-left" class="uk-padding-remove uk-flex uk-flex-1 panel-content">
        <tabContent id="connect" :requireConnection="false" :currentTab="currentTab">
          <paneConnect/>
        </tabContent>
        <tabContent id="navigate" :requireConnection="true" :currentTab="currentTab">
          <paneNavigate/>
        </tabContent>
        <tabContent id="capture" :requireConnection="true" :currentTab="currentTab">
          <paneCapture/>
        </tabContent>
        <tabContent id="settings" :requireConnection="false" :currentTab="currentTab">
          <paneSettings/>
        </tabContent>
      </div>
    </div>

  </div>

</template>

<script>
// Import axios for HTTP requests
import axios from 'axios'

// Import generic components
import tabIcon from './genericComponents/tabIcon.vue'
import tabContent from './genericComponents/tabContent.vue'

// Import pane components
import paneConnect from './controlComponents/paneConnect.vue'
import paneNavigate from './controlComponents/paneNavigate.vue'
import paneCapture from './controlComponents/paneCapture.vue'
import paneSettings from './controlComponents/paneSettings.vue'

// Export main app
export default {
  name: 'panelLeft',

  components: {
    tabIcon,
    tabContent,
    paneConnect,
    paneNavigate,
    paneCapture,
    paneSettings
  },

  data: function () {
    return {
      currentTab: 'connect',
      showControlBar: true,
    }  
  },

  methods: {
    setTab: function(event, tab) {
      if (this.currentTab == tab) {
        this.showControlBar = !this.showControlBar
        this.currentTab = 'none'
      }
      else {
        this.showControlBar = true
        this.currentTab = tab
      }
    }

  }

}
</script>

<style scoped lang="less">

#component-left {
  width: 300px;
}

#container-left {
  overflow: hidden auto;
  background-color: rgba(180, 180, 180, 0.025);
}

#container-left, #switcher-left {
  border-width: 0 1px 0 0;
  border-style: solid;
  border-color: rgba(180, 180, 180, 0.25)
}

#switcher-left a{
  padding: 12px 20px;
}

#switcher-left{
  background-color: rgba(180, 180, 180, 0.1);
  padding-top: 2px !important;
}

</style>
