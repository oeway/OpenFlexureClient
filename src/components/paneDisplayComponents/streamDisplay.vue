<template>
	<div class="streamDisplay">
		<div class="streamContainer" v-if="$store.state.connected">
			<img v-bind:src="streamImgUri" alt="Stream">
		</div>
	</div>
</template>

<script>
// Export main app
export default {
  name: 'streanmDisplay',

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
	.streamContainer img {
		width: 100%;
		height: 100%;
		object-fit: contain
	}

	.streamContainer, .streamDisplay {
		width: 100%;
		height: 100%;
	}
</style>
