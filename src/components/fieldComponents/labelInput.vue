<template>
  <div>
    <label class="uk-form-label uk-text-bold">{{label}}</label>

    <div @click="setEditing(true)" uk-tooltip="title: Click to edit value; delay: 250">

      <div v-show="editing == false">
        <label> {{value}} </label>
      </div>

      <input
        v-show="editing == true"
        class="uk-input uk-form-small"
        type="text"
        v-bind:name="name"
        v-bind:value="value"
        ref="textinput"
        v-on:blur= "setEditing(false)"
        @keyup.enter = "setEditing(false)"
        @input="$emit('input', $event.target.value)"
        autofocus
      >
    </div>



  </div>
</template>

<script>
export default {
  name: 'labelInput',

  data: function () {
    return {
      editing: false
    }
  },

  props: [
    'name',
    'label',
    'value'
  ],

  methods: {
    setEditing(editing) {
      this.editing = editing
      if (editing == true) {
        this.$nextTick(() => this.$refs.textinput.focus())
      }
    }
  },

}
</script>

<style scoped></style>