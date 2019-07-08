<template>
<div class="host-input">
  <div class="uk-margin">

    <form @submit.prevent="handleSubmit">
      <div class="uk-form-controls uk-margin">
        <label><input class="uk-radio" type="radio" name="radio_local" v-model="computedLocalMode" v-bind:value="true"> Connect locally</label><br>
        <label><input class="uk-radio" type="radio" name="radio_local" v-model="computedLocalMode" v-bind:value="false" checked> Connect remotely</label>
      </div>

      <div v-if="!localMode">
        <div class="uk-inline uk-width-1-1">
          <span class="uk-form-icon"><i class="material-icons">dns</i></span>
          <input v-model="hostname" v-bind:class="IpFormClasses" class="uk-input uk-form-small" type="text" placeholder="Hostname or IP address">
        </div>
      </div>

      <ul uk-accordion="multiple: true">
        <li>
          <a class="uk-accordion-title" href="#">Advanced</a>
          <div class="uk-accordion-content">
            <label class="uk-form-label" for="form-stacked-text">Port</label>
            <div class="uk-form-controls">
              <input v-model="computedPort" class="uk-input uk-form-small" id="form-stacked-text" type="number" value=5000>
            </div>
          </div>
        </li>

        <li>
          <a class="uk-accordion-title" href="#">Status</a>
          <div class="uk-accordion-content">
            <div v-if="$store.getters.ready">
              <p><b>Host:</b> {{ $store.state.host }}</p>
              <p><b>Base URI:</b> {{ $store.getters.uri }}</p>
              <p v-if="$store.state.apiConfig.name"><b>Device name:</b> {{ $store.state.apiConfig.name }}</p>
            </div>
            <div v-else-if="$store.state.waiting"><div uk-spinner></div></div>
            <div v-else-if="$store.state.error"><b>Error:</b> {{ $store.state.error }}</div>
            <div v-else>No active connection</div>
          </div>
        </li>

        <li v-if="!localMode" class="uk-open">
          <a class="uk-accordion-title" href="#">Saved hosts</a>
          <div class="uk-accordion-content">
            <button v-if="$store.getters.ready" v-on:click="saveHost()" class="uk-button uk-button-default uk-form-small uk-margin-small uk-width-1-1">Save Current</button>
            <div v-for="host in savedHosts" :key="host.name" class="uk-margin-small uk-margin-remove-left uk-margin-remove-right uk-flex uk-flex-middle">
              <a href="#" v-on:click="autofillHost(host)" class="uk-link uk-padding-remove uk-width-expand host-description"><b>{{ host.name }}</b> ({{ host.hostname }}:{{ host.port }})</a> 
              <a href="#" v-on:click="delSavedHost(host)" class="uk-icon uk-width-auto host-delete"><i class="material-icons">delete</i></a> 
            </div>
          </div>
        </li>

      </ul>

      <button class="uk-button uk-button-primary uk-form-small uk-float-right uk-margin uk-margin-remove-top uk-width-1-1">Connect</button>
    </form>

  <button 
    v-if="$store.getters.ready" 
    v-on:click="$store.commit('resetState')" 
    class="uk-button uk-button-danger uk-form-small uk-float-right uk-margin uk-margin-remove-top uk-width-1-1">
    Disconnect
  </button>

  </div>

</div>
</template>

<script>
import { version } from 'punycode';

