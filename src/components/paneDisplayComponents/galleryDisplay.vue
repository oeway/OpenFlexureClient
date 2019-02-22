<template>
	<div class="galleryDisplay uk-padding uk-padding-remove-top">

    <nav class="uk-navbar-container navbar" uk-navbar="mode: click">
        <div class="uk-navbar-left uk-padding-remove-top uk-padding-remove-bottom">

            <ul class="uk-navbar-nav">
              <li v-bind:class="[sortDescending ? 'uk-active' : '']"><a v-on:click="sortDescending=true;" class="uk-icon-link" href="#" uk-icon="icon: arrow-down"></a></li>
              <li v-bind:class="[!sortDescending ? 'uk-active' : '']"><a v-on:click="sortDescending=false;" class="uk-icon-link" href="#" uk-icon="icon: arrow-up"></a></li>
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

    <div class="uk-padding-remove-top" uk-lightbox="toggle: .lightbox-link">
      <div class="uk-grid-medium uk-padding uk-padding-remove-right uk-grid-match" uk-grid>
      
        <captureCard 
          v-for="capture in sortedDateCaptures" 
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
      checkedTags: [],
      sortDescending: true
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
          var tag = capture.metadata.tags[j];
          if (!tags.includes(tag)) {
            tags.push(tag);
          };
        };
      };
      return tags.sort()
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
        includeCapture = checker(tags, this.checkedTags);

        // Add to capture list if matched
        if (includeCapture == true) {
          captures.push(capture);
        };

      };

    return captures
    },

    sortedDateCaptures: function () {
      function compare(a, b) {
        if (a.metadata.time < b.metadata.time)
          return -1;
        if (a.metadata.time > b.metadata.time)
          return 1;
        return 0;
      }

      if (this.sortDescending == true) {
        return this.filteredCaptures.sort(compare).reverse();
      }
      else {
        return this.filteredCaptures.sort(compare);
      }
    }

  }

}
</script>

<style scoped lang="less">
.navbar {
  background-color: #fff !important;
  border-bottom: 1px solid #e5e5e5;
}
</style>
