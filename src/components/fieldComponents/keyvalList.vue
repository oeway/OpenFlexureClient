<template>
  <div>
    <form @submit.prevent="handleMetadataSubmit">
      <div class="uk-margin-remove uk-flex uk-flex-middle">
        <div class="uk-margin-remove-top uk-padding-remove uk-grid-small uk-width-expand" uk-grid>
          <div class="uk-margin-remove uk-width-1-2"><input v-model="newMetadata.key" class="uk-input uk-form-width-small uk-form-small" type="text" name="flavor" placeholder="Key"></div>
          <div class="uk-margin-remove uk-width-1-2"><input v-model="newMetadata.value" class="uk-input uk-form-width-small uk-form-small" type="text" name="flavor" placeholder="Value"></div>
        </div>
        
        <a href="#" v-on:click="handleMetadataSubmit()" class="uk-icon uk-margin-left"><i class="material-icons">add_circle</i></a>

      </div>
    </form>

    <div v-for="(val, key) in value" :key="key" class="uk-width-1-1 uk-margin-small uk-margin-remove-left uk-margin-remove-right uk-flex uk-flex-middle">
      <div class="uk-margin-remove-top uk-padding-remove uk-width-expand"><b>{{ key }}: </b>{{ val }}</div>
      <a href="#" v-on:click="delMetadataKey(key)" class="uk-icon uk-width-auto"><i class="material-icons">delete</i></a>
    </div>
  
  </div>
</template>

<script>
export default {
  name: 'keyvalList',

  data: function () {
    return {
      newMetadata: {
        key: "",
        value: ""
      }
    }
  },

  props: [
    'value'
  ],

  methods: {
    handleMetadataSubmit: function () {
      var newSelected = {}

      if (this.value != null) {
        Object.assign(newSelected, this.value)
      }

      newSelected[this.newMetadata.key] = this.newMetadata.value
      this.newMetadata.key = "";
      this.newMetadata.value = "";

      this.$emit('input', newSelected)
    },

    delMetadataKey: function (key) {
      var newSelected = {}

      if (this.value != null) {
        Object.assign(newSelected, this.value)
      }

      this.$delete(newSelected, key)

      this.$emit('input', newSelected)
    },

  }
}
</script>

<style scoped></style>