export default {
  name: 'paneConnect',

  data: function () {
    return {
      localMode: true,
      hostname: "",
      port: 5000,
      selectedHost: "",
      savedHosts: [
        {
          name: "local",
          hostname: "localhost",
          port: 5000
        }
      ]
    }  
  },

  mounted() {
    // Propagate localMode settings
    this.setLocalMode(this.localMode)

    // Try loading savedHosts from localStorage. If null, don't change.
    this.savedHosts = this.getLocalStorageObj('savedHosts') || this.savedHosts
  },

  // When savedHosts changes, serialise to JSON and save to localStorage
  watch: {
    savedHosts(newSavedHosts) {
      this.setLocalStorageObj('savedHosts', this.savedHosts)
    }
  },

  methods: {
    handleSubmit: function(event) {
      // Split host and port if needed
      if (this.hostname.includes(':')) {
        this.port = this.computedPort;
        this.hostname = this.hostname.split(':')[0];
      }
      // Handle auto-local-connect
      if (this.localMode) {
        var hostname = "localhost";
      }
      else {
        var hostname = this.hostname;
      }
      // Commit the hostname and port to store
      this.$store.commit('changeHost', [
        hostname, 
        this.port
      ]);
      // Try to get config and state JSON from the newly submitted host
      this.$store.dispatch('firstConnect')
      .then (() => {
        console.log("Connected!")
        this.checkServerVersion()
      })
      .catch(error => {
        this.modalError(error) // Let mixin handle error
      })
    },

    checkServerVersion: function () {
      this.$store.dispatch('updateState')
      .then (() => {
        var clientVersion = process.env.PACKAGE.version
        var clientVersionMajor = clientVersion.substring(0, 3)
        console.log(clientVersionMajor)

        var serverVersion = this.$store.state.apiState.version
        if (serverVersion != undefined) {
          var serverVersionMajor = serverVersion.substring(0, 3)
        }
        console.log(serverVersionMajor)

        if ((serverVersion == undefined) || (serverVersionMajor != clientVersionMajor)) {
          var versionWarning = `Client and microscope versions do not match.\
            Consider updating your microscope software.\
            Some functionality may currently be broken.<br><br> \
            <b>Client version:</b> ${clientVersion}<br> \
            <b>Server version:</b> ${serverVersion}<br><br>`
          if (serverVersion < 1.1) {
            versionWarning = versionWarning + "You may need to install a never server version on a clean SD card."
          }
          else {
            versionWarning = versionWarning + "Try running 'ofm upgrade' on your microscope."
          }
          this.modalDialog("Version mismatch", versionWarning, status='warning')
        }
      })
      .catch(error => {
        this.modalError(error) // Let mixin handle error
      })
    },

    setLocalMode: function (state) {
      this.$store.commit("changeSetting", ['trackWindow', state]);
      this.$store.commit("changeSetting", ['disableStream', state]);
      this.$store.commit("changeSetting", ['autoGpuPreview', state]);
      //this.$root.$emit('globalTogglePreview', state)
    },

    autofillHost: function (host) {
      this.hostname = host.hostname;
      this.port = host.port
    },

    delSavedHost: function (host) {
      console.log(host)
      var index = this.savedHosts.indexOf(host);
      if (index > -1) {
        this.savedHosts.splice(index, 1);
      }
    },

    saveHost: function() {
      this.savedHosts.push(
        {
          name: this.$store.state.apiConfig.name,
          hostname: this.$store.state.host,
          port: this.$store.state.port
        }
      )
    },

  },

  computed: {
    // Stylises the hostname input box based on connection status
    IpFormClasses: function () {
      return {
        'uk-form-danger': !this.$store.state.available,
        'uk-form-success': this.$store.getters.ready
      }
    },

    computedLocalMode: {
      get: function() {
        return this.localMode
      },
      set: function(state) {
        this.localMode = state;
        this.setLocalMode(state)
      }
    },

    computedPort: {
      get: function() {
        if (this.hostname.includes(':')) {
          var port = parseInt(this.hostname.split(':')[1]);
          return !isNaN(port) ? port : this.port
        }
        else {
          return this.port
        }
      },
      set: function(newPort) {
        this.port = newPort
        if (this.hostname.includes(':')) {
          this.hostname = this.hostname.split(':')[0] + ":" + this.port
        }
      }
    },

    computedSelectedHost: {
      get: function() {
        return this.selectedHost
      },
      set: function(host) {
        this.selectedHost = host;
        this.hostname = host.hostname;
        this.port = host.port;
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.host-input {
  text-align: left;
}

.host-description {
  text-overflow: ellipsis;
  overflow: hidden;
}

.host-delete {
  padding: 0 2px 0 10px;
}

</style>
