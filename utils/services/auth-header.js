import {getLocalStorageWithExpiry} from '../common'
import {parseUserObject} from './user.service'
import { handleResponse } from './response';
const baseURL = ''
import Cookie from 'cookie'

export async function authHeader(needToken = true, headers = {'Content-Type': 'application/json'}) {
    // return authorization header with jwt token
    let user
    const userStore = useUserStore()
    let headerswww = useRequestHeaders(['cookie'])
    console.log('headerswww',headerswww)
       var cookieAll = headerswww.cookie ? Cookie.parse(headerswww.cookie) : {}
       console.log('cookieAll',cookieAll)
    user = userStore.user;
    if (needToken) {
        user = userStore.user;
        if (!user || !user.token) {
            const requestOptions = {
                method: 'POST',
                headers: headers,
            };
            let newData = await fetch(`${baseURL}/api/user/refreshToken`, requestOptions).then(handleResponse)
            parseUserObject(newData.user)
            user = newData.user
        }
    }
    if (user && user.token) {
        headers['Authorization'] = 'Bearer ' + user.token
    } 
    return headers;
}

export async function authHeaderYandex(headers = {'Content-Type': 'application/json'}) {
    
const config = useRuntimeConfig();
    headers['Authorization'] = 'OAuth ' + (process.env.yandexToken ? process.env.yandexToken: config.public.yandexToken) 
    return headers;
}