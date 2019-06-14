<template>
  <div>
    <label>{{label}}</label>

    <div class="uk-form-controls">

      <div v-for="option in options" :key="option">
        <label><input class="uk-radio" type="radio" :name="name" :value="option" :checked="value==option" @input="$emit('input', $event.target.value)"> {{ option }}</label>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'radioList',

  props: [
    'options', 
    'name', 
    'label',
    'value'
  ]
}
</script>

<style scoped></style>