<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  style: {
    type: String,
    default: ''
  },
})
onMounted(() => {
}) 
const isModalActive = ref(false)

</script>

<template>
  <CardBoxModal v-model="isModalActive"  button="danger" smallPadding>
    <img
      :src="src ? src : '/img/unknown.jpg'"
      class="w-full"
    />
  </CardBoxModal>
  <img
    @click='() => {isModalActive = true}'
    :style='style'
    :src="src ? src : '/img/unknown.jpg'"
    class='object-contain'
    :class="class"
  />
</template>
<style> 
</style>