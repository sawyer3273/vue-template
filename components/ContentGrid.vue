<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useDataStore } from '@/stores/data'
import { mdiEye, mdiTrashCan } from '@mdi/js'
const dayjs = inject('dayjs')
const { locale } = useI18n()

const router = useRouter()

interface Props {
  size?: Number
  storeModel?: String
  openLink?: String
  openFunc?: String
  noContent?: String
  count?: String
  subText?: String
  nodate: {
    type: Boolean,
    default: false
  }
}

const props = withDefaults(defineProps<Props>(), {
  size: 50,
  storeModel: '',
  noContent: '',
})

const emit = defineEmits(['load-data', 'delete-data', 'onChoosePack'])


onMounted(async () => {
  openPage(1)
})



const dataStore = useDataStore()

const items = computed(() => dataStore[props.storeModel] ? dataStore[props.storeModel] : [])
const total = computed(() => dataStore[props.storeModel] ? dataStore[props.storeModel+'_count'] : 0)
const numPages = computed(() => Math.ceil(total.value / perPage.value))
const perPage = ref(props.size)
const currentPage = ref(1)


function openPage(page) {
  currentPage.value = page
  emit('load-data', {
    size: perPage.value,
    page: page
  })
}

function showItem(id) {
  if (props.openLink) {
    router.push(props.openLink.replace('{id}', id));
  } else {
    let item = items.value.find(one => one.id == id)
    emit('onChoosePack', item)
  }
}
</script>

<template>
  <div class='row'>
    <template v-for="pack in items" :key="pack.id"  > 
      <ContentGridItem :nodate='nodate' :count='count' :subText='subText' :pack='pack' @showItem='showItem'/>
    </template>
    <div v-if='!items.length && noContent'>
      <NoContent :text='noContent' />
    </div>
  </div>
</template>
