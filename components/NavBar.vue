<script setup>
import { ref } from 'vue'
import { mdiClose, mdiDotsVertical } from '@mdi/js'
import { containerMaxW } from '@/configs/config'
import  {PROJECT_NAME} from '~/constants.js'
import { useUserStore } from '@/stores/user'
import { userService } from '~/utils/services/user.service'

let userStore = useUserStore()
const route = useRoute()

defineProps({
  isAdmin: {
    type: Boolean,
    default: false
  },
  menu: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['menu-click'])

const menuClick = (event, item) => {
  emit('menu-click', event, item)
}
const isMainPage = computed(() => {
 return route.path == '/' ? true : false
})

const isMenuNavBarActive = ref(false)

const isModal = ref(false)

const form = reactive({
  name: '', 
  password: '',
})
async function save() {
  let data = await userService.login({email: form.name, password: form.password})
  if (data && data.success) {
    isModal.value = false
  }
}

</script>

<template>
<CardBoxModal v-model="isModal">
  <div class='text-gray-400 text-xs'> Имя</div>
    <FormControl v-model='form.name' placeholder="Введите имя" />
  <div class='text-gray-400 text-xs'> Пароль</div>
    <FormControl v-model='form.password' type='password' placeholder="Введите пароль" />
  <BaseButton
      @click='save'
      label="Войти"
      color="info"
    />
</CardBoxModal>

  <nav class=" top-0 inset-x-0 bg-gradient-to-r bg-nav from-gray-500 to-black h-15 z-30 transition-position w-screen md:w-auto dark:bg-slate-800">
 
<div class='opacity-back'>
    <div class="flex md:items-stretch" :class="containerMaxW">
      <NuxtLink v-if='!isAdmin' to='/'><div class='absolute flex justify-center items-center text-slate-100 px-3 mt-3 font-bold text-2xl' ><Logo size='20' /><div>{{PROJECT_NAME}}</div></div></NuxtLink>
      <div class="flex flex-1 items-stretch h-15">
        <slot />
      </div>
      <div class="flex-none items-stretch flex h-15 md:hidden z-50 text-slate-100">
        <NavBarItemPlain @click.prevent="isMenuNavBarActive = !isMenuNavBarActive">
          <BaseIcon :path="isMenuNavBarActive ? mdiClose : mdiDotsVertical" size="24" />
        </NavBarItemPlain>
      </div>
      <div
        class="ww max-h-screen-menu md:overflow-visible absolute w-screen top-14 left-0 text-slate-100 md:shadow-lg md:w-auto md:flex md:static md:shadow-none z-50"
        :class="[isMenuNavBarActive ? 'block' : 'hidden']"
      >
        <div v-if='!userStore.user?.id ' @click='isModal = true' class="flex items-center hover:text-blue-500 md:bg-none cursor-pointer md:bg-transparent md:dark:bg-transparent p-3 md:p-0">
            Войти
        </div>
        <NavBarMenuList v-else :menu="menu" @menu-click="menuClick" />
      </div>
    </div>
    </div>
  </nav>
</template>
<style> 

.h-15 {
    height: 3.8rem;
}

</style>
