<template>
  <div id="app">
    <IpInput msg="Is your name good or bad?."/>
    <img alt="Vue logo" src="./assets/images/logo.png">
    <IpDisplay/>
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
import IpInput from './components/IpInput.vue'
import IpDisplay from './components/IpDisplay'

// Export main app
export default {
  name: 'app',
  components: {
    IpInput,
    IpDisplay
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
