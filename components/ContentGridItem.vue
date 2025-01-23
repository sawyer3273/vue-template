<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useDataStore } from '@/stores/data'
import { mdiAccountCircle } from '@mdi/js'
const dayjs = inject('dayjs')
const { locale } = useI18n()

const router = useRouter()


const props = defineProps({
  pack: {
    type: Object,
    default: {}
  },
  class: {
    type: String,
    default: 'col-md-3 mb-3'
  },
  count: {
    type: String,
    default: ''
  },
  subText: {
    type: String,
    default: ''
  },
  nodate: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits([ 'showItem'])

onMounted(async () => {
  
})

function showItem(id) {
  emit('showItem', id)
}

function getTotal(pack) {
  let sum = 0
  if (pack.QuizPackRound ) {
    pack.QuizPackRound.map(one => {sum = sum + one.score})
  }
  return sum
}

</script>

<template>
    <div :class='class'>
      <div class='rounded-lg overflow-hidden shadow-lg cursor-pointer relative' @click='() => showItem(pack.id)'>
        <img :src='pack.logo ? pack.logo: "/img/card_placeholder_horizon.jpg"' :class='pack.IntuitionResult && pack.IntuitionResult.length || pack.CastResult && pack.CastResult.length || pack.RoomUser ? "opacity-80": ""'/>
        
        
        <div v-if='!nodate' class='p-1 absolute top-0 text-white flex justify-between w-full bg-opacity' >
            <div><QuizType :rounds='pack.QuizPackRound' /></div>

            <div v-if='pack.RoomUser' class='text-yellow-400 textWithShadow' >
              <div class='relative flex items-center'>
                <StarsGold :value='pack.RoomUser.score/getTotal(pack)*10' />
              <div class=''> {{pack.RoomUser.score}}/{{getTotal(pack)}} </div>
              </div>
            </div>

        </div>


        <div class='p-1 absolute bottom-0 flex justify-between w-full bg-opacity' >
          <div>
            <div class='font-medium text-lg textWithShadow text-white' style='line-height: 1rem;'>{{pack.name}}</div> 
            <div v-if='!nodate' class='text-xs text-gray-300 text-capitalize textWithShadow'>{{ dayjs(pack.createdAt).locale(locale).format('D.MM.YYYY') }}</div>
            <div v-if='subText' class='text-xs text-gray-300 text-capitalize textWithShadow'>{{ pack[subText] }}</div>
            
          </div>
          <div v-if='count && pack._count' class='flex justify-center text-white'>
            <BaseIcon :path='mdiAccountCircle' /> {{pack._count[count]}}
          </div>
          <div v-if='pack.RoomUserCount' class='flex justify-center text-white' title='Игр завершено'>
            <BaseIcon :path='mdiAccountCircle' /> {{pack.RoomUserCount}}
          </div>
        
        </div>
        
        <div v-if='pack.IntuitionResult && pack.IntuitionResult.length' class='bg-gradient-to-r from-blue-start to-blue-end absolute top-0 left-0 w-full flex justify-center'>
          <Stars :value='pack.IntuitionResult[0].value'/>
        </div>
        <div v-if='pack.CastResult && pack.CastResult.length' class='bg-gradient-to-r from-blue-start to-blue-end absolute top-0 left-0 w-full flex justify-center text-white'>
          {{pack.CastResult[0].value}}
        </div>
       
      </div>
    </div>
</template>
