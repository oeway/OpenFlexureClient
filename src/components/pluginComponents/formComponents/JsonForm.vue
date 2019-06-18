<template>
  <div>

    <div class="uk-flex">
      <div class="uk-text-bold uk-text-uppercase uk-width-expand">{{ name }}</div>
      <a href="#" v-if="selfUpdate" v-on:click="getFormData()" class="uk-icon uk-width-auto"><i class="material-icons">cached</i></a>
    </div>

    <form @submit.prevent="submitForm" class="uk-form-stacked">

      <div v-for="(field, index) in schema" :key="index"> 
        <div v-if="Array.isArray(field)" class="uk-grid-small uk-width-1-1 uk-child-width-expand" uk-grid>
          <div v-for="(subfield, subindex) in field" :key="subindex"> 
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

      <div class="uk-text-center uk-container uk-margin-small" v-if="taskRunning">
        <div class="center-spinner" uk-spinner></div>
      </div>

      <button v-bind:hidden="taskRunning" class="uk-button uk-button-primary uk-form-small uk-float-right uk-margin-small uk-width-1-1">{{ submitLabel }}</button>

    </form>

  </div>

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
    'name': {
      type: String,
      required: false,
      default: "Plugin"
    },
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
    },
    'selfUpdate': {
      type: Boolean,
      required: false,
      default: false
    },
  },

  data: function () {
    return {
      formData: {},
      taskRunning: false
    }
  },

  created() {
    this.initialiseFormData()

    if (this.selfUpdate) {
      this.getFormData()
    }
  },

  methods: {
    initialiseFormData() {
      /* 
      This function initialises the form data.
      Limitations in Vue mean that newly created formData properties are not reactive.
      GETting formData values from the server creates the properties, but the form components
      don't get updated because of this limitation.
      Here, we step through the form schema, and properly create reactive properties for each component.
      */
      for (const field of this.schema) {
        if (Array.isArray(field)) {
          for (const subfield of field) {
          console.log(subfield.name)
          this.$set(this.formData, subfield.name, null)
          }
        }
        else {
          console.log(field.name)
          this.$set(this.formData, field.name, null)
        }
        
      }
    },

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

    getFormData: function() {
      // Send a quick request
      axios.get(this.submitApiUri)
        .then(response => { 
          console.log(response.data)
          Object.assign(this.formData, response.data)
        })
        .catch(error => {
          this.modalError(error) // Let mixin handle error
        })
    },

    newQuickRequest: function(params) {
      console.log(this.submitApiUri)
      console.log(params)
      // Send a quick request
      axios.post(this.submitApiUri, params)
        .then(response => { 
          // Do something with the response
          console.log(response)
          // Update the form data if we're self-updating
          if (this.selfUpdate) {
            this.getFormData()
          }
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
          // Do something with the response
          console.log(response)
        })
        .catch(error => {
          this.modalError(error) // Let mixin handle error
        })
        .finally(() => {
          console.log("Cleaning up after task.")
          this.taskRunning = false
          // Update the form data if we're self-updating
          if (this.selfUpdate) {
            this.getFormData()
          }
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