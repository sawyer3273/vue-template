import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMainStore = defineStore('main', () => {

  
  const loader = ref(false)
  const loaderLocal = ref(false)
  const isFieldFocusRegistered = ref(false)
  const breadCrumbs = ref([])
  const clients = ref([])
  const history = ref([])



  function setLoader(payload) {
    loader.value = payload
  }
  function setLoaderLocal(payload) {
    loaderLocal.value = payload
  }
  
  function setBreadCrumbs(payload) {
    breadCrumbs.value = payload
  }





  return {
    isFieldFocusRegistered,
    clients,
    history,
    loader,
    loaderLocal,
    breadCrumbs,
    setLoader,
    setBreadCrumbs,
    setLoaderLocal
  }
})
