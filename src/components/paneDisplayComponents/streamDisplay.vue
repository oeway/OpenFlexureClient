<template>
	<div class="streamDisplay scrollTarget">

		<img class="uk-align-center" v-on:dblclick="clickmonitor" v-if="$store.getters.ready" v-bind:src="streamImgUri" alt="Stream">

		<div v-else-if="$store.state.waiting" class="uk-position-center">
			<div uk-spinner="ratio: 4.5" ></div>
		</div>
	</div>
</template>

<script>
// Export main app
export default {
  name: 'streamDisplay',

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
    }
  },

  computed: {
    streamImgUri: function () {
      return this.$store.getters.uri + "/stream"
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
</style>
