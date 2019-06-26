<template>
  <div>
    <label class="uk-form-label">{{label}}</label>

    <input 
      class="uk-input uk-form-small"
      type="text"
      v-bind:name="name"
      v-bind:value="value"
      v-bind:placeholder="placeholder"
      @input="$emit('input',$event.target.value)"
    >

  </div>
</template>

<script>
export default {
  name: 'textInput',

  props: [
    'placeholder', 
    'label', 
    'name',
    'value'
  ]
}
</script>

<style scoped></style>