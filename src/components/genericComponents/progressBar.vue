<template>
<div class="progress uk-margin-top uk-margin-horizontal-remove uk-padding-remove">
  <div class="indeterminate"></div>
</div>
</template>

<script>

export default {
  name: 'progressBar',

  props: {},

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
@import "../../assets/less/theme.less";

.progress {
  position: relative;
  height: 5px;
  display: block;
  width: 100%;
  background-color: rgba(180, 180, 180, 0.15);
  border-radius: 2px;
  background-clip: padding-box;
  margin: 0.5rem 0 1rem 0;
  overflow: hidden; 
}

.progress .determinate {
  position: absolute;
  background-color: inherit;
  top: 0;
  bottom: 0;
  transition: width .3s linear; 
}

.progress .indeterminate, .progress .determinate {
  background-color: @global-primary-background; 
}

.hook-inverse() {
    .progress .indeterminate, .progress .determinate{
        background-color: @inverse-primary-muted-color;
    }
}

.progress .indeterminate:before {
  content: '';
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
          animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite; 
}

.progress .indeterminate:after {
  content: '';
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
          animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
  -webkit-animation-delay: 1.15s;
          animation-delay: 1.15s; 
}

@-webkit-keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%; }
  60% {
    left: 100%;
    right: -90%; }
  100% {
    left: 100%;
    right: -90%; } 
}
@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%; }
  60% {
    left: 100%;
    right: -90%; }
  100% {
    left: 100%;
    right: -90%; } 
}
@-webkit-keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%; }
  60% {
    left: 107%;
    right: -8%; }
  100% {
    left: 107%;
    right: -8%; } 
}
@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%; }
  60% {
    left: 107%;
    right: -8%; }
  100% {
    left: 107%;
    right: -8%; } 
}

</style>