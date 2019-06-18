<template>
  <div>
    <label>{{label}}</label>

    <div class="uk-form-controls">

      <div v-for="option in options" :key="option">
        <label>
          <input class="uk-checkbox" type="checkbox" v-bind:value="option" v-bind:checked="(value && value.includes(option))" @change="updateValue($event.target)"> 
          {{ option }}
        </label>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'checkList',

  props: [
    'options', 
    'name', 
    'label',
    'value'
  ],

  methods: {
    updateValue(target) {
      var newSelected = this.value != null ? [...this.value] : []  // Clone value array

      if (target.checked) {
        if (!newSelected.includes(target.value)) {
          newSelected.push(target.value)
        }
      }
      else {
        if (newSelected.includes(target.value)) {
          var newSelected = newSelected.filter(function(value, index, arr){
              return value != target.value;
          })
        }
      }
      this.$emit('input', newSelected)
    }
  }
}
</script>

<style scoped></style>