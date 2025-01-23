<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { userService } from '~/utils/services/user.service'
import { containerMaxW } from '@/configs/config'
definePageMeta({
  middleware: 'auth' 
})
const mainStore = useMainStore()


onMounted(() => {
})



</script>

<template>
  <div>
    <NuxtLayout name="auth">
        <div class="w-full">
          
          <div class="flex items-center justify-center w-full absolute top-44 px-6 xl:px-0" >
            <div class="row w-full" :class='containerMaxW'>
              <div class="col-md-6 flex items-center justify-center">
                <div class="text-slate-100 text-center-cust md:text-left opacity-back p-3 rounded-lg">
                  <h1 class='text-3xl font-bold'>
                    Default project
                  </h1>
                  <p>
                    some text
                  </p>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
    </NuxtLayout>
  </div>
</template>
