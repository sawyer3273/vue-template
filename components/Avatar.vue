<script setup>
import { computed } from 'vue'

const props = defineProps({
  avatar: {
    type: String,
    default: null
  },
  border: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: '16'
  }
})


const borderClass = computed(() => {
  switch (props.border) {
    case 'gold': return 'bg-gold';
    case 'silver': return 'bg-silver';
    case 'bronze': return 'bg-bronze';
  }
})
const componentClass = computed(() => {
  return [
    props.class,
    `w-${props.size}`,
    `h-${props.size}`
  ]
})
</script>

<template>
  <div :class='componentClass'>
    <img
      :src="avatar ? avatar : '/img/unknown.jpg'"
      :alt="username"
      class="rounded-full block h-full w-full max-w-full bg-gray-100 dark:bg-slate-800 object-cover "
      :class='borderClass'
    />
    <slot />
  </div>
</template>
<style> 
.bg-gold {
  box-shadow: 1px -4px 18px #FFE866, -5px 2px 12px #FFC814;
}
.bg-bronze {
  box-shadow: 1px -4px 18px #CD7F32, -5px 2px 12px #BE7023;
}
.bg-silver {
  box-shadow: 1px -4px 18px #c4c4c4, -5px 2px 12px #e8e8e8;
}
</style>