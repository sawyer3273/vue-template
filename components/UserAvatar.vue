<script setup>
import { computed } from 'vue'

const props = defineProps({
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  api: {
    type: String,
    default: 'avataaars'
  },
  border: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  }
})

const avatar2 = computed(
  () =>
    props.avatar ? props.avatar :
    `https://api.dicebear.com/7.x/${props.api}/svg?seed=${props.username.replace(
      /[^a-z0-9]+/gi,
      '-'
    )}.svg`
)

const username = computed(() => props.username)
const borderClass = computed(() => {
  if (props.border == 'yellow-500') {
    return 'border-2 border-yellow-500'
  }
  if (props.border == 'green-500') {
    return 'border-2 border-green-500'
  }
  return ''
})
</script>

<template>
  <div v-if='username' :class='class'>
    <img
      :src="avatar2"
      :alt="username"
      class="rounded-full block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800"
      :class='borderClass'
    />
    <slot />
  </div>
</template>
