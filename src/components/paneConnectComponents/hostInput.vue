<template>
<div class="host-input">
  <h2>Connect</h2>
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
                  <input v-model="port" class="uk-input uk-form-width-medium uk-form-small" id="form-stacked-text" type="number" value=5000>
              </div>
            </div>
          </li>
      </ul>
      </form>
  </div>
</div>
</template>

<script>

export default {
  name: 'hostInput',

  methods: {
    handleSubmit: function(event) {
      // Commit the hostname and port to store
      this.$store.commit('changeHost', [
        this.hostname, 
        this.port
      ]);
      // Try to get config and state JSON from the newly submitted host
      this.$store.dispatch('firstConnect')
    }
  },

  data: function () {
    return {
      hostname: "localhost",
      port: 5000
    }  
  },

  computed: {
    // Stylises the hostname input box based on connection status
    IpFormClasses: function () {
      return {
        'uk-form-danger': !this.$store.state.available,
        'uk-form-success': this.$store.getters.ready
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
