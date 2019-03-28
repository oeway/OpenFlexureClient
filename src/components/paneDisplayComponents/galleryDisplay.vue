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

    <div v-if="$store.getters.ready" class="uk-padding-remove-top" uk-lightbox="toggle: .lightbox-link">
      <div class="uk-grid-medium uk-padding uk-padding-remove-right uk-grid-match" uk-grid>
        
        <div v-for="item in sortedItems" :key="item.metadata.id" class="uk-remove-padding-remove-left" >
          <scanCard 
            v-if="'isScan' in item"
            :metadata="item.metadata"
            :thumbnail="item.thumbnail"
          />
          <captureCard 
            v-else
            :metadata="item.metadata"
            :temporary="item.temporary"
          />

        </div>
    
      </div>

    </div>

	</div>
</template>

<script>
import axios from 'axios'
import captureCard from './galleryComponents/captureCard.vue'
import scanCard from './galleryComponents/scanCard.vue'

// Export main app
export default {
  name: 'galleryDisplay',

  components: {
    captureCard,
    scanCard
  },

  data: function () {
    return {
      captureList: [],
      checkedTags: [],
      sortDescending: true,
      scanTag: 'scan'
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
    },

    filterCaptureList: function(list, filterTags) {
      var result = [];
      for (var capture of list) {
        // Assume exclusion
        var includeCapture = false;

        // Filter by selected tags
        var tags = capture.metadata.tags;
        let checker = (arr, target) => target.every(v => arr.includes(v));
        // True if all tags match
        includeCapture = checker(tags, filterTags);

        // Add to capture list if matched
        if (includeCapture == true) {
          result.push(capture);
        };

      };

      return result
    },

    sortCaptureList: function(list) {
      function compare(a, b) {
        if (a.metadata.time < b.metadata.time)
          return -1;
        if (a.metadata.time > b.metadata.time)
          return 1;
        return 0;
      }

      if (this.sortDescending == true) {
        return list.sort(compare).reverse();
      }
      else {
        return list.sort(compare);
      }
    }

  },

  computed: {
    captureApiUri: function () {
      return this.$store.getters.uri + "/camera/capture"
    },

    allTags: function () {
      // Return an array of unique tags across all captures
      var tags = [];
      for (var capture of this.captureList) {
        for (var tag of capture.metadata.tags) {
          if (!tags.includes(tag)) {
            tags.push(tag);
          };
        };
      };
      return tags.sort()
    },

    noScanCaptureList: function () {
      var captures = [];
      for (var capture of this.captureList) {
        // Assume exclusion
        var includeCapture = false;

        // Filter by selected tags
        var tags = capture.metadata.tags;

        // Add to capture list if matched
        if (!tags.includes(this.scanTag)) {
          captures.push(capture);
        };

      };

      return captures
    },

    allScans: function () {
      // Return an array of unique tags across all captures
      var scans = {};

      for (var capture of this.captureList) {
        var custom = capture.metadata.custom;
        var tags = capture.metadata.tags;

        if ('scan_id' in custom) {
          var id = custom['scan_id']
          
          // If this scan ID hasn't been seen before
          if (!(id in scans)) {
            scans[id] = {}
            scans[id].isScan = true
            scans[id].captureList = []
            scans[id].metadata = {
              filename: custom.basename,
              time: custom.time,
              id: custom.scan_id
            }
            scans[id].metadata.tags = []
            scans[id].metadata.custom = {}
          };

          // Add the capture object to the scan
          scans[id].captureList.push(capture)

          // Add missing scan metadata, prioritising first capture
          for (var key of Object.keys(custom)) {
            if (!(key in scans[id].metadata.custom)) {
              scans[id].metadata.custom[key] = custom[key]
            };
          };

          // Append missing tags
          for (var tag of tags) {
            if (!scans[id].metadata.tags.includes(tag)) {
              scans[id].metadata.tags.push(tag)
            };
          };

          // Create a preview thumbnail
          if (!('thumbnail' in scans[id])) {
            scans[id].thumbnail = this.$store.getters.uri + "/camera/capture/" + capture.metadata.id + "/download?thumbnail=true"
          }

        }

      };
      return scans
    },

    scanList: function () {
      return Object.values(this.allScans)
    },

    itemList: function () {
      return this.noScanCaptureList.concat(this.scanList)
    },

    filteredItems: function () {
      return this.filterCaptureList(this.itemList, this.checkedTags)
    },

    sortedItems: function () {
      return this.sortCaptureList(this.filteredItems)
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
