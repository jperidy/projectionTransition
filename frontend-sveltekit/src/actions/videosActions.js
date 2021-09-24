import axios from 'axios';
//import { API_URL } from '../config/backend_api';
import { get } from 'svelte/store';
import { userInfo } from '../store';
import config from '../config.json';

const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

export const uploadVideo = async(file, videoToDelete) => {

    try {
        const userInfoStored = get(userInfo);
        
        const config = {
            headers: {
                Authorization: `Bearer ${userInfoStored.token}`,
                'content-type': 'multipart/form-data'
            }
        };
        
        if (videoToDelete) {
            await axios.delete(`${API_URL}/api/upload/videos?url=${videoToDelete}`, config);
        }

        const { data } = await axios.post(`${API_URL}/api/upload/videos`, file, config);

        return { status: 'Ok', data: `${data.path}` };
        
    } catch (error) {
        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }
};

export const deleteImage = async(imagePath) => {

    try {
        const userInfoStored = get(userInfo);
        
        const config = {
            headers: {
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.delete(`${API_URL}/api/upload/images?url=${imagePath}`, config);

        return { status: 'Ok', data: data};

    } catch (error) {
        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }

};
