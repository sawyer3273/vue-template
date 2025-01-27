<script setup>
import { mdiClose } from '@mdi/js';
import { computed, onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  classProp: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'sm'
  },
  isFooter: {
    type: Boolean,
    default: false
  },
  smallPadding: Boolean,
  button: {
    type: String,
    default: 'info'
  },
  buttonLabel: {
    type: String,
    default: 'Done'
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const confirmCancel = (mode) => {
  value.value = false
  emit(mode)
}

const confirm = () => confirmCancel('confirm')

const cancel = () => confirmCancel('cancel')

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && value.value) {
      cancel()
    }
  })
})

const getSizeClasses = () => {
  if (props.size == 'sm') {
    return 'w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 '
  }
  if (props.size == 'xs') {
    return 'w-11/12 md:w-2/5 lg:w-1/5 xl:w-3/12 '
  }

  if (props.size == 'lg') {
    return 'w-11/12 md:w-4/5 lg:w-4/5 xl:w-6/12 '
  }
  if (props.size == 'xl') {
    return 'w-11/12 md:w-4/5 lg:w-4/5 xl:w-10/12 '
  }
}

</script>

<template>
  <OverlayLayer v-show="value" @overlay-click="cancel">
    <CardBox
      v-show="value"
      :class="getSizeClasses() + classProp"
      :smallPadding="smallPadding"
      class="shadow-lg max-h-modal z-50 overflow-auto" 
      is-modal
    >
      <CardBoxComponentTitle :title="title">
        <BaseButton
          v-if="hasCancel"
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="cancel"
        />
      </CardBoxComponentTitle>

      <div class="space-y-3">
        <slot />
      </div>

      <template #footer v-if='isFooter'>
        <BaseButtons>
          <BaseButton :label="buttonLabel" :color="button" @click="confirm" />
          <BaseButton v-if="hasCancel" label="Cancel" :color="button" outline @click="cancel" />
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>
