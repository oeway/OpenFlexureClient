<template>
  <div>
    <label>{{label}}</label>

    <div class="uk-form-controls">

      <div v-for="option in options" :key="option">
        <label><input class="uk-checkbox" type="checkbox" v-bind:value="option" v-model="computedChecked"> {{ option }}</label>
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

  data: function () {
    return {
      itemsChecked: this.value || []
    }
  },

  computed: {
    computedChecked: {
      get() {
        return this.itemsChecked
      },
      set(val) {
        this.itemsChecked = val
        this.$emit('input', this.itemsChecked)
      }
    }
  }
}
</script>

<style scoped></style>