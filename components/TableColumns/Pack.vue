<script setup lang='ts'>
import { computed, ref } from 'vue'

const props = defineProps({
  additionalData: {
    type: String,
  },
  text: {
    type: String,
  },
})

</script>

<template>
  <div class='relative w-max'> 
    <img v-if='additionalData' class='max-h-16' :src='additionalData' />
    <div v-if='text' class='absolute top-0 text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_1)] text-xs'> {{text}} </div>
  </div>
</template>

