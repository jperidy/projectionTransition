import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo } from '../store';
import config from '../config.json';

const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

export const getFooter = async () => {

    try {

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        };

        const { data } = await axios.get(`${API_URL}/api/footer`, config);

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

        const { data } = await axios.post(`${API_URL}/api/footer`, footer, config);

        return { footer: data.value, loading: false, message: data.message };

    } catch (error) {

        return { footer: {}, loading: false, message: 'Error updating footer ' + error };
    }
};