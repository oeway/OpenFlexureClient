<template>
<div v-if="$store.state.connected" id="paneNavigate">

  <ul uk-accordion>
    <li>
      <a class="uk-accordion-title" href="#">Configure</a>
      <div class="uk-accordion-content">

        <div class="uk-child-width-1-2" uk-grid>

          <div>
            <label class="uk-form-label" for="form-stacked-text">x-y step size</label>
            <div class="uk-form-controls">
              <input v-model="stepXy" class="uk-input uk-form-width-medium uk-form-small" type="number" name="inputStepXy">
            </div>
          </div>

          <div>
            <label class="uk-form-label" for="form-stacked-text">z step size</label>
            <div class="uk-form-controls">
              <input v-model="stepZz" class="uk-input uk-form-width-medium uk-form-small" type="number" name="inputStepZz">
            </div>
          </div>

        </div>
      </div>
    </li>

    <li>
      <a class="uk-accordion-title" href="#">Move-to</a>
      <div class="uk-accordion-content">

        <form @submit.prevent="handleSubmit">
          <div class="uk-child-width-1-3" uk-grid>
            <div>
              <label class="uk-form-label" for="form-stacked-text">x</label>
              <div class="uk-form-controls">
                <input v-model="$store.state.apiState.stage.position.x" class="uk-input uk-form-small" type="number" name="inputPositionX">
              </div>
            </div>

            <div>
              <label class="uk-form-label" for="form-stacked-text">y</label>
              <div class="uk-form-controls">
                <input v-model="$store.state.apiState.stage.position.y" class="uk-input uk-form-small" type="number" name="inputPositionY">
              </div>
            </div>

            <div>
              <label class="uk-form-label" for="form-stacked-text">z</label>
              <div class="uk-form-controls">
                <input v-model="$store.state.apiState.stage.position.z" class="uk-input uk-form-small" type="number" name="inputPositionZx">
              </div>
            </div>
          </div>

          <p>
            <button class="uk-button uk-button-default uk-form-small uk-float-right uk-width-1-1">Move</button>
          </p>
        </form>

      </div>
    </li>
  </ul>

  <p>
  <b>TODO:</b> Basic keyboard control by adding event listeners to this pane (e.g. v-on:keyup.)
  <br>
  <b>TODO:</b> Make step size and position boxes work.
  <br>
  <b>TODO:</b> Add click-navigation (and scroll focus) by adding event listeners to the stream panel (e.g. v-on:click, v-on:scroll)

  </p>
</div>
</template>

<script>
// Export main app
export default {
  name: 'paneNavigate',

  data: function () {
    return {
      stepXy: 50,
      stepZz: 20
    }
  },

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
    },

    handleSubmit: function(event) {
      console.log("Position form submitted!")
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