import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo } from '../store';
import config from '../config.json';

const API_URL = config.API_URL;

export const getFooter = async () => {

    try {

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        };

        const { data } = await axios.get(`${API_URL}/api/footers`, config);

        return { footer: data.value, loading: false, message: data.message };

    } catch (error) {

        return { footer: {}, loading: false, message: 'Error loading footer ' + error };

    }
};

export const updateOrCreateFooter = async (footer) => {

    const userInfoStored = get(userInfo);

    try {

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.post(`${API_URL}/api/footers`, footer, config);

        return { footer: data.value, loading: false, message: data.message };

    } catch (error) {

        return { footer: {}, loading: false, message: 'Error updating footer ' + error };
    }
};