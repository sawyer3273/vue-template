<script setup>
import { computed } from 'vue'
import { adminService } from '~/utils/services/admin.service'

const props = defineProps({
  modelValue: {
    type: [String],
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  classImages: {
    type: String,
    default: 'col-md-2'
  },
  folder: {
    type: String,
    default: 'main'
  },
  ratio: {
    type: Number,
    default: 0
  },
  libraryId: {
    type: String,
    default: ''
  },
  imagesToSelect: {
    type: [String],
    default: ''
  },
})

const emit = defineEmits(['update:modelValue'])

const imageCrop = ref(props.modelValue)
const images = ref(props.imagesToSelect ? props.imagesToSelect : [])

function onUpload(file) {
  emit('update:modelValue', file)
  adminService.addImage({image: file, type: props.folder, id: props.libraryId})
  console.log('images',images.value)
  images.value.push({link: file})
}
function selectImage(file) {
  emit('update:modelValue', file)
  imageCrop.value = file
}
function deleteImage(file) {
  let res = []
  adminService.deleteImage({image: file.link, id: props.libraryId, folder: props.folder})
  images.value.map(one => {
    if (one.link !== file.link) {
      res.push(one)
    }
  })
  images.value = res
}
</script>

<template>
  <div :class='class'>
    <div class='row mb-4'>
      <div :class='classImages' class='relative' v-for='image in images'> 
        <DeleteAction  v-if='image.link != imageCrop' @deleteFuncion='deleteImage(image)'/>
        <div @click='selectImage(image.link)' :class='image.link == imageCrop ? "border-green-600" :"border-white"' class='cursor-pointer rounded-lg border-4'><img class='rounded-sm' :src='image.link' /></div>
      </div>
    </div>
    <CropperCust :placeholder='"horizon"' :folder='folder' :classProp='"inline-grid"' :ratio='ratio' v-model='imageCrop' @onUpload='onUpload' :showImage='false' :noDelete='true' :buttonTitle='"Добавить фото"'/> 
  </div>
</template>
