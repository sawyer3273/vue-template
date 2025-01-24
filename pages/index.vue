<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { hikeService } from '~/utils/services/hike.service'
import { containerMaxW } from '@/configs/config'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import Slider from '@vueform/slider'
import GeoTIFF, { fromUrl, fromUrls, fromArrayBuffer, fromBlob } from 'geotiff';
definePageMeta({
  middleware: 'auth' 
})
const mainStore = useMainStore()

const form = reactive({
  file: null, 
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

onMounted(() => {
console.log('window',window)
   initVk()

})

useHead({
  script: [
    {src: 'https://api-maps.yandex.ru/2.1/?apikey=c42fd476-4925-4244-86c2-38fdf2ccbfd4&lang=en_US'},
    { src: "https://yastatic.net/s3/mapsapi-jslibs/heatmap/0.0.1/heatmap.min.js" }, {src: 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js'}],
});




watch(() => form.file, async () => {
    if (form.file) {
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

async function save() {
  let data = await hikeService.addHike({
    allCoords
  })
  if (data.success) {
  
  }
}



async function initMap() {
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

function initVk() {
 if ('VKIDSDK' in window) {
      const VKID = window.VKIDSDK;

      VKID.Config.init({
        app: 52929456,
        redirectUrl: 'https://vk.com/id25819806',
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: '', // Заполните нужными доступами по необходимости
      });

      const oneTap = new VKID.OneTap();

      oneTap.render({
        container: document.getElementById('test'),
        showAlternativeLogin: true
      })
      .on(VKID.WidgetEvents.ERROR, vkidOnError)
      .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
        const code = payload.code;
        const deviceId = payload.device_id;

        VKID.Auth.exchangeCode(code, deviceId)
          .then(vkidOnSuccess)
          .catch(vkidOnError);
      });
    
      function vkidOnSuccess(data) {
        // Обработка полученного результата
      }
    
      function vkidOnError(error) {
        // Обработка ошибки
      }
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
                            <div class='col-md-6 flex'>
                              <FormFilePicker v-model="form.file" label="Загрузите треки в формате GPX" :autoUpload='false' :isMultiple='true'/>
                              <BaseButton
                                v-if='showRadius'
                                @click='save'
                                label="Сохранить"
                                color="info"
                              />
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
  height: calc(50vh - 200px); 
  max-height: 100vh;
 }
 @media (min-width: 500px) {
  .map {
  width: 100%; 
  min-height: 300px; 
  height: calc(100vh - 200px); 
  max-height: 100vh;
 }
 }
 
</style>