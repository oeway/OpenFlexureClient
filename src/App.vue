<template>
  <div id="app">
    <hostInput/>
    <img alt="Vue logo" src="./assets/images/logo.png">
    <hostDisplay/>
  </div>
</template>

<script>
// Import axios for HTTP requests
import axios from 'axios'
// Import basic UIkit
import UIkit from 'uikit';
// Import UIkit icon set
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

// Import components
import hostInput from './components/hostInput.vue'
import hostDisplay from './components/hostDisplay'

// Export main app
export default {
  name: 'app',
  components: {
    hostInput,
    hostDisplay
  }
}
</script>

<style lang="less">
// Basic UIkit CSS
@import "../node_modules/uikit/src/less/uikit.less";
// Custom UIkit CSS modifications
@import "./assets/less/theme.less";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
