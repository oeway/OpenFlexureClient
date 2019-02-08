<template>
	<div class="streamDisplay">

		<img v-if="$store.state.connected" v-bind:src="streamImgUri" alt="Stream">

		<div v-else-if="$store.state.waiting" class="uk-position-center">
			<div uk-spinner="ratio: 4.5" ></div>
		</div>
	</div>
</template>

<script>
// Export main app
export default {
  name: 'streamDisplay',

  computed: {
    // a computed getter
    streamImgUri: function () {
      // `this` points to the vm instance
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
