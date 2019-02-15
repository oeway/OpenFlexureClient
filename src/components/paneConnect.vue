<template>
<div class="host-input">
  <div class="uk-margin">

      <form @submit.prevent="handleSubmit">
        <div class="uk-inline">
          <span class="uk-form-icon" uk-icon="icon: server"></span>
          <input v-model="hostname" v-bind:class="IpFormClasses" class="uk-input uk-form-width-medium uk-form-small" type="text" name="flavor" placeholder="localhost">
        </div>
        <button class="uk-button uk-button-default uk-form-small uk-float-right">Connect</button>

        <ul uk-accordion>
          <li>
            <a class="uk-accordion-title" href="#">Advanced</a>
            <div class="uk-accordion-content">
              <label class="uk-form-label" for="form-stacked-text">Port</label>
              <div class="uk-form-controls">
                  <input v-model="computedPort" class="uk-input uk-form-width-medium uk-form-small" id="form-stacked-text" type="number" value=5000>
              </div>
            </div>
          </li>
      </ul>
      </form>

      <div class="host-display">
        <div v-if="$store.getters.ready">
          <p><b>Host:</b> {{ $store.state.host }}</p>
          <p><b>Base URI:</b> {{ $store.getters.uri }}</p>
          <p v-if="$store.state.apiConfig.name"><b>Device name:</b> {{ $store.state.apiConfig.name }}</p>

          <button v-on:click="saveHost()" class="uk-button uk-button-default uk-form-small uk-float-right uk-margin-small uk-width-1-1">Save Host</button>

        </div>

        <div v-else-if="$store.state.waiting">
          <div uk-spinner></div>
        </div>

        <div v-else-if="$store.state.error">
          <b>Error:</b> {{ $store.state.error }}
        </div>

        <div v-else>
          Enter a hostname and connect to start.
        </div>
      </div>

    <h3>Saved hosts</h3>

    <div v-for="host in savedHosts" :key="host.name">
      <a href="#" v-on:click="delSavedHost(host)" class="uk-icon-link" uk-icon="trash"></a> 
      <a href="#" v-on:click="autofillHost(host)">{{ host.name }} ({{ host.hostname }}:{{ host.port }})</a> 
    </div>

  </div>



</div>
</template>

<script>

export default {
  name: 'paneConnect',

  data: function () {
    return {
      hostname: "localhost",
      port: 5000,
      selectedHost: "",
      savedHosts: [
        {
          name: "local",
          hostname: "localhost",
          port: 80
        },
        {
          name: "test",
          hostname: "192.168.1.126",
          port: 5000
        }
      ]
    }  
  },

  methods: {
    handleSubmit: function(event) {
      if (this.hostname.includes(':')) {
        this.port = this.computedPort
        this.hostname = this.hostname.split(':')[0];
      }
      // Commit the hostname and port to store
      this.$store.commit('changeHost', [
        this.hostname, 
        this.port
      ]);
      // Try to get config and state JSON from the newly submitted host
      this.$store.dispatch('firstConnect')
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
</style>
