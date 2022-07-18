import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo } from '../store';
import config from '../config.json';

const API_URL = config.API_URL;

export const getNavBar = async () => {

    try {

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        };

        const { data } = await axios.get(`${API_URL}/api/navs`, config);

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

        const { data } = await axios.post(`${API_URL}/api/navs`, navBar, config);

        return { navBar: data.value, loading: false, message: data.message };

    } catch (error) {

        return { navBar: {}, loading: false, message: 'Error updating navBar ' + error };
    }

};