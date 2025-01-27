<script setup>
import { reactive } from 'vue'
import { NuxtLink } from '#components'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import axios from 'axios';
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email} from '@vuelidate/validators'
import { userService } from '~/utils/services/user.service'
import { useMainStore } from '@/stores/main'

const router = useRouter()


</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <SectionFullScreen >
        
        
       <div class="text-gray-400 text-xl"> Место для вашей рекламы </div>

      </SectionFullScreen>
    </NuxtLayout>
  </div>
</template>

<style scoped>

    </style>
