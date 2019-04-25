<template>
  <Page>
    <ActionBar title="OpenFlexure Native Demo"/>
    <TabView id="tabViewContainer" androidTabsPosition="bottom">
        <TabViewItem title="First Tab" iconSource="res://icon">
            <StackLayout>
                <Label text="First tab content" textWrap="true" class="m-15 h2 text-left" color="blue" />
            </StackLayout>
        </TabViewItem>
        <TabViewItem title="Second Tab" iconSource="res://icon">
            <StackLayout>
                <Label text="Second tab content" textWrap="true" class="m-15 h2 text-left" color="blue" />
            </StackLayout>
        </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
// Import axios for HTTP requests
import axios from 'axios'

// Export main app
export default {
  name: 'app',


  data: function () {
    return {}  
  },

  created: function () {
  },

  beforeDestroy: function () {
  },

  methods: {
  },

  computed: {
  }

}
</script>

<style>
</style>