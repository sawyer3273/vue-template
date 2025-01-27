<script setup>
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
import { NuxtLink } from '#components'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useMainStore } from '@/stores/main.js'
import { useUserStore } from '@/stores/user'
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['menu-click'])

const is = computed(() => {
  if (props.item.href) {
    return 'a'
  }

  if (props.item.to) {
    return NuxtLink
  }

  return 'div'
})
const componentClass = computed(() => {
  const base = [
    isDropdownActive.value
      ? `navbar-item-label-active dark:text-slate-400 `
      : `navbar-item-label dark:text-white dark:hover:text-slate-400`,
    props.item.menu ? 'md:px-3' : 'py-2 px-3',
    props.item.style ? props.item.style : ''
  ]

  if (props.item.isDesktopNoLabel) {
    base.push('md:w-16', 'md:justify-center')
  }

  return base
})
let userStore = useUserStore()
let mainStore = useMainStore()
const itemLabel = computed(() =>
  props.item.isCurrentUser ? (userStore.user.username + (userStore.user.team ? ' (' + userStore.user.team.name + ')': "")) : props.item.label
)

const isDropdownActive = ref(false)

const menuClick = (event) => {
  emit('menu-click', event, props.item)

  if (props.item.menu) {
    isDropdownActive.value = !isDropdownActive.value
  }
}

const menuClickDropdown = (event, item) => {
  emit('menu-click', event, item)
}

const root = ref(null)

const forceClose = (event) => {
  if (root.value && !root.value.contains(event.target)) {
    isDropdownActive.value = false
  }
}

onMounted(() => {
  if (props.item.menu) {
    window.addEventListener('click', forceClose)
  }
})

onBeforeUnmount(() => {
  if (props.item.menu) {
    window.removeEventListener('click', forceClose)
  }
})
</script>

<template>
  <BaseDivider v-if="item.isDivider" nav-bar />
  <component
    :is="is"
    v-else
    ref="root"
    class="block md:flex items-center relative cursor-pointer md:bg-none bg-gradient-to-r from-gray-600 to-black"
    :class="componentClass"
    :to="item.to ?? null"
    :target="item.target ?? null"
    @click="menuClick"
  >
    <div
      class="flex items-center hover:text-blue-500 md:bg-none"
      :class="{
        ' dark:bg-slate-800 md:bg-transparent md:dark:bg-transparent p-3 md:p-0':
          item.menu
      }"
    >
      <UserAvatarCurrentUser v-if="item.isCurrentUser" class="w-6 h-6 mr-3 inline-flex" />
      <BaseIcon v-if="item.icon" :path="item.icon" class="transition-colors" />
      <span
        class="px-2 transition-colors"
        :class="{ 'md:hidden': item.isDesktopNoLabel && item.icon }"
        >{{ itemLabel }}</span
      >
      <BaseIcon
        v-if="item.menu"
        :path="isDropdownActive ? mdiChevronUp : mdiChevronDown"
        class="hidden md:inline-flex transition-colors"
      />
    </div>
    <div
      v-if="item.menu"
      class="text-sm border-b border-gray-100 md:border min-w-44 md:bg-gradient-to-r md:from-gray-600 md:to-black md:absolute md:top-full md:left-0 md:z-20 md:rounded-lg md:shadow-lg dark:border-slate-700"
      :class="{ 'md:hidden': !isDropdownActive }"
    >
      <NavBarMenuList :menu="item.menu" @menu-click="menuClickDropdown" />
    </div>
  </component>
</template>
