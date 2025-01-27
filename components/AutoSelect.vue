<script setup>
import { computed, ref } from 'vue'
import  _ from 'lodash'
import { dataService } from '~/utils/services/data.service'
import { useDebounceFn } from "@vueuse/core"
import { useComponentStore } from '@/stores/component'
import { useUserStore } from '@/stores/user'
import outside from "@venegrad/vue3-click-outside"

const componentStore = useComponentStore()
const props = defineProps({
  library: {
    type: String,
    default: 'movie'
  },
  placeholder: {
    type: String,
    default: 'Начните вводить...'
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
  searchF: String,
})

const emit = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const mainStore = useMainStore()

let computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

let handleDebounce
onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
  componentStore.setAutofillData([])
  handleDebounce = _.debounce(async function (val) {
      if (val && val.length > 1 && !chooseDelay.value) {
        componentStore.setAutofillLoading(true)
        let autofill = await dataService[props.searchF]({key: val, type: props.library})
        componentStore.setAutofillData(autofill.success ? autofill.data : [])
        componentStore.setAutofillLoading(false)
      } else {
        componentStore.setAutofillData([])
      }
  }, 500);
  
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})

onUpdated(() => {
  if (!isInit.value ) {
    inputValue.value = props.modelValue.name ? props.modelValue.name : (props.modelValue.title ? props.modelValue.title: props.modelValue.word)
    if (inputValue.value) {
      isSelectedFromBeggining.value = true
    }
    isInit.value = true
  }
})

let id = 'autoselect' + _.uniqueId()
let inputValue = ref(props.modelValue.name ? props.modelValue.name : (props.modelValue.title ? props.modelValue.title : props.modelValue.word))
let chooseDelay = ref(false)
let isFocused = ref(false)
let isInit = ref(false)
let isSelectedFromBeggining = ref(false)

watch(inputValue, async val => {
    handleDebounce(val)
})

watch(() => props.modelValue, async val => {
   if (!val) {
    inputValue.value = ''
    componentStore.setAutofillData([])
   } else {
    
   }
}, { deep: true })

function hide() {
    if (!props.modelValue.id) {
      inputValue.value = ''
    }
    if (props.modelValue.title) {
      inputValue.value = props.modelValue.title 
    }
    if (props.modelValue.word) {
      inputValue.value = props.modelValue.word 
    }
    if (props.modelValue.name) {
      inputValue.value = props.modelValue.name 
    }
    componentStore.setAutofillData([])
}


function choose(data) {
  chooseDelay.value = true
  componentStore.setAutofillData([])
  inputValue.value = data.name ? data.name : (data.title ? data.title : data.word) 
  emit('update:modelValue', data)
  setTimeout(() => chooseDelay.value = false, 600)
}

function onBLur(data) {
  setTimeout(() => isFocused.value = false, 500)
}

let mode = ref('bottom')
function handleScroll() {
  let element = document.querySelector('#'+id)
  if (element) {
    const position = element.getBoundingClientRect().bottom
    let viewportBottom =  window.document.documentElement.clientHeight
    if ((position + 200) > viewportBottom) {
      mode.value = 'top'
    } else {
      mode.value = 'bottom'
    }
  }
}

function onDelete(data) {
  let conf = confirm('Уверены?')
  if (conf) {
    setTimeout(() => {
      dataService.libraryDelete({type: data.type, word: data.word })

      choose('')
    }, 100)
  }
}
function onAdd(data) {
  let conf = confirm('Уверены?')
  if (conf) {
    setTimeout(() => {
      dataService.libraryAdd({type: props.library, word: inputValue.value })

      choose('')
    }, 100)
  }
}
const isModal = ref(false)
const payload = ref({})

async function openModal() {
  isModal.value = true
  let data = await dataService.libraryGetById({id: props.modelValue.id})
  if (data.success) {
    payload.value = data.data
  }
}
async function save() {
  isModal.value = true
  let data = await dataService.libraryAdd(payload.value)
  if (data.success) {
    isModal.value = false
    emit('update:modelValue', payload.value)
  }
}
</script>

