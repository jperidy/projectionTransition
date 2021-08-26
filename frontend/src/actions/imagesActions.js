import axios from 'axios';
import { API_URL } from '../config/backend_api';
import { get } from 'svelte/store';
import { userInfo } from '../store';

export const uploadImage = async(file, imageToDelete) => {

    //imageToDelete = imageToDelete ? imageToDelete : 'isEmpty';

    try {
        const userInfoStored = get(userInfo);
        
        const config = {
            headers: {
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };
        
        //await axios.delete(`${API_URL}/api/upload/images/1000x250/${imageToDelete}`, config);
        if (imageToDelete) {
            await axios.delete(`${API_URL}/api/upload/images?url=${imageToDelete}`, config);
        }

        const { data } = await axios.post(`${API_URL}/api/upload/images/1000x250`, file, config);

        return { status: 'Ok', data: `${API_URL}${data.path}` };
        
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
