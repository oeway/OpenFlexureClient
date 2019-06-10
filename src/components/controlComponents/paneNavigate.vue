<template>
<div id="paneNavigate">

  <ul uk-accordion="multiple: true">
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

    <li class="uk-open">
      <a class="uk-accordion-title" href="#">Move-to</a>
      <div class="uk-accordion-content">

        <form @submit.prevent="handleSubmit">
          <div class="uk-grid-small uk-child-width-1-3" uk-grid>
            <div>
              <label class="uk-form-label" for="form-stacked-text">x</label>
              <div class="uk-form-controls">
                <input v-model="setPosition.x" class="uk-input uk-form-small" type="number" name="inputPositionX">
              </div>
            </div>

            <div>
              <label class="uk-form-label" for="form-stacked-text">y</label>
              <div class="uk-form-controls">
                <input v-model="setPosition.y" class="uk-input uk-form-small" type="number" name="inputPositionY">
              </div>
            </div>

            <div>
              <label class="uk-form-label" for="form-stacked-text">z</label>
              <div class="uk-form-controls">
                <input v-model="setPosition.z" class="uk-input uk-form-small" type="number" name="inputPositionZx">
              </div>
            </div>
          </div>

          <p>
            <button class="uk-button uk-button-primary uk-form-small uk-float-right uk-width-1-1">Move</button>
          </p>
        </form>

      </div>
    </li>

    <li class="uk-open">
      <a class="uk-accordion-title" href="#">Autofocus</a>
      <div class="uk-accordion-content">

        <div class="uk-text-center uk-container" v-if="isAutofocusing">
          <div class="center-spinner" uk-spinner></div>
        </div>
        <div class="uk-grid-small uk-child-width-1-3" v-bind:hidden="isAutofocusing" uk-grid>
          <div>
            <button v-on:click="runFastAutofocus(2000, 300);" class="uk-button uk-button-default uk-form-small uk-float-right uk-width-1-1">Fast</button>
          </div>
          <div>
            <button v-on:click="runAutofocus([-60,-30,0,30,60]);" class="uk-button uk-button-default uk-form-small uk-float-right uk-width-1-1">Medium</button>
          </div>
          <div>
            <button v-on:click="runAutofocus([-20,-10,0,10,20]);" class="uk-button uk-button-default uk-form-small uk-float-right uk-width-1-1">Fine</button>
          </div>
        </div>

      </div>
    </li>

  </ul>
</div>
</template>

<script>
import axios from 'axios'

// Key Codes
const keyCodes = {
  pgup: 33,
  pgdn: 34,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  enter: 13,
  esc: 27
}

