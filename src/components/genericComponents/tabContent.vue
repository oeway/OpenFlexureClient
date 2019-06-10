<template>
  
  <div 
    v-if="!(this.requireConnection && !this.$store.getters.ready)"
    v-bind:hidden="currentTab!=id" 
    class="uk-width-expand"
  >
    <div class="section-heading">{{ id }}</div>
    <div class="section-content"><slot></slot></div>
    
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

.section-heading {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  line-height: 20px;
}

.section-content, .section-heading {
  padding: 9px 10px;
}

</style>