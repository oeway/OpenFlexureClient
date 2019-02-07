<template>
  <div id="paneConnect">
    <hostInput/>
    <hostDisplay/>
  </div>
</template>

<script>
// Import components
import hostInput from './paneConnectComponents/hostInput.vue'
import hostDisplay from './paneConnectComponents/hostDisplay'

// Export main app
export default {
  name: 'paneConnect',
  components: {
    hostInput,
    hostDisplay
  }
}
</script>

<style lang="less">

</style>
