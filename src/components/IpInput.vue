<template>
<div class="hello">
  {{ msg }}
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
  name: 'HelloWorld',

  props: {
    msg: String
  },

  methods: {
    IpChanged: function(event) {
      if (!(event.target.value == this.$store.getters.host)) {
        this.hostname = event.target.value
      }
    },
    
    handleSubmit: function(event) {
      if (this.hostname != "badhost") {
        this.$store.commit('changeHost', this.hostname)
        alert(`Connecting to ${this.$store.getters.host}`)
        this.$store.commit('changeConnected', true)
      }
      else {
        alert("I won't connect to a bad host!")
        this.$store.commit('changeConnected', false)
        this.$store.commit('changeAvailable', false)
      }
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
        'uk-form-danger': !this.$store.getters.available,
        'uk-form-success': this.$store.getters.connected
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
