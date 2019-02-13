<template>
	<div class="captureCard uk-card uk-card-default uk-card-hover uk-padding-remove uk-width-medium uk-margin-right">

    <div class="uk-card-media-top">
        
          <a class="lightbox-link" v-bind:href="ImgURL" v-bind:data-caption="metadata.filename">
            <img class="uk-width-1-1" v-bind:src="ThumbURL" v-bind:alt="metadata.id" uk-img>
          </a>

    </div>

    <div class="uk-card-body uk-padding-small">
      <p> {{ metadata.filename }} </p>
      <p class="uk-text-meta uk-margin-remove-top"><time>{{ metadata.time }}</time></p>
      
    </div>

    <div class="uk-card-footer uk-padding-small">
      <span v-for="tag in tags" :key="tag" v-on:click="delTagConfirm(tag)" class="uk-label uk-margin-small-right deletable-label"> {{ tag }} </span>

      <a v-bind:href="TagModalTarget" uk-toggle>
        <span class="uk-label uk-label-success uk-margin-small-right">Add</span>
      </a>

    </div>

    <div v-bind:id="TagModalID" uk-modal>

      <form class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical" @submit.prevent="handleTagSubmit">

          <div class="uk-inline">
            <span class="uk-form-icon" uk-icon="icon: tag"></span>
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
      console.log(this.TagURL);
      console.log(this.newtag);
      this.newTagRequest(this.newtag);
      this.newtag = "";
      UIkit.modal(event.target.parentNode).hide();
    },

    newTagRequest: function(tag_string) {
      // Send tag PUT request
      axios.put(this.TagURL, [tag_string])
      .then(response => { 
        // Update tag array
        this.getTagRequest()
      })
      .catch(error => {
        this.$store.dispatch('handleHTTPError', error);  // Let store handle error
      })
    },

    delTagConfirm: function(tag_string) {
      var self = this;
      UIkit.modal.confirm(`Remove tag '${tag_string}'?`).then(function() {
        self.delTagRequest(tag_string)
      }, function () {
        console.log('Rejected.')
      });
    },

    delTagRequest: function(tag_string) {
      console.log(tag_string)
      // Send tag DELETE request
      axios.delete(this.TagURL, {data: [tag_string]})
      .then(response => { 
        // Update tag array
        this.getTagRequest()
      })
      .catch(error => {
        this.$store.dispatch('handleHTTPError', error);  // Let store handle error
      })
    },

    getTagRequest: function() {
      // Send tag request
      axios.get(this.TagURL)
      .then(response => { 
        this.tags = response.data.metadata.tags
      })
      .catch(error => {
        this.$store.dispatch('handleHTTPError', error);  // Let store handle error
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
    TagModalID: function () {
      return this.makeModalName("tag-modal-")
    },
    TagModalTarget: function () {
      return "#" + this.TagModalID
    },
    ThumbURL: function () {
      return this.$store.getters.uri + "/camera/capture/" + this.metadata.id + "/download?thumbnail=true"
    },
    ImgURL: function () {
      return this.$store.getters.uri + "/camera/capture/" + this.metadata.id + "/download/" + this.metadata.filename
    },
    TagURL: function () {
      return this.$store.getters.uri + "/camera/capture/" + this.metadata.id + "/tags"
    }
  }

}
</script>

<style scoped lang="less">
.deletable-label {
  cursor: pointer;
}

.deletable-label:hover {
  background-color: #f0506e;
}
</style>