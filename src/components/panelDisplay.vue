<template>
  <div id="panelDisplay">
    <streamDisplay/>
  </div>
</template>

<script>
// Import components
import streamDisplay from './paneDisplayComponents/streamDisplay.vue'

// Export main app
export default {
  name: 'panelDisplay',

  components: {
    streamDisplay
  }

}
</script>

<style lang="less">
#panelDisplay {
	width: 100%;
	height: 100%;
}
</style>
