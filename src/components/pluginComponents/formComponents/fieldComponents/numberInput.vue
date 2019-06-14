<template>
  <div>
    <label class="uk-form-label">{{label}}</label>

    <input 
      class="uk-input uk-form-small"
      type="number"
      :name="name"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
    >

  </div>
</template>

<script>

export default {
  name: 'numberInput',

  props: [
    'placeholder', 
    'label', 
    'name', 
    'value'
  ]

}

</script>

<style scoped></style>