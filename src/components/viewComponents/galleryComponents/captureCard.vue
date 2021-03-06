<template>
	<div class="captureCard uk-card uk-card-default uk-card-hover uk-padding-remove uk-width-medium" v-bind:class="{ 'uk-card-secondary': $store.state.globalSettings.darkMode }">

    <div class="uk-card-media-top">
        
          <a class="lightbox-link" v-bind:href="imgURL" v-bind:data-caption="metadata.filename">
            <img class="uk-width-1-1" v-bind:data-src="thumbURL" v-bind:alt="metadata.id" width="300" height="225" uk-img>
          </a>

    </div>

    <div class="uk-card-body uk-padding-small">
      <div class="uk-width-1-1 uk-margin-small uk-margin-remove-left uk-margin-remove-right" uk-grid>
        <div class="uk-margin-remove-top uk-padding-remove uk-width-expand">{{ metadata.filename }}</div>
        <div class="uk-margin-remove-top uk-padding-remove uk-width-auto">
          <a href="#" v-on:click="delCaptureConfirm()" class="uk-icon">
            <i class="material-icons">delete</i>
          </a>
        </div>
      </div>


      <div class="uk-text-meta uk-margin-remove-top uk-padding-remove uk-width-expand"><time>{{ betterTimestring }}</time></div>
      <div class="uk-text-meta uk-margin-remove-top uk-padding-remove uk-width-auto">
        <a v-bind:href="metadataModalTarget" uk-toggle>More...</a>
      </div>


    </div>

    <div class="uk-card-footer uk-padding-small">
      <span v-if="temporary" class="uk-label uk-label-danger uk-margin-small-right" uk-tooltip="title: Capture will be removed automatically; delay: 500">Temporary</span>

      <span v-for="tag in tags" :key="tag" v-on:click="delTagConfirm(tag)" class="uk-label uk-margin-small-right deletable-label"> {{ tag }} </span>

      <a v-bind:href="tagModalTarget" uk-toggle>
        <span class="uk-label uk-label-success uk-margin-small-right">Add</span>
      </a>

    </div>

    <div v-bind:id="metadataModalID" uk-modal>

      <div class="uk-modal-dialog uk-modal-body" v-bind:class="{ 'uk-light uk-background-secondary': $store.state.globalSettings.darkMode }" >
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <h2 class="uk-modal-title">{{ metadata.filename }}</h2>
          <p><b>Path: </b>{{ path }}</p>
          <p><b>Time: </b>{{ betterTimestring }}</p>
          <p><b>ID: </b>{{ metadata.id }}</p>
          <p><b>Format: </b>{{ metadata.format }}</p>

          <div v-for="(value, key) in metadata.custom" :key="key" >
            <p><b>{{ key }}: </b>{{ value }}</p>
          </div>
      </div>

    </div>

    <div v-bind:id="tagModalID" uk-modal>

      <form class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical" v-bind:class="{ 'uk-light uk-background-secondary': $store.state.globalSettings.darkMode }" @submit.prevent="handleTagSubmit">

          <div class="uk-inline">
            <span class="uk-form-icon"><i class="material-icons">label</i></span>
            <input v-model="newtag" class="uk-input uk-form-width-medium uk-form-small" type="text" name="tagname" placeholder="tag">

            <button class="uk-button uk-button-default uk-margin-left uk-form-small uk-modal-close" type="button">Cancel</button>
            <button type="submit" class="uk-button uk-button-primary uk-margin-left uk-form-small">Save</button>
          </div>

      </form>

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
    temporary: {
      type: Boolean,
      required: true
    },
    metadata: {
      type: Object,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },

  data: function () {
    return {
      tags: [],
      newtag: "",
    }  
  },

  methods: {
    handleTagSubmit: function(event) {
      console.log(this.tagURL);
      console.log(this.newtag);
      this.newTagRequest(this.newtag);
      this.newtag = "";
      UIkit.modal(event.target.parentNode).hide();  // TODO: Remove somehow
    },

    delCaptureConfirm: function(tag_string) {
      var context = this
      this.modalConfirm('Permanantly delete capture?')
      .then(function() {
        context.delCaptureRequest()
      });
    },

    delCaptureRequest: function() {
      // Send tag DELETE request
      axios.delete(this.captureURL)
      .then(response => { 
        // Emit signal to update capture list
        this.$root.$emit('globalUpdateCaptureList')
      })
      .catch(error => {
        this.modalError(error) // Let mixin handle error
      })
    },

    newTagRequest: function(tag_string) {
      // Send tag PUT request
      axios.put(this.tagURL, [tag_string])
      .then(response => { 
        // Update tag array
        this.getTagRequest()
      })
      .catch(error => {
        this.modalError(error) // Let mixin handle error
      })
    },

    delTagConfirm: function(tag_string) {
      var context = this;
      this.modalConfirm(`Remove tag '${tag_string}'?`).then(function() {
        context.delTagRequest(tag_string)
      });
    },

    delTagRequest: function(tag_string) {
      console.log(tag_string)
      // Send tag DELETE request
      axios.delete(this.tagURL, {data: [tag_string]})
      .then(response => { 
        // Update tag array
        this.getTagRequest()
      })
      .catch(error => {
        this.modalError(error) // Let mixin handle error
      })
    },

    getTagRequest: function() {
      // Send tag request
      axios.get(this.tagURL)
      .then(response => { 
        this.tags = response.data.metadata.tags
      })
      .catch(error => {
        this.modalError(error) // Let mixin handle error
      })
    },

    makeModalName: function(prefix) {
      return prefix + this.metadata.id
    }

  },

  created: function () {
    this.getTagRequest()
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
    thumbURL: function () {
      return this.captureURL + "/download?thumbnail=true"
    },
    imgURL: function () {
      return this.captureURL + "/download/" + this.metadata.filename
    },
    tagURL: function () {
      return this.captureURL + "/tags"
    },
    captureURL: function () {
      return this.$store.getters.uri + "/camera/capture/" + this.metadata.id
    },
    betterTimestring: function () {
      var dtSplit = this.metadata.time.split("_");
      var date = dtSplit[0]
      var time = dtSplit[1].replace(/-/g, ":")
      return date + " " + time
    }
  }

}
</script>
