import { authHeader } from './auth-header';
import { handleResponse, fetchWithRetry } from './response';
import { useDataStore } from '@/stores/data'
const baseURL = ''

export const hikeService = {
    addHike,
    parseTrack,
    getUserCooridates
};


async function addHike(form) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true, {}),
        body: form
    };
    return fetchWithRetry(`${baseURL}/api/hike/add`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}

async function parseTrack(form) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true, {}),
        body: form
    };
    return fetch(`${baseURL}/api/hike/parseTrack`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}
async function getUserCooridates(token) {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(false),
    };
    return fetchWithRetry(`${baseURL}/api/hike/userCoordinates`, requestOptions).then(handleResponse)
}