// Export main app
export default {
  name: 'paneNavigate',

  data: function () {
    return {
      keysDown: {},
      stepXy: 200,
      stepZz: 50,
      setPosition: this.$store.state.apiState.stage.position,
      isAutofocusing: false,
      moveLock: false
    }
  },

  mounted() {
    // A global signal listener to perform a move action
    this.$root.$on('globalMoveEvent', (x, y, z, absolute) => {
      this.moveRequest(x, y, z, absolute)
    })
  },

  methods: {
    // Handle global mouse wheel events to be associated with navigation
    wheelMonitor: function(event) {
      // Only capture scroll if the event target's parent contains the "scrollTarget" class
      if (event.target.parentNode.classList.contains("scrollTarget") || event.target.classList.contains("scrollTarget")) {
        var z_rel = (event.deltaY)/100 * this.stepZz
        this.moveRequest(0, 0, z_rel, false)
      }
    },

    // Handle global key press events to be associated with navigation
    keyDownMonitor: function(event) {
      this.keysDown[event.keyCode] = true; //Add key to array

      // Convert keyCode dict into a list of key codes
      var keyCodeList = Object.keys(keyCodes).map(function(key){return keyCodes[key];});

      if (!(event.target instanceof HTMLInputElement) && !(event.target.classList.contains('lightbox-link')) && keyCodeList.includes(event.keyCode)) {
        //console.log(this.keysDown)
        // Calculate movement array
        var x_rel = 0;
        var y_rel = 0;
        var z_rel = 0;
        if (keyCodes.left in this.keysDown) {
          x_rel = x_rel + this.stepXy;
        }
        if (keyCodes.right in this.keysDown) {
          x_rel = x_rel - this.stepXy;
        }
        if (keyCodes.up in this.keysDown) {
          y_rel = y_rel + this.stepXy;
        }
        if (keyCodes.down in this.keysDown) {
          y_rel = y_rel - this.stepXy;
        }
        if (keyCodes.pgup in this.keysDown) {
          z_rel = z_rel - this.stepZz;
        }
        if (keyCodes.pgdn in this.keysDown) {
          z_rel = z_rel + this.stepZz;
        }

        // Make a position request
        this.moveRequest(x_rel, y_rel, z_rel, false)
      }
    },

    keyUpMonitor: function(event) {
      delete this.keysDown[event.keyCode]; //Remove key from array
    },

    handleSubmit: function(event) {
      this.moveRequest(
        this.setPosition.x,
        this.setPosition.y,
        this.setPosition.z,
        true,
      )
    },

    moveRequest: function(x, y, z, absolute) {
      console.log(`Sending move request of ${x}, ${y}, ${z}`)
      // If not movement-locked
      if (!this.moveLock) {
        // Lock move requests
        this.moveLock = true

        // Send move request
        axios.post(this.positionApiUri, {
          x: x,
          y: y,
          z: z,
          absolute: absolute
        })
        .then(response => { 
          this.$store.dispatch('updateState');  // Update store state
          this.setPosition = response.data.stage.position;  // Update boxes from response
        })
        .catch(error => {
          this.modalError(error) // Let mixin handle error
        })
        .then(() => {
          this.moveLock = false  // Release the move lock
        })
      }
    },

    runAutofocus: function(dz) {
      if (!this.moveLock) {
        // Lock move requests
        this.moveLock = true
        this.isAutofocusing = true
        axios.post(this.autofocusApiUri, {dz: dz})
        .then(response => { 
          console.log("Autofocus Task ID: " + response.data.id)
          // Start the store polling TaskId for success
          return this.$store.dispatch('pollTask', [response.data.id, null, null])
        })
        .then(() => {
          console.log("Successfully finished autofocus")
        })
        .catch(error => {
          this.modalError(error) // Let mixin handle error
        })
        .finally(() => {
          console.log("Cleaning up after autofocus.")
          this.isAutofocusing = false;
          this.moveLock = false  // Release the move lock
        })
      }
    },

    runFastAutofocus: function(dz, backlash) {
      if (!this.moveLock) {
        // Lock move requests
        this.moveLock = true
        this.isAutofocusing = true
        axios.post(this.fastAutofocusApiUri, {dz: dz, backlash: backlash})
        .then(response => { 
          console.log("Autofocus Task ID: " + response.data.id)
          // Start the store polling TaskId for success
          return this.$store.dispatch('pollTask', [response.data.id, null, null])
        })
        .then(() => {
          console.log("Successfully finished autofocus")
        })
        .catch(error => {
          this.modalError(error) // Let mixin handle error
        })
        .finally(() => {
          console.log("Cleaning up after autofocus.")
          this.isAutofocusing = false
          this.moveLock = false  // Release the move lock
        })
      }
    }

  },

  created: function () {
    window.addEventListener('keydown', this.keyDownMonitor);
    window.addEventListener("keyup", this.keyUpMonitor);
    window.addEventListener('wheel', this.wheelMonitor);
  },

  computed: {
    positionApiUri: function () {
      return this.$store.getters.uri + "/stage/position"
    },
    autofocusApiUri: function () {
      return this.$store.getters.uri + "/plugin/default/autofocus/autofocus"
    },
    fastAutofocusApiUri: function () {
      return this.$store.getters.uri + "/plugin/default/autofocus/fast_autofocus"
    }
  }

}
</script>