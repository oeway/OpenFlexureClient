<template>
  <div id="panel-left" class="uk-margin-remove uk-padding-remove uk-height-1-1" uk-grid>

    <!-- Vertical tab bar -->
    <div id="switcher-left" class="uk-flex uk-flex-column uk-padding-remove uk-width-auto uk-height-1-1">
      <tabIcon id="connect" :requireConnection="false" :currentTab="currentTab" @set-tab="setTab">
        <i class="material-icons">settings_ethernet</i>
      </tabIcon>
      <tabIcon id="navigate" :requireConnection="true" :currentTab="currentTab" @set-tab="setTab">
        <i class="material-icons">gamepad</i>  
      </tabIcon>
      <tabIcon id="capture" :requireConnection="true" :currentTab="currentTab" @set-tab="setTab">
        <i class="material-icons">camera_alt</i>
      </tabIcon>
      <tabIcon id="settings" :requireConnection="false" :currentTab="currentTab" @set-tab="setTab">
        <i class="material-icons">settings</i>  
      </tabIcon>

      <hr>

      <tabIcon v-for="plugin in $store.state.apiPlugins" :key="plugin.id" :id="plugin.id" :uk-icon="plugin.icon" :requireConnection="plugin.requiresConnection" :currentTab="currentTab" @set-tab="setTab">
        <i class="material-icons">{{ plugin.icon || "extension" }}</i> 
      </tabIcon>

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

        <tabContent v-for="plugin in $store.state.apiPlugins" :key="plugin.id" :id="plugin.id" :requireConnection="plugin.requiresConnection" :currentTab="currentTab">
          <JsonForm  v-for="form in plugin.forms" :key="form.route" :route="form.route" :schema="form.schema"/>
        </tabContent>
  
      </div>
    </div>

  </div>

</template>

<script>
// Import axios for HTTP requests
import axios from 'axios'

// Import generic components
import tabIcon from './genericComponents/tabIcon'
import tabContent from './genericComponents/tabContent'

// Import pane components
import paneConnect from './controlComponents/paneConnect'
import paneNavigate from './controlComponents/paneNavigate'
import paneCapture from './controlComponents/paneCapture'
import paneSettings from './controlComponents/paneSettings'

// Import plugin components
import JsonForm from './pluginComponents/formComponents/JsonForm'

// Export main app
export default {
  name: 'panelLeft',

  components: {
    tabIcon,
    tabContent,
    paneConnect,
    paneNavigate,
    paneCapture,
    paneSettings,
    JsonForm
  },

  data: function () {
    return {
      currentTab: 'connect',
      showControlBar: true
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
    },

  },

  computed: {
    pluginApiUri: function () {
      return this.$store.getters.uri + "/plugin"
    },
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
  padding: 10px 16px;
}

#switcher-left{
  background-color: rgba(180, 180, 180, 0.1);
  padding-top: 2px !important;
}

</style>
