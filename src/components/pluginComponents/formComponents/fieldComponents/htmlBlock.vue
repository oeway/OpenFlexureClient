<template>
  <div>
    <p v-html="content"></p>
  </div>
</template>

<script>
export default {
  name: 'textInput',

  props: [ 
    'label', 
    'name',
    'content'
  ]
}
</script>

<style scoped></style>