import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo } from '../store';
import config from '../config.json';

const API_URL = config.API_URL;

export const upload = async(fileName, CHUNK, fileToDelete) => {
    try {
        const userInfoStored = get(userInfo);
        const config = {
            headers: {
                Authorization: `Bearer ${userInfoStored.token}`,
                'content-type': "application/octet-stream",
                'content-length': CHUNK.length,
            }
        };

        if (fileToDelete) {
            await axios.delete(`/api/upload-files?url=${fileToDelete}`, config);
        }
        
        const { data } = await axios.post(`${API_URL}/api/upload-files?fileName=${fileName}`, CHUNK, config);

        return { status: 'Ok', data: `${data.storage}` };
        
    } catch (error) {
        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }
}