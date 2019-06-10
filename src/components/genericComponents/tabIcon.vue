<template>
  <a 
    href="#" 
    :class="classObject" 
    :uk-tooltip="tooltipOptions"
    @click="setThisTab">
  </a>

</template>

<script>

export default {
  name: 'tabIcon',

  props: {
    id: String,
    currentTab: String,
    requireConnection: Boolean
  },

  methods: {
    setThisTab(event, value) {
      this.$emit('set-tab', event, this.id);
    }
  },

  computed: {
    tooltipOptions: function () {
      var title = this.id.charAt(0).toUpperCase() + this.id.slice(1);
      return `pos: right; title: ${title}; delay: 500`
    },

    classObject: function () {
      return {
        'tabicon-active': this.currentTab == this.id,
        'uk-disabled': (this.requireConnection && !this.$store.getters.ready)
      }
    }

  }
}

</script>

<style lang="less" scoped>
// Custom UIkit CSS modifications
@import "../../assets/less/theme.less";

.tabicon-active {
  color: @global-primary-background !important;
}

.hook-inverse() {
    .tabicon-active {
        color: @inverse-primary-muted-color !important;
    }
}

</style>