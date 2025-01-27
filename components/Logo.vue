<script setup>
defineProps({
  class: {
    type: String,
    default: 'w-14'
  },
})
</script>
<template>
  <img :class='class' src='/img/logo.png'/>
</template>
