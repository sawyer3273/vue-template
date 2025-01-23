<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useDataStore } from '@/stores/data'
import { mdiEye, mdiTrashCan, mdiSortAscending, mdiSortDescending, mdiSort} from '@mdi/js'
const dayjs = inject('dayjs')
const { locale } = useI18n()

const router = useRouter()

interface Props {
  label?: String
  size?: Number
  storeModel?: String
  fields?: Array
  showTitle?: String
  showLink?: String,
  class: {
    type: String,
    default: ''
  },
  rowClass: {
    type: String,
    default: ''
  },
  headerTabulation: Boolean,
  pointer: Boolean,
  hideIfEmpty: Boolean
}

const props = withDefaults(defineProps<Props>(), {
  checkable: false,
  size: 50,
  storeModel: '',
  pointer: true,
  hideIfEmpty: false,
  fields: null
})

const emit = defineEmits(['load-data', 'delete-data', 'onClick', 'headerClick', 'onClickCeil'])


onMounted(async () => {
  openPage(1)
})

function onClick(data, i) {
  emit('onClick', data, i)
}

function onClickCeil(data, i) {
  emit('onClickCeil', data, i)
}

function headerClick(data, i) {
  emit('headerClick', data, i)
}

const dataStore = useDataStore()

const items = computed(() => dataStore[props.storeModel] ? dataStore[props.storeModel] : [])
const total = computed(() => dataStore[props.storeModel] ? dataStore[props.storeModel+'_count'] : 0)
const numPages = computed(() => (perPage.value && total.value) ? Math.ceil(total.value / perPage.value) : 0)
const perPage = ref(props.size ? props.size : 0)
const currentPage = ref(1)

const isModalActive = ref(false)
const isModalDangerActive = ref(false)
const checkedRows = ref([])


const pagesList = computed(() => {
  const pagesList = []
  if (numPages.value < 10) {
    for (let i = 1; i < numPages.value + 1; i++) {
      pagesList.push(i)
    }
  } else if (currentPage.value < 7) {
    for (let i = 1; i < 10; i++) {
      pagesList.push(i)
    }
  } else if (currentPage.value > numPages.value - 7) {
    for (let i = numPages.value - 10; i < numPages.value; i++) {
      pagesList.push(i)
    }
  } else {
    for (let i = currentPage.value - 4; i < currentPage.value + 5; i++) {
      pagesList.push(i)
    }
  }
  return pagesList
})

const remove = (arr, cb) => {
  const newArr = []
  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })

  return newArr
}

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client)
  } else {
    checkedRows.value = remove(checkedRows.value, (row) => row.id === client.id)
  }
}

function openPage(page) {
  currentPage.value = page
  emit('load-data', {
    size: perPage.value,
    page: page
  })
}

function showItem(item, column) {
  if (column.custom) {
    return column.custom(item)
  }
  let isSplitOne = column.column.includes('.')
  let isSplitTwo = isSplitOne ? column.column.split('.')[2]: false
  if (isSplitTwo) {
    let split = column.column.split('.')
    return item[split[0]] &&  item[split[0]][split[1]] ? item[split[0]][split[1]][split[2]] : ''
  }
  return isSplitOne ?  item[column.column.split('.')[0]][column.column.split('.')[1]] :  item[column.column] 
}

function showItemSecond(item, column) {
  let isSplitOne = column.additionalData.includes('.')
  let isSplitTwo = isSplitOne ? column.additionalData.split('.')[2]: false
  if (isSplitTwo) {
    let split = column.additionalData.split('.')
    return item[split[0]] &&  item[split[0]][split[1]] ? item[split[0]][split[1]][split[2]] : ''
  }
  return isSplitOne ?  item[column.additionalData.split('.')[0]][column.additionalData.split('.')[1]] :  item[column.additionalData] 
}


function getCeilData(item) {
  return 
}
</script>

