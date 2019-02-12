<template>
	<div class="captureCard uk-card uk-card-default uk-padding-small uk-width-medium uk-margin-right">

    <div class="uk-card-header uk-padding-small">
  		<h3>Capture</h3>
    </div>

    <div class="uk-card-body uk-padding-small">
      {{ metadata.id }}
    </div>

    <div class="uk-card-footer uk-padding-small">
      <span class="uk-label uk-margin-small-right">Tag1</span>
      <span class="uk-label uk-margin-small-right">Tag2</span>
    </div>

	</div>
</template>

<script>

// Export main app
export default {
  name: 'captureCard',

  props: {
    temporary: {
      type: Boolean,
      required: true
    },
    metadata: {
      type: Object,
      required: true
    }
  },

  computed: {
    ThumbURL: function () {
      return this.$store.getters.uri + "/camera/capture/" + this.metadata.id + "/download?thumbnail=true"
    }
  }

}
</script>