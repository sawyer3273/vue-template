<script setup lang='ts'>

const dayjs = inject('dayjs')
const { locale } = useI18n()


const props = defineProps({
  time: {
    type: String,
    default: ''
  },
  format: {
    type: String,
    default: 'MMMM D, YYYY'
  }
})

</script>

<template>
    {{ dayjs(time).locale(locale).format(format) }}
</template>
