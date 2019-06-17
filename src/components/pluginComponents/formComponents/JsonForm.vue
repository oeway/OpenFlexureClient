<template>
  <form @submit.prevent="submitForm" class="uk-form-stacked">

    <div v-for="(field, index) in schema" :key="index"> 
      <div v-if="Array.isArray(field)" class="uk-grid-small" uk-grid>
        <div v-for="(subfield, subindex) in field" :key="subindex" class="uk-width-expand"> 
          <component
            :is="subfield.fieldType"
            v-model="formData[subfield.name]"
            v-bind="subfield">
          </component>
        </div>
      </div>
      
      <component
        :is="field.fieldType"
        v-model="formData[field.name]"
        v-bind="field">
      </component>
    </div>

    <div class="uk-text-center uk-container" v-if="taskRunning">
      <div class="center-spinner" uk-spinner></div>
    </div>

    <button v-bind:hidden="taskRunning" type="submit" class="uk-button uk-button-primary uk-form-small uk-float-right uk-margin-small uk-width-1-1">{{ submitLabel }}</button>

  </form>
</template>

<script>
import axios from 'axios'

import numberInput from "./fieldComponents/numberInput";
import selectList from "./fieldComponents/selectList";
import textInput from "./fieldComponents/textInput";
import htmlBlock from "./fieldComponents/htmlBlock";
import radioList from "./fieldComponents/radioList";
import checkList from "./fieldComponents/checkList"

export default {
  name: 'JsonForm',

  components: { 
    numberInput, 
    selectList, 
    textInput,
    htmlBlock,
    radioList,
    checkList
  },

  props: {
    'schema': {
      type: Array,
      required: true
    },
    'route': {
      type: String,
      required: true
    },
    'isTask': {
      type: Boolean,
      required: false,
      default: false
    },
    'submitLabel': {
      type: String,
      required: false,
      default: "Submit"
    }
  },

  data: function () {
    return {
      formData: {},
      taskRunning: false
    }
  },

  methods: {
    updateForm(fieldName, value) {
      this.$set(this.formData, fieldName, value);
      this.$emit('input', this.formData)
    },

    submitForm() {
      if (this.isTask == true) {
        this.newLongRequest(this.formData)
      }
      else {
        this.newQuickRequest(this.formData)
      }
    },

    newQuickRequest: function(params) {
      console.log(this.submitApiUri)
      console.log(params)
      // Send a quick request
      axios.post(this.submitApiUri, params)
        .then(response => { 
          console.log(response)
          // TODO: Have this perform a GET request to update all available parameters
        })
        .catch(error => {
          this.modalError(error) // Let mixin handle error
        })
    },

    newLongRequest: function(params) {
        this.taskRunning = true
        axios.post(this.submitApiUri, params)
        .then(response => { 
          console.log("Task ID: " + response.data.id)
          // Start the store polling TaskId for success
          return this.$store.dispatch('pollTask', [response.data.id, null, null])
        })
        .then(response => {
          console.log("Successfully finished task with response:")
          console.log(response)
        })
        .catch(error => {
          this.modalError(error) // Let mixin handle error
        })
        .finally(() => {
          console.log("Cleaning up after task.")
          this.taskRunning = false
        })
    },

  },

  computed: {
    pluginApiUri: function () {
      return this.$store.getters.uri + "/plugin"
    },

    submitApiUri: function () {
      return this.pluginApiUri + this.route
    },

  }

}
</script>

<style scoped>
.flex-container {
  display: flex;
}

.flex-container > div {
  flex-basis: 100%
}
</style>