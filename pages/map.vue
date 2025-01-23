<script setup>
import { reactive, shallowRef} from 'vue'
import { NuxtLink } from '#components'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email} from '@vuelidate/validators'
import { userService } from '~/utils/services/user.service'

import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
} from 'vue-yandex-maps'

useHead({
  script: [
    {src: 'https://api-maps.yandex.ru/2.1/?apikey=c42fd476-4925-4244-86c2-38fdf2ccbfd4&lang=en_US'},
    { src: "https://yastatic.net/s3/mapsapi-jslibs/heatmap/0.0.1/heatmap.min.js" }],
});



//Можно использовать для различных преобразований
const map = shallowRef(null);
const router = useRouter()

function onMapReady() {
      // В этом методе можно получить доступ к глобальной переменной ymaps
      const ymaps = window.ymaps;
      
      // Теперь можно использовать все объекты и методы API Яндекс.Карт
      console.log(ymaps); // Выведет объект ymaps в консоль
}

onMounted(() => {
  
  setTimeout(() => {
            initMap();
     
     
  }, 1000)

});




async function initMap() {
    const ymaps = window.ymaps;
 ymaps.ready(function () {
            var map = new ymaps.Map('map', {
                    center: [37.774546, -122.433523],
                    controls: ['zoomControl', 'typeSelector',  'fullscreenControl'],
                    zoom: 12, type: 'yandex#satellite'
                }),

                buttons = {
                    dissipating: new ymaps.control.Button({
                        data: {
                            content: 'Toggle dissipating'
                        },
                        options: {
                            selectOnClick: false,
                            maxWidth: 150
                        }
                    }),
                    opacity: new ymaps.control.Button({
                        data: {
                            content: 'Change opacity'
                        },
                        options: {
                            selectOnClick: false,
                            maxWidth: 150
                        }
                    }),
                    radius: new ymaps.control.Button({
                        data: {
                            content: 'Change radius'
                        },
                        options: {
                            selectOnClick: false,
                            maxWidth: 150
                        }
                    }),
                    gradient: new ymaps.control.Button({
                        data: {
                            content: 'Reverse gradient'
                        },
                        options: {
                            selectOnClick: false,
                            maxWidth: 150
                        }
                    }),
                    heatmap: new ymaps.control.Button({
                        data: {
                            content: 'Toggle Heatmap'
                        },
                        options: {
                            selectOnClick: false,
                            maxWidth: 150
                        }
                    })
                },

                gradients = [{
                    0.1: 'rgba(128, 255, 0, 0.7)',
                    0.2: 'rgba(255, 255, 0, 0.8)',
                    0.7: 'rgba(234, 72, 58, 0.9)',
                    1.0: 'rgba(162, 36, 25, 1)'
                }, {
                    0.1: 'rgba(162, 36, 25, 0.7)',
                    0.2: 'rgba(234, 72, 58, 0.8)',
                    0.7: 'rgba(255, 255, 0, 0.9)',
                    1.0: 'rgba(128, 255, 0, 1)'
                }],
                radiuses = [5, 10, 20, 30],
                opacities = [0.4, 0.6, 0.8, 1];

            ymaps.modules.require(['Heatmap'], function (Heatmap) {
              var data = [
    [37.782551, -122.445368],
    [37.782745, -122.444586],
    [37.782842, -122.443688],
    [37.782919, -122.442815],
    [37.782992, -122.442112],
    [37.783100, -122.441461],
    [37.783206, -122.440829],
    [37.783273, -122.440324],
    [37.783316, -122.440023],
    [37.783357, -122.439794],
    [37.783371, -122.439687],

              ]
                var heatmap = new Heatmap(data, {
                    gradient: gradients[0],
                    radius: radiuses[1],
                    opacity: opacities[2]
                });
                heatmap.setMap(map);

               

            });
        });
}


</script>

<template>

 <div id="map" style="width: 600px; height: 400px"></div>

</template>
<style scoped>
  
    </style>