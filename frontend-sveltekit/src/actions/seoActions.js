import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo } from '../store';

export const getSeo = async () => {

    try {

        const config = {
            headers: {
                'Content-type': 'application/json',
                'accept': 'application/json'
            }
        };

        const { data } = await axios.get(`/api/seo`, config);

        return { seo: data.value, loading: false, message: data.message };

    } catch (error) {
        // console.log('__error', error);
        return { seo: {}, loading: false, message: 'Error loading seo ' + error };

    }
};

export const updateOrCreateSeo = async (seo) => {

    const userInfoStored = get(userInfo);

    try {

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.post(`/api/seo`, seo, config);

        return { seo: data.value, loading: false, message: data.message };

    } catch (error) {

        return { seo: {}, loading: false, message: 'Error updating seo ' + error };
    }

};