<template>
  
  <div class="" :class='class' v-if='hideIfEmpty && items.length || !hideIfEmpty'>
  <SectionTitleLine v-if='label' :title="label" main></SectionTitleLine>
  <div class="overflow-auto" >
    <table class="responsive-table">
      <tbody>
        <tr class="li table-header text-white shadow-lg ">
          <th v-if='props.fields' class="col col-1" :class='column.style' v-for="column in props.fields">{{column.name}}</th>
          <th v-else class="col text-center flex items-center !justify-center cursor-pointer" @click='headerClick(column, j)' :class='column.style' v-for="(column, j) in items[0]">
            <div v-if='column.logo' class='relative ' >
              <img class='w-20 ' :src='column.logo'/>
              <div class='absolute w-20 max-w-full h-8 text-wrap overflow-hidden text-oveflow top-0 text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_1)] text-2xs'>
                {{column.name}}
              </div>
              <div v-if='column.createdAt' class='absolute w-20 h-3 text-lowercase max-w-full text-wrap overflow-hidden text-oveflow bottom-0 text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_1)] text-2xs'> 
                <div>{{ dayjs(column.createdAt).locale(locale).format('D.MM.YYYY') }}</div>
              </div>
            </div>
            <div v-else-if='column.name'>{{column.name}}</div>
            <div v-else>{{column}}</div>
          </th>
        </tr>
      <template v-for="(item, i) in items" :key="item.id" v-if='items.length' >
        <tr v-if='!fields && i || fields' class="li table-row" :class='[rowClass, pointer ? "cursor-pointer": "", !fields && item[0].isYou ? "text-green-600": "" ]' @click='onClick(item, i)'>
            <template v-if='!fields'>
              <td class="col flex items-center !justify-center"  v-if='i' v-for="(column, j) in item"  @click='onClickCeil(column, j)'> 
                <div v-if='column.username' class='flex flex-wrap justify-center text-center text-xs'> 
                  <UserAvatar :avatar='column.avatar' :username='column.username' class='w-8'/>
                  <div class='w-full'>{{column.username}}</div> 
                </div>
                <div v-else> {{column}} </div>
                    
              </td>
            </template>
            <td v-else class="col col-1 flex items-center" :class='column.style' v-for="column in props.fields"> 
              <template v-if='column.type == "img"'>
                <img class='max-h-16' :src='showItem(item, column)' />
              </template>
              <template v-else-if='column.type == "time"'>
                {{ dayjs(showItem(item, column)).locale(locale).format(column.format ? column.format : 'MMMM D, YYYY') }}
              </template>
              <template v-else-if='column.type == "component"'>
                <component :is='column.component' :text='showItem(item, column)' :additionalData='showItemSecond(item, column)' :class='column.componentClass'/>
              </template>
              <template v-else-if='column.type == "counter"'>
                {{(i + 1) * currentPage}}
              </template>
              <template v-else>
                {{ showItem(item, column) }}
              </template>
            </td>
          </tr>
        </template>
        <NoContent v-else :text='"Нет данных"' />
      </tbody>
    </table>
      </div>
  </div>
  <div v-if='numPages > 1' class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800" >
    <BaseLevel>
      <BaseButtons>
        <BaseButton 
          v-if='numPages > 10 && currentPage > 6'
          :active="1 === currentPage"
          :label="1"
          :color="1 === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="openPage(1)"
        />
        <div v-if='numPages && numPages > 10 && currentPage > 6' class='pb-2'>...</div>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="openPage(page)"
        />
        <div v-if='numPages > 10 && currentPage < (numPages - 6)' class='pb-2'>...</div>
        <BaseButton 
          v-if='numPages > 10 && currentPage < (numPages - 6)'
          :active="(numPages - 1) === currentPage"
          :label="numPages"
          :color="(numPages - 1) === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="openPage(numPages - 1)"
        />
      </BaseButtons>
    </BaseLevel>
  </div>
</template>


<style lang='scss' scoped>

body {
  font-family: 'lato', sans-serif;
}
.container {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 10px;
  padding-right: 10px;
}
td{
  padding: 0 0 0 10px;
  justify-content: start;
}
th {
  padding: 0 0 0 10px;
  justify-content: start;
}
.col-200 {
  width: 200px;
}
.col-50 {
  width: 50px;
}

.responsive-table {
  .li {
    border-radius: 3px;
    padding: 3px 3px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .table-header {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    background-image: linear-gradient(to right, #5e5e5e 0%, #000609 80%, #4e4e4e 100%)
  }
  .table-row {
    background-image: linear-gradient(to right, #fdfdfd 0%, #eef4f7  100%);
    box-shadow: 0px 0px 9px 0px rgba(0,0,0,0.1);
  }
  
}


</style>