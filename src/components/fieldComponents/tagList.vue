<template>
  <div>

    <form @submit.prevent="handleTagSubmit">
      <div class="uk-margin-small uk-flex uk-flex-middle">

        <div class="uk-margin-remove-top uk-width-expand">
          <div class="uk-inline uk-width-1-1">
            <span class="uk-form-icon"><i class="material-icons">label</i></span>
            <input v-model="newTag" class="uk-input uk-form-small" type="text" name="flavor" placeholder="Tag">
          </div>
        </div>

        <a href="#" v-on:click="handleTagSubmit()" class="uk-icon uk-margin-left"><i class="material-icons">add_circle</i></a>
      </div>
    </form>

    <span v-for="tag in value" :key="tag" v-on:click="delTag(tag)" class="uk-label uk-margin-small-right deletable-label"> {{ tag }} </span>

  </div>
</template>

<script>
export default {
  name: 'tagList',

  data: function () {
    return {
      newTag: ""
    }
  },

  props: [
    'value'
  ],

  methods: {
    handleTagSubmit: function () {
      var newSelected = this.value != null ? [...this.value] : []  // Clone value array

      newSelected.push(this.newTag)
      this.newTag = "";

      this.$emit('input', newSelected)
    },

    delTag: function (tag) {
      var newSelected = this.value != null ? [...this.value] : []  // Clone value array

      if (newSelected.includes(tag)) {
        var newSelected = newSelected.filter(function(value, index, arr){
            return value != tag;
        })
      }

      this.$emit('input', newSelected)
    }

  }
}
</script>

<style scoped></style>