<template>
	<div ref="streamDisplay" class="stream-display uk-width-1-1 uk-height-1-1 scrollTarget" id="stream-display">

		<img class="uk-align-center uk-margin-remove-bottom" v-on:dblclick="clickmonitor" v-if="showStream" v-bind:src="streamImgUri" alt="Stream">

		<div v-else-if="$store.state.waiting" class="uk-position-center">
			<div uk-spinner="ratio: 4.5" ></div>
		</div>

		<div v-else-if="$store.state.globalSettings.disableStream" class="uk-position-center position-relative text-center">
			Stream preview disabled
		</div>

		<div v-else class="uk-position-center position-relative text-center">
			No active connection
		</div>

	</div>
</template>

<script>
import axios from 'axios'

// Export main app
export default {
  name: 'stream-display',

  data: function () {
    return {
			displaySize: [0, 0],
			displayPosition: [0, 0],
			GpuPreviewActive: false,
			resizeTimeoutId: setTimeout(this.doneResizing, 500)
    }
  },

  mounted() {

		const context = this;

    // A global signal listener to change the GPU preview state
    this.$root.$on('globalTogglePreview', (state) => {
			console.log(`Toggling preview to ${state}`)
			this.previewRequest(state)
		})

		// Mutation observer
		this.sizeObserver = new ResizeObserver(entries => {
			context.handleResize()  // For any element attached to the observer, run handleResize() on change
			entries.forEach(entry => {})  // Optional: Run something per entry
		});

		// Fetch streamDisplay by ref
		const streamDisplayElement = this.$refs.streamDisplay.parentNode;
		// Attach streamDisplay to the size observer
		this.sizeObserver.observe(streamDisplayElement);

	},

	created: function () {

		// Watch for host 'ready'
		this.$store.watch(
			(state)=>{
				return this.$store.getters.ready
			},
			(newValue, oldValue)=>{
				// 'ready' changed, so do something
				this.previewRequest(this.$store.state.globalSettings.autoGpuPreview)
			}
		)
	},

	beforeDestroy: function () {
		// Disconnect the size observer
		this.sizeObserver.disconnect()
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
			clearTimeout(this.resizeTimeoutId);
			this.resizeTimeoutId = setTimeout(this.handleDoneResize, 500)
		},

		handleDoneResize: function() {
			// Recalculate size
			console.log("Recalculating frame size")
			this.recalculateSize();
			if (this.$store.state.globalSettings.autoGpuPreview == true && this.GpuPreviewActive == true) {
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
			console.log("ELEMENT:")
			console.log(this.$refs.streamDisplay)
			let element = this.$refs.streamDisplay.parentNode.parentNode;

			let size = [element.clientWidth, element.clientHeight];

			let elem_pos = [element.getBoundingClientRect().left, element.getBoundingClientRect().top];
			let wind_pos = [window.screenX, window.screenY];
			let navHeight = window.outerHeight - window.innerHeight;
			let position = [Math.max(0, wind_pos[0] + elem_pos[0]), Math.max(0, wind_pos[1] + elem_pos[1] + navHeight)];

			this.displaySize = size;
			console.log(`Size: ${this.displaySize}`)
			this.displayPosition = position;
			console.log(`Position: ${this.displayPosition}`)
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
				if (this.$store.state.globalSettings.trackWindow == true && state == true) {
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
					this.modalError(error) // Let mixin handle error
				})
			}
    },

  },

  computed: {
		showStream: function () {
			return this.$store.getters.ready && !this.$store.state.globalSettings.disableStream
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
.stream-display img {
	height: 100%;
	text-align: center;
	object-fit: contain
}

.stream-display {
	width: 100%;
	height: 100%;
}

.position-relative {
	position: relative !important;
}

.text-center {
	text-align: center;
}
</style>
