import Cookie from 'cookie'

export default defineNuxtRouteMiddleware((to, from) => {
    let cookies: any
    if (import.meta.server) {
        
        let headers = useRequestHeaders(['cookie'])
        var cookieAll = headers.cookie ? Cookie.parse(headers.cookie) : {}
        cookies = cookieAll.user ? JSON.parse(cookieAll.user) : {}
    } else {
        let userStore = useUserStore()
        cookies = {user: userStore.user}
    }
   // console.log('import.mer   ', import.meta.server)
    //console.log('cookies auth',cookies && cookies.user.token)
    //console.log('to',to.fullPath)
    if (!cookies || !cookies.user || !cookies.user.token) {
        return navigateTo('/login');
    }
    if (cookies && cookies.user && cookies.user.role == 'ADMIN') {
        if (!to.path.includes('/admin')) {
            return navigateTo('/admin');
        }
    } else {
        if (to.path.includes('/admin')) {
            return navigateTo('/');
        }
    }
})