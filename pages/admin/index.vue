<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiMonitorCellphone,
  mdiReload,
  mdiGithub,
  mdiChartPie
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import { userService } from '~/utils/services/user.service'
import { dataService } from '~/utils/services/data.service'
definePageMeta({
  middleware: 'auth' 
})


onMounted(() => {
})

const mainStore = useMainStore()



</script>

<template>
  <div>
    <NuxtLayout name="admin">
      <SectionMain>
       
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
