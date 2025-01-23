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
  
})


onMounted(() => {
})

const mainStore = useMainStore()

async function onClick() {
  await dataService.librarySearch({key: 'The Greatest Showman', type: 'all'})
  //userService.customRoute()
}

</script>

<template>
  <div>
    <NuxtLayout name="empty">
      <SectionMain>
        <BaseButton color='info' label='click' @click='onClick' class='cursor-pointer'>   click</BaseButton>
      </SectionMain>
    </NuxtLayout>
  </div>
</template>
