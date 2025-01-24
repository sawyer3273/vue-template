<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { hikeService } from '~/utils/services/hike.service'
import { containerMaxW } from '@/configs/config'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import Slider from '@vueform/slider'
import { mdiMap } from '@mdi/js';
import GeoTIFF, { fromUrl, fromUrls, fromArrayBuffer, fromBlob } from 'geotiff';
definePageMeta({
  middleware: 'auth' 
})
const mainStore = useMainStore()
const route = useRoute()
const router = useRouter()
const form = reactive({
  file: null, 
  fileAdd: null,
  photo: null,
  title: '',
  date: ''
})
let allCoords = ref([])
let centerMap = ref([])
let radiusIdx = ref(5)
let intensityOfMidpoint = ref(5)
let showRadius = ref(false)
let heatmap = reactive(null)
const rules = computed(() => (
  {
    title: {
      required, 
      minLength: minLength(3),
    },
    file: {
      required,
    },
  }
));
const $v = useVuelidate(rules, form);

const maps = ref(false)
onMounted(async () => {
  if (route.query.map) {
    getMap(route.query.map)
  }
 
  getMaps()
})

const selected = ref(null)
async function getMap(id) {
  selected.value = id
  router.push({ path: '/', query: { map: id }})
 let data = await hikeService.getMap({
   id
  })
  if (data.success) {
      allCoords.value = data.data.Coordinates
      initMap()
  }
  
}

async function getMaps() {
  let data = await hikeService.getMaps()
  if (data.success) {
    maps.value = data.data
  }
  
}

useHead({
  script: [
    {src: 'https://api-maps.yandex.ru/2.1/?apikey=c42fd476-4925-4244-86c2-38fdf2ccbfd4&lang=en_US'},
    { src: "https://yastatic.net/s3/mapsapi-jslibs/heatmap/0.0.1/heatmap.min.js" }],
});


const isOpened = computed(() => {
  if (route.query.map) {
    return true
  }
  return false
})

watch(() => form.file, async () => {
    if (form.file) {
        router.push({ path: '/', })
        selected.value = null
        mainStore.setLoader(true)
        let formData = new FormData()
        for (let i = 0; i < form.file.length; i++) {
            formData.append("file[]", form.file[i]);
        }
    
        formData.append('title', form.title)
        let data = await hikeService.parseTrack(formData)
        if (data.success) {
            allCoords.value = data.allCoords
            centerMap.value = data.centerMapGeneral
            initMap()
        }
       
        mainStore.setLoader(false)
    }
   
})
//TODO: code duplicate
watch(() => form.fileAdd, async () => {
    if (form.fileAdd) {
        router.push({ path: '/', })
        selected.value = null
        mainStore.setLoader(true)
        let formData = new FormData()
        for (let i = 0; i < form.fileAdd.length; i++) {
            formData.append("file[]", form.fileAdd[i]);
        }
    
        formData.append('title', form.title)
        let data = await hikeService.parseTrack(formData)
        if (data.success) {
            allCoords.value = allCoords.value.concat(data.allCoords)
            centerMap.value = data.centerMapGeneral
            initMap()
        }
       
        mainStore.setLoader(false)
    }
   
})
watch(radiusIdx, () => {
   // initMap()
   heatmap.options.set(
        'radius', radiusIdx.value * 1.35
    );
})
watch(intensityOfMidpoint, () => {
   // initMap()
   heatmap.options.set(
        'intensityOfMidpoint', intensityOfMidpoint.value * 0.003,
    );
})

const isModal = ref(false)
const name = ref('')
async function openModal() {
  isModal.value = true
  
}
async function save() {
  mainStore.setLoader(true)
 let data = await hikeService.addHike({
    allCoords: allCoords.value,
    name: name.value
  })
  if (data.success) {
  isModal.value = false
  }
  getMaps()
  mainStore.setLoader(false)
}


