import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo } from '../store';
import config from '../config.json';

const API_URL = config.API_URL;

export const uploadFile = async (file, fileName, fileToDelete) => {
    const fileReader = new FileReader();
    const results = [];

    return new Promise ((resolve) => {
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = async (event) => {
        const content = event.target.result;
        const CHUNK_SIZE = 5000;
        const totalChunks = content.byteLength / CHUNK_SIZE;

        for (let chunk = 0; chunk < totalChunks + 1; chunk++) {
            let CHUNK = content.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE);
            const result = await upload(fileName, CHUNK, fileToDelete);
            results.push(result);
        }
        resolve(results);
      }
    }) 
}

export const upload = async(fileName, CHUNK, fileToDelete) => {
    try {
        const userInfoStored = get(userInfo);
        const config = {
            headers: {
                Authorization: `Bearer ${userInfoStored.token}`,
                'content-type': "application/octet-stream",
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