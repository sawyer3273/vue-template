import { authHeader } from './auth-header';
import { handleResponse, fetchWithRetry } from './response';
import { useDataStore } from '@/stores/data'
const baseURL = ''

export const adminService = {
    uploadFile,
    
};


async function uploadFile(form) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true, {}),
        body: form
    };
    return fetchWithRetry(`${baseURL}/api/admin/upload`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}
