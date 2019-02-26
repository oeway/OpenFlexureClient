<template>
	<div class="streamDisplay uk-width-1-1 uk-height-1-1 scrollTarget" id="streamDisplay" ref="streamDisplay">

		<img class="uk-align-center uk-margin-remove-bottom" v-on:dblclick="clickmonitor" v-if="showStream" v-bind:src="streamImgUri" alt="Stream">

		<div v-else-if="$store.state.waiting" class="uk-position-center">
			<div uk-spinner="ratio: 4.5" ></div>
		</div>

		<div v-else-if="$store.state.settings.disableStream" class="uk-position-center position-relative">
			Stream preview disabled
		</div>

		<div v-else class="uk-position-center position-relative">
			No active connection
		</div>

	</div>
</template>

<script>
import axios from 'axios'

// Export main app
export default {
  name: 'streamDisplay',

  data: function () {
    return {
			displaySize: [0, 0],
			displayPosition: [0, 0],
			GpuPreviewActive: false,
      resizeTeimoutId: setTimeout(this.doneResizing, 500)
    }
  },

  mounted() {
    // A global signal listener to change the GPU preview state
    this.$root.$on('globalTogglePreview', (state) => {
			this.previewRequest(state)
		})
	},

	created: function () {
		// Add resize listener
  	window.addEventListener('resize', this.handleResize)
	},

	beforeDestroy: function () {
		// Remove resize listener
		window.removeEventListener('resize', this.handleResize)
	},

  methods: {
    clickmonitor: function(event) {
			// Calculate steps from event coordinates and store config FOV
			var xCoordinate = event.offsetX;
			var yCoordinate = event.offsetY;

			var xRelative = (0.5*event.target.offsetWidth - xCoordinate)/event.target.offsetWidth;
			var yRelative = (0.5*event.target.offsetHeight - yCoordinate)/event.target.offsetHeight;

			var xSteps = xRelative * this.$store.state.apiConfig.fov[0];
			var ySteps = yRelative * this.$store.state.apiConfig.fov[1];

			// Emit a signal to move, acted on by panelNavigate.vue
			this.$root.$emit('globalMoveEvent', xSteps, ySteps, 0, false)
		},
		
		handleResize: function(event) {
			// Only fires resize event after no resize in 500ms (prevents resize event spam)
			clearTimeout(this.resizeTeimoutId);
			this.resizeTeimoutId = setTimeout(this.handleDoneResize, 500)
		},

		handleDoneResize: function() {
			// Recalculate size
			this.recalculateSize();
			if (this.$store.state.settings.autoGpuPreview == true && this.GpuPreviewActive == true) {
				// Reload preview
				this.$root.$emit('globalTogglePreview', true)
			}
		},

		recalculateSize: function () {
			console.log("Recalculating window dimensions...")
			// Stacking parentNode is a hacky fix
			// For some reason, when switching tabs, width was always half what it should be,
			// until the size was recalculated at some later time. Probably something to do
			// with tab transition. This parentNode stuff instead reads the size of the tab
			// container, irrespective of WHICH tab is selected. It's nasty, but works.
			let element = this.$refs.streamDisplay.parentNode.parentNode;

			let size = [element.clientWidth, element.clientHeight];

			let elem_pos = [element.getBoundingClientRect().left, element.getBoundingClientRect().top];
			let wind_pos = [window.screenX, window.screenY];
			let navHeight = window.outerHeight - window.innerHeight;
			let position = [Math.max(0, wind_pos[0] + elem_pos[0]), Math.max(0, wind_pos[1] + elem_pos[1] + navHeight)];

			this.displaySize = size;
			this.displayPosition = position;
		},

    previewRequest: function(state) {
			if (this.$store.getters.ready == true) {
				// Create URI and set this.GpuPreviewActive depending on if starting or stopping preview
				if (state == true) {
					this.GpuPreviewActive = true
					var requestUri = this.startPreviewUri;
				}
				else {
					this.GpuPreviewActive = false;
					var requestUri = this.stopPreviewUri;
				}

				// Generate payload if tracking window position
				if (this.$store.state.settings.trackWindow == true && state == true) {
					// Recalculate frame dimensions and position
					this.recalculateSize()
					// Copy data into payload array
					var payload = {
						window : [
							this.displayPosition[0],
							this.displayPosition[1],
							this.displaySize[0],
							this.displaySize[1],
						]
					}
				}
				else {
					var letpayload = {}
				}

				// Send preview request
				axios.post(requestUri, payload)
				.then(response => { 
					this.$store.dispatch('updateState');  // Update store state
				})
				.catch(error => {
					this.$store.dispatch('handleHTTPError', error);  // Let store handle error
				})
			}
    },

  },

  computed: {
		showStream: function () {
			return this.$store.getters.ready && !this.$store.state.settings.disableStream
		},
    streamImgUri: function () {
      return this.$store.getters.uri + "/stream"
		},
		startPreviewUri: function () {
			return this.$store.getters.uri + "/camera/preview/start"
		},
		stopPreviewUri: function () {
			return this.$store.getters.uri + "/camera/preview/stop"
		}
	}

}
</script>

<style scoped lang="less">
.streamDisplay img {
	height: 100%;
	text-align: center;
	object-fit: contain
}

.streamDisplay {
	width: 100%;
	height: 100%;
}

.position-relative {
	position: relative !important;
}
</style>
