<template>
	<div class="streamDisplay scrollTarget">

		<img v-on:dblclick="clickmonitor" v-if="$store.getters.ready" v-bind:src="streamImgUri" alt="Stream">

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
			// TODO: Add logic
			console.log("The preview was clicked!");
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
	width: 100%;
	height: 100%;
	object-fit: contain
}

.streamDisplay {
	width: 100%;
	height: 100%;
}
</style>
