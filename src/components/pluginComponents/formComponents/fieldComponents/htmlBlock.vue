<template>
  <div>
    <p v-html="content"></p>
  </div>
</template>

<script>
export default {
  name: 'htmlBlock',

  props: [ 
    'label', 
    'name',
    'content'
  ]
}
</script>

<style scoped></style>