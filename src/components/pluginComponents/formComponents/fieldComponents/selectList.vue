<template>
  <div>
    <label class="uk-form-label">{{label}}</label>

    <select
      class="uk-select uk-form-small"
      :multiple="multi"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
      <option v-for="option in options" :key="option">
        {{option}}
      </option>

    </select>
  </div>
</template>

<script>
export default {
  name: 'selectList',

  props: [
    'multi', 
    'options', 
    'name', 
    'label',
    'value'
  ]
}
</script>

<style scoped></style>