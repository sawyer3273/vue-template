import { authHeader } from './auth-header';
import  _  from 'lodash'
import { handleResponse, fetchWithRetry } from './response';
import { useMainStore } from '@/stores/main'
import { useUserStore } from '@/stores/user'
const baseURL = ''

export const userService = {
    login,
    loginYandex,
    logout,
    register,
    getUser,
    customRoute,
    forgot,
    checkForgotToken,
    updatePassword,
    updateUser
};

async function login(user) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(user)
    };
    return fetchWithRetry(`${baseURL}/api/user/login`, requestOptions)
        .then(handleResponse)
        .then(data => {
            let user = data.user
            // login successful if there's a jwt token in the response
            if (data.success && data.user.token) {
                user = parseUserObject(data.user);
            }
            return data;
        });
}

async function loginYandex(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(payload)
    };
    return fetchWithRetry(`${baseURL}/api/user/loginYandex`, requestOptions)
        .then(handleResponse)
        .then(data => {
            let user = data.user
            if (data.success && data.user.token) {
                user = parseUserObject(data.user);
            }
            return data;
        });
}


async function logout() {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(),
    };
    let response = await fetchWithRetry(`${baseURL}/api/user/logout`, requestOptions)
    const parsedValue = await response.json()
    const userStore = useUserStore()
    userStore.setUser(null)
   // localStorage.removeItem('user')
    return parsedValue
}

async function forgot(data) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(data)
    };
    const mainStore = useMainStore()
    mainStore.setLoader(true)
    return fetchWithRetry(`${baseURL}/api/user/forgot`, requestOptions).then(handleResponse);
}

async function updatePassword(data) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(data)
    };
    const mainStore = useMainStore()
    mainStore.setLoader(true)
    return fetchWithRetry(`${baseURL}/api/user/updatePassword`, requestOptions).then(handleResponse);
}

async function updateUser(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(payload)
    };
    const userStore = useUserStore()
    return fetchWithRetry(`${baseURL}/api/user`, requestOptions).then(handleResponse).then(data => {
        if (data.success) {
            console.log('data,data',payload)
            let newUser = {...userStore.user, ...payload }
            console.log('newUser',newUser)
            parseUserObject(newUser);
        }
        return data;
    });
}

async function checkForgotToken(token) {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(false),
    };
    let data = {
        token
    }
    return fetchWithRetry(`${baseURL}/api/user/checkForgotToken?` + new URLSearchParams(data), requestOptions).then(handleResponse)
}



async function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(user)
    };
    return fetchWithRetry(`${baseURL}/api/user/register`, requestOptions).then(handleResponse);
}

async function getUser(data) {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(),
    };
    return fetchWithRetry(`${baseURL}/api/user?` + new URLSearchParams(data), requestOptions).then(handleResponse).then(user => {
        try {
            return user
        } catch (error) {
            console.log('error', error)
        }
        
    });
}

async function customRoute(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true, {}),
    };
    return fetch(`${baseURL}/api/scrapper/saveLinks44`, requestOptions).then(handleResponse).then(user => {
        try {
            
        } catch (error) {
            console.log('error', error)
        }
    });
}


export function parseUserObject(user) {
    let userData = user ? {
        id: user.id,
        email: user.email,
        username: user.username,
        rate: user.rate,
        role: user.role,
        token: user.token,
        avatar: user.avatar,
        team: user.team,
    } : {}
    const userStore = useUserStore()
    userStore.setUser(userData)
    //setLocalStorageWithExpiry('user', JSON.stringify(userData), 1000 * 60 * 60 * 24 * 7)
    return userData 
}
