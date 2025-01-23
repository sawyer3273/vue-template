import { useToast } from "vue-toastification";
import { ERROR_EXPIRED } from "~/constants";
import { useMainStore } from '@/stores/main'
import { useUserStore } from '@/stores/user'
const toast = useToast();


export function handleResponse(response) {
    return response ? response.text().then(text => {
        const mainStore = useMainStore()
        mainStore.setLoader(false)
        mainStore.setLoaderLocal(false)
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (data.type == ERROR_EXPIRED) {
                
            }
            if (data.message && data.type != ERROR_EXPIRED && !data.hideFrontMessage) {
                toast.error(data.message);
            }
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                const userStore = useUserStore()
                userStore.setUser()
                location.reload(true);
            }
            
            let error = (data && data.message) || response.statusText;
            if (data && data.errors && data.errors[0]) {
                error = data.errors[0].msg
            }
            return Promise.reject(error);
        } else {
            if (data.frontMessage && data.message) {
                toast.success(data.message);
            }
        }
        return data;
    }) : {};
}

/**
 * fetch() with retries
 * @param {string} url URL to fetch
 * @param {object} requestOptions All requestOptions 
 * @param {object} options All options required
 * @param {number} options.timeout Max timeout, in milliseconds (default: 5000)
 * @param {retries} options.retries Max number of retries (default: 2)
 */
export async function fetchWithRetry(url, requestOptions, { timeout, retries } = { timeout: 4000, retries: 2 }) {
    let data;
    let controller;
    
    const mainStore = useMainStore()
    let timerLoader = setTimeout(() => {
      mainStore.setLoaderLocal(true)
    }, 600)
    

    for (let n = 0; n <= retries; n++) {
      let timer;
  
      try {
        // 1. create new AbortController
        controller = new AbortController();
  
        // 2. time out after 5s
        timer = setTimeout(() => {
          controller.abort(); // break current loop
        }, timeout);
  
        // 3. fetch
        data = await fetch(url, { signal: controller.signal, ...requestOptions, retry: n })
 
        // 4. clear timeout if successful
        clearTimeout(timer);
        clearTimeout(timerLoader);
        return data;
      } catch (err) {
        console.log('err fetchWithRetry',err)
        clearTimeout(timer); // clear timeout just for safety
        clearTimeout(timerLoader);
        // TODO: handle HTTP errors here, or in fetch().
      }
    }
    
    return data;
  }
