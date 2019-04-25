<template>
  <Page>
    <ActionBar title="OpenFlexure Native Demo"/>
    <GridLayout rows="auto, auto">
      <Label class="message" text="No content currently ported" row="0" horizontalAlignment="center"/>
    </GridLayout>
  </Page>
</template>

<script>
// Import axios for HTTP requests
import axios from 'axios'

// Export main app
export default {
  name: 'app',


  data: function () {
    return {}  
  },

  created: function () {
  },

  beforeDestroy: function () {
  },

  methods: {
  },

  computed: {
  }

}
</script>

<style></style>