<template>
<div class='relative'>
  <label v-if='label' :for="id" class="form-label">{{label}}</label>
  <div v-if='mode=="top" && isFocused' class='shadow-md rounded-md absolute z-30 bg-white bottom-0 mb-14 autofill-content' v-outside="hide" >
    <div class='p-2 hover:bg-gray-100 border-b first:rounded-t-md autofill-odd cursor-pointer' :key='suggest.id' v-for='suggest in componentStore.autofillData' @click='()=>choose(suggest)'> 
      <span v-if='suggest.name'>{{suggest.name}}</span> 
      <template v-else-if='suggest.word'>
        <div>{{suggest.word}} <span class='text-red-500' v-if='userStore.user.role=="ADMIN" && library == "common" && false' @click='()=>onDelete(suggest)'> Удалить </span> <span v-if='suggest.additionalData'>({{suggest.additionalData}})</span></div>
        <div class='text-xs text-gray-400' v-if='suggest.translation'>{{suggest.translation}}</div>
      </template> 
      <template v-else><div>{{suggest.title}} ({{suggest.year}})</div><div class='text-xs text-gray-400'>{{suggest.origin}}</div></template> 
      
    </div>
    <div v-if='userStore.user.role=="ADMIN" && !componentStore.autofillData.length && inputValue && inputValue.length > 2' class='p-2 text-green-500 cursor-pointer'><span @click='()=>onAdd(suggest)'> Добавить</span></div>
  </div>
  <FormControl v-model="inputValue" @focus='isFocused=true' @blur='onBLur' :placeholder="placeholder" :id="id"/>
  
  <div v-if='mode=="bottom"  && isFocused' class='shadow-md rounded-md absolute z-30 bg-white autofill-content' v-outside="hide" >
    <div class='p-2 hover:bg-gray-100  border-b cursor-pointer first:rounded-t-md autofill-odd cursor-pointer' v-for='suggest in componentStore.autofillData' @click='()=>choose(suggest)'> 
    
      <span v-if='suggest.name'>{{suggest.name}}</span> 
      <template v-else-if='suggest.word'>
        <div>{{suggest.word}}  <span class='text-red-500' v-if='userStore.user.role=="ADMIN" && library == "common" && false' @click='()=>onDelete(suggest)'> Удалить </span> <span v-if='suggest.additionalData'>({{suggest.additionalData}})</span></div>
        <div class='text-xs text-gray-400' v-if='suggest.translation'>{{suggest.translation}} </div>
      </template> 
      <template v-else><div>{{suggest.title}} ({{suggest.year}})</div><div class='text-xs text-gray-400'>{{suggest.origin}}</div></template> 
      
    </div>
    <div v-if='userStore.user.role=="ADMIN" && !componentStore.autofillData.length && inputValue && inputValue.length > 2 && !isSelectedFromBeggining' class='p-2 bg-gray-100 text-green-500 cursor-pointer'>
      <span  @click='()=>onAdd(suggest)'> Добавить</span>
    </div>
  </div>
  <div @click='openModal' v-if='userStore.user.role=="ADMIN" && modelValue.id' class='cursor-pointer text-xs text-gray-500'>
    Изменить данные в базе
  </div>
  <CardBoxModal v-model="isModal" classProp='max-w-96'>
    <FormControl v-model='payload.word' placeholder="Введите текст" />
    <FormControl v-model='payload.translation' placeholder="Введите перевод" />
    <FormControl v-model='payload.keywords' placeholder="Введите ключевые слова" />
    <BaseButton
      @click='save'
      label="Save"
      color="contrast"
      small
    />
  </CardBoxModal>
</div>
</template>
<style scoped>
.autofill-content {
  max-height: 325px;
  overflow: auto;
}
</style>