<template>
	<div class="captureCard uk-card uk-card-primary uk-card-hover uk-padding-remove uk-width-medium uk-margin-right">

    <div class="uk-card-media-top">
      <img class="uk-width-1-1" v-bind:src="thumbnail" v-bind:alt="metadata.scan_id" uk-img>
    </div>

    <div class="uk-card-body uk-padding-small">
      <div class="uk-width-1-1 uk-margin-small uk-margin-remove-left uk-margin-remove-right" uk-grid>
        <div class="uk-margin-remove-top uk-padding-remove uk-width-expand"><b>Scan:</b> {{ metadata.custom.basename }}</div>
      </div>

      <div class="uk-text-meta uk-margin-remove-top uk-padding-remove uk-width-expand"><time>{{ betterTimestring }}</time></div>
      <div class="uk-text-meta uk-margin-remove-top uk-padding-remove uk-width-auto">
        <a v-bind:href="metadataModalTarget" uk-toggle>More...</a>
      </div>

    </div>

    <div class="uk-card-footer uk-padding-small">
      <span v-for="tag in metadata.tags" :key="tag" class="uk-label uk-margin-small-right deletable-label"> {{ tag }} </span>
    </div>

    <div v-bind:id="metadataModalID" uk-modal>

      <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <h2 class="uk-modal-title">{{ metadata.basename }}</h2>
        <p><b>Time: </b>{{ betterTimestring }}</p>
        <p><b>Scan ID: </b>{{ metadata.custom.scan_id }}</p>

        <div v-for="(value, key) in metadata.custom" :key="key" >
          <p><b>{{ key }}: </b>{{ value }}</p>
        </div>
      </div>

    </div>

	</div>
</template>

<script>
import UIkit from 'uikit';
import axios from 'axios'

// Export main app
export default {
  name: 'captureCard',

  props: {
    metadata: {
      type: Object,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    }
  },

  methods: {
    makeModalName: function(prefix) {
      return prefix + this.metadata.id
    }

  },

  computed: {
    tagModalID: function () {
      return this.makeModalName("tag-modal-")
    },
    tagModalTarget: function () {
      return "#" + this.tagModalID
    },
    metadataModalID: function () {
      return this.makeModalName("metadata-modal-")
    },
    metadataModalTarget: function () {
      return "#" + this.metadataModalID
    },
    betterTimestring: function () {
      var dtSplit = this.metadata.custom.time.split("_");
      var date = dtSplit[0]
      var time = dtSplit[1].replace(/-/g, ":")
      return date + " " + time
    }
  }

}
</script>
