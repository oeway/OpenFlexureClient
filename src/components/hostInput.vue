<template>
<div class="host-input">
  <div class="uk-margin">
      <form @submit.prevent="handleSubmit">
        <div class="uk-inline">
          <span class="uk-form-icon" uk-icon="icon: server"></span>
          <input @input="IpChanged" v-bind:class="IpFormClasses" class="uk-input uk-form-width-medium uk-form-small" type="text" name="flavor" placeholder="localhost">
        </div>
        <button class="uk-button uk-button-default uk-form-small">Connect</button>
      </form>
  </div>

</div>
</template>

<script>

export default {
  name: 'hostInput',

  methods: {
    IpChanged: function(event) {
      if (!(event.target.value == this.$store.state.host)) {
        this.hostname = event.target.value
      }
    },
    
    handleSubmit: function(event) {
        this.$store.commit('changeHost', this.hostname);
        this.$store.dispatch('updateConfig');
    }
  },

  data: function () {
    return {
      hostname: "localhost"
    }  
  },

  computed: {
    IpFormClasses: function () {
      return {
        'uk-form-danger': !this.$store.state.available,
        'uk-form-success': this.$store.state.connected
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
