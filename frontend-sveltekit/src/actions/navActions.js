import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo } from '../store';
import config from '../config.json';

const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

export const getNavBar = async () => {

    try {

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        };

        const { data } = await axios.get(`${API_URL}/api/nav`, config);

        return { navBar: data.value, loading: false, message: data.message };

    } catch (error) {

        return { navBar: {}, loading: false, message: 'Error loading navBar ' + error };

    }
};

export const updateOrCreateNavBar = async (navBar) => {

    const userInfoStored = get(userInfo);

    try {

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.post(`${API_URL}/api/nav`, navBar, config);

        return { navBar: data.value, loading: false, message: data.message };

    } catch (error) {

        return { navBar: {}, loading: false, message: 'Error updating footer ' + error };
    }

};