async function initMap() {
  console.log(' allCoords.value', allCoords.value.length)
  if (heatmap) {
    var newData = allCoords.value
    heatmap.setData(newData);
  } else {
     const ymaps = window.ymaps;
      ymaps.ready(function () {
        var map = new ymaps.Map('map', {
            center: [43.5,42],
            controls: ['zoomControl', 'typeSelector',  'fullscreenControl'],
            zoom: 7, type: 'yandex#satellite'
        }),
        gradients = [{
            0.1: 'rgba(128, 255, 0, 0.7)',
            0.2: 'rgba(255, 255, 0, 0.8)',
            0.7: 'rgba(234, 72, 58, 0.9)',
            1.0: 'rgba(162, 36, 25, 1)'
        }],
        opacities = [0.7, 0.8, 0.9, 1];

        ymaps.modules.require(['Heatmap'], function (Heatmap) {
    
        showRadius.value = true
        heatmap = new Heatmap(allCoords.value, {
            gradient: gradients[0],
            radius: radiusIdx.value * 1.35,
            opacity: opacities[2],
            intensityOfMidpoint: intensityOfMidpoint.value * 0.003
        });
        heatmap.setMap(map);
      });
  });
  }
   
}




</script>

<template>
  <div>
    <NuxtLayout name="empty">
        <div class="w-full">
            <div class="flex items-center justify-center w-full  p-2 xl:px-0" >
                <div class="row w-full" :class='containerMaxW'>
                    <div class="col-md-12 flex items-center justify-center">
                        <CardBox class='w-full' is-form >
                          <div class='row mb-4'>
                            <div class='col-md-6  text-xs'>
                              <div class='flex w-full flex-wrap'>
                                  <FormFilePicker v-model="form.file" class='w-full' label="Создать новую карту" accept=".gpx" :autoUpload='false' :isMultiple='true'/>
                                
                                  <FormFilePicker v-if='showRadius && !isOpened' v-model="form.fileAdd" label="Добавить треки" accept=".gpx" :autoUpload='false' :isMultiple='true'/>
                               

                                <BaseButton
                                  v-if='showRadius && !isOpened'
                                  @click='openModal'
                                  label="Опубликовать"
                                  class='font-bold w-full md:w-auto h-10'
                                  color="info"
                                />
                              </div>
                                  <span class='text-gray-400 font-bold text-xs'>Загрузите треки в формате GPX</span>
                            </div>
                            <div class='col-md-6'>
                              <template v-if='showRadius'>
                                <div class='row'>
                                  <label class='col-md-4 text-xs text-right'> Радиус</label>
                                  <div class='col-md-8'><Slider v-model='radiusIdx'  :min='1' :max='10' class='mt-1' :tooltips='false'/></div>
                                </div>
                                <div class='row mt-1'>
                                  <label class='col-md-4 text-xs text-right'> Интенсивность</label>
                                  <div class='col-md-8'><Slider v-model='intensityOfMidpoint'  :min='1' :max='10' class='mt-1' :tooltips='false'/></div>
                                </div>
                              </template>
                            </div>
                          </div>
                          <div id="map" class='map'></div>
                          <div id="test"></div>
                        </CardBox>
                    </div>

                    <div class="col-md-12 mt-3 flex items-center justify-center" v-if='maps && maps.length'>
                    <CardBox class='w-full h-full '  >
                      <div class='flex'>
                        <label>Сохраненные карты:</label>
                        <div v-for='map in maps' class='flex rounded-full px-2 font-medium border bg-white border-gray-300 ml-2 cursor-pointer hover:bg-gray-100 hover:shadow-md' 
                          :class='selected == map.id ? "!bg-gray-200 shadow-md" : ""' @click='getMap(map.id)'>
                            <BaseIcon :path='mdiMap' /> {{map.title}} 
                          </div>
                      </div> 
                    </CardBox>
                    </div>
                    <CardBoxModal v-model="isModal">
                      <FormControl v-model='name' placeholder="Введите имя" />
                      <BaseButton
                          v-if='showRadius'
                          @click='save'
                          label="Сохранить"
                          color="info"
                        />
                    </CardBoxModal>
                </div>
            </div>
        </div>
    </NuxtLayout>
  </div>
</template>
<style>
 .map {
  width: 100%; 
  min-height: 300px; 
  height: calc(50vh - 250px); 
  max-height: 100vh;
 }
 @media (min-width: 500px) {
  .map {
  width: 100%; 
  min-height: 300px; 
  height: calc(100vh - 250px); 
  max-height: 100vh;
 }
 }
 
</style>