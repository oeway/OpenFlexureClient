<template>
	<div class="galleryDisplay uk-padding-remove">

    <nav class="uk-navbar-container" uk-navbar="mode: click">
        <div class="uk-navbar-left uk-padding uk-padding-remove-top uk-padding-remove-bottom">

            <ul class="uk-navbar-nav">
                <li>
                  <a href="#">Filter</a>
                  <div class="uk-navbar-dropdown">
                    <ul class="uk-nav uk-navbar-dropdown-nav">
                      <form class="uk-form-stacked">
                        <div v-for="tag in allTags" :key="tag" class="uk-margin-small">
                          <label><input class="uk-checkbox" type="checkbox" v-bind:id="tag" v-bind:value="tag" v-model="checkedTags" checked> {{ tag }}</label>
                        </div>
                      </form>
                    </ul>
                  </div>
                </li>
            </ul>

        </div>
    </nav>

    <div class="uk-padding uk-padding-remove-top" uk-lightbox="toggle: .lightbox-link">
      <div class="uk-grid-medium uk-padding uk-padding-remove-right uk-grid-match" uk-grid>
      
        <captureCard 
          v-for="capture in filteredCaptures" 
          :key="capture.metadata.id"
          :metadata="capture.metadata"
          :temporary="capture.temporary"
        />
    
      </div>

    </div>

	</div>
</template>

<script>
import axios from 'axios'
import captureCard from './galleryComponents/captureCard.vue'

// Export main app
export default {
  name: 'galleryDisplay',

  components: {
    captureCard
  },

  data: function () {
    return {
      captureList: [],
      checkedTags: []
    }  
  },

  mounted() {
    // A global signal listener to perform a gallery refresh
    this.$root.$on('globalUpdateCaptureList', () => {
      this.updateCaptureList()
    })
  },

  methods: {
    updateCaptureList: function() {
      console.log("Updating capture list...")
      // Send move request
      axios.get(this.captureApiUri)
      .then(response => { 
        this.$store.dispatch('updateState');  // Update store state for good measure
        this.captureList = response.data;  // Update boxes from response
      })
      .catch(error => {
        this.$store.dispatch('handleHTTPError', error);  // Let store handle error
      })
    }
  },

  created: function () {
    this.updateCaptureList()
  },

  computed: {
    captureApiUri: function () {
      return this.$store.getters.uri + "/camera/capture"
    },

    allTags: function () {
      // Return an array of unique tags across all captures
      var tags = [];
      for (var i in this.captureList) {
        var capture = this.captureList[i]
        for (var j in capture.metadata.tags) {
          var tag = capture.metadata.tags[j]
          if (!tags.includes(tag)) {
            tags.push(tag)
          };
        };
      };
      return tags
    },

    filteredCaptures: function () {
      var captures = [];
      for (var i in this.captureList) {
        // Quickly access capture object
        var capture = this.captureList[i];
        // Assume exclusion
        var includeCapture = false;

        // Filter by selected tags
        var tags = capture.metadata.tags;
        let checker = (arr, target) => target.every(v => arr.includes(v));
        // True if all tags match
        includeCapture = checker(tags, this.checkedTags)

        // Add to capture list if matched
        if (includeCapture == true) {
          captures.push(capture)
        }

      };

    return captures
      
    }
  }

}
</script>

<style scoped lang="less">

</style>
