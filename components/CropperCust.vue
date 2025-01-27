<script setup>
import { computed, ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
import {
  mdiUploadCircle, mdiContentSave
} from '@mdi/js'
import { adminService } from '~/utils/services/admin.service'
import imageCompression from 'browser-image-compression';

const mainStore = useMainStore()
const componentStore = useComponentStore()
const props = defineProps({
  modelValue: {
    type: [String],
    default: ''
  },
  showImage: {
    type: Boolean,
    default: true
  },
  buttonTitle:  {
    type: String,
    default: 'Выбрать фото'
  },
  width: {
    type: String,
    default: '166'
  },
  showbtn: {
    type: [Boolean, Number],
    default: true
  },
  ratio: {
    type: Number,
    default: 10/12
  },
  folder: {
    type: String,
    default: 'main'
  },
  placeholder: {
    type: String,
    default: 'main'
  },
  classProp: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  noDelete: {
    type: Boolean,
    default: false
  }
})
useHead({
  script: [{ src: "https://unpkg.com/vue-advanced-cropper@^2.0.0/dist/index.umd.js" }],
});

const emit = defineEmits(['update:modelValue', 'onUpload'])
const componentKey = ref(0);
onMounted(async () => {
  componentKey.value = Math.ceil(Math.random()*1000000);
})

let isModalActive = ref(false)
watch(isModalActive, async val => {
  if (!val) {
    imageData.value =  { name: "", type: "image/png", src: "" }
  } else {
    chooseFiles()
  }
}) 

let img = ref('/img/logo.png')
let imageData = ref( { name: "", type: "image/png", src: "" } )
let errorText = ref('')
const cropperRef = ref(null)

function chooseFiles() {
  document.getElementById(componentKey.value+"inputImage").click()
}

function fileChanged() {
  let file = document.getElementById(componentKey.value+"inputImage").files[0]
  if (file) {
    let formats = ["image/png", "image/jpg", "image/jpeg"]
    let size = file.size / 10 ** 6
    let isFormat = formats.includes(file.type)
    if (FileReader && isFormat && size <= 5) {
      imageData.value.name = file.name
      imageData.value.type = file.type
      let reader = new FileReader()
      reader.onload = () => {
        imageData.value.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }
}

async function cropSave() {
  const { canvas } = cropperRef.value.getResult()
  
  const form = new FormData()
  if (canvas) {
    await new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        blob = await handleImageUpload(blob)
        form.append("file", blob, imageData.value.name)
        form.append("type", props.folder)
        if (!props.noDelete) {
          form.append("toDelete", props.modelValue)
        }
        resolve()
      }, imageData.value.type)
    })
  }
  mainStore.setLoader(true)
  let image = await adminService.uploadFile(form)
  mainStore.setLoader(false)
  if (image.success) {
    emit('update:modelValue', image.data.file)
    emit('onUpload', image.data.file)
  } else {
    errorText.value = 'Failed to upload'
  }
  
  isModalActive.value = false
}

async function handleImageUpload(imageFile) {
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 840,
    useWebWorker: true,
  }
  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    return compressedFile
  } catch (error) {
    console.log(error);
  }

}
</script>

<template>
<div :key='componentKey' :class='classProp'>
  <img v-if='showImage' class='mb-1' :class='ratio == 1 ? "square": ""' :src="modelValue ? (modelValue !== '%%%' ? modelValue : '') : (placeholder == 'main' ? '/img/card_placeholder.png' : '/img/card_placeholder_horizon.jpg')" :width='width'  />
  <BaseButton
    :disabled='!showbtn'
    @click='isModalActive = true'
    :icon="mdiUploadCircle"
    :label="buttonTitle"
    color="contrast"
    rounded-full
    small
  />
  <div class='text-red-500 text-xs' v-if='error'>{{error}}</div>
  </div>
  <CardBoxModal v-model="isModalActive" classProp='max-w-96'>
    <Cropper
     v-if='isModalActive'
      ref="cropperRef"
      class="cropper"
      :src="imageData.src"
      :defaultBoundaries='"fit"'
      :stencil-props="{
        aspectRatio: ratio
      }"
    ></Cropper>
      <input
        @change="fileChanged()"
        :id="componentKey+'inputImage'"
        type="file"
        accept=".png, .jpg, .jpeg"
        hidden
      />
        <div class="mb-2 flex justify-center">
          <BaseButton
            @click='cropSave()'
            :icon="mdiContentSave"
            label="Сохранить"
            color="contrast"
            rounded-full
            small
          />  
        </div>
    <div class='text-red' v-if='errorText'>{{errorText}}</div>
  </CardBoxModal>
</template>
<style>
.cropper {
  width: 100%;
}
.square {
  height: 166px;
  object-fit: cover;
}
</style>