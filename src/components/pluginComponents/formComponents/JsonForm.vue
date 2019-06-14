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

    <button type="submit" class="uk-button uk-button-primary uk-form-small uk-float-right uk-margin-small uk-width-1-1">Submit</button>

  </form>
</template>

<script>

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
    }
  },

  data: function () {
    return {
      formData: {}
    }
  },

  methods: {
    updateForm(fieldName, value) {
      this.$set(this.formData, fieldName, value);
      this.$emit('input', this.formData)
    },

    submitForm() {
      console.log(`Mock-submitting form to ${this.submitApiUri}:`)
      console.log(this.formData)
    }

  },

  computed: {
    submitApiUri: function () {
      return this.$store.getters.uri + this.route
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