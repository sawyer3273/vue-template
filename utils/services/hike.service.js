import { authHeader } from './auth-header';
import { handleResponse, fetchWithRetry } from './response';
import { useDataStore } from '@/stores/data'
const baseURL = ''

export const hikeService = {
    addHike,
    parseTrack,
    getUserCooridates,
    getMaps,
    getMap
};


async function addHike(form) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(form)
    };
    return fetch(`${baseURL}/api/hike/add`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}

async function parseTrack(form) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false, {}),
        body: form
    };
    return fetch(`${baseURL}/api/hike/parseTrack`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}
async function getUserCooridates() {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(false),
    };
    return fetchWithRetry(`${baseURL}/api/hike/userCoordinates`, requestOptions).then(handleResponse)
}
async function getMaps() {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(false),
    };
    return fetchWithRetry(`${baseURL}/api/hike/maps`, requestOptions).then(handleResponse)
}

async function getMap(data) {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(false),
    };
    return fetchWithRetry(`${baseURL}/api/hike/map?` + new URLSearchParams(data), requestOptions).then(handleResponse)
}

