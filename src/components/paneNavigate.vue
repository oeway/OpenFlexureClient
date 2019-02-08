<template>
<div id="paneNavigate">
  Navigate
  <p>
  TODO: Basic keyboard control by adding event listeners to this pane (e.g. v-on:keyup.)
  <br>
  TODO: Add step-size boxes
  <br>
  TODO: Add click-navigation (and scroll focus) by adding event listeners to the stream panel (e.g. v-on:click, v-on:scroll)
  <br>
  TODO: Add absolute-positioning input boxes
  </p>
</div>
</template>

<script>
// Export main app
export default {
  name: 'paneNavigate',

  methods: {
    // Handle global mouse wheel events to be associated with navigation
    wheelmonitor: function(event) {
      // TODO: Add logic
      console.log(event.deltaY)
      console.log(event.target.parentNode.classList)

      // Only capture scroll if the event target's parent contains the "scrollTarget" class
      if (event.target.parentNode.classList.contains("scrollTarget")) {
        console.log("Wheel captured");
      }
      else {
        console.log("Scrolled outside of a scroll capture target")
      }
    },

    // Handle global key press events to be associated with navigation
    keymonitor: function(event) {
      // TODO: Add logic
      if (!(event.target instanceof HTMLInputElement)) {
        console.log("A key was pressed:");
        console.log(event.keyCode)
      }
    }
  },

  created: function () {
    window.addEventListener('keydown', this.keymonitor);
    window.addEventListener('wheel', this.wheelmonitor)
  },

  computed: {
    positionApiUri: function () {
      return this.$store.getters.uri + "/stage/position"
    }
  }

}
</script>