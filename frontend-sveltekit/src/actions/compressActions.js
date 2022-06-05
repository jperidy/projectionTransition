import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo } from '../store';
import config from '../config.json';

const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

export const uploadCompress = async(file, compressToDelete) => {

    try {
        const userInfoStored = get(userInfo);
        
        const config = {
            headers: {
                Authorization: `Bearer ${userInfoStored.token}`,
                'content-type': 'multipart/form-data'
            }
        };
        
        if (compressToDelete) {
            await axios.delete(`/api/upload-files?url=${compressToDelete}`, config);
        }

        const { data } = await axios.post(`${API_URL}/api/uploads`, file, config);

        return { status: 'Ok', data: `${data.path}` };
        
    } catch (error) {
        return { 
            status: 'Error', 
            data: error.response && error.response.data.message ? error.response.data.message : error.message,
        }
    }
};

export const deleteCompress = async(compressPath) => {

    try {
        const userInfoStored = get(userInfo);
        
        const config = {
            headers: {
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.delete(`/api/upload-files?url=${compressPath}`, config);

        return { status: 'Ok', data: data};

    } catch (error) {
        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }

};
