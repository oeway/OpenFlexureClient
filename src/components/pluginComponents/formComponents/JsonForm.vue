<template>
  <div class="uk-form-stacked">
    <div v-for="(field, index) in schema" :key="index"> 
    
      <div v-if="Array.isArray(field)" class="uk-grid-small" uk-grid>
        <div v-for="(subfield, subindex) in field" :key="subindex" class="uk-width-expand"> 
          <component
            :is="subfield.fieldType"
            @input="updateForm(subfield.name, $event)"
            v-bind="subfield">
          </component>
        </div>
      </div>
      
      <component
        :is="field.fieldType"
        @input="updateForm(field.name, $event)"
        v-bind="field">
      </component>

    </div>
  </div>
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
    }
  },

  data: function () {
    return {
      formData: {}
    }
  },

  created: function () {
    // `this` points to the vm instance
    console.log(this.schema)
  },

  methods: {
    updateForm(fieldName, value) {
      console.log(`${fieldName}: ${value}`)
      this.$set(this.formData, fieldName, value);
      this.$emit('input', this.formData)
    }
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