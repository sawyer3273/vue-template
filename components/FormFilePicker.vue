<script setup>
import { mdiUpload } from '@mdi/js'
import { computed, ref, watch } from 'vue'
import axios from 'axios'
import { adminService } from '~/utils/services/admin.service'

const props = defineProps({
  modelValue: {
    type: [Object, File, Array],
    default: null
  },
  url: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: mdiUpload
  },
  accept: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'info'
  },
  type: {
    type: String,
    default: 'video'
  },
  inputId: {
    type: String
  },
  isMultiple: {
    default: false,
    type: Boolean
  },
  isRoundIcon: Boolean,
  autoUpload: {
    default: true,
    type: Boolean
  }
})

const emit = defineEmits(['update:modelValue', 'onUpload'])

const root = ref(null)

const file = ref(props.modelValue)

const loader = ref(false)

const showFilename = computed(() => !props.isRoundIcon && file.value)

const modelValueProp = computed(() => props.modelValue)

watch(modelValueProp, (value) => {
  file.value = value

  if (!value && root && root.value.input) {
    root.value.input.value = null
  }
})

const upload = async (event) => {
    const value = event.target.files || event.dataTransfer.files
    file.value = props.isMultiple ? value : value[0]
    emit('update:modelValue', file.value)
    if (props.autoUpload) {
      let formData = new FormData()
      formData.append('file', file.value)
      formData.append("type", props.type)
      if (props.url) {
        formData.append("toDelete", props.url)
      }
      const mediaStoreRoute = `/api/admin/upload`
      loader.value = true
      let fileData = await adminService.uploadFile(formData)
      loader.value = false
      
      if (fileData.success) {
        emit('onUpload', fileData.data)
      } else {
      }
    }
}


</script>

<template>
  <div class="flex items-stretch justify-start relative w-full md:w-auto">
    <label class="inline-flex w-full md:w-auto">
      <BaseButton
        as="a"
        :loader='loader'
        :class="{ 'w-12 h-12': isRoundIcon, 'rounded-r-none': showFilename, 'w-full md:w-auto': true}"
        :icon-size="isRoundIcon ? 24 : undefined"
        :label="isRoundIcon ? null : label"
        :icon="icon"
        :color="color"
        :rounded-full="isRoundIcon"
      />
      <input
        ref="root"
        type="file"
        :multiple='isMultiple'
        class="absolute top-0 left-0 w-full h-full opacity-0 outline-none cursor-pointer -z-1"
        :accept="accept"
        @input="upload"
        :id='inputId'
      />
    </label>
    <div
      v-if="showFilename && !isMultiple"
      class="px-4 py-2 bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border rounded-r"
    >
      <span  class="text-ellipsis line-clamp-1">
        {{ file.name }}
      </span>
    </div>
  </div>
</template>
