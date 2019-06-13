<template>
  <div>
    <component v-for="(field, index) in schema"
      :key="index"
      :is="field.fieldType"
      v-model="formData[field.name]"
      v-bind="field">

    </component>
  </div>
</template>

<script>

import numberInput from "./fieldComponents/numberInput";
import selectList from "./fieldComponents/selectList";
import textInput from "./fieldComponents/textInput";
import htmlBlock from "./fieldComponents/htmlBlock";

export default {
  name: 'JsonForm',

  components: { 
    numberInput, 
    selectList, 
    textInput,
    htmlBlock
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
  }
}
</script>

<style scoped></style>