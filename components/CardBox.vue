<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  rounded: {
    type: String,
    default: 'rounded-2xl'
  },
  flex: {
    type: String,
    default: 'flex-col'
  },
  class: {
    type: String,
    default: ''
  },
  isNoClass: {
    type: Boolean,
    default: false
  },
  hasComponentLayout: Boolean,
  hasTable: Boolean,
  smallPadding: Boolean,
  isForm: Boolean,
  isHoverable: Boolean,
  isModal: Boolean
})

const emit = defineEmits(['submit'])

const slots = useSlots()

const hasFooterSlot = computed(() => slots.footer && !!slots.footer())

const componentClass = computed(() => {
  const base = [
    props.rounded,
    props.flex,
    props.class,
    props.isModal ? 'dark:bg-slate-900' : 'dark:bg-slate-900/70',
    props.isNoClass ? '' : 'bg-white flex shadow'
  ]

  if (props.isHoverable) {
    base.push('hover:shadow-lg transition-shadow duration-500')
  }

  return base
})

const submit = (event) => {
  emit('submit', event)
}
</script>

<template>
  <component
    :is="isForm ? 'form' : 'div'"
    :class="componentClass"
    @submit="submit"
  >
    <slot v-if="hasComponentLayout" />
    <template v-else>
      <CardBoxComponentBody :no-padding="hasTable" :smallPadding="smallPadding">
        <slot />
      </CardBoxComponentBody>
      <CardBoxComponentFooter v-if="hasFooterSlot"  :smallPadding="smallPadding">
        <slot name="footer" />
      </CardBoxComponentFooter>
    </template>
  </component>
</template>
