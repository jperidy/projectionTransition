import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo } from '../store';
import config from '../config.json';

const API_URL = config.API_URL;

export const uploadImage = async(file, imageToDelete) => {

    try {
        const userInfoStored = get(userInfo);
        
        const config = {
            headers: {
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };
        
        if (imageToDelete) {
            await axios.delete(`/api/upload-files?url=${imageToDelete}`, config);
        }

        const { data } = await axios.post(`${API_URL}/api/upload-files`, file, config);

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

        const { data } = await axios.delete(`${API_URL}/api/upload-files?url=${imagePath}`, config);

        return { status: 'Ok', data: data};

    } catch (error) {
        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }

};
