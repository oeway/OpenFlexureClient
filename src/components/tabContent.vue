<template>
  
  <div 
    v-if="!(this.requireConnection && !this.$store.getters.ready)"
    v-bind:hidden="currentTab!=id" 
    class="uk-width-expand"
  >
    <slot></slot>
  </div>

</template>

<script>

export default {
  name: 'tabContent',

  props: {
    id: String,
    currentTab: String,
    requireConnection: Boolean,
  },

  methods: {},
  computed: {}
}

</script>

<style lang="less" scoped>
</style>