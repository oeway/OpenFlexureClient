<template>
	<div class="galleryDisplay uk-padding uk-padding-remove-right">
    
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

  methods: {
    updateCaptureList: function() {
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
</style>
