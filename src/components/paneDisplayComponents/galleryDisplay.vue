<template>
	<div class="galleryDisplay uk-padding uk-padding-remove-right">
    
    <div id="refresh-btn">
      <a href="#" v-on:click="updateCaptureList()" class="refresh-icon-align uk-icon-button uk-box-shadow-small uk-box-shadow-hover-medium action-btn-outline" uk-icon="refresh"></a>
    </div>

    <div uk-lightbox="toggle: .lightbox-link">
      <div class="uk-grid-medium uk-padding uk-padding-remove-right uk-grid-match" uk-grid>
      
        <captureCard 
          v-for="capture in captureList" 
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
      captureList: []
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
    orderedcaptureList: function () {
      return _.orderBy(this.captureList, 'metadata_path', 'desc')
    }
  }

}
</script>

<style scoped lang="less">
#refresh-btn {
  width: 0px;
  height: 30px;
  z-index: 999;
  margin-top: -57px;
  margin-left: 40px;
  position: absolute;
}

.refresh-icon-align {
  padding-bottom: 3px;
}

</